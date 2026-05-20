const $ = (id) => document.getElementById(id);

const selectedColumns = [
  { label: "Local Time (UK)", source: "Local Time" },
  { label: "Overall", source: "Overall" },
  { label: "Wind Bft", source: "Wind (kn)", format: "beaufort" },
  { label: "Gust Bft", source: "Gust (kn)", format: "beaufort" },
  { label: "Wind Dir", source: "Wind Dir" },
  { label: "Wave (m)", source: "Wave (m)", format: "meters" },
  { label: "Swell (m)", source: "Swell (m)", format: "meters" },
  { label: "Tide Rate (kn)", source: "Tide Rate (kn)", format: "knots" },
  { label: "Tide Dir", source: "Tide Dir (deg)", format: "cardinal" },
  { label: "Tide Status", source: "Tide Status" },
  { label: "Rel: Boat-Tide", source: "Rel: Boat-Tide" },
  { label: "Rel: Wind-Tide", source: "Rel: Wind-Tide" },
  { label: "Point of Sail", source: "Point of Sail" },
  { label: "SOG (OnCourse)", source: "SOG (OnCourse)", format: "knots" },
  { label: "CTS Angle", source: "CTS Angle" },
  { label: "Wind Rating", source: "Wind Rating" },
  { label: "Wave Rating", source: "Wave Rating" }
];

const locationConstantColumns = [
  { key: "location", label: "Location", type: "text" },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
  { key: "maps", label: "Google Maps", type: "link" },
  { key: "floodSet", label: "Flood Set", type: "cardinal" },
  { key: "ebbSet", label: "Ebb Set", type: "cardinal" },
  { key: "springPeakFlow", label: "Spring Peak Flow (kn)", type: "number" },
  { key: "neapPeakFlow", label: "Neap Peak Flow (kn)", type: "number" },
  { key: "source", label: "Source", type: "text" },
  { key: "floodSpringAfter", label: "Flood Spring After HW", type: "duration" },
  { key: "floodNeapAfter", label: "Flood Neap After HW", type: "duration" },
  { key: "floodSpringSlack", label: "Flood Spring Slack", type: "duration" },
  { key: "floodNeapSlack", label: "Flood Neap Slack", type: "duration" },
  { key: "ebbSpringAfter", label: "Ebb Spring After HW", type: "duration" },
  { key: "ebbNeapAfter", label: "Ebb Neap After HW", type: "duration" },
  { key: "ebbSpringSlack", label: "Ebb Spring Slack", type: "duration" },
  { key: "ebbNeapSlack", label: "Ebb Neap Slack", type: "duration" },
  { key: "actions", label: "Actions", type: "actions" }
];

const locationConstants = {
  "Corryvreckan": {
    location: "Corryvreckan",
    latitude: "56.153",
    longitude: "-5.733",
    floodSet: "W",
    ebbSet: "E",
    springPeakFlow: "8.5",
    neapPeakFlow: "4.0",
    source: "Existing app constants; spring rate agrees with Paddle Argyll",
    floodSpringAfter: "4:10:00",
    floodNeapAfter: "4:10:00",
    floodSpringSlack: "0:12:00",
    floodNeapSlack: "0:40:00",
    ebbSpringAfter: "-2:10:00",
    ebbNeapAfter: "-2:10:00",
    ebbSpringSlack: "0:12:00",
    ebbNeapSlack: "0:40:00"
  },
  "Cuan Sound": {
    location: "Cuan Sound",
    latitude: "56.27224",
    longitude: "-5.637656",
    floodSet: "W",
    ebbSet: "E",
    springPeakFlow: "7.0",
    neapPeakFlow: "3.5",
    source: "Existing app constants; alternate Paddle Argyll spring rate is 6 kn",
    floodSpringAfter: "4:20:00",
    floodNeapAfter: "4:50:00",
    floodSpringSlack: "0:15:00",
    floodNeapSlack: "0:40:00",
    ebbSpringAfter: "-2:00:00",
    ebbNeapAfter: "-1:30:00",
    ebbSpringSlack: "0:15:00",
    ebbNeapSlack: "0:40:00"
  },
  "Dorus Mor": {
    location: "Dorus Mor",
    latitude: "56.047",
    longitude: "-5.576",
    floodSet: "NW",
    ebbSet: "SE",
    springPeakFlow: "5.0",
    neapPeakFlow: "2.5",
    source: "Existing app constants; alternate Paddle Argyll spring rate is 8 kn",
    floodSpringAfter: "3:30:00",
    floodNeapAfter: "4:15:00",
    floodSpringSlack: "0:15:00",
    floodNeapSlack: "0:45:00",
    ebbSpringAfter: "-2:15:00",
    ebbNeapAfter: "-1:30:00",
    ebbSpringSlack: "0:15:00",
    ebbNeapSlack: "0:45:00"
  },
  "Sound of Luing": {
    location: "Sound of Luing",
    latitude: "56.225",
    longitude: "-5.609",
    floodSet: "NW",
    ebbSet: "SE",
    springPeakFlow: "7.0",
    neapPeakFlow: "3.5",
    source: "Existing app constants; alternate Paddle Argyll spring rate is 4 kn",
    floodSpringAfter: "4:30:00",
    floodNeapAfter: "5:00:00",
    floodSpringSlack: "0:20:00",
    floodNeapSlack: "0:50:00",
    ebbSpringAfter: "-1:55:00",
    ebbNeapAfter: "-1:30:00",
    ebbSpringSlack: "0:20:00",
    ebbNeapSlack: "0:50:00"
  },
  "Mull of Kintyre": {
    location: "Mull of Kintyre",
    latitude: "55.31067",
    longitude: "-5.80149",
    floodSet: "",
    ebbSet: "",
    springPeakFlow: "",
    neapPeakFlow: "",
    source: "User-provided Sail Scotland list; UKCityMap coordinates; no complete timing/slack/neap source yet",
    floodSpringAfter: "",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  },
  "Sound of Islay": {
    location: "Sound of Islay",
    latitude: "",
    longitude: "",
    floodSet: "N",
    ebbSet: "S",
    springPeakFlow: "5.4",
    neapPeakFlow: "",
    source: "Tethys/Sound of Islay monitoring reports flood north, ebb south, recorded 5.44 kn; no complete timing/slack/neap source yet",
    floodSpringAfter: "",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  },
  "Sound of Kerrera": {
    location: "Sound of Kerrera",
    latitude: "56.40000",
    longitude: "-5.51667",
    floodSet: "N",
    ebbSet: "S",
    springPeakFlow: "1.5",
    neapPeakFlow: "",
    source: "Paddle Argyll Kayak Trail spring rate/start times; Mindat coordinates",
    floodSpringAfter: "4:30:00",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "-1:55:00",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  },
  "Clachan Sound": {
    location: "Clachan Sound",
    latitude: "56.31772",
    longitude: "-5.58281",
    floodSet: "N",
    ebbSet: "S",
    springPeakFlow: "5.0",
    neapPeakFlow: "",
    source: "Paddle Argyll Kayak Trail spring rate/start times; Trove/HES coordinates",
    floodSpringAfter: "5:55:00",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "-0:25:00",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  },
  "Torsa": {
    location: "Torsa",
    latitude: "56.25722",
    longitude: "-5.61667",
    floodSet: "N",
    ebbSet: "S",
    springPeakFlow: "1.0",
    neapPeakFlow: "",
    source: "Paddle Argyll Kayak Trail spring rate/start times; Torsa coordinates",
    floodSpringAfter: "4:15:00",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "-2:00:00",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  },
  "Duart Point": {
    location: "Duart Point",
    latitude: "56.44167",
    longitude: "-5.64667",
    floodSet: "NW",
    ebbSet: "SE",
    springPeakFlow: "2.0",
    neapPeakFlow: "",
    source: "UKRGB/seakayakphoto timing at SE Sound of Mull/Rubha an Ridire; NLB Duart Point coordinates",
    floodSpringAfter: "-6:00:00",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "-0:45:00",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  },
  "Kyle of Loch Alsh": {
    location: "Kyle of Loch Alsh",
    latitude: "57.28387",
    longitude: "-5.71117",
    floodSet: "",
    ebbSet: "",
    springPeakFlow: "",
    neapPeakFlow: "",
    source: "User-provided Sail Scotland list; Geodatos coordinates; no complete tidal stream constants sourced yet",
    floodSpringAfter: "",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  },
  "Kyle Rhea": {
    location: "Kyle Rhea",
    latitude: "",
    longitude: "",
    floodSet: "",
    ebbSet: "",
    springPeakFlow: "",
    neapPeakFlow: "",
    source: "Tethys scoping report notes streams can exceed 8 kn at springs and 5 kn on neap flood; no complete timing/slack constants sourced yet",
    floodSpringAfter: "",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  },
  "Ardnamurchan Point": {
    location: "Ardnamurchan Point",
    latitude: "56.72556",
    longitude: "-6.22583",
    floodSet: "",
    ebbSet: "",
    springPeakFlow: "",
    neapPeakFlow: "",
    source: "British Place Names coordinates; no complete tidal stream timing/slack/neap source yet",
    floodSpringAfter: "",
    floodNeapAfter: "",
    floodSpringSlack: "",
    floodNeapSlack: "",
    ebbSpringAfter: "",
    ebbNeapAfter: "",
    ebbSpringSlack: "",
    ebbNeapSlack: ""
  }
};

const timeColumns = [
  "Flood Slack Starts",
  "Flood Commences",
  "Flood Slack Ends",
  "Peak Flood Time",
  "Ebb Slack Starts",
  "Ebb Commences",
  "Ebb Slack Ends",
  "Peak Ebb Time"
];

const editableTideColumns = [
  "Local Time",
  "HW Time (UTC)",
  "HW Height (m)",
  "Range (m)",
  "% Spring",
  "Peak Flow (kn)",
  "Peak Flood Dir (deg)",
  "Flood Commences",
  "Ebb Commences",
  "Peak Ebb Dir (deg)",
  "Location"
];

const fetchedWeatherColumns = [
  "Local Time",
  "Temp (°C)",
  "Wind (kn)",
  "Gust (kn)",
  "Wind Dir",
  "Wave (m)",
  "Period (s)",
  "Wave Dir",
  "Swell (m)",
  "Swell (s)",
  "Swell Dir"
];

const fetchedTideColumns = [
  "Time (UT)",
  "Tide",
  "Height (m)",
  "Range (m)",
  "% Spring"
];

