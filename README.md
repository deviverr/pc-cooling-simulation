# Airframe — PC Builder & Cooling Studio

A free, browser-based PC planning tool with editable 3D hardware, room-to-case airflow, section maps, fit checks, and an electricity and wiring planner.

**[Open Airframe](https://deviverr.github.io/pc-cooling-simulation/)**

## What you can do

- Build from four starting configurations, seven chassis templates, or custom case dimensions.
- Choose CPU, GPU, cooler, and fan profiles; edit dimensions, heat loads, sockets, storage, and power assumptions.
- Inspect solid, glass, or cutaway case panels. Move and rotate case fans with 3D handles, axis constraints, snapping, undo, and redo.
- Follow air from outside the enclosure through intake openings, CPU heatsinks, and GPU coolers to exhausts.
- Explore relative speed, pressure, and heat-source maps in three section planes; download a map as PNG.
- Compare PSU capacity, design DC load, wall-input estimates, reserve, and monthly electricity scenarios.
- Review a PSU connection diagram and declared fit, socket, and connector checks.
- Save builds on your device, share a build in a URL, import/export JSON, and download a standalone HTML build report.

No account, backend, tracking, remote fonts, or runtime package downloads. Build data stays in browser storage unless you export or share it. Shared build URLs contain the entered configuration; anyone with the link can read it.

## Run locally

Requires Python 3 to serve files, and Node.js 22+ only for development checks.

```sh
npm start
# open http://127.0.0.1:8742/
npm run check
npm test
```

There are no npm dependencies or build step. Serve `web/` over HTTP; browser modules and workers do not run correctly from a `file://` URL. The Three.js dependency and its MIT license are included in `web/vendor/`.

## Controls

Drag the empty viewport to orbit; use the wheel to zoom. Select a fan to edit it. `G` moves, `R` rotates, `X/Y/Z` constrain an axis, `F` focuses, and Escape cancels an edit. The fan editor also exposes numeric transforms and snapping. Use the on-screen Guide for the full workflow.

## Accuracy and scope

Airframe is an exploratory planning tool. The airflow field is a coarse steady pressure projection with modeled fan forcing, porous heatsinks, and solid obstacles. It is not calibrated against a specific physical PC or validated as engineering CFD. Path counts are sampled visualization routes, not airflow percentages. Heat-source maps show prescribed heat; temperature cards use a separate simplified thermal estimate.

Component geometry is generic and editable, not manufacturer CAD. Named CPU/GPU power figures are reference values, and CPU TDP is distinct from electrical draw. PSU efficiency, load budgets, prices, and operating hours are user assumptions. Fit checks cannot certify BIOS, memory QVL, cable bend radius, every physical interference, or electrical safety. Verify your exact component manuals, dimensions, and PSU cable compatibility before buying or assembling parts.

See [model details](docs/MODEL.md) and [sources](docs/SOURCES.md).

## Deployment

The Pages workflow checks syntax and runs the numerical and builder tests before deploying only `web/`. Pull requests run checks without deployment. Repository Settings → Pages must use **GitHub Actions** as the source.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). MIT licensed; third-party licenses remain with their respective files.
