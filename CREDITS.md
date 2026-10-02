# Asset sources

- **Structure** — User-supplied `Structure model.fbx`, exported from Revit. Original geometry retained; web meshes merged by component class. The Revit Toposolid is excluded to avoid overlap with the map terrain. No architectural facade has been invented.
- **Context and terrain** — User-supplied Hong Kong Lands Department 3D Visualisation Map tiles `11-SE-13B` and `11-SE-8D`. Attribution: © Hong Kong SAR Government, Lands Department. Dataset terms remain applicable; no new license is granted over the provided map or structural model.
- **Trees** — [Island Tree 01](https://polyhaven.com/a/island_tree_01), Poly Haven. [CC0](https://polyhaven.com/license). Near trees use 2K color textures and 1K auxiliary maps on an 80,000-triangle mesh. Medium and far trees use Blender-baked transparent canopy cards (10 and 6 triangles), including a top-view canopy. Tree placement and size are illustrative, based on the supplied context images; they are not a tree survey or a species identification.
- **Three.js 0.180.0** — MIT license; see `vendor/three/LICENSE`. Draco decoder is distributed with Three.js and retains its included license.
- **Typography** — Local system fonts (Arial / Georgia).
- **AIS logo** — Company logo reused from the user's reference website, https://aisbim26.github.io/mount-parker-site-formation/, at the user's request.
- **Trams and cars** — Original vehicle models created in Blender for this project. Motion follows the government CAD rail alignment; liveries are illustrative.

No source vegetation FBX is imported or delivered. Version 4 extends the highlighted streets from the user-supplied government iB1000 drawing `11-SE-13B.dwg`, with map-based continuation beyond its northern coverage. The user-supplied `GP03.dwg` informed review of the entrance. Road surfaces use original procedural grain and brick textures. The supplied street photographs inform the street furniture and finishes; their pixels are not used as website textures. Trees outside the site use low-detail instanced canopy cards.