const beaufortBounds = [
  { force: 0, min: 0, max: 1, description: "Calm" },
  { force: 1, min: 1, max: 4, description: "Light Air" },
  { force: 2, min: 4, max: 7, description: "Light Breeze" },
  { force: 3, min: 7, max: 11, description: "Gentle Breeze" },
  { force: 4, min: 11, max: 17, description: "Moderate Breeze" },
  { force: 5, min: 17, max: 22, description: "Fresh Breeze" },
  { force: 6, min: 22, max: 28, description: "Strong Breeze" },
  { force: 7, min: 28, max: 34, description: "Near Gale" },
  { force: 8, min: 34, max: 41, description: "Gale" },
  { force: 9, min: 41, max: 48, description: "Severe Gale" },
  { force: 10, min: 48, max: 56, description: "Storm" },
  { force: 11, min: 56, max: 64, description: "Violent Storm" },
  { force: 12, min: 64, max: Infinity, description: "Hurricane" }
];

const crewProfiles = [
  {
    key: "family",
    label: "Family with young children",
    windBftOffset: -1,
    waveMultiplier: 0.7,
    strongFoulRatio: 0.6,
    hobbyMultiplier: 1.45
  },
  {
    key: "competent",
    label: "Competent Crew",
    windBftOffset: 0,
    waveMultiplier: 1,
    strongFoulRatio: null,
    hobbyMultiplier: null
  },
  {
    key: "racing",
    label: "Racing Crew",
    windBftOffset: 1,
    waveMultiplier: 1.3,
    strongFoulRatio: 0.25,
    hobbyMultiplier: 1.15
  }
];

let currentWeatherRows = null;
let currentTideRows = null;
let currentFetchedTideRows = null;
let currentPlanRows = null;
let currentWeatherMeta = null;
let currentTideMeta = null;
let currentTideEvents = null;
let hourRepeatTimer = null;
let hourRepeatDelayTimer = null;
let appSettings = {
  selectedGate: "Cuan Sound",
  selectedHeading: "270",
  selectedCrewCapability: "competent",
  speed: "5",
  ukhoAccountEmail: "",
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
  windChillTempLimitC: "10",
  windChillWindLimitKmh: "4.8",
  knotsToKmh: "1.852"
};

const calculationSettingIds = [
  "fallbackCycleHours",
  "fallbackEbbHours",
  "peakEbbOffsetMinutes",
  "peakFlowMinimumKn",
  "knotsToMs",
  "gravityMs2",
  "displacementReferenceKg",
  "resonanceMinSeconds",
  "resonanceMaxSeconds",
  "resonanceMinWaveM",
  "hobbyHorsingMultiplier",
  "tideWaveSteepeningPerKn",
  "tideWaveSteepeningMax",
  "beatingStrenuousWaveM",
  "beatingDangerousWaveM",
  "offwindStrenuousWaveM",
  "offwindDangerousWaveM",
  "beatingAcceptableBft",
  "beatingStrenuousBft",
  "beatingDangerousBft",
  "offwindStrenuousBft",
  "offwindDangerousBft",
  "strongFoulRatio",
  "windChillTempLimitC",
  "windChillWindLimitKmh",
  "knotsToKmh"
];

function settingNumber(key) {
  const control = $(key);
  const value = control ? control.value : appSettings[key];
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : Number(appSettings[key]);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function competentComfortSettings() {
  return {
    beatingAcceptableBft: settingNumber("beatingAcceptableBft"),
    beatingStrenuousBft: settingNumber("beatingStrenuousBft"),
    beatingDangerousBft: settingNumber("beatingDangerousBft"),
    offwindStrenuousBft: settingNumber("offwindStrenuousBft"),
    offwindDangerousBft: settingNumber("offwindDangerousBft"),
    strongFoulRatio: settingNumber("strongFoulRatio"),
    beatingStrenuousWaveM: settingNumber("beatingStrenuousWaveM"),
    beatingDangerousWaveM: settingNumber("beatingDangerousWaveM"),
    offwindStrenuousWaveM: settingNumber("offwindStrenuousWaveM"),
    offwindDangerousWaveM: settingNumber("offwindDangerousWaveM"),
    hobbyHorsingMultiplier: settingNumber("hobbyHorsingMultiplier")
  };
}

function crewComfortSettings(profileKey = "competent") {
  const base = competentComfortSettings();
  const profile = crewProfiles.find((item) => item.key === profileKey) || crewProfiles[1];
  const applyWind = (value) => clamp(Number(value) + profile.windBftOffset, 0, 12);
  return {
    ...base,
    beatingAcceptableBft: applyWind(base.beatingAcceptableBft),
    beatingStrenuousBft: applyWind(base.beatingStrenuousBft),
    beatingDangerousBft: applyWind(base.beatingDangerousBft),
    offwindStrenuousBft: applyWind(base.offwindStrenuousBft),
    offwindDangerousBft: applyWind(base.offwindDangerousBft),
    strongFoulRatio: profile.strongFoulRatio ?? base.strongFoulRatio,
    beatingStrenuousWaveM: base.beatingStrenuousWaveM * profile.waveMultiplier,
    beatingDangerousWaveM: base.beatingDangerousWaveM * profile.waveMultiplier,
    offwindStrenuousWaveM: base.offwindStrenuousWaveM * profile.waveMultiplier,
    offwindDangerousWaveM: base.offwindDangerousWaveM * profile.waveMultiplier,
    hobbyHorsingMultiplier: profile.hobbyMultiplier ?? base.hobbyHorsingMultiplier
  };
}

function beaufortScale(knots) {
  if (knots === null || knots === "") return ["", ""];
  const band = beaufortBand(knots);
  return [band.force, band.description];
}

function cardinalToDegrees(cardinalString) {
  if (!cardinalString || typeof cardinalString !== "string") return "N/A";
  const directions = {
    N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
    S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5
  };
  const key = cardinalString.toUpperCase().trim();
  return Object.prototype.hasOwnProperty.call(directions, key) ? directions[key] : "N/A";
}

function knotsToBeaufort(knots) {
  return beaufortBand(knots).force;
}

function beaufortBand(knots) {
  const speed = Math.max(0, Number(knots) || 0);
  return beaufortBounds.find((band) => speed >= band.min && speed < band.max) || beaufortBounds[beaufortBounds.length - 1];
}

function beaufortDecimal(knots) {
  const speed = Math.max(0, Number(knots) || 0);
  const band = beaufortBand(speed);
  if (!Number.isFinite(band.max)) return 12;
  const span = band.max - band.min;
  if (span <= 0) return band.force;
  return Math.min(12, band.force + ((speed - band.min) / span));
}

function calculateWindChill(temp, knots) {
  const wind = Number(knots) * settingNumber("knotsToKmh");
  if (Number(temp) > settingNumber("windChillTempLimitC") || wind < settingNumber("windChillWindLimitKmh")) return Math.round(Number(temp));
  const temperature = Number(temp);
  const wc = 13.12 + (0.6215 * temperature) - (11.37 * (wind ** 0.16)) + (0.3965 * temperature * (wind ** 0.16));
  return Math.round(wc);
}

function degreesToCardinal(degrees) {
  if (degrees === null || degrees === undefined || degrees === "") return "-";
  if (Number.isNaN(Number(degrees))) return "-";
  const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return cardinals[Math.round(Number(degrees) / 22.5) % 16];
}

function get8PointArrow(deg) {
  if (Number.isNaN(Number(deg)) || deg === "-" || deg === null) return "-";
  const arrows = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];
  return arrows[Math.round(Number(deg) / 45) % 8];
}

function windAndWaveArrow(deg) {
  if (deg === null || deg === "" || Number.isNaN(Number(deg))) return "";
  return get8PointArrow((Number(deg) + 180) % 360);
}

function getPointOfSail(hdg, windFrom) {
  let diff = Math.abs(Number(hdg) - Number(windFrom));
  if (diff > 180) diff = 360 - diff;
  if (diff < 50) return "beating";
  if (diff < 80) return "close reach";
  if (diff < 105) return "beam reach";
  if (diff < 150) return "broad reach";
  return "running";
}

function getRelativeFlow(hdg, flowDir, type) {
  if (flowDir === "-" || flowDir === "" || Number.isNaN(Number(flowDir))) return "Slack";
  let targetDir = Number(flowDir);
  if (type === "Wind" || type === "WindTide") targetDir = (targetDir + 180) % 360;
  let diff = Math.abs(Number(hdg) - targetDir) % 360;
  if (diff > 180) diff = 360 - diff;
  if (diff <= 45) return type === "Tide" ? "Fair Tide" : "With";
  if (diff >= 135) return type === "Tide" ? "Foul Tide" : "Against";
  return "Cross";
}

function calculateNavSpeeds(Vs, yachtHdg, Vt, tideDir) {
  const hdgRad = yachtHdg * (Math.PI / 180);
  const tideRad = tideDir * (Math.PI / 180);
  const alpha = hdgRad - tideRad;
  const sogCrab = Math.sqrt((Vs ** 2) + (Vt ** 2) + (2 * Vs * Vt * Math.cos(alpha)));
  const crossCurrent = Vt * Math.sin(alpha);
  let sogOnCourse = 0;
  let ctsAngle = 0;

  if (Math.abs(crossCurrent) < Vs) {
    ctsAngle = Math.asin(crossCurrent / Vs) * (180 / Math.PI);
    sogOnCourse = Math.sqrt((Vs ** 2) - (crossCurrent ** 2)) + (Vt * Math.cos(alpha));
  }

  return {
    crabbing: Math.max(0, sogCrab).toFixed(2),
    onCourse: Math.max(0, sogOnCourse).toFixed(2),
    ctsAngle: ctsAngle === 0 ? "0°" : `${ctsAngle.toFixed(1)}°`
  };
}

function calculateSineRate(currentTime, startTime, endTime, peakRate) {
  const fraction = (currentTime - startTime) / (endTime - startTime);
  return peakRate * Math.sin(fraction * Math.PI);
}

