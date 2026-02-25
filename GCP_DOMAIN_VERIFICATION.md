# 網域驗證指南 (Google Search Console)

因為您的 GCP 專案還是全新的，Google 不知道 `arbonova.com.tw` 這個網址是不是真的是你們公司的，所以它用 `The provided domain does not appear to be verified` 擋下了請求。

我們必須先向 Google 證明「這個網域是我的」。這個動作稱為「網域驗證 (Domain Verification)」。

請依照以下 3 個步驟進行：

### 第一步：前往 Google Search Console 取得驗證碼

Google 最近更新了驗證介面！請點擊這個連結前往新版的 Search Console：
👉 **[Google Search Console 新增資源](https://search.google.com/search-console/welcome)**

*(請確保你登入的 Google 帳號，就是你用來開 GCP Project 的那個帳號)*

### 第二步：新增網域並複製 TXT 紀錄

1. 進入畫面後，你會看到左右兩個選項（「網域」與「網址前置字元」）。
2. 請選擇左邊的 **「網域 (Domain)」**。
3. 在輸入框填入：`arbonova.com.tw`，然後點擊「繼續 (Continue)」。
4. 接著會跳出一個視窗，請找到步驟 2，它會給你一串以 `google-site-verification=` 開頭的隨機密碼（這就是你的驗證碼）。
5. **點擊密碼旁邊的「複製 (Copy)」按鈕，把這整串拷貝下來。**

*(不要把這個視窗關掉！)*

### 第三步：去你們的 DNS 代管商新增 TXT 紀錄

請登入你們公司管理網域的後台 (例如 Cloudflare, GoDaddy, HiNet DNS 等)，新增一筆 DNS 紀錄：

- **紀錄類型 (Type)**：`TXT`
- **名稱/主機 (Name/Host)**：`@` (有些平台要求留空，代表根網域)
- **值/目標 (Value/Target)**：貼上你剛剛複製的那串 `google-site-verification=...`

---

存檔後，回到剛剛 Google Webmaster Central 的網頁，點擊最下方的 **「驗證 (Verify)」** 按鈕。

*(註：DNS 生效可能需要幾分鐘，如果點了失敗，等個 5 分鐘再點一次通常就會過了)*

**當網頁顯示驗證成功後，請告訴我，我們就能回去跑剛才那行綁定指令了！**
