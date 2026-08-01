# 父親節潛水闖關網站

一個父親節主題的互動闖關網站，透過尋找裝備、回憶錄答題、拍照留念，最後呈現明信片祝福。

## 遊戲流程

1. **開始畫面**：點擊「開始冒險」進入遊戲
2. **尋找裝備**：在地圖上找到散落的裝備（共6件）
3. **回憶錄答題**：點擊裝備後，會出現一張回憶照片和問題
4. **獲得裝備**：答對後獲得該裝備
5. **重複尋找**：直到所有6件裝備都找到
6. **潛水畫面**：前往海水潛水
7. **拍照留念**：與海中生物合照
8. **泡泡轉場**：HAPPY FATHER'S DAY 泡泡從下方飄上
9. **明信片**：呈現手寫祝福字句

## 裝備清單

| 裝備 | 圖示 |
|------|------|
| 蛙鏡 | 🥽 |
| 呼吸管 | 🤿 |
| 蛙鞋 | 🩴 |
| 潛水衣 | 👙 |
| 氣瓶 | 🫧 |
| 面鏡 | 👓 |

## 修改設定

### 修改題目與照片

編輯 `config.json` 檔案：

```json
{
  "equipment": [
    {
      "id": "mask",
      "name": "蛙鏡",
      "icon": "🥽",
      "location": { "x": 15, "y": 30 },
      "question": "這是你的問題",
      "photo": "photos/你的照片.jpg"
    }
  ]
}
```

### 修改明信片內容

```json
{
  "postcard": {
    "message": "你的祝福語",
    "address": "收件人",
    "stamp": "日期"
  }
}
```

### 修改顏色

```json
{
  "colors": {
    "primary": "#0077B6",
    "secondary": "#00B4D8",
    "accent": "#90E0EF",
    "background": "#CAF0F8",
    "text": "#03045E"
  }
}
```

## 添加照片

1. 在 `photos` 資料夾中放入照片
2. 照片命名為 `memory1.jpg` ~ `memory6.jpg`
3. 或在 `config.json` 中修改 `photo` 欄位指定其他檔名

## 部署到 GitHub Pages

1. 在 GitHub 建立新 repository
2. 將所有檔案上傳
3. 進入 Settings > Pages
4. 選擇 main 分支作為來源
5. 點擊 Save，等待部署完成

## 技術細節

- 純前端靜態網站（HTML + CSS + JavaScript）
- 手機版設計，支援直式螢幕
- 響應式佈局，適應不同螢幕尺寸
- CSS 動畫效果（泡泡飄浮、魚類游動、轉場動畫）

## 檔案結構

```
父親節闖關設計/
├── index.html      # 主要 HTML 檔案
├── styles.css      # 樣式表
├── config.js       # 預設設定
├── game.js         # 遊戲邏輯
├── config.json     # 可修改的設定檔
├── README.md       # 說明文件
└── photos/         # 回憶照片資料夾
    ├── memory1.jpg
    ├── memory2.jpg
    ├── memory3.jpg
    ├── memory4.jpg
    ├── memory5.jpg
    └── memory6.jpg
```