function angularDifference(a, b) {
  let diff = Math.abs(Number(a) - Number(b));
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function checkWindComfort(bft, pos, settings) {
  const force = Number(bft);
  if (pos === "beating") {
    if (force >= settings.beatingDangerousBft) return "Dangerous";
    if (force >= settings.beatingStrenuousBft) return "Strenuous";
    return force >= settings.beatingAcceptableBft ? "Acceptable" : "Pleasant";
  }
  return force >= settings.offwindDangerousBft ? "Dangerous" : force >= settings.offwindStrenuousBft ? "Strenuous" : "Acceptable";
}

function checkWaveComfortOptimized(rawRow, pos, tideStatus, tideRate, tideDirDeg, settings) {
  const COL = { wH: 12, wP: 13, wD: 14, sH: 17, sP: 18, sD: 19, windDir: 6 };
  const waveH = Number(rawRow[COL.wH] || 0);
  const swellH = Number(rawRow[COL.sH] || 0);
  let combinedH = Math.sqrt((waveH ** 2) + (swellH ** 2));
  if (combinedH === 0) return "Smooth";

  const getTe = (period, direction) => {
    const p = Number(period);
    if (!p) return null;
    const dirDeg = direction !== null && direction !== "" && !Number.isNaN(Number(direction))
      ? Number(direction)
      : Number(rawRow[COL.windDir]);
    const boatSpeedMs = settings.yachtSpeed * settings.knotsToMs;
    const waveSpeed = (settings.gravityMs2 * p) / (2 * Math.PI);
    let angleToWaves = Math.abs(settings.hdg - dirDeg);
    if (angleToWaves > 180) angleToWaves = 360 - angleToWaves;
    return p / (1 + (boatSpeedMs / waveSpeed) * Math.cos(angleToWaves * (Math.PI / 180)));
  };

  const inResonance = (te) => te >= settings.resonanceMinSeconds && te <= settings.resonanceMaxSeconds;
  const windEncounter = getTe(rawRow[COL.wP], rawRow[COL.wD]);
  const swellEncounter = getTe(rawRow[COL.sP], rawRow[COL.sD]);
  const isHobby = (windEncounter && inResonance(windEncounter) && waveH > settings.resonanceMinWaveM)
    || (swellEncounter && inResonance(swellEncounter) && swellH > settings.resonanceMinWaveM);

  if (isHobby) combinedH *= settings.hobbyHorsingMultiplier;
  const tideOpposesWaves = tideStatus !== "Slack"
    && Math.abs(tideRate) > 0
    && [rawRow[COL.wD], rawRow[COL.sD]]
      .filter((direction) => direction !== null && direction !== "" && !Number.isNaN(Number(direction)))
      .some((direction) => angularDifference((Number(direction) + 180) % 360, tideDirDeg) >= 135);
  if (tideOpposesWaves) {
    combinedH *= 1 + Math.min(settings.tideWaveSteepeningMax, Math.abs(tideRate) * settings.tideWaveSteepeningPerKn);
  }

  const limit = settings.displacement / settings.displacementReferenceKg;
  let status = "Acceptable";
  if (pos === "beating") {
    if (combinedH > settings.beatingStrenuousWaveM * limit) status = "Strenuous";
    if (combinedH > settings.beatingDangerousWaveM * limit) status = "Dangerous";
  } else {
    if (combinedH > settings.offwindStrenuousWaveM * limit) status = "Strenuous";
    if (combinedH > settings.offwindDangerousWaveM * limit) status = "Dangerous";
  }
  if (isHobby) {
    if (status === "Acceptable") status = "Strenuous";
    return `${status} (Hobby-Horsing)`;
  }
  return status;
}

function checkTideRating(sogOnCourse, yachtSpeed, settings) {
  const sog = Number(sogOnCourse);
  const ratio = sog / yachtSpeed;
  if (sog <= 0) return "Set Back";
  if (ratio < settings.strongFoulRatio) return "Strong Foul";
  if (sog < yachtSpeed) return "Adverse";
  if (sog > yachtSpeed) return "Fair Tide";
  return "Neutral";
}

function overallRating(wind, wave, tide) {
  if (wind === "Dangerous" || wave.includes("Dangerous") || tide === "Set Back" || tide === "Strong Foul") {
    return "Unacceptable";
  }
  if (wind === "Strenuous" || wave.includes("Strenuous") || wave.includes("Hobby-Horsing") || tide === "Adverse") {
    return "Uncomfortable";
  }
  if (tide === "Fair Tide" && wave === "Smooth" && wind === "Acceptable") return "Pleasant";
  return "Comfortable";
}

function parseTime(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return new Date(Math.round((value - 25569) * 86400 * 1000)).getTime();
  if (typeof value === "string") {
    const normalized = normalizeDateTimeText(value);
    const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
      const [, year, month, day, hour, minute, second = "0"] = match;
      return Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
    }
    return new Date(value).getTime();
  }
  return Number.NaN;
}

