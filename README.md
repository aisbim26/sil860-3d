# SIL860 · Residential Redevelopment

An interactive Blender / Three.js scene of Shau Kei Wan, Hong Kong.

[Live website](https://aisbim26.github.io/sil860-3d/)

## Version 7

- Removed original GENERIC, INFRASTRUCTURE and WATERBODY objects from the map exports. Retained BUILDING, TERRAIN, custom roads, vehicles and replacement trees. Original vegetation FBX remains excluded.
- Mobile buildings now use 1024 px within 85 m and 512 px beyond, with full-resolution cropped terrain pixels. Increased mobile display pixel ratio to 1.5 and anisotropic filtering to 8.
- Both display profiles release decoded CPU image bitmaps after texture upload. Memory figures in verification.json are texture allocation estimates, not measured browser usage.

## Version 6

- Phones and tablets automatically use separate lightweight terrain, building and tree textures (about 6 MB total); desktop keeps the original pixel resolution, with 29 images losslessly cropped to their used UV regions. This removes 59 MB of downloads and about 1.19 GB of estimated decoded texture allocation. Texture memory estimates are 112 MB for mobile versus 3.93 GB for the original main texture sets, including mipmaps; these are asset estimates, not measurements on an iPhone.
- Mobile skips the high-detail tree model, disables real-time shadows, caps rendering at 30 fps and limits image decode concurrency to three. Structure and roads appear before the surrounding map finishes loading. Transient image requests retry twice.
- Filled the northwest triangular island interior with concrete texture. Rails are sampled every 0.35 m and lifted above the actual triangulated road surface; 788 exported rail samples have at least 0.052 m clearance.
- Preserved the approved structure and all visible desktop terrain pixels; the crop output is checked against the decoded source pixels. Browser checks cover phone-sized layout and the mobile asset profile; physical iPhone Safari testing is still needed.

## Version 5

- Restored all 90 terrain and ground-surface image files directly from the original map download. No resizing, JPEG re-encoding or lossy texture compression. The files total 148.35 MB; SHA-256 hashes are recorded in `assets/terrain-texture-audit.json`.
- Replaced the width-estimated road network within the main CAD extent with polygons enclosed by `CartoTransLine` kerbs. Factory Street now has the continuous surveyed kerb and median geometry, without building-footprint notches or spurious small paving islands.
- CAD linework is snapped to 0.02 m. One interrupted kerb between handles 45E94 and 45F86 is connected between its surveyed endpoints. The continuation outside the supplied CAD extent retains the map-based alignment; pavement widths and materials remain visualization interpretations.
- Adjusted the western car turn to clear the CAD median. All 362 moving-car samples have 1 m centre clearance inside the road.
- Preserved the approved structure geometry/position and existing trams, cars, trees and English interface.

## Earlier scene features

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

1. The local delivery includes the complete `assets/` and `vendor/` folders. For a repository download, extract `assets*.zip`, concatenate `update-v5.part*` in numbered order into a ZIP, and extract it over the assets. Then extract all `update-v6*.zip` and `update-v7*.zip` archives in order.
2. Run `python serve.py`.
3. Open http://127.0.0.1:8600 in a browser.

## GitHub Pages

Pages uses GitHub Actions. `.github/workflows/pages.yml` extracts the base archives, joins the V5 transport parts and extracts their lossless ZIP over the base assets before deployment. These transport files preserve the original image bytes. Three.js and Draco are bundled; no font service is required.

## Blender

The local delivery includes the editable `SIL860.blend`, with separate collections for terrain, surrounding buildings, structure, roads, trees, animated trams and cars. `scripts/rebuild_blender.py` rebuilds it from the web assets. The Blender master is not included in the GitHub Pages download.

See [CREDITS.md](CREDITS.md) for sources.
