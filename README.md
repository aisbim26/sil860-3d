# SIL860 · 筲箕灣住宅重建

Blender 製作、Three.js 顯示的第一版 3D 環境檢視器。

**網站：** https://aisbim26.github.io/sil860-3d/

## 第一版範圍

- 以使用者提供的 Revit 結構 FBX 取代原有筲箕灣街市大廈。
- 地盤中心半徑 **200 米**；保留現有建築、地形及道路。
- 近地盤 7 棵樹使用 2K 材質及 80,000 三角面的樹木模型；其餘樹木採用 Blender 烘焙樹冠圖片，近／中／遠景按觀看距離切換。
- 共 93 棵示意配置樹木。不匯入 Open 3D Map vegetation FBX。
- 支援旋轉、縮放、平移、三個預設視角和圖層開關。
- 網站內容及道路重建留待第二版。

## 定位與限制

地圖採用 HK1980 方格座標，場景原點為 **E841803、N815475**。Revit 模型保留米制比例、原方向與標高，XY 平移到場景原點；定位仍屬初步視覺對位，未經共用座標／測量基準核實。輪廓線為原建築外輪廓，並非法定地盤界線。

替換的原建築資料 ID：`B417841546601063A0`。地圖使用 `11-SE-13B` 和 `11-SE-8D`；最東端約 3 米超出現有圖幅。樹木位置、尺寸及外觀僅供視覺示意，非樹木測量或樹種辨識。地圖底圖中的樹冠影像保留在地形材質內；原 vegetation FBX 沒有載入。

## 本機開啟

1. 解壓縮 `assets.zip` 到專案目錄，得到 `assets/` 和 `vendor/`。
2. 執行 `python serve.py`。
3. 開啟 http://127.0.0.1:8600 。不要直接雙擊 HTML，瀏覽器會限制模型檔案的讀取。

本機交付資料夾已經解壓縮，可直接啟動。Three.js 與 Draco 已隨專案附上；字型無法連線時會使用系統字型。

## GitHub Pages

Repository Settings → Pages → Source 選擇 **GitHub Actions**。
`.github/workflows/pages.yml` 解壓 `assets.zip`，連同 HTML、CSS 及 JavaScript 部署到 Pages。

模型和共用材質使用 zip 存放，以減少瀏覽器上載的檔案數。日後如修改模型，重新打包 `assets/` 和 `vendor/` 為 `assets.zip` 即可。網頁文字和互動可直接修改 `index.html`、`style.css`、`main.js`。

## Blender 檔案

本機交付包含 `SIL860.blend`，提供可編輯的優化場景及獨立模型圖層。Blender 檔案不包含在 GitHub Pages 下載內容中。原始 Revit FBX 及原地圖檔案保持不變。

資產來源及授權請見 [CREDITS.md](CREDITS.md)。