function formatDateTime(ms) {
  const date = new Date(ms);
  const pad = (value, size = 2) => String(value).padStart(size, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function formatHourDateTime(ms) {
  return formatDateTime(ms).slice(0, 16);
}

function normalizeDateTimeText(value) {
  return String(value)
    .replace("T", " ")
    .replace(/^(\d{2})-([A-Za-z]{3}) /, "2026-$2-$1 ");
}

function timeZoneParts(ms, timeZone = "Europe/London") {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date(ms));
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

function formatLondonDateTime(ms) {
  const parts = timeZoneParts(ms, "Europe/London");
  const pad = (value) => String(value).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)}`;
}

function timeZoneOffsetMs(ms, timeZone = "Europe/London") {
  const parts = timeZoneParts(ms, timeZone);
  const zoneAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return zoneAsUtc - ms;
}

function londonWallTimeToUtcMs(value) {
  const normalized = normalizeDateTimeText(value);
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return new Date(value).getTime();
  const [, year, month, day, hour, minute, second = "0"] = match;
  const localAsUtc = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  let utc = localAsUtc - timeZoneOffsetMs(localAsUtc, "Europe/London");
  utc = localAsUtc - timeZoneOffsetMs(utc, "Europe/London");
  return utc;
}

function durationToMinutes(value) {
  if (typeof value === "number") return value * 24 * 60;
  if (!value || typeof value !== "string") return 0;
  const text = value.trim();
  const sign = text.startsWith("-") ? -1 : 1;

  if (text.includes("day")) {
    const dayMatch = text.match(/(-?\d+)\s+day/);
    const timeMatch = text.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    const days = dayMatch ? Number(dayMatch[1]) : 0;
    const hours = timeMatch ? Number(timeMatch[1]) : 0;
    const minutes = timeMatch ? Number(timeMatch[2]) : 0;
    const seconds = timeMatch?.[3] ? Number(timeMatch[3]) : 0;
    return (days * 24 * 60) + (hours * 60) + minutes + Math.round(seconds / 60);
  }

  const clean = text.replace("-", "");
  const [hours = 0, minutes = 0, seconds = 0] = clean.split(":").map(Number);
  return sign * (hours * 60 + minutes + Math.round(seconds / 60));
}

function minutesToDuration(totalMinutes) {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(Math.round(totalMinutes));
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `${sign}${hours}:${String(minutes).padStart(2, "0")}:00`;
}

function addMinutesToTime(value, minutes) {
  const ms = parseTime(value);
  if (Number.isNaN(ms)) return value;
  return formatDateTime(ms + (minutes * 60 * 1000));
}

function midpointTime(start, end) {
  const startMs = parseTime(start);
  const endMs = parseTime(end);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return "";
  return formatDateTime(startMs + ((endMs - startMs) / 2));
}

function interpolateMinutes(location, springKey, neapKey, springFactor) {
  const spring = durationToMinutes(location[springKey]);
  const neap = durationToMinutes(location[neapKey]);
  return neap + (Number(springFactor || 0) * (spring - neap));
}

function interpolateNumber(location, springKey, neapKey, springFactor) {
  const spring = Number(location[springKey]);
  const neap = Number(location[neapKey]);
  if (!Number.isFinite(spring) || !Number.isFinite(neap)) return Number.NaN;
  return neap + (Number(springFactor || 0) * (spring - neap));
}

function shiftDateString(value, minutes) {
  const ms = parseTime(value);
  if (Number.isNaN(ms)) return value;
  return formatDateTime(ms + (minutes * 60 * 1000));
}

function shiftTideRowsToWeatherWindow(tidesArray, weatherArray) {
  if (!tidesArray?.length || !weatherArray?.length) return tidesArray;
  const headers = tidesArray[0];
  const dateColumns = ["Local Time", "HW Time (UTC)", ...timeColumns];
  const firstWeather = parseTime(weatherArray[1]?.[0]);
  const firstTide = parseTime(tidesArray[1]?.[headers.indexOf("Local Time")]);
  if (Number.isNaN(firstWeather) || Number.isNaN(firstTide)) return tidesArray;

  const dayMs = 24 * 60 * 60 * 1000;
  let dayShift = Math.round((firstWeather - firstTide) / dayMs);
  const shiftedFirstFlood = parseTime(shiftDateString(tidesArray[1][headers.indexOf("Flood Commences")], dayShift * 24 * 60));
  if (!Number.isNaN(shiftedFirstFlood) && shiftedFirstFlood > firstWeather) dayShift -= 1;

  return tidesArray.map((row, rowIndex) => {
    if (rowIndex === 0 || dayShift === 0) return row;
    const next = [...row];
    for (const column of dateColumns) {
      const colIndex = headers.indexOf(column);
      if (colIndex !== -1) next[colIndex] = shiftDateString(next[colIndex], dayShift * 24 * 60);
    }
    return next;
  });
}

function scaleDurationString(value, scale) {
  if (!value || typeof value !== "string" || !value.includes(":")) return value;
  const sign = value.startsWith("-") ? -1 : 1;
  const clean = value.replace("-1 day,", "").replace("-", "").trim();
  const [hours = 0, minutes = 0, seconds = 0] = clean.split(":").map(Number);
  let totalSeconds = Math.round((hours * 3600 + minutes * 60 + seconds) * scale);
  totalSeconds *= sign;
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  const text = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return totalSeconds < 0 ? `-${text}` : text;
}

function tidesForGate(tidesArray, gateName) {
  const selected = locationConstants[gateName] || locationConstants["Cuan Sound"];
  const base = locationConstants["Cuan Sound"];
  const headers = tidesArray[0];
  const idx = (name) => headers.indexOf(name);
  return tidesArray.map((row, rowIndex) => {
    if (rowIndex === 0) return row;
    const next = [...row];
    const springFactor = Number(row[idx("% Spring")] || 0);
    const floodShift = interpolateMinutes(selected, "floodSpringAfter", "floodNeapAfter", springFactor)
      - interpolateMinutes(base, "floodSpringAfter", "floodNeapAfter", springFactor);
    const ebbShift = interpolateMinutes(selected, "ebbSpringAfter", "ebbNeapAfter", springFactor)
      - interpolateMinutes(base, "ebbSpringAfter", "ebbNeapAfter", springFactor);
    const baseSlack = interpolateMinutes(base, "floodSpringSlack", "floodNeapSlack", springFactor);
    const selectedSlack = interpolateMinutes(selected, "floodSpringSlack", "floodNeapSlack", springFactor);
    const slackScale = baseSlack ? selectedSlack / baseSlack : 1;

    for (const column of timeColumns) {
      const shift = column.startsWith("Flood") || column === "Peak Flood Time" ? floodShift : ebbShift;
      next[idx(column)] = shiftDateString(next[idx(column)], shift);
    }
    next[idx("Peak Flood Dir (deg)")] = cardinalToDegrees(selected.floodSet);
    next[idx("Peak Flood (Set)")] = selected.floodSet;
    next[idx("Peak Ebb Dir (deg)")] = cardinalToDegrees(selected.ebbSet);
    next[idx("Peak Ebb (Set)")] = selected.ebbSet;
    next[idx("Slack Duration")] = scaleDurationString(next[idx("Slack Duration")], slackScale);
    next[idx("Location")] = gateName;
    return next;
  });
}

function tideCalculationRowsFromEvents(eventRows, gateName) {
  const selected = locationConstants[gateName] || locationConstants["Cuan Sound"];
  const headers = [
    "Local Time", "HW Time (UTC)", "HW Height (m)", "Range (m)", "% Spring",
    "Peak Flow (kn)", "Peak Flood Dir (deg)", "Peak Flood (Set)",
    "Flood Slack Starts", "Flood Commences", "Flood Slack Ends", "Peak Flood Time",
    "Peak Ebb Dir (deg)", "Peak Ebb (Set)", "Ebb Slack Starts", "Ebb Commences",
    "Ebb Slack Ends", "Peak Ebb Time", "Flood Time Diff", "Slack Duration",
    "Ebb Time Diff", "Location"
  ];
  if (!eventRows?.length) return [headers];
  const sourceHeaders = eventRows[0];
  const idx = (name) => sourceHeaders.indexOf(name);
  const rows = [headers];
  for (const row of eventRows.slice(1)) {
    if (row[idx("Tide")] !== "HW") continue;
    const hwTime = row[idx("Time (UT)")];
    const springFactor = Number(row[idx("% Spring")] || 0);
    const floodAfter = interpolateMinutes(selected, "floodSpringAfter", "floodNeapAfter", springFactor);
    const ebbAfter = interpolateMinutes(selected, "ebbSpringAfter", "ebbNeapAfter", springFactor);
    const floodSlack = interpolateMinutes(selected, "floodSpringSlack", "floodNeapSlack", springFactor);
    const ebbSlack = interpolateMinutes(selected, "ebbSpringSlack", "ebbNeapSlack", springFactor);
    const floodCommences = addMinutesToTime(hwTime, floodAfter);
    const ebbCommences = addMinutesToTime(hwTime, ebbAfter);
    const locationPeakFlow = interpolateNumber(selected, "springPeakFlow", "neapPeakFlow", springFactor);
    const peakFlow = Math.max(settingNumber("peakFlowMinimumKn"), Number.isFinite(locationPeakFlow) ? locationPeakFlow : settingNumber("peakFlowMinimumKn"));

    rows.push([
      hwTime,
      hwTime,
      row[idx("Height (m)")],
      Number(row[idx("Range (m)")] || 0),
      springFactor,
      peakFlow,
      cardinalToDegrees(selected.floodSet),
      selected.floodSet,
      addMinutesToTime(floodCommences, -floodSlack / 2),
      floodCommences,
      addMinutesToTime(floodCommences, floodSlack / 2),
      midpointTime(floodCommences, ebbCommences),
      cardinalToDegrees(selected.ebbSet),
      selected.ebbSet,
      addMinutesToTime(ebbCommences, -ebbSlack / 2),
      ebbCommences,
      addMinutesToTime(ebbCommences, ebbSlack / 2),
      addMinutesToTime(ebbCommences, settingNumber("peakEbbOffsetMinutes")),
      minutesToDuration(floodAfter),
      minutesToDuration((floodSlack + ebbSlack) / 2),
      minutesToDuration(ebbAfter),
      gateName
    ]);
  }
  return rows;
}

function weatherRowsFromApi(payload) {
  const forecast = payload.forecast?.hourly;
  const marine = payload.marine?.hourly;
  if (!forecast?.time?.length || !marine) return null;

  const header = [
    "Local Time", "UTC Time", "Temp (°C)", "Chill (°C)",
    "Wind (kn)", "Gust (kn)", "Wind Dir (°)", "Wind Arrow", "Wind Dir", "Wind Bft", "Wind Desc", "Gust Bft",
    "Wave (m)", "Period (s)", "Wave Dir (°)", "Wave Arrow", "Wave Dir",
    "Swell (m)", "Swell (s)", "Swell Dir (°)", "Swell Arrow", "Swell Dir"
  ];

  const rows = [header];
  const providerTimezone = payload.forecast?.timezone || "";
  const providerTimesAreUtc = /^(UTC|GMT|Etc\/GMT)$/i.test(providerTimezone);
  for (let i = 0; i < forecast.time.length; i++) {
    const sourceTime = normalizeDateTimeText(forecast.time[i]);
    const utcMs = providerTimesAreUtc ? parseTime(sourceTime) : londonWallTimeToUtcMs(sourceTime);
    const utcTime = formatHourDateTime(utcMs);
    const localTime = formatLondonDateTime(utcMs);
    const temp = forecast.temperature_2m?.[i] ?? "";
    const wind = forecast.windspeed_10m?.[i] ?? "";
    const gust = forecast.windgusts_10m?.[i] ?? "";
    const windDir = forecast.winddirection_10m?.[i] ?? "";
    const waveDir = marine.wave_direction?.[i] ?? "";
    const swellDir = marine.swell_wave_direction?.[i] ?? "";
    const windBeaufort = beaufortScale(wind);
    const gustBeaufort = beaufortScale(gust);
    rows.push([
      localTime,
      utcTime,
      temp,
      temp !== "" && wind !== "" ? calculateWindChill(temp, wind) : "",
      wind,
      gust,
      windDir,
      windAndWaveArrow(windDir),
      degreesToCardinal(windDir),
      windBeaufort[0],
      windBeaufort[1],
      gustBeaufort[0],
      marine.wave_height?.[i] ?? "",
      marine.wave_period?.[i] ?? "",
      waveDir,
      windAndWaveArrow(waveDir),
      degreesToCardinal(waveDir),
      marine.swell_wave_height?.[i] ?? "",
      marine.swell_wave_period?.[i] ?? "",
      swellDir,
      windAndWaveArrow(swellDir),
      degreesToCardinal(swellDir)
    ]);
  }
  return rows;
}

function interpolateTidalFlow(weatherArray, tidesArray, settings) {
  const wHeaders = weatherArray[0];
  const tHeaders = tidesArray[0];
  const tIdx = (name) => tHeaders.indexOf(name);
  const lastValidCol = 22;
  const sailArrow = get8PointArrow(settings.hdg);
  const resultHeaders = [
    ...wHeaders.slice(0, lastValidCol),
    "Tide Rate (kn)", "Tide Dir (deg)", "Tide Arrow", "Tide Status",
    "Rel: Boat-Tide", "Rel: Wind-Tide", "Rel: Boat-Wind", "Point of Sail", "Sail Arrow",
    "SOG (Crab)", "SOG (OnCourse)", "CTS Angle",
    "Tide Rating", "Wind Rating", "Wave Rating", "Overall"
  ];
  const result = [resultHeaders];
  const tideData = tidesArray.slice(1);
  const COL = { windDir: 6, bForce: 9 };

  for (let i = 1; i < weatherArray.length; i++) {
    const rawRow = weatherArray[i];
    if (!rawRow[0]) continue;
    const wTime = parseTime(rawRow[1] || rawRow[0]);
    let tideRate = 0;
    let tideDir = "-";
    let tideStatus = "Slack";
    let activePhase = null;

    for (let j = 0; j < tideData.length; j++) {
      const row = tideData[j];
      const peakRate = Number(row[tIdx("Peak Flow (kn)")]);
      const fStart = parseTime(row[tIdx("Flood Commences")]);
      const eStart = parseTime(row[tIdx("Ebb Commences")]);
      const nextEStart = j + 1 < tideData.length
        ? parseTime(tideData[j + 1][tIdx("Ebb Commences")])
        : eStart + (settings.fallbackCycleHours * 60 * 60 * 1000);
      const floodDir = String(row[tIdx("Peak Flood Dir (deg)")]).replace(/[^\d.-]/g, "");
      const ebbDir = String(row[tIdx("Peak Ebb Dir (deg)")]).replace(/[^\d.-]/g, "");

      if (j === 0) {
        const previousFloodStart = fStart - (settings.fallbackCycleHours * 60 * 60 * 1000);
        if (wTime >= previousFloodStart && wTime < eStart) {
          activePhase = { status: "Flood", dir: floodDir, start: previousFloodStart, end: eStart, peakRate };
          break;
        }
      }

      if (wTime >= eStart && wTime < fStart) {
        activePhase = { status: "Ebb", dir: ebbDir, start: eStart, end: fStart, peakRate };
        break;
      }

      if (wTime >= fStart && wTime < nextEStart) {
        activePhase = { status: "Flood", dir: floodDir, start: fStart, end: nextEStart, peakRate };
        break;
      }
    }

    if (activePhase) {
      tideStatus = activePhase.status;
      tideDir = activePhase.dir;
      tideRate = calculateSineRate(wTime, activePhase.start, activePhase.end || activePhase.start + (settings.fallbackEbbHours * 60 * 60 * 1000), activePhase.peakRate);
      if (Math.abs(tideRate) < settings.slackThreshold) {
        tideStatus = "Slack";
        tideRate = 0;
        tideDir = "-";
      }
    }

    const windDirFrom = rawRow[COL.windDir];
    const pointOfSail = windDirFrom !== "" ? getPointOfSail(settings.hdg, windDirFrom) : "N/A";
    let nav = { crabbing: settings.yachtSpeed.toFixed(2), onCourse: settings.yachtSpeed.toFixed(2), ctsAngle: "0°" };
    if (tideStatus !== "Slack" && tideDir !== "-") {
      nav = calculateNavSpeeds(settings.yachtSpeed, settings.hdg, tideRate, Number(tideDir));
    }

    const tideRating = checkTideRating(nav.onCourse, settings.yachtSpeed, settings);
    const windRating = checkWindComfort(rawRow[COL.bForce], pointOfSail, settings);
    const waveRating = checkWaveComfortOptimized(rawRow, pointOfSail, tideStatus, tideRate, Number(tideDir), settings);

    result.push([
      ...rawRow.slice(0, lastValidCol),
      tideRate.toFixed(2),
      tideDir,
      tideDir === "-" ? "-" : get8PointArrow(tideDir),
      tideStatus,
      getRelativeFlow(settings.hdg, tideDir, "Tide"),
      getRelativeFlow(windDirFrom, tideDir, "WindTide"),
      getRelativeFlow(settings.hdg, windDirFrom, "Wind"),
      pointOfSail,
      sailArrow,
      nav.crabbing,
      nav.onCourse,
      nav.ctsAngle,
      tideRating,
      windRating,
      waveRating,
      overallRating(windRating, waveRating, tideRating)
    ]);
  }
  return result;
}

function tideCoverageEndMs(tidesArray) {
  if (!tidesArray?.length) return Number.NaN;
  const headers = tidesArray[0];
  const indexes = ["Local Time", ...timeColumns]
    .map((name) => headers.indexOf(name))
    .filter((index) => index !== -1);
  let end = Number.NaN;
  for (const row of tidesArray.slice(1)) {
    for (const index of indexes) {
      const ms = parseTime(row[index]);
      if (!Number.isNaN(ms) && (Number.isNaN(end) || ms > end)) end = ms;
    }
  }
  return end;
}

function limitWeatherRowsToTideWindow(weatherRows, tidesArray) {
  if (!weatherRows?.length || !tidesArray?.length) return weatherRows;
  const end = tideCoverageEndMs(tidesArray);
  if (Number.isNaN(end)) return weatherRows;
  return [
    weatherRows[0],
    ...weatherRows.slice(1).filter((row) => {
      const ms = parseTime(row[1] || row[0]);
      return !Number.isNaN(ms) && ms <= end;
    })
  ];
}

function formatHoursOld(fromIso) {
  const ms = fromIso ? new Date(fromIso).getTime() : Number.NaN;
  if (Number.isNaN(ms)) return "-";
  return `${((Date.now() - ms) / 3600000).toFixed(1)} hours old`;
}

function renderFreshnessCard(id, meta, label) {
  const card = $(id);
  if (!card) return;
  if (!meta?.fetchedAt) {
    card.dataset.expired = "false";
    card.querySelector("strong").textContent = "No web update yet";
    card.querySelector("small").textContent = "No stored web data loaded";
    return;
  }
  const fetched = new Date(meta.fetchedAt);
  const expires = meta.refreshAfter ? new Date(meta.refreshAfter) : null;
  const expired = expires ? Date.now() >= expires.getTime() : false;
  card.dataset.expired = String(expired);
  card.querySelector("strong").textContent = `${label}: ${fetched.toLocaleString()}`;
  card.querySelector("small").textContent = expires
    ? `${formatHoursOld(meta.fetchedAt)}; ${expired ? "refresh due" : `next refresh ${expires.toLocaleString()}`}`
    : formatHoursOld(meta.fetchedAt);
}

function updateFreshness() {
  const locationCard = $("selectedLocationStatus");
  if (locationCard) {
    const gate = $("gate").value;
    const location = locationConstants[gate];
    locationCard.dataset.expired = "false";
    locationCard.querySelector("strong").textContent = gate || "-";
    locationCard.querySelector("small").textContent = location?.latitude && location?.longitude
      ? `${Number(location.latitude).toFixed(5)}, ${Number(location.longitude).toFixed(5)}`
      : "No latitude/longitude set";
  }
  renderFreshnessCard("weatherFreshness", currentWeatherMeta, "Weather");
  renderFreshnessCard("tideFreshness", currentTideMeta, "Tide");
  const horizon = $("planningHorizon");
  if (!horizon || !currentPlanRows?.length || !currentTideRows?.length) return;
  const headers = currentPlanRows[0];
  const first = parseTime(currentPlanRows[1]?.[headers.indexOf("UTC Time")] || currentPlanRows[1]?.[0]);
  const end = tideCoverageEndMs(currentTideRows);
  const hours = !Number.isNaN(first) && !Number.isNaN(end) ? Math.max(0, (end - first) / 3600000) : 0;
  horizon.dataset.expired = "false";
  horizon.querySelector("strong").textContent = `${(hours / 24).toFixed(1)} days`;
  horizon.querySelector("small").textContent = `${currentPlanRows.length - 1} hourly rows, limited by tide data`;
}

function summarize(rows) {
  const headers = rows[0];
  const idx = (name) => headers.indexOf(name);
  const stats = { maxWind: 0, maxWave: 0, minSOG: 100, unacceptable: 0, comfortable: 0, pleasant: 0 };
  for (const row of rows.slice(1)) {
    stats.maxWind = Math.max(stats.maxWind, Number(row[idx("Gust (kn)")] || 0));
    stats.maxWave = Math.max(stats.maxWave, Number(row[idx("Wave (m)")] || 0));
    stats.minSOG = Math.min(stats.minSOG, Number(row[idx("SOG (OnCourse)")] || 100));
    if (row[idx("Overall")] === "Unacceptable") stats.unacceptable++;
    if (row[idx("Overall")] === "Comfortable") stats.comfortable++;
    if (row[idx("Overall")] === "Pleasant") stats.pleasant++;
  }
  const total = Math.max(1, rows.length - 1);
  const good = stats.comfortable + stats.pleasant;
  $("maxGust").textContent = `Bft ${beaufortDecimal(stats.maxWind).toFixed(1)}`;
  $("maxWave").textContent = `${stats.maxWave.toFixed(2)} m`;
  $("worstSog").textContent = `${stats.minSOG.toFixed(1)} kn`;
  $("usable").textContent = `${good} hrs (${Math.round((good / total) * 100)}%)`;
  $("nogo").textContent = `${stats.unacceptable} hrs`;
}

function formatDisplayValue(value, format) {
  if (value === null || value === undefined || value === "") return "";
  const numeric = Number(value);
  if (format === "knots" && !Number.isNaN(numeric)) return numeric.toFixed(1);
  if (format === "beaufort" && !Number.isNaN(numeric)) return beaufortDecimal(numeric).toFixed(1);
  if (format === "meters" && !Number.isNaN(numeric)) return numeric.toFixed(2);
  if (format === "percent" && !Number.isNaN(numeric)) {
    return `${(numeric * 100).toFixed(0)}%`;
  }
  if (format === "cardinal") return degreesToCardinal(value);
  return String(value);
}

function tideColumnFormat(columnName) {
  if (columnName === "Peak Flow (kn)") return "knots";
  if (columnName === "Wind (kn)" || columnName === "Gust (kn)") return "knots";
  if (columnName === "Height (m)" || columnName === "HW Height (m)" || columnName === "LW Height (m)" || columnName === "Range (m)" || columnName === "Rise (m)" || columnName === "Wave (m)" || columnName === "Swell (m)") return "meters";
  if (columnName === "% Spring") return "percent";
  if (columnName.includes("Dir (deg)")) return "cardinal";
  return null;
}

function renderTable(rows) {
  const headers = rows[0];
  const indexes = selectedColumns.map((column) => headers.indexOf(column.source));
  const thead = $("planTable").querySelector("thead");
  const tbody = $("planTable").querySelector("tbody");
  thead.innerHTML = `<tr>${selectedColumns.map((column) => `<th>${column.label}</th>`).join("")}</tr>`;
  tbody.innerHTML = rows.slice(1).map((row) => {
    const rating = row[headers.indexOf("Overall")];
    const cells = indexes.map((idx, columnIndex) => {
      const column = selectedColumns[columnIndex];
      return `<td>${formatDisplayValue(row[idx], column.format)}</td>`;
    }).join("");
    return `<tr data-rating="${rating}">${cells}</tr>`;
  }).join("");
}

function renderReadOnlyTable(tableId, rows, columns) {
  if (!rows?.length) return;
  const headers = rows[0];
  const indexes = columns.map((name) => headers.indexOf(name));
  const thead = $(tableId).querySelector("thead");
  const tbody = $(tableId).querySelector("tbody");
  thead.innerHTML = `<tr>${columns.map((name) => `<th>${tableHeaderLabel(name)}</th>`).join("")}</tr>`;
  tbody.innerHTML = rows.slice(1).map((row, rowOffset) => {
    const cells = indexes.map((colIndex) => {
      if (colIndex === -1) return "<td></td>";
      const value = row[colIndex] ?? "";
      const displayValue = formatDisplayValue(value, tideColumnFormat(headers[colIndex]));
      return `<td>${escapeHtml(displayValue)}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
}

