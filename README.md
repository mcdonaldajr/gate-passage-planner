# Gate Passage Planner

Local web app for planning tidal-gate passages using cached weather, UKHO tide heights, local gate constants, and crew comfort settings.

This tool is experimental and untested. It is not for navigation. Cross-check all tide, weather, and passage decisions against official sources, pilot books, and local judgement.

## What It Does

- Fetches weather and marine forecast data from Open-Meteo.
- Fetches tide events from the ADMIRALTY UK Tidal API.
- Caches provider data locally to avoid unnecessary API calls.
- Can use stored weather/tide data while offline; explicit refreshes require internet.
- Calculates gate timing, tidal stream direction/rate, wind/wave/tide comfort, speed over ground, and an overall rating.
- Lets you edit local tidal-gate constants and crew capability thresholds.

## Install On Lubuntu

Open a terminal and run:

```bash
git clone https://github.com/mcdonaldajr/gate-passage-planner.git
cd gate-passage-planner
./scripts/install-lubuntu.sh
```

The install script checks for Node.js, creates local data folders, installs a user-level systemd service, and creates `data/app-settings.json` from `data/app-settings.example.json` if needed. Location constants saved in the app are stored in `data/user-location-constants.json`, which is local user data and is not overwritten by software updates.

## Start The App

```bash
systemctl --user start gate-passage-planner
```

This starts the local server at:

```text
http://127.0.0.1:4173
```

The server also listens on the boat/local Wi-Fi network. Open the Lubuntu machine's LAN address in Safari or Firefox on the iPad while it is connected to the same secure Wi-Fi network, for example:

```text
http://192.168.1.23:4173
```

Use your browser bookmark to open the app. The Lubuntu desktop icons only start and stop the server; they do not launch Firefox.

Useful service commands:

```bash
systemctl --user status gate-passage-planner
systemctl --user stop gate-passage-planner
journalctl --user -u gate-passage-planner -f
```

## Offline Use

The server and app run locally. Once weather and tide data have been fetched at least once for a location/station, the app can load that stored data and recalculate passage plans without an internet connection.

Offline behaviour:

- Starting the app, changing course/speed/crew settings, changing tabs, and recalculating use local files only.
- Weather is loaded from the stored cache for the selected location, even when it is older than the normal refresh interval.
- Tide data is loaded from today's stored UKHO cache when available, otherwise from the latest stored tide cache for the station.
- The status cards mark stale/offline data as stored offline data.
- `Refresh weather`, `Refresh tides`, and `Refresh all` still need internet to obtain new provider data. If refresh cannot reach the provider but stored data exists, the app keeps using the stored data.

Before going offline, open each tidal gate/location you may use and run `Refresh all` while connected.

To force local-only mode instead:

```bash
HOST=127.0.0.1 ./scripts/start-passage-planner.sh
```

The older explicit LAN helper still works, but is now just an alias:

```bash
./scripts/start-passage-planner-lan.sh
```

Example LAN URL:

```text
http://192.168.1.23:4173
```

Security notes:

- The app has no login screen.
- Anyone on the same network who knows the Lubuntu machine address and port can open it.
- The UKHO key itself is not sent to the browser by `/api/settings`, but someone with access to the app can use the app to fetch tides.
- Use the default LAN mode only on a trusted private network, such as your secured boat Wi-Fi.
- If Lubuntu's firewall is enabled, allow TCP port `4173` on your local network.

Example firewall command:

```bash
sudo ufw allow from 192.168.0.0/16 to any port 4173 proto tcp
```

To create desktop launchers on Lubuntu:

```bash
./scripts/create-desktop-launcher.sh
```

Then use the `Start Gate Passage Planner Server` and `Stop Gate Passage Planner Server` icons on your desktop. Depending on your desktop settings, you may need to right-click each launcher and allow it to run.

## macOS Desktop Launcher

From the project directory:

```bash
chmod +x scripts/start-passage-planner.sh scripts/install-macos.sh
./scripts/install-macos.sh
```

Then double-click **Passage Planner.app** on the Desktop. It starts the local server in the background and opens the app in the default browser.

To stop the server:

```bash
./scripts/stop-passage-planner.sh
```

## UKHO API Key

The tide download uses an ADMIRALTY UK Tidal API subscription key.

1. Open the [ADMIRALTY API Developer Portal startup guide](https://developer.admiralty.co.uk/docs/startup).
2. Sign up for the ADMIRALTY API Developer Portal.
3. Verify/set your account password when prompted.
4. Subscribe to the UK Tidal API product.
5. Copy your subscription key from your profile/subscriptions page.
6. Paste it into the app on the `Constants` tab as `UKHO API key`.

The UKHO/ADMIRALTY portal account is email-based: the public docs mention signup, verification email, and profile details including email/name. The app includes a `UKHO account email` field so you can record which account owns the key. That email is stored locally only and is not sent to UKHO by this app.

Useful UKHO links:

- [ADMIRALTY APIs overview](https://www.admiralty.co.uk/access-data/apis)
- [UK Tidal API Discovery catalogue](https://www.api.gov.uk/ukho/uk-tidal-api-discovery/)
- [ADMIRALTY API startup guide](https://developer.admiralty.co.uk/docs/startup)
- [ADMIRALTY API technical overview](https://admiraltyapi.developer.azure-api.net/docs/technicalOverview)
- [UKHO Tidal API FAQ](https://admiraltyapi.developer.azure-api.net/faqs)

## Local Files And Secrets

Do not commit `data/app-settings.json`. It may contain:

- UKHO API key
- UKHO account email
- Your current selected gate/course/crew settings

The repository ignores this file and includes `data/app-settings.example.json` instead.

Provider caches under `data/cache/` are also ignored.

## Updating The App On Lubuntu

```bash
cd gate-passage-planner
git pull
./scripts/install-lubuntu.sh
systemctl --user restart gate-passage-planner
```

## Notes On Data Limits

- UKHO Discovery gives current plus 6 days of tidal events.
- Open-Meteo forecast data can extend beyond the tide horizon, but the passage plan is limited by available tide data.
- Weather cache defaults to 1 hour; manual refreshes are guarded for 10 minutes to avoid hammering providers.
- Tide cache is once per day.
- Location constants require latitude, longitude, flood/ebb set, spring/neap peak rates, and spring/neap flood/ebb timing offsets before a gate is selectable. Blank slack-duration fields are allowed and are treated as zero slack.

## Development

```bash
npm start
```

The app is plain Node.js plus static browser files. There are no npm package dependencies at the moment.
