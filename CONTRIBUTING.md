# Contributing

Run `npm run check` and `npm test` before submitting a pull request. Serve `web/` over HTTP and check 3D, maps, power, reports, saved builds, and a narrow screen when changing the interface.

Keep the app static and usable without accounts. Do not add analytics or remote runtime dependencies by default. Treat imported configurations as untrusted, validate bounds, and escape user text in generated HTML. Keep new reference hardware data sourced to manufacturer documentation and distinguish TDP, electrical budgets, and measured values. Preserve the model limitations in the UI and documentation.

Changes to the flow model should include meaningful numerical regression coverage. Avoid claiming physically accurate CFD without calibration and independent validation. Vendor CAD and contributed assets must have redistributable licenses.