function tableHeaderLabel(name) {
  if (name === "Local Time") return "Local Time (UK)";
  if (name === "UTC Time") return "UTC Time (UT)";
  if (name === "HW Time") return "HW Time (UT)";
  if (name === "HW Time (UTC)") return "HW Time (UT)";
  if (name === "Flood Commences") return "Flood Commences (UT)";
  if (name === "Ebb Commences") return "Ebb Commences (UT)";
  if (name === "Peak Flood Dir (deg)") return "Peak Flood Dir";
  if (name === "Peak Ebb Dir (deg)") return "Peak Ebb Dir";
  return name;
}

function ratingColor(rating) {
  if (!rating) return "#6b7785";
  if (rating.includes("Unacceptable") || rating.includes("Dangerous") || rating.includes("Set Back") || rating.includes("Strong Foul")) return "#d76c6c";
  if (rating.includes("Uncomfortable") || rating.includes("Strenuous") || rating.includes("Adverse") || rating.includes("Hobby-Horsing")) return "#d59b22";
  if (rating.includes("Pleasant") || rating.includes("Fair Tide")) return "#4f9f5f";
  if (rating.includes("Comfortable") || rating.includes("Acceptable") || rating.includes("Neutral")) return "#1f6f8b";
  return "#6b7785";
}

function vectorPoint(degrees, length, center = 210) {
  const rad = Number(degrees) * (Math.PI / 180);
  return {
    x: center + (Math.sin(rad) * length),
    y: center - (Math.cos(rad) * length)
  };
}

function vectorArrow({ label, degrees, magnitude, maxMagnitude, color, dashed = false, labelOffset = 0 }) {
  if (degrees === "-" || degrees === "" || Number.isNaN(Number(degrees))) return "";
  const length = 42 + (Math.min(1, Math.abs(Number(magnitude) || 0) / maxMagnitude) * 118);
  const end = vectorPoint(degrees, length);
  const rad = Number(degrees) * (Math.PI / 180);
  const ux = Math.sin(rad);
  const uy = -Math.cos(rad);
  const px = Math.cos(rad);
  const py = Math.sin(rad);
  const baseX = end.x - (ux * 14);
  const baseY = end.y - (uy * 14);
  const arrow = [
    `${end.x.toFixed(1)},${end.y.toFixed(1)}`,
    `${(baseX + (px * 6)).toFixed(1)},${(baseY + (py * 6)).toFixed(1)}`,
    `${(baseX - (px * 6)).toFixed(1)},${(baseY - (py * 6)).toFixed(1)}`
  ].join(" ");
  const labelPoint = vectorPoint(degrees, Math.min(180, length + 22));
  labelPoint.x += px * labelOffset;
  labelPoint.y += py * labelOffset;
  return `
    <g>
      <line x1="210" y1="210" x2="${end.x.toFixed(1)}" y2="${end.y.toFixed(1)}" stroke="${color}" stroke-width="7" stroke-linecap="round" ${dashed ? 'stroke-dasharray="8 8"' : ""}></line>
      <polygon points="${arrow}" fill="${color}"></polygon>
      <text x="${labelPoint.x.toFixed(1)}" y="${labelPoint.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="13" font-weight="750">${escapeHtml(label)}</text>
    </g>
  `;
}

function directionTo(degreesFrom) {
  if (degreesFrom === "-" || degreesFrom === "" || degreesFrom === null || Number.isNaN(Number(degreesFrom))) return "-";
  return (Number(degreesFrom) + 180) % 360;
}

