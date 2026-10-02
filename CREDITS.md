# Asset sources

- **Structure** — User-supplied `Structure model.fbx`, exported from Revit. Original geometry retained; web meshes merged by component class. The Revit Toposolid is excluded to avoid overlap with the map terrain. No architectural facade has been invented.
- **Context and terrain** — User-supplied Hong Kong Lands Department 3D Visualisation Map tiles `11-SE-13B` and `11-SE-8D`. Attribution: © Hong Kong SAR Government, Lands Department. Dataset terms remain applicable; no new license is granted over the provided map or structural model.
- **Trees** — [Island Tree 01](https://polyhaven.com/a/island_tree_01), Poly Haven. [CC0](https://polyhaven.com/license). Near trees use 2K color textures and 1K auxiliary maps on an 80,000-triangle mesh. Medium and far trees use Blender-baked transparent canopy cards (10 and 6 triangles), including a top-view canopy. Tree placement and size are illustrative, based on the supplied context images; they are not a tree survey or a species identification.
- **Three.js 0.180.0** — MIT license; see `vendor/three/LICENSE`. Draco decoder is distributed with Three.js and retains its included license.
- **Typography** — Noto Sans TC and Noto Serif TC via Google Fonts (SIL Open Font License). System fonts are used if the font service is unavailable.

No source vegetation FBX is imported or delivered. Existing roads are left in the supplied map; road reconstruction and website content are deferred to version 2.
