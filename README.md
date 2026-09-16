# HCTGo Web

The browser build of the Hub City Transit rider application. It offers the same live
map, journey planning and navigation as the mobile application, for riders on a desktop
or on a phone without the app installed.

Built with React and Vite.

<!--
  SCREENSHOT: Home page with the live map, route filters and favourite routes.
  Add the file, then uncomment the line below.
  <p align="center"><img src="docs/screenshots/home.png" alt="Home page" width="900"></p>
-->

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [Screens](#screens)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Architecture notes](#architecture-notes)
- [Known limitations](#known-limitations)
- [Related projects](#related-projects)

---

## Overview

Route, stop and vehicle data is held in Firebase and administered through a separate
dispatch dashboard. Live vehicle positions come from the transit authority's ArcGIS
feed. Journey planning runs in the browser rather than on a server.

This build shares its planning engine and data model with the mobile application; the
two differ in presentation and in the platform APIs they use for mapping and location.

---

## Features

**Live network map.** Every active route drawn from its traced path, with stops and
real-time vehicle positions. Selecting a stop shows the routes serving it and available
transfers.

**Journey planning.** Enter an origin and destination to receive several viable
journeys, optimised for speed, for least walking, or for fewest transfers. Planning is
time-aware, so departing now and departing later can yield different results.

**Navigation.** Once a journey starts, the interface reduces to the current leg, with
walking directions or remaining stop counts as appropriate, and warnings before the
alighting stop. Completed legs and steps are dimmed as the rider progresses.

**Service alerts.** Delays and detours published by dispatch appear in the app with an
unread indicator.

**Favourites.** Riders can star routes for quick access.

---

## Screens

<!--
  SCREENSHOT: Trip planner showing route options and the segment breakdown.
  <p align="center"><img src="docs/screenshots/trip-planner.png" alt="Trip planner" width="900"></p>
-->

<!--
  SCREENSHOT: Route detail page with per-stop schedules.
  <p align="center"><img src="docs/screenshots/route-detail.png" alt="Route detail" width="900"></p>
-->

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 19, Vite |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Mapping | Mapbox GL JS |
| Backend | Firebase Firestore, Firebase Auth (anonymous) |
| Vehicle positions | ArcGIS FeatureServer |
| Icons | Font Awesome |

---

## Getting started

### Prerequisites

- Node.js 20 or newer
- A Firebase project with Firestore enabled
- A Mapbox access token
- Access to the ArcGIS vehicle position endpoint

### Installation

```bash
npm install
```

### Running

```bash
npm run dev
```

### Building

```bash
npm run build
npm run preview
```

---

## Environment variables

Create a `.env` file in the project root.

```
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_DATABASE_URL=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_MEASUREMENT_ID=
VITE_MAPBOX_TOKEN=
VITE_ARCGIS_URL=
```

Note that the Mapbox variable is named `VITE_MAPBOX_TOKEN` here, while the admin
dashboard uses `VITE_MAPBOX_KEY`. Copying an env file between the two projects without
renaming will produce a map that fails to initialise.

Variables prefixed `VITE_` are embedded in the built bundle and readable by anyone with
access to the site. Treat them as public identifiers rather than secrets, and enforce
access control through Firestore security rules.

---

## Project structure

```
src/
  pages/            Home, Lines, Trip, Route detail, Notifications, Settings
  components/       Route pill, alert pill, navigation chrome
  context/          Providers for transit data, bus positions, auth, theme
  data/             Firebase initialisation and static seed data
  hooks/            Auth, debounce
  utils/            Journey planning, schedule generation, coordinate helpers
scripts/            One-off data import utilities
```

---

## Architecture notes

**Journey planning runs in the browser.** The network is modelled as a directed graph
whose nodes are stops and whose edges are either a ride between consecutive stops on a
route or a walk between nearby stops. A time-dependent Dijkstra search accounts for
waiting for the next departure, and a k-shortest-paths search produces genuinely
different alternatives rather than variations of one route. See `src/utils/navigation.js`.

**Progress is measured against the journey, not the vehicle.** Navigation compares the
rider's browser geolocation against the waypoints of the current leg, because vehicle
positions update too infrequently to drive turn-by-turn guidance. Advancing a leg
requires several independent conditions, so one inaccurate reading cannot skip ahead.

**Transit data is live.** Firestore listeners keep routes, stops and vehicles current,
so changes published by dispatch reach an open tab without a reload.

---

## Known limitations

- Browser geolocation reports speed inconsistently across platforms, and does not
  report it at all on most desktop browsers. Features depending on it degrade to other
  signals rather than failing.
- The route detail page still performs a one-time read rather than subscribing, so it
  does not reflect changes published while it is open.
- Vehicle positions are polled per client. Centralising this behind a scheduled
  function is planned.

---

## Related projects

| Project | Purpose |
| --- | --- |
| `LIVE/hctgo-mobile` | Rider application for iOS and Android |
| `Admin/adminPage` | Dispatch dashboard for routes, alerts and fleet monitoring |

All three share one Firebase project and one data model.
