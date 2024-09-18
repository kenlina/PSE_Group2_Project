# Project content

這個project提供了拍賣合約連結到web app的功能

## 預處理步驟

首先，你需要安裝合約和Web應用的相依性。

1. 進入 `contracts` 目錄並安裝依賴：
    ```bash
    cd contracts
    npm install
    ```

2. 進入 `web-ts` 目錄並安裝依賴：
    ```bash
    cd web-ts
    npm install
    ```

## 運行 Web App

接下來，啟動合約節點和佈署合約，然後運行 Web 應用。

### 先開啟合約節點

1. 進入 `contracts` 目錄：
    ```bash
    cd contracts
    ```

2. 啟動 Hardhat 節點：
    ```bash
    npx hardhat node
    ```

3. 在新的終端機視窗，執行以下命令以佈署合約到本地網路：
    ```bash
    npx hardhat ignition deploy ./ignition/modules/Auction.js --network localhost
    ```

### 運行 Web 應用

1. 在另一個終端機視窗，進入 `web-ts` 目錄：
    ```bash
    cd ../web-ts
    ```

2. 啟動開發服務器：
    ```bash
    npm run dev
    ```

3. 開啟瀏覽器並訪問 [localhost:3000](http://localhost:3000) 以查看應用。

