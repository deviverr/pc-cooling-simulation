# Modeling notes

## Flow

`flow-solver.js` voxelizes the case, openings, components, and porous cooling regions on a coarse staggered grid. Fan forcing, resistance, and weak buoyancy produce a provisional velocity field. A preconditioned pressure solve projects the field toward mass conservation. The worker transfers the result to the renderer and section maps.

Case fans exchange air across openings. Internal CPU and GPU fans recirculate case air through porous heatsink regions; they do not create room air. Visible cooling routes are traced backward to outside the enclosure. Solid PCB and enclosure regions constrain the paths. Case dimensions, component dimensions, fan transforms, RPM, panel openness, filter resistance, and cooling mode affect the calculation.

This is a steady, approximate visualization model. It does not resolve turbulence, measured fan pressure curves, detailed blade aerodynamics, dust accumulation, or a coupled transient energy equation. It is not mesh-converged or physically validated. Relative pressure is gauge pressure in model units, not a manometer prediction. Prescribed heat maps are source distributions, not solved temperatures. Temperature cards are a separate heuristic and should be used only for qualitative layout comparisons.

## Power

Current DC demand is the selected CPU heat assumption plus GPU board heat, board/memory/storage allowances, case fans, and a pump allowance. The design scenario replaces current CPU heat with the greater of current heat and the editable CPU budget. A user-selected reserve determines a planning PSU tier. Wall input divides current DC demand by assumed efficiency. Monthly energy assumes the same current scenario for the entered daily hours over 30 days.

Fan/pump allowances are generic. CPU TDP is not an electrical measurement; named profiles expose editable planning budgets. GPU board power already includes PCIe slot power. PSU load percentage is design DC demand divided by PSU DC rating. Efficiency is one editable constant, not a measured load-dependent curve. Transient excursions, protection behavior, connector current limits, acoustics, and PSU quality are not modeled.

## Fit and geometry

One scene unit represents 100 mm. Templates provide editable planning limits. Reference-profile geometry remains generic; board partners can change GPU dimensions and connectors. The checks cover declared board/socket, GPU length, cooler height, radiator support, PSU form and capacity, and declared power-cable availability. They do not perform full solid-model collision testing or certify a build.

## Verification

Tests cover configuration bounds and serialization, geometry transforms, power math, compatibility checks, finite fields, pressure-projection residuals, outside-air path origins, obstacle crossings, cooling-region traversal, open/passive configurations, and flow-cache reuse for power-only changes. Passing these tests checks software behavior, not physical calibration.
