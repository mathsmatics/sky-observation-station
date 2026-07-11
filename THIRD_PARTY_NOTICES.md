# Third-party notices

This package bundles pinned local copies of:

- D3 3.5.17 — BSD-3-Clause. Data binding, Canvas/SVG utilities and geographic zoom infrastructure.
- d3.geo.projection v0-era browser bundle — BSD-3-Clause. Additional map projections used by D3-Celestial.
- D3-Celestial 0.7.35 — BSD-3-Clause. Celestial rendering, catalogs, coordinate transforms and general planetarium ephemeris framework.
- Luxon 3.7.2 — MIT. IANA time zones, local civil time, UTC conversion and calendar arithmetic.
- @photostructure/tz-lookup 11.5.0 — CC0-1.0. Offline coordinate-to-IANA-zone lookup.

See `licenses/` for the bundled license texts.

## Local compatibility patches to D3-Celestial 0.7.35

The pinned local `celestial.min.js` contains two narrow compatibility hooks required by this project:

1. The locally loaded Solar System Kepler objects and Earth-origin function are exposed as `window.__RSO_PLANET_OBJECTS__` and `window.__RSO_PLANET_ORIGIN__`. The project uses them to draw and pick all supported Solar System objects consistently in custom overlays.
2. After `reproject()`, the public `Celestial.mapProjection` and `Celestial.map` references are updated to the newly created internal projection/path objects. Upstream 0.7.35 replaces the internal projection but leaves the public reference pointing to the previous projection, which misaligns custom overlays and picking after projection changes.

These patches do not change the astronomical data files or upstream license. The modular source and technical guide document how they are used.

Astronomical data provenance, Chinese traditional-region reconstruction methods and scientific limitations are described inside the application's “代码与计算说明 / Code & calculation guide”.
