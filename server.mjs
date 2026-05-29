import { createServer } from "node:http";
import { appendFile, mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const logDir = join(root, "data", "logs");
const weatherLogPath = join(logDir, "weather-refresh.log");
const cacheDir = join(root, "data", "cache");
const bundledLocationConstantsPath = join(root, "data", "location-constants.json");
const userLocationConstantsPath = join(root, "data", "user-location-constants.json");
const appSettingsPath = join(root, "data", "app-settings.json");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const serverVersion = "0.1.16";
const serverStartedAt = new Date().toISOString();
const weatherTtlMs = Number(process.env.WEATHER_CACHE_HOURS || 1) * 60 * 60 * 1000;
const weatherRefreshGuardMs = Number(process.env.WEATHER_REFRESH_GUARD_MINUTES || 10) * 60 * 1000;
const weatherCacheRetentionMs = Number(process.env.WEATHER_CACHE_RETENTION_DAYS || 30) * 24 * 60 * 60 * 1000;
const tideCacheRetentionMs = Number(process.env.TIDE_CACHE_RETENTION_DAYS || 14) * 24 * 60 * 60 * 1000;

const defaultAppSettings = {
  selectedGate: "Cuan Sound",
  selectedHeading: "270",
  selectedCrewCapability: "competent",
  speed: "5",
  ukhoAccountEmail: "",
  baseTideStationName: "Oban",
  baseTideStationId: "0372",
  baseTideTimeStandard: "UT",
  obanMhws: "4.00",
  obanMhwn: "2.90",
  obanMlwn: "1.80",
  obanMlws: "0.70",
  fallbackCycleHours: "12.5",
  fallbackEbbHours: "6.2",
  peakEbbOffsetMinutes: "180",
  peakFlowMinimumKn: "0.5",
  knotsToMs: "0.5144",
  gravityMs2: "9.81",
  displacementReferenceKg: "5604",
  resonanceMinSeconds: "1.8",
  resonanceMaxSeconds: "3.2",
  resonanceMinWaveM: "0.4",
  hobbyHorsingMultiplier: "1.3",
  tideWaveSteepeningPerKn: "0.03",
  tideWaveSteepeningMax: "0.25",
  beatingStrenuousWaveM: "0.6",
  beatingDangerousWaveM: "1.5",
  offwindStrenuousWaveM: "1.8",
  offwindDangerousWaveM: "2.8",
  beatingAcceptableBft: "4",
  beatingStrenuousBft: "5",
  beatingDangerousBft: "6",
  offwindStrenuousBft: "7",
  offwindDangerousBft: "8",
  strongFoulRatio: "0.4",
  gustBaseLimitKn: "30",
  gustBeatingPenaltyKn: "5",
  gustBeamPenaltyKn: "2",
  gustExposedWaveHeightM: "1.0",
  gustExposedFetchPenaltyKn: "4",
  gustWindOverTidePenaltyKn: "4",
  gustMajorGatePenaltyKn: "7",
  gustMajorGateTideKn: "3.0",
  windChillTempLimitC: "10",
  windChillWindLimitKmh: "4.8",
  knotsToKmh: "1.852"
};

const publicSettingKeys = Object.keys(defaultAppSettings);

const locations = {
  "Corryvreckan": { latitude: 56.153, longitude: -5.733, stationId: "0372" },
  "Cuan Sound": { latitude: 56.27224, longitude: -5.637656, stationId: "0372" },
  "Dorus Mor": { latitude: 56.047, longitude: -5.576, stationId: "0372" },
  "Sound of Luing": { latitude: 56.225, longitude: -5.609, stationId: "0372" }
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readRequestJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function cacheName(prefix, key) {
  return join(cacheDir, `${prefix}-${key.replace(/[^a-z0-9._-]+/gi, "_")}.json`);
}

async function readFreshCache(path, maxAgeMs) {
  try {
    const info = await stat(path);
    if (Date.now() - info.mtimeMs > maxAgeMs) return null;
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

async function writeCache(path, payload) {
  await mkdir(cacheDir, { recursive: true });
  await writeFile(path, JSON.stringify(payload, null, 2));
}

async function readCache(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

function withCacheStatus(payload, status) {
  return {
    ...payload,
    cache: {
      ...payload.cache,
      ...status
    }
  };
}

function oneLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function logWeather(level, message) {
  const line = `${new Date().toISOString()} ${message}`;
  if (level === "error") console.error(line);
  else console.log(line);
  mkdir(logDir, { recursive: true })
    .then(() => appendFile(weatherLogPath, `${line}\n`))
    .catch(() => {});
}

async function fetchProviderJson(label, url) {
  const startedAt = Date.now();
  logWeather("info", `[weather-refresh] ${label} request ${url.toString()}`);
  try {
    const response = await fetch(url);
    const elapsedMs = Date.now() - startedAt;
    if (!response.ok) {
      const body = oneLine(await response.text().catch(() => ""));
      logWeather("error", `[weather-refresh] ${label} failed status=${response.status} ${response.statusText} elapsedMs=${elapsedMs} body="${body.slice(0, 240)}"`);
      const error = new Error(`${label} provider returned ${response.status} ${response.statusText}${body ? `: ${body.slice(0, 180)}` : ""}`);
      error.status = 502;
      error.upstreamStatus = response.status;
      throw error;
    }
    logWeather("info", `[weather-refresh] ${label} ok status=${response.status} elapsedMs=${elapsedMs}`);
    return await response.json();
  } catch (error) {
    if (!error.upstreamStatus) {
      logWeather("error", `[weather-refresh] ${label} request error elapsedMs=${Date.now() - startedAt} error="${error.message}"`);
      error.status = 502;
    }
    throw error;
  }
}

async function readLatestCacheByPrefix(filePrefix) {
  try {
    const files = await readdir(cacheDir);
    const matches = files
      .filter((file) => file.startsWith(filePrefix) && file.endsWith(".json"))
      .sort()
      .reverse();
    for (const file of matches) {
      const cached = await readCache(join(cacheDir, file));
      if (cached) return cached;
    }
  } catch {
    return null;
  }
  return null;
}

function cacheTimestamp(payload, fallbackInfo) {
  const fetchedAt = payload?.cache?.fetchedAt ? new Date(payload.cache.fetchedAt).getTime() : NaN;
  if (Number.isFinite(fetchedAt)) return fetchedAt;
  return fallbackInfo?.mtimeMs || 0;
}

async function pruneCacheFiles() {
  try {
    await mkdir(cacheDir, { recursive: true });
    const files = await readdir(cacheDir);
    const now = Date.now();
    await Promise.all(files.map(async (file) => {
      if (!file.endsWith(".json")) return;
      const path = join(cacheDir, file);
      const info = await stat(path).catch(() => null);
      if (!info) return;
      const payload = await readCache(path);
      const timestamp = cacheTimestamp(payload, info);
      const maxAge = file.startsWith("weather-")
        ? weatherCacheRetentionMs
        : file.startsWith("tides-")
          ? tideCacheRetentionMs
          : null;
      if (maxAge && now - timestamp > maxAge) {
        await unlink(path).catch(() => {});
      }
    }));
  } catch (error) {
    console.warn(`${new Date().toISOString()} [cache-prune] ${error.message}`);
  }
}

async function readAppSettings() {
  return {
    ...defaultAppSettings,
    ...(await readCache(appSettingsPath) || {})
  };
}

function publicAppSettings(settings) {
  return Object.fromEntries(publicSettingKeys.map((key) => [key, settings[key]]));
}

async function writeAppSettings(settings) {
  await mkdir(join(root, "data"), { recursive: true });
  await writeFile(appSettingsPath, JSON.stringify(settings, null, 2));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchWeather(url, res) {
  const locationName = url.searchParams.get("location");
  const location = locationName ? locations[locationName] : null;
  const latitude = url.searchParams.get("lat") ?? location?.latitude;
  const longitude = url.searchParams.get("lon") ?? location?.longitude;
  const weatherDays = Math.max(1, Math.min(16, Number(url.searchParams.get("days") || 16)));
  const marineDays = Math.max(1, Math.min(8, Number(url.searchParams.get("marineDays") || 8)));
  if (!latitude || !longitude) return json(res, 400, { error: "lat and lon are required" });

  const key = locationName ? `${locationName}_${latitude}_${longitude}` : `${latitude}_${longitude}`;
  const cachePath = cacheName("weather", `${key}_${weatherDays}_${marineDays}`);
  const latestCached = await readLatestCacheByPrefix(`weather-${key.replace(/[^a-z0-9._-]+/gi, "_")}_`);
  const manualRefresh = url.searchParams.get("refresh") === "1";
  const cached = await readCache(cachePath);
  const fetchedAtMs = cached?.cache?.fetchedAt ? new Date(cached.cache.fetchedAt).getTime() : 0;
  const ageMs = fetchedAtMs ? Date.now() - fetchedAtMs : Infinity;
  if (cached && !manualRefresh) {
    return json(res, 200, withCacheStatus(cached, {
        hit: true,
        manualRefresh,
        stale: ageMs > weatherTtlMs,
        refreshAfter: new Date(fetchedAtMs + weatherRefreshGuardMs).toISOString()
    }));
  }
  if (!manualRefresh) {
    if (latestCached) {
      return json(res, 200, withCacheStatus(latestCached, {
        hit: true,
        manualRefresh,
        stale: true,
        offlineFallback: true,
        fallbackReason: "Using latest stored weather data; press Refresh Weather to fetch from the web",
        refreshAfter: latestCached.cache?.refreshAfter || latestCached.cache?.fetchedAt || null
      }));
    }
    return json(res, 404, {
      error: "No stored weather data is available for this location. Press Refresh Weather when connected to the internet."
    });
  }

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.search = new URLSearchParams({
    latitude,
    longitude,
    hourly: "temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m",
    wind_speed_unit: "kn",
    forecast_days: String(weatherDays),
    timezone: "GMT"
  });

  const marineUrl = new URL("https://marine-api.open-meteo.com/v1/marine");
  marineUrl.search = new URLSearchParams({
    latitude,
    longitude,
    hourly: "wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,swell_wave_direction",
    forecast_days: String(marineDays),
    timezone: "GMT"
  });

  let forecast;
  let marine;
  try {
    [forecast, marine] = await Promise.all([
      fetchProviderJson("Open-Meteo weather", weatherUrl),
      fetchProviderJson("Open-Meteo marine", marineUrl)
    ]);
  } catch (error) {
    const fallback = cached || latestCached;
    if (fallback) {
      logWeather("error", `[weather-refresh] using stored weather fallback for ${locationName || `${latitude},${longitude}`}: ${error.message}`);
      return json(res, 200, withCacheStatus(fallback, {
        hit: true,
        stale: true,
        manualRefresh,
        offlineFallback: true,
        fallbackReason: error.message,
        refreshAfter: fallback.cache?.refreshAfter || fallback.cache?.fetchedAt || null
      }));
    }
    return json(res, error.status || 502, {
      error: "Weather provider unavailable and no stored weather cache is available",
      detail: error.message,
      upstreamStatus: error.upstreamStatus || null
    });
  }
  const payload = {
    location: locationName || null,
    latitude: Number(latitude),
    longitude: Number(longitude),
    weatherDays,
    marineDays,
    forecast,
    marine,
    cache: {
      hit: false,
      fetchedAt: new Date().toISOString(),
      refreshAfter: new Date(Date.now() + weatherRefreshGuardMs).toISOString(),
      policy: `${weatherTtlMs / 3600000} hour freshness marker; provider fetch only on manual refresh`
    }
  };
  await writeCache(cachePath, payload);
  pruneCacheFiles();
  json(res, 200, payload);
}

async function fetchTides(url, res) {
  const appSettings = await readAppSettings();
  const locationName = url.searchParams.get("location");
  const location = locationName ? locations[locationName] : null;
  const stationId = String(url.searchParams.get("stationId") || appSettings.baseTideStationId || location?.stationId || "").padStart(4, "0");
  if (!stationId || stationId === "0000") return json(res, 400, { error: "stationId is required" });

  const cachePath = cacheName("tides", `${stationId}_${todayKey()}`);
  const manualRefresh = url.searchParams.get("refresh") === "1";
  const cached = await readFreshCache(cachePath, 24 * 60 * 60 * 1000);
  if (cached && !manualRefresh) return json(res, 200, withCacheStatus(cached, { hit: true }));

  const latestCached = await readLatestCacheByPrefix(`tides-${stationId}_`);
  if (latestCached && !manualRefresh) {
    return json(res, 200, withCacheStatus(latestCached, {
      hit: true,
      stale: true,
      offlineFallback: true,
      fallbackReason: "Using latest stored tide data; press Refresh Tides to fetch from the web"
    }));
  }

  if (!manualRefresh) {
    return json(res, 404, {
      error: "No stored tide data is available. Press Refresh Tides when connected to the internet."
    });
  }

  const apiKey = process.env.UKHO_API_KEY || appSettings.ukhoApiKey;
  if (!apiKey) {
    if (latestCached) {
      return json(res, 200, withCacheStatus(latestCached, {
        hit: true,
        stale: true,
        offlineFallback: true,
        fallbackReason: "UKHO_API_KEY is not set; using latest stored tide data"
      }));
    }
    return json(res, 400, { error: "UKHO_API_KEY is not set and no cached tide data is available" });
  }

  const paths = [
    `https://admiraltyapi.azure-api.net/uktidalapi/v1/Stations/${stationId}/TidalEvents`,
    `https://admiraltyapi.azure-api.net/uktidalapi/api/v1/Stations/${stationId}/TidalEvents`
  ];

  let lastError = "No response";
  for (const path of paths) {
    try {
      const response = await fetch(path, { headers: { "Ocp-Apim-Subscription-Key": apiKey } });
      if (response.ok) {
        const payload = {
          stationId,
          stationName: appSettings.baseTideStationName || "Oban",
          timeStandard: appSettings.baseTideTimeStandard || "UT",
          location: locationName || null,
          events: await response.json(),
          cache: {
            hit: false,
            fetchedAt: new Date().toISOString(),
            refreshAfter: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            policy: "once per day freshness marker; provider fetch only on manual refresh"
          }
        };
        await writeCache(cachePath, payload);
        pruneCacheFiles();
        return json(res, 200, payload);
      }
      lastError = `${response.status} ${response.statusText}`;
    } catch (error) {
      lastError = error.message;
    }
  }
  if (latestCached) {
    return json(res, 200, withCacheStatus(latestCached, {
      hit: true,
      stale: true,
      offlineFallback: true,
      fallbackReason: lastError
    }));
  }
  json(res, 502, { error: lastError });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/api/locations") return json(res, 200, locations);
    if (url.pathname === "/api/location-constants" && req.method === "GET") {
      try {
        const body = await readFile(userLocationConstantsPath, "utf8");
        res.writeHead(200, { "content-type": contentTypes[".json"] });
        res.end(body);
      } catch (error) {
        if (error.code === "ENOENT") {
          try {
            const body = await readFile(bundledLocationConstantsPath, "utf8");
            res.writeHead(200, { "content-type": contentTypes[".json"] });
            res.end(body);
          } catch (fallbackError) {
            if (fallbackError.code === "ENOENT") return json(res, 404, { error: "No saved location constants file yet" });
            throw fallbackError;
          }
          return;
        }
        throw error;
      }
      return;
    }
    if (url.pathname === "/api/location-constants" && req.method === "POST") {
      const body = await readRequestJson(req);
      await mkdir(join(root, "data"), { recursive: true });
      await writeFile(userLocationConstantsPath, JSON.stringify(body, null, 2));
      return json(res, 200, { ok: true, path: userLocationConstantsPath });
    }
    if (url.pathname === "/api/settings" && req.method === "GET") {
      const settings = await readAppSettings();
      return json(res, 200, {
        ...publicAppSettings(settings),
        ukhoApiKeySet: Boolean(process.env.UKHO_API_KEY || settings.ukhoApiKey),
      });
    }
    if (url.pathname === "/api/settings" && req.method === "POST") {
      const body = await readRequestJson(req);
      const current = await readAppSettings();
      const next = { ...current };
      if (typeof body.ukhoApiKey === "string") next.ukhoApiKey = body.ukhoApiKey.trim();
      if (typeof body.baseTideStationName === "string") next.baseTideStationName = body.baseTideStationName.trim() || "Oban";
      if (typeof body.baseTideStationId === "string") next.baseTideStationId = body.baseTideStationId.trim().padStart(4, "0");
      if (typeof body.baseTideTimeStandard === "string") next.baseTideTimeStandard = body.baseTideTimeStandard.trim() || "UT";
      if (typeof body.obanMhws === "string") next.obanMhws = body.obanMhws.trim();
      if (typeof body.obanMhwn === "string") next.obanMhwn = body.obanMhwn.trim();
      if (typeof body.obanMlwn === "string") next.obanMlwn = body.obanMlwn.trim();
      if (typeof body.obanMlws === "string") next.obanMlws = body.obanMlws.trim();
      for (const key of publicSettingKeys) {
        if (typeof body[key] === "string") next[key] = body[key].trim();
      }
      await writeAppSettings(next);
      return json(res, 200, {
        ok: true,
        ...publicAppSettings(next),
        ukhoApiKeySet: Boolean(process.env.UKHO_API_KEY || next.ukhoApiKey),
      });
    }
    if (url.pathname === "/api/version") {
      return json(res, 200, {
        serverVersion,
        host,
        port,
        startedAt: serverStartedAt
      });
    }
    if (url.pathname === "/api/shutdown" && req.method === "POST") {
      res.writeHead(200, { "content-type": "application/json; charset=utf-8", connection: "close" });
      res.end(JSON.stringify({ ok: true, message: "Server is shutting down" }));
      setTimeout(() => {
        server.close();
        setTimeout(() => process.exit(0), 250);
      }, 100);
      return;
    }
    if (url.pathname === "/api/weather") return await fetchWeather(url, res);
    if (url.pathname === "/api/tides") return await fetchTides(url, res);

    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = normalize(join(publicDir, requested));
    if (!filePath.startsWith(publicDir)) return json(res, 403, { error: "Forbidden" });
    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": contentTypes[extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch (error) {
    if (error.code === "ENOENT") return json(res, 404, { error: "Not found" });
    json(res, 500, { error: error.message });
  }
});

pruneCacheFiles();

server.listen(port, host, () => {
  console.log(`Passage planner running at http://${host}:${port}`);
});
