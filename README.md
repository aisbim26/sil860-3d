# SIL860 · Residential Redevelopment

An interactive Blender / Three.js scene of Shau Kei Wan, Hong Kong.

[Live website](https://aisbim26.github.io/sil860-3d/)

## Version 2

- Reconstructed streets, brick sidewalks, kerbs and tram turning loop using government CAD `11-SE-13B.dwg`.
- CAD rail curves with embedded steel rails and grooves; overhead wires, poles, railings, drains and road markings interpreted from the supplied street photographs.
- Revit structure moved **2.80 m west and 0.55 m south** relative to version 1. Scale, orientation and elevations are retained.
- Fully English interface with Site, Area, orthographic Plan and Tram loop views, plus layer controls.
- Five detailed trees near the site and 310 low-detail hillside trees. Hillside placement uses green map pixels with building and crown clearance checks. No tree on the tram island.
- 200 m site radius. Original vegetation FBX files are not loaded.

## Coordinates and interpretation

HK1980 / EPSG:2326 origin: **E841803, N815475**. Alignment is based on the CAD plan and supplied images; shared Revit survey coordinates have not been supplied. The gold line is the former market footprint, not the lot boundary. CAD kerb endpoints are joined within 2 cm, and curves are sampled with a 4 cm chord tolerance. Road levels interpolate nearby CAD spot heights. Street furniture, tree sizes and locations are visual interpretations, not a measured inventory.

The existing map is retained outside the rebuilt street area. Map tiles: `11-SE-13B` and `11-SE-8D`; the eastern tile ends approximately 197 m from the centre. Original building `B417841546601063A0` is removed. The Revit Toposolid is excluded.

## Run locally

1. Extract `assets.zip` into this directory, producing `assets/` and `vendor/`. The local delivery already contains these folders.
2. Run `python serve.py`.
3. Open http://127.0.0.1:8600 in a browser.

## GitHub Pages

Pages uses GitHub Actions. `.github/workflows/pages.yml` extracts `assets.zip` and deploys the static website. Update that archive after changing assets. Three.js and Draco are bundled; no font service is required.

## Blender

The local delivery includes the editable `SIL860.blend`, with separate collections for terrain, surrounding buildings, structure, roads and trees. `scripts/rebuild_blender.py` rebuilds it from the web assets. The Blender master is not included in the GitHub Pages download.

See [CREDITS.md](CREDITS.md) for sources.
