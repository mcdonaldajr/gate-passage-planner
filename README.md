# Gate Passage Planner

Local web app for planning tidal-gate passages using cached weather, UKHO tide heights, local gate constants, and crew comfort settings.

This tool is experimental and untested. It is not for navigation. Cross-check all tide, weather, and passage decisions against official sources, pilot books, and local judgement.

## What It Does

- Fetches weather and marine forecast data from Open-Meteo.
- Fetches tide events from the ADMIRALTY UK Tidal API.
- Caches provider data locally to avoid unnecessary API calls.
- Calculates gate timing, tidal stream direction/rate, wind/wave/tide comfort, speed over ground, and an overall rating.
- Lets you edit local tidal-gate constants and crew capability thresholds.

## Install On Lubuntu

Open a terminal and run:

```bash
git clone https://github.com/mcdonaldajr/gate-passage-planner.git
cd gate-passage-planner
./scripts/install-lubuntu.sh
```

The install script checks for Node.js, npm, and Firefox, creates local data folders, and creates `data/app-settings.json` from `data/app-settings.example.json` if needed.

## Start The App

```bash
./scripts/start-passage-planner.sh
```

This starts the local server and opens Firefox at:

```text
http://127.0.0.1:4173
```

## Read From An iPad On The Same Network

By default the app only listens on `127.0.0.1`, so it is private to the Lubuntu machine and an iPad cannot connect.

To allow another device on your home/boat Wi-Fi to read it, start the LAN version:

```bash
./scripts/start-passage-planner-lan.sh
```

The script prints a URL like:

```text
http://192.168.1.23:4173
```

Open that URL in Safari or Firefox on the iPad while it is connected to the same Wi-Fi network.

Security notes:

- The app has no login screen.
- Anyone on the same network who knows the Lubuntu machine address and port can open it.
- The UKHO key itself is not sent to the browser by `/api/settings`, but someone with access to the app can use the app to fetch tides.
- Use LAN mode only on a trusted private network.
- If Lubuntu's firewall is enabled, allow TCP port `4173` on your local network.

Example firewall command:

```bash
sudo ufw allow from 192.168.0.0/16 to any port 4173 proto tcp
```

To create a desktop launcher on Lubuntu:

```bash
./scripts/create-desktop-launcher.sh
```

Then use the `Gate Passage Planner` icon on your desktop. Depending on your desktop settings, you may need to right-click the launcher and allow it to run.

To stop the server:

```bash
./scripts/stop-passage-planner.sh
```

You can also use the in-app `Stop server` button.

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
./scripts/start-passage-planner.sh
```

## Notes On Data Limits

- UKHO Discovery gives current plus 6 days of tidal events.
- Open-Meteo forecast data can extend beyond the tide horizon, but the passage plan is limited by available tide data.
- Weather cache defaults to 1 hour; manual refreshes are guarded for 10 minutes to avoid hammering providers.
- Tide cache is once per day.

## Development

```bash
npm start
```

The app is plain Node.js plus static browser files. There are no npm package dependencies at the moment.
