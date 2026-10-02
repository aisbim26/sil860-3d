# SIL860 · Residential Redevelopment

An interactive Blender / Three.js scene of Shau Kei Wan, Hong Kong.

[Live website](https://aisbim26.github.io/sil860-3d/)

## Version 4

- Added the northwest and southwest streets requested in the latest review. Road crossings at the map boundary remain open. Removed the white island platform and service kiosk; the island is fully brick paved.
- Added three moving cars in the western street circuit and three parked cars beside the garden. Detailed the trams with roof vents, mirrors, wipers, lamps and handrails. Pause traffic controls both vehicle types.
- Rebuilt building textures from original source images: up to 2048 px within 110 m, 1024 px within 165 m, and 512 px beyond.
- Extended the reconstructed streets, brick sidewalks and kerbs using government CAD `11-SE-13B.dwg`. The short continuation north of the CAD coverage is traced from the supplied map.
- Added paving at the new building's north pedestrian entrance and street frontage, including the covered approach. Removed the former market outline and road direction arrows.
- CAD rail curves with embedded steel rails and grooves; overhead wires, poles, railings, drains and road markings interpreted from the supplied street photographs.
- Retained the user-confirmed Version 2 structure position and geometry: **2.80 m west and 0.55 m south** relative to version 1. GP03 was reviewed; no further structure or ground-floor wall changes were applied after the user's clarification.
- AIS logo, English interface, translucent desktop sidebar and compact mobile controls. Views: Site, Surroundings and Plan.
- Three simple double-decker trams follow the CAD rails at 2.4 m/s. Pause/resume and a separate tram layer are available. Vehicles re-enter at the edge of the 200 m scene.
- Five detailed trees near the site and 310 low-detail hillside trees. Hillside placement uses green map pixels with building and crown clearance checks. No tree on the tram island.
- 200 m site radius. Original vegetation FBX files are not loaded.

## Coordinates and interpretation

HK1980 / EPSG:2326 origin: **E841803, N815475**. Alignment is based on the CAD plan and supplied images; shared Revit survey coordinates have not been supplied. The former market outline is hidden. Road levels interpolate nearby CAD spot heights. Street furniture, entrance paving, tree sizes and locations are visual interpretations, not a measured inventory.

The existing map is retained outside the rebuilt street area. Map tiles: `11-SE-13B` and `11-SE-8D`; the eastern tile ends approximately 197 m from the centre. Original building `B417841546601063A0` is removed. The Revit Toposolid is excluded.

## Run locally

1. Extract all `assets*.zip` archives into this directory, producing `assets/` and `vendor/`. The local delivery already contains these folders.
2. Run `python serve.py`.
3. Open http://127.0.0.1:8600 in a browser.

## GitHub Pages

Pages uses GitHub Actions. `.github/workflows/pages.yml` extracts all `assets*.zip` archives and deploys the static website. Update the archives after changing assets. Three.js and Draco are bundled; no font service is required.

## Blender

The local delivery includes the editable `SIL860.blend`, with separate collections for terrain, surrounding buildings, structure, roads, trees, animated trams and cars. `scripts/rebuild_blender.py` rebuilds it from the web assets. The Blender master is not included in the GitHub Pages download.

See [CREDITS.md](CREDITS.md) for sources.