function renderHourOptions(rows) {
  const select = $("hourSelect");
  if (!select || !rows?.length) return;
  const previous = select.value;
  select.innerHTML = rows.slice(1).map((row, index) => {
    const value = String(row[0]);
    const label = value.slice(0, 16);
    return `<option value="${escapeHtml(value)}"${previous === value || (!previous && index === 0) ? " selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function getPlanRowBySelectedHour() {
  if (!currentPlanRows?.length) return null;
  const selected = $("hourSelect")?.value;
  return currentPlanRows.slice(1).find((row) => String(row[0]) === selected) || currentPlanRows[1] || null;
}

function stepSelectedHour(delta) {
  const select = $("hourSelect");
  if (!select || select.options.length === 0) return;
  const nextIndex = Math.max(0, Math.min(select.options.length - 1, select.selectedIndex + delta));
  if (nextIndex === select.selectedIndex) return;
  select.selectedIndex = nextIndex;
  updateHourStepButtons();
  renderHourVisual();
}

function updateHourStepButtons() {
  const select = $("hourSelect");
  const previous = $("previousHour");
  const next = $("nextHour");
  if (!select || !previous || !next) return;
  previous.disabled = select.selectedIndex <= 0;
  next.disabled = select.selectedIndex < 0 || select.selectedIndex >= select.options.length - 1;
}

function stopHourRepeat() {
  if (hourRepeatDelayTimer) clearTimeout(hourRepeatDelayTimer);
  if (hourRepeatTimer) clearInterval(hourRepeatTimer);
  hourRepeatDelayTimer = null;
  hourRepeatTimer = null;
}

function startHourRepeat(delta) {
  stopHourRepeat();
  stepSelectedHour(delta);
  hourRepeatDelayTimer = setTimeout(() => {
    hourRepeatTimer = setInterval(() => stepSelectedHour(delta), 120);
  }, 450);
}

function bindHourStepButton(id, delta) {
  const button = $(id);
  if (!button) return;
  button.addEventListener("pointerdown", (event) => {
    if (button.disabled) return;
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    startHourRepeat(delta);
  });
  button.addEventListener("pointerup", stopHourRepeat);
  button.addEventListener("pointercancel", stopHourRepeat);
  button.addEventListener("pointerleave", stopHourRepeat);
  button.addEventListener("click", (event) => event.preventDefault());
}

function renderHourVisual() {
  const svg = $("hourCompass");
  const cards = $("hourCards");
  const overall = $("hourOverall");
  if (!svg || !cards || !overall || !currentPlanRows?.length) return;

  const headers = currentPlanRows[0];
  const idx = (name) => headers.indexOf(name);
  const row = getPlanRowBySelectedHour();
  if (!row) return;
  updateHourStepButtons();

  const settings = settingsFromControls();
  const windSpeed = Number(row[idx("Wind (kn)")] || 0);
  const windFrom = row[idx("Wind Dir (°)")];
  const waveHeight = Number(row[idx("Wave (m)")] || 0);
  const waveFrom = row[idx("Wave Dir (°)")];
  const swellHeight = Number(row[idx("Swell (m)")] || 0);
  const swellFrom = row[idx("Swell Dir (°)")];
  const tideRate = Number(row[idx("Tide Rate (kn)")] || 0);
  const tideDir = row[idx("Tide Dir (deg)")];
  const windRating = row[idx("Wind Rating")];
  const waveRating = row[idx("Wave Rating")];
  const tideRating = row[idx("Tide Rating")];
  const overallRatingValue = row[idx("Overall")];

  const vectors = [
    vectorArrow({ label: "Boat", degrees: settings.hdg, magnitude: settings.yachtSpeed, maxMagnitude: 8, color: "#17212b", labelOffset: -16 }),
    vectorArrow({ label: "Wind", degrees: directionTo(windFrom), magnitude: windSpeed, maxMagnitude: 35, color: ratingColor(windRating) }),
    vectorArrow({ label: "Wave", degrees: directionTo(waveFrom), magnitude: waveHeight, maxMagnitude: 3.5, color: ratingColor(waveRating), dashed: true }),
    vectorArrow({ label: "Swell", degrees: directionTo(swellFrom), magnitude: swellHeight, maxMagnitude: 3.5, color: "#7a64a0", dashed: true }),
    vectorArrow({ label: "Tide", degrees: tideDir, magnitude: tideRate, maxMagnitude: 6, color: ratingColor(tideRating), labelOffset: 16 })
  ].join("");

  svg.innerHTML = `
    <rect width="420" height="420" fill="#fff"></rect>
    <circle cx="210" cy="210" r="172" fill="#f7f9fb" stroke="#d7dee4" stroke-width="2"></circle>
    <circle cx="210" cy="210" r="112" fill="none" stroke="#e8edf1" stroke-width="1"></circle>
    <circle cx="210" cy="210" r="54" fill="none" stroke="#e8edf1" stroke-width="1"></circle>
    <line x1="210" y1="34" x2="210" y2="386" stroke="#d7dee4"></line>
    <line x1="34" y1="210" x2="386" y2="210" stroke="#d7dee4"></line>
    <text x="210" y="24" text-anchor="middle" font-size="14" font-weight="750" fill="#17212b">N</text>
    <text x="397" y="215" text-anchor="middle" font-size="14" font-weight="750" fill="#17212b">E</text>
    <text x="210" y="404" text-anchor="middle" font-size="14" font-weight="750" fill="#17212b">S</text>
    <text x="23" y="215" text-anchor="middle" font-size="14" font-weight="750" fill="#17212b">W</text>
    ${vectors}
    <circle cx="210" cy="210" r="7" fill="#17212b"></circle>
  `;

  overall.dataset.rating = overallRatingValue;
  overall.textContent = `${row[0]} - ${overallRatingValue}`;

  const cardData = [
    { name: "Boat", value: `${degreesToCardinal(settings.hdg)} ${settings.yachtSpeed.toFixed(1)} kn`, note: `Point of sail: ${row[idx("Point of Sail")]}`, color: "#17212b" },
    { name: "Wind", value: `Bft ${beaufortDecimal(windSpeed).toFixed(1)} from ${degreesToCardinal(windFrom)}`, note: `${windSpeed.toFixed(1)} kn - ${windRating}`, color: ratingColor(windRating) },
    { name: "Wave", value: `${waveHeight.toFixed(2)} m from ${degreesToCardinal(waveFrom)}`, note: waveRating, color: ratingColor(waveRating) },
    { name: "Swell", value: `${swellHeight.toFixed(2)} m from ${degreesToCardinal(swellFrom)}`, note: `${row[idx("Swell (s)")]} s period`, color: "#7a64a0" },
    { name: "Tide", value: `${tideRate.toFixed(1)} kn ${degreesToCardinal(tideDir)}`, note: `${row[idx("Tide Status")]} - ${tideRating}`, color: ratingColor(tideRating) },
    { name: "Progress", value: `${Number(row[idx("SOG (OnCourse)")] || 0).toFixed(1)} kn SOG`, note: `CTS ${row[idx("CTS Angle")]}`, color: ratingColor(tideRating) }
  ];
  cards.innerHTML = cardData.map((card) => `
    <article class="hourCard" style="border-left-color: ${card.color}">
      <span>${escapeHtml(card.name)}</span>
      <strong>${escapeHtml(card.value)}</strong>
      <small>${escapeHtml(card.note)}</small>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseEditedValue(value, columnName = "") {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  if (columnName.includes("Dir (deg)")) {
    const direction = cardinalToDegrees(trimmed);
    if (direction !== "N/A") return direction;
  }
  const numeric = Number(trimmed);
  return Number.isNaN(numeric) ? trimmed : numeric;
}

function googleMapsUrl(location) {
  const latitude = String(location.latitude ?? "").trim();
  const longitude = String(location.longitude ?? "").trim();
  if (!latitude || !longitude) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
}

function defaultLocationValues(name) {
  const template = locationConstants["Cuan Sound"] || {};
  return {
    location: name,
    latitude: template.latitude || "",
    longitude: template.longitude || "",
    floodSet: template.floodSet || "W",
    ebbSet: template.ebbSet || "E",
    springPeakFlow: template.springPeakFlow || "7.0",
    neapPeakFlow: template.neapPeakFlow || "3.5",
    floodSpringAfter: template.floodSpringAfter || "0:00:00",
    floodNeapAfter: template.floodNeapAfter || "0:00:00",
    floodSpringSlack: template.floodSpringSlack || "0:15:00",
    floodNeapSlack: template.floodNeapSlack || "0:40:00",
    ebbSpringAfter: template.ebbSpringAfter || "0:00:00",
    ebbNeapAfter: template.ebbNeapAfter || "0:00:00",
    ebbSpringSlack: template.ebbSpringSlack || "0:15:00",
    ebbNeapSlack: template.ebbNeapSlack || "0:40:00",
    source: template.source || ""
  };
}

function uniqueLocationName(baseName = "New Location") {
  let name = baseName;
  let counter = 2;
  while (locationConstants[name]) {
    name = `${baseName} ${counter}`;
    counter++;
  }
  return name;
}

function isLocationComplete(location) {
  if (!location) return false;
  const requiredFields = [
    "latitude",
    "longitude",
    "floodSet",
    "ebbSet",
    "springPeakFlow",
    "neapPeakFlow",
    "floodSpringAfter",
    "floodNeapAfter",
    "floodSpringSlack",
    "floodNeapSlack",
    "ebbSpringAfter",
    "ebbNeapAfter",
    "ebbSpringSlack",
    "ebbNeapSlack"
  ];
  return requiredFields.every((field) => String(location[field] ?? "").trim() !== "");
}

function syncGateOptions(selected = $("gate").value) {
  const gate = $("gate");
  const names = Object.keys(locationConstants);
  const completeNames = names.filter((name) => isLocationComplete(locationConstants[name]));
  const selectedIsComplete = locationConstants[selected] && isLocationComplete(locationConstants[selected]);
  const active = selectedIsComplete ? selected : (completeNames[0] || names[0] || "");
  gate.innerHTML = names.map((name) => {
    const complete = isLocationComplete(locationConstants[name]);
    const label = complete ? name : `${name} (incomplete)`;
    return `<option value="${escapeHtml(name)}"${name === active ? " selected" : ""}${complete ? "" : " disabled"}>${escapeHtml(label)}</option>`;
  }).join("");
  if (active) gate.value = active;
}

async function savePlannerSelection() {
  try {
    appSettings.selectedGate = $("gate").value;
    appSettings.selectedHeading = $("heading").value;
    appSettings.selectedCrewCapability = $("crewCapability").value;
    appSettings.speed = $("speed").value;
    await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        selectedGate: appSettings.selectedGate,
        selectedHeading: appSettings.selectedHeading,
        selectedCrewCapability: appSettings.selectedCrewCapability,
        speed: appSettings.speed
      })
    });
  } catch {
    // Selection persistence is helpful, but should never block replanning.
  }
}

function renameLocation(oldName, newName) {
  const cleanName = newName.trim();
  if (!cleanName || cleanName === oldName) return oldName;
  if (locationConstants[cleanName]) {
    $("locationConstantsStatus").textContent = `Rename failed: "${cleanName}" already exists.`;
    return oldName;
  }
  const updated = {};
  for (const [name, values] of Object.entries(locationConstants)) {
    if (name === oldName) updated[cleanName] = { ...values, location: cleanName };
    else updated[name] = values;
  }
  for (const name of Object.keys(locationConstants)) delete locationConstants[name];
  Object.assign(locationConstants, updated);
  if ($("gate").value === oldName) $("gate").value = cleanName;
  return cleanName;
}

function renderLocationConstantsTable() {
  const thead = $("locationTable").querySelector("thead");
  const tbody = $("locationTable").querySelector("tbody");
  thead.innerHTML = `<tr>${locationConstantColumns.map((column) => `<th>${column.label}</th>`).join("")}</tr>`;
  tbody.innerHTML = Object.values(locationConstants).map((location) => {
    const cells = locationConstantColumns.map((column) => {
      if (column.type === "actions") {
        return `<td><button class="dangerButton" type="button" data-delete-location="${escapeHtml(location.location)}">Delete</button></td>`;
      }
      if (column.type === "link") {
        const href = googleMapsUrl(location);
        const link = href
          ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">View map</a>`
          : "";
        return `<td>${link}</td>`;
      }
      const value = location[column.key];
      return `<td><input value="${escapeHtml(String(value ?? ""))}" data-location="${escapeHtml(location.location)}" data-key="${column.key}"></td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
}

function tideRowsFromApi(payload) {
  const events = Array.isArray(payload.events)
    ? [...payload.events].sort((a, b) => Date.parse(a.DateTime) - Date.parse(b.DateTime))
    : [];
  currentTideEvents = events;
  const tideEvents = events
    .filter((event) => event.EventType === "HighWater" || event.EventType === "LowWater")
    .map((event) => ({
      time: String(event.DateTime || "").replace("T", " ").slice(0, 16),
      type: event.EventType === "HighWater" ? "HW" : "LW",
      height: Number(event.Height)
    }));
  return tideEvents.length ? tideEventsToRangeRows(tideEvents) : null;
}

function tideEventsToRangeRows(tideEvents) {
  const eventRows = tideEvents.map((event, index) => {
    const previous = [...tideEvents.slice(0, index)].reverse().find((candidate) => candidate.type !== event.type);
    const next = tideEvents.slice(index + 1).find((candidate) => candidate.type !== event.type);
    const pairedEvent = previous || next;
    const range = pairedEvent ? Math.abs(event.height - pairedEvent.height) : Number.NaN;
    return {
      time: event.time,
      type: event.type,
      height: event.height,
      range
    };
  });
  const rows = [["Time (UT)", "Tide", "Height (m)", "Range (m)", "% Spring"]];
  for (const row of eventRows) {
    const range = Number(row.range);
    const springPercent = springPercentFromObanRange(range);
    rows.push([row.time, row.type, row.height, Number.isNaN(range) ? "" : range, springPercent]);
  }
  return rows;
}

function springPercentFromObanRange(range) {
  const tideRange = Number(range);
  if (Number.isNaN(tideRange)) return "";
  const mhws = Number(appSettings.obanMhws);
  const mhwn = Number(appSettings.obanMhwn);
  const mlwn = Number(appSettings.obanMlwn);
  const mlws = Number(appSettings.obanMlws);
  const springRange = mhws - mlws;
  const neapRange = mhwn - mlwn;
  const spread = springRange - neapRange;
  if (![springRange, neapRange, spread].every(Number.isFinite) || spread <= 0) return "";
  return (tideRange - neapRange) / spread;
}

function beaufortRows() {
  const rows = [["Force", "Description", "Knots", "m/s"]];
  for (const band of beaufortBounds) {
    const knotRange = Number.isFinite(band.max) ? `${band.min}-${band.max - 1}` : `${band.min}+`;
    const minMs = band.min * settingNumber("knotsToMs");
    const maxMs = Number.isFinite(band.max) ? ((band.max - 1) * settingNumber("knotsToMs")) : null;
    const msRange = maxMs === null ? `${minMs.toFixed(1)}+` : `${minMs.toFixed(1)}-${maxMs.toFixed(1)}`;
    rows.push([band.force, band.description, knotRange, msRange]);
  }
  return rows;
}

function comfortConstantsRows() {
  const rows = [[
    "Crew Capability",
    "Beating Acceptable Bft",
    "Beating Strenuous Bft",
    "Beating Dangerous Bft",
    "Offwind Strenuous Bft",
    "Offwind Dangerous Bft",
    "Strong Foul Ratio",
    "Beating Strenuous Wave (m)",
    "Beating Dangerous Wave (m)",
    "Offwind Strenuous Wave (m)",
    "Offwind Dangerous Wave (m)",
    "Hobby Multiplier"
  ]];
  for (const profile of crewProfiles) {
    const settings = crewComfortSettings(profile.key);
    rows.push([
      profile.label,
      settings.beatingAcceptableBft.toFixed(0),
      settings.beatingStrenuousBft.toFixed(0),
      settings.beatingDangerousBft.toFixed(0),
      settings.offwindStrenuousBft.toFixed(0),
      settings.offwindDangerousBft.toFixed(0),
      settings.strongFoulRatio.toFixed(2),
      settings.beatingStrenuousWaveM.toFixed(2),
      settings.beatingDangerousWaveM.toFixed(2),
      settings.offwindStrenuousWaveM.toFixed(2),
      settings.offwindDangerousWaveM.toFixed(2),
      settings.hobbyHorsingMultiplier.toFixed(2)
    ]);
  }
  return rows;
}

function renderComfortConstantsTable() {
  renderReadOnlyTable("comfortConstantsTable", comfortConstantsRows(), comfortConstantsRows()[0]);
}

function rebuildTidesFromLocationConstants() {
  syncGateOptions();
  const settings = settingsFromControls();
  currentTideRows = tideCalculationRowsFromEvents(currentFetchedTideRows, settings.gate);
  renderReadOnlyTable("gateCalcTable", currentTideRows, editableTideColumns);
  recalculateCurrentPlan();
}

async function loadLocationConstants() {
  try {
    const response = await fetch("/api/location-constants");
    if (!response.ok) throw new Error(response.status === 404 ? "no saved file exists yet" : `server returned ${response.status}`);
    const saved = await response.json();
    applyLocationConstants(saved);
    renderLocationConstantsTable();
    rebuildTidesFromLocationConstants();
    $("locationConstantsStatus").textContent = "Loaded location constants from data/location-constants.json.";
  } catch (error) {
    $("locationConstantsStatus").textContent = `Load failed: ${error.message}.`;
  }
}

function applyLocationConstants(saved) {
  for (const name of Object.keys(locationConstants)) delete locationConstants[name];
  for (const [name, values] of Object.entries(saved)) {
    locationConstants[name] = defaultLocationValues(name);
    for (const column of locationConstantColumns) {
      if (column.key === "location" || column.type === "link" || column.type === "actions") continue;
      if (Object.prototype.hasOwnProperty.call(values, column.key)) {
        locationConstants[name][column.key] = String(values[column.key]);
      }
    }
    locationConstants[name].location = name;
  }
  syncGateOptions();
}

async function saveLocationConstants() {
  try {
    const response = await fetch("/api/location-constants", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(locationConstants)
    });
    if (!response.ok) throw new Error(`server returned ${response.status}`);
    $("locationConstantsStatus").textContent = "Saved location constants to data/location-constants.json.";
  } catch (error) {
    $("locationConstantsStatus").textContent = `Save failed: ${error.message}.`;
  }
}

async function loadSettings() {
  try {
    const response = await fetch("/api/settings");
    if (!response.ok) throw new Error(`server returned ${response.status}`);
    const settings = await response.json();
    $("baseTideStationName").value = settings.baseTideStationName || "Oban";
    $("baseTideStationId").value = settings.baseTideStationId || "0372";
    $("baseTideTimeStandard").value = settings.baseTideTimeStandard || "UT";
    appSettings = { ...appSettings, ...settings };
    $("ukhoAccountEmail").value = settings.ukhoAccountEmail || "";
    if (settings.selectedHeading && [...$("heading").options].some((option) => option.value === settings.selectedHeading)) {
      $("heading").value = settings.selectedHeading;
    }
    if (settings.selectedCrewCapability && [...$("crewCapability").options].some((option) => option.value === settings.selectedCrewCapability)) {
      $("crewCapability").value = settings.selectedCrewCapability;
    }
    $("speed").value = settings.speed || appSettings.speed;
    $("obanMhws").value = settings.obanMhws || appSettings.obanMhws;
    $("obanMhwn").value = settings.obanMhwn || appSettings.obanMhwn;
    $("obanMlwn").value = settings.obanMlwn || appSettings.obanMlwn;
    $("obanMlws").value = settings.obanMlws || appSettings.obanMlws;
    for (const id of calculationSettingIds) {
      if ($(id)) $(id).value = settings[id] || appSettings[id];
    }
    $("settingsStatus").textContent = settings.ukhoApiKeySet ? "UKHO API key is set." : "UKHO API key is not set.";
  } catch (error) {
    $("settingsStatus").textContent = `Settings load failed: ${error.message}.`;
  }
}

async function saveSettings() {
  try {
    const ukhoApiKey = $("ukhoApiKey").value.trim();
    const ukhoAccountEmail = $("ukhoAccountEmail").value.trim();
    const baseTideStationName = $("baseTideStationName").value.trim();
    const baseTideStationId = $("baseTideStationId").value.trim();
    const baseTideTimeStandard = $("baseTideTimeStandard").value.trim();
    const obanMhws = $("obanMhws").value.trim();
    const obanMhwn = $("obanMhwn").value.trim();
    const obanMlwn = $("obanMlwn").value.trim();
    const obanMlws = $("obanMlws").value.trim();
    const selectedGate = $("gate").value;
    const selectedHeading = $("heading").value;
    const selectedCrewCapability = $("crewCapability").value;
    const speed = $("speed").value.trim();
    const calculationSettings = Object.fromEntries(calculationSettingIds.map((id) => [id, $(id).value.trim()]));
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ukhoApiKey,
        ukhoAccountEmail,
        baseTideStationName,
        baseTideStationId,
        baseTideTimeStandard,
        obanMhws,
        obanMhwn,
        obanMlwn,
        obanMlws,
        selectedGate,
        selectedHeading,
        selectedCrewCapability,
        speed,
        ...calculationSettings
      })
    });
    if (!response.ok) throw new Error(`server returned ${response.status}`);
    const settings = await response.json();
    $("ukhoApiKey").value = "";
    $("ukhoAccountEmail").value = settings.ukhoAccountEmail || ukhoAccountEmail;
    $("baseTideStationName").value = settings.baseTideStationName || baseTideStationName;
    $("baseTideStationId").value = settings.baseTideStationId || baseTideStationId;
    $("baseTideTimeStandard").value = settings.baseTideTimeStandard || baseTideTimeStandard;
    appSettings = { ...appSettings, ...settings };
    if (settings.selectedGate && locationConstants[settings.selectedGate]) $("gate").value = settings.selectedGate;
    if (settings.selectedHeading) $("heading").value = settings.selectedHeading;
    if (settings.selectedCrewCapability) $("crewCapability").value = settings.selectedCrewCapability;
    $("speed").value = settings.speed || speed;
    $("obanMhws").value = settings.obanMhws || obanMhws;
    $("obanMhwn").value = settings.obanMhwn || obanMhwn;
    $("obanMlwn").value = settings.obanMlwn || obanMlwn;
    $("obanMlws").value = settings.obanMlws || obanMlws;
    for (const id of calculationSettingIds) {
      if ($(id)) $(id).value = settings[id] || calculationSettings[id];
    }
    if (currentTideEvents?.length) {
      currentFetchedTideRows = tideRowsFromApi({ events: currentTideEvents });
      renderReadOnlyTable("fetchedTideTable", currentFetchedTideRows, fetchedTideColumns);
      rebuildTidesFromLocationConstants();
    }
    $("settingsStatus").textContent = settings.ukhoApiKeySet ? "UKHO API key saved." : "UKHO API key cleared.";
  } catch (error) {
    $("settingsStatus").textContent = `Settings save failed: ${error.message}.`;
  }
}

function addLocation() {
  const name = uniqueLocationName();
  locationConstants[name] = defaultLocationValues(name);
  syncGateOptions(name);
  $("gate").value = name;
  renderLocationConstantsTable();
  rebuildTidesFromLocationConstants();
  $("locationConstantsStatus").textContent = `Added "${name}". Edit the row, then Save to write it to data/location-constants.json.`;
}

function deleteLocation(name) {
  if (!locationConstants[name]) return;
  if (Object.keys(locationConstants).length <= 1) {
    $("locationConstantsStatus").textContent = "Delete failed: at least one location is required.";
    return;
  }
  delete locationConstants[name];
  syncGateOptions();
  renderLocationConstantsTable();
  rebuildTidesFromLocationConstants();
  $("locationConstantsStatus").textContent = `Deleted "${name}". Save to persist the change.`;
}

function recalculateCurrentPlan() {
  if (!currentWeatherRows || !currentTideRows || currentTideRows.length < 2) {
    currentPlanRows = null;
    updateFreshness();
    return;
  }
  const planWeatherRows = limitWeatherRowsToTideWindow(currentWeatherRows, currentTideRows);
  const rows = interpolateTidalFlow(planWeatherRows, currentTideRows, settingsFromControls());
  currentPlanRows = rows;
  summarize(rows);
  renderTable(rows);
  renderHourOptions(rows);
  renderHourVisual();
  updateFreshness();
}

function settingsFromControls() {
  const settings = {
    gate: $("gate").value,
    hdg: Number($("heading").value),
    crewCapability: $("crewCapability").value,
    yachtSpeed: Number($("speed").value),
    slackThreshold: Number($("slack").value),
    displacement: Number($("displacement").value),
    lwl: Number($("lwl").value)
  };
  for (const id of calculationSettingIds) settings[id] = settingNumber(id);
  Object.assign(settings, crewComfortSettings(settings.crewCapability));
  return settings;
}

async function loadWeatherForGate(settings, options = {}) {
  try {
    const location = locationConstants[settings.gate];
    const params = new URLSearchParams({
      location: settings.gate,
      lat: location.latitude,
      lon: location.longitude,
      days: "16",
      marineDays: "8"
    });
    if (options.manualRefresh) params.set("refresh", "1");
    const response = await fetch(`/api/weather?${params}`);
    if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);
    const payload = await response.json();
    const rows = weatherRowsFromApi(payload);
    if (!rows) throw new Error("Weather response did not contain hourly data");
    currentWeatherMeta = payload.cache;
    $("dataStatus").textContent = "";
    return rows;
  } catch (error) {
    currentWeatherMeta = null;
    $("dataStatus").textContent = `Weather data was not loaded for ${settings.gate} (${error.message}).`;
    return null;
  }
}

async function refreshWeather() {
  const settings = settingsFromControls();
  const rows = await loadWeatherForGate(settings, { manualRefresh: true });
  if (rows) {
    currentWeatherRows = rows;
    renderReadOnlyTable("weatherDataTable", currentWeatherRows, fetchedWeatherColumns);
    recalculateCurrentPlan();
  }
}

async function refreshTides() {
  const settings = settingsFromControls();
  try {
    const response = await fetch(`/api/tides?${new URLSearchParams({ location: settings.gate })}`);
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload.error || `Tide provider returned ${response.status}`);
    }
    const payload = await response.json();
    const rows = tideRowsFromApi(payload);
    if (!rows) throw new Error("Tide response did not contain high-water rows");
    currentFetchedTideRows = rows;
    currentTideMeta = payload.cache;
    renderReadOnlyTable("fetchedTideTable", currentFetchedTideRows, fetchedTideColumns);
    currentTideRows = tideCalculationRowsFromEvents(currentFetchedTideRows, settings.gate);
    renderReadOnlyTable("gateCalcTable", currentTideRows, editableTideColumns);
    $("dataStatus").textContent = "";
    recalculateCurrentPlan();
  } catch (error) {
    currentTideMeta = null;
    currentFetchedTideRows = null;
    currentTideRows = null;
    $("dataStatus").textContent = `Tide data was not loaded for ${settings.gate} (${error.message}).`;
    updateFreshness();
  }
}

async function refreshAll() {
  await refreshWeather();
  await refreshTides();
  updateFreshness();
}

async function stopServer() {
  const confirmed = window.confirm("Stop the local passage planner server? The app will be unavailable until you start it again.");
  if (!confirmed) return;
  try {
    const response = await fetch("/api/shutdown", { method: "POST" });
    if (!response.ok) throw new Error(`server returned ${response.status}`);
    $("dataStatus").textContent = "Server stop requested. You can close this page or restart the server from the terminal.";
  } catch (error) {
    $("dataStatus").textContent = `Server stop request failed: ${error.message}.`;
  }
}

async function loadStoredData() {
  const settings = settingsFromControls();
  $("locationLabel").textContent = settings.gate;
  currentWeatherRows = await loadWeatherForGate(settings);
  await refreshTides();
  renderLocationConstantsTable();
  if (currentWeatherRows) renderReadOnlyTable("weatherDataTable", currentWeatherRows, fetchedWeatherColumns);
  if (currentTideRows) renderReadOnlyTable("gateCalcTable", currentTideRows, editableTideColumns);
  if (currentFetchedTideRows) renderReadOnlyTable("fetchedTideTable", currentFetchedTideRows, fetchedTideColumns);
  recalculateCurrentPlan();
}

$("gate").addEventListener("change", () => {
  savePlannerSelection();
  loadStoredData();
});
$("heading").addEventListener("change", () => {
  savePlannerSelection();
  recalculateCurrentPlan();
});
$("crewCapability").addEventListener("change", () => {
  savePlannerSelection();
  recalculateCurrentPlan();
});
$("speed").addEventListener("change", savePlannerSelection);
for (const id of ["speed", "slack", "lwl", "displacement", ...calculationSettingIds]) {
  $(id).addEventListener("input", () => {
    renderComfortConstantsTable();
    recalculateCurrentPlan();
  });
}
$("refreshWeather").addEventListener("click", refreshWeather);
$("refreshTides").addEventListener("click", refreshTides);
$("refreshAll").addEventListener("click", refreshAll);
$("stopServer").addEventListener("click", stopServer);
$("addLocation").addEventListener("click", addLocation);
$("locationTable").addEventListener("change", (event) => {
  if (!event.target.matches("input[data-location][data-key]")) return;
  const locationName = event.target.dataset.location;
  const key = event.target.dataset.key;
  if (key === "location") {
    const newName = renameLocation(locationName, event.target.value);
    syncGateOptions(newName);
    renderLocationConstantsTable();
    rebuildTidesFromLocationConstants();
    return;
  }
  if (!locationConstants[locationName]) return;
  locationConstants[locationName][key] = event.target.value.trim();
  if (key === "latitude" || key === "longitude") renderLocationConstantsTable();
  syncGateOptions($("gate").value);
  rebuildTidesFromLocationConstants();
});
$("locationTable").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-delete-location]");
  if (!button) return;
  deleteLocation(button.dataset.deleteLocation);
});
$("loadLocationConstants").addEventListener("click", loadLocationConstants);
$("saveLocationConstants").addEventListener("click", saveLocationConstants);
$("saveSettings").addEventListener("click", saveSettings);
$("hourSelect").addEventListener("change", () => {
  updateHourStepButtons();
  renderHourVisual();
});
bindHourStepButton("previousHour", -1);
bindHourStepButton("nextHour", 1);
document.addEventListener("keydown", (event) => {
  if (!$("hourViewPanel").classList.contains("active")) return;
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  event.preventDefault();
  stepSelectedHour(event.key === "ArrowUp" ? -1 : 1);
});

for (const button of document.querySelectorAll(".tabButton")) {
  button.addEventListener("click", () => {
    for (const other of document.querySelectorAll(".tabButton")) other.classList.remove("active");
    for (const panel of document.querySelectorAll(".tabPanel")) panel.classList.remove("active");
    button.classList.add("active");
    $(`${button.dataset.tab}Panel`).classList.add("active");
  });
}
async function initializeApp() {
  await loadSettings();
  await loadLocationConstants();
  syncGateOptions(appSettings.selectedGate || $("gate").value);
  if (appSettings.selectedHeading && [...$("heading").options].some((option) => option.value === appSettings.selectedHeading)) {
    $("heading").value = appSettings.selectedHeading;
  }
  if (appSettings.selectedCrewCapability && [...$("crewCapability").options].some((option) => option.value === appSettings.selectedCrewCapability)) {
    $("crewCapability").value = appSettings.selectedCrewCapability;
  }
  renderReadOnlyTable("beaufortTable", beaufortRows(), ["Force", "Description", "Knots", "m/s"]);
  renderComfortConstantsTable();
  await loadStoredData();
}

initializeApp();
setInterval(updateFreshness, 60000);
