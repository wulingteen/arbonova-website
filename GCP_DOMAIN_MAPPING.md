# 綁定 GCP Cloud Run 自訂網域 (Shell Script 腳本)

雖然在 GCP 網頁點一點最直覺，但如果你想用 Cloud Shell 用指令跑，請複製底下的腳本並在 **Cloud Shell** 中執行：

⚠️ **前提：** 你必須已經在「Google Search Console」驗證過你對該網域的擁有權。

```bash
# =========================================================
# 📝 請先修改以下這三個變數，填入你們實際的狀況
# =========================================================
export PROJECT_ID="valiant-memory-488306-h4"
export SERVICE_NAME="arbonova-website"
export REGION="asia-east1"

# 1. 你想綁定的網址
export CUSTOM_DOMAIN="www.arbonova.com.tw" 
# =========================================================

# 開始綁定網域到 Cloud Run 服務
echo "正在將 $CUSTOM_DOMAIN 綁定到 Cloud Run 服務 $SERVICE_NAME..."

gcloud beta run domain-mappings create \
  --service=$SERVICE_NAME \
  --domain=$CUSTOM_DOMAIN \
  --region=$REGION \
  --project=$PROJECT_ID

echo -e "\n✅ 綁定指令已送出！"
echo "--------------------------------------------------------"
echo "👉 接下來你必須到你買網址的地方 (DNS 代管商) 加入一筆紀錄："
```

### 執行後的下一步
腳本跑完後，終端機通常會印出類似下面的資訊告訴你 DNS 要怎麼設：

如果你是用 `www.arbonova.com.tw` (子網域)：
```text
record type: CNAME
name: www
content/value: ghs.googlehosted.com.
```

如果你是用 `arbonova.com.tw` (主網域)：
```text
record type: A
name: @
content/value: (4個不同的 IP 地址)

record type: AAAA
name: @
content/value: (4個不同的 IPv6 地址)
```

請拿著它印出來的結果，登入你們公司的 DNS 後台（例如 GoDaddy、Cloudflare 等）把紀錄填進去，然後等待大約 15~30 分鐘，Google 就會自動幫你簽發 SSL 安全憑證並讓網址生效了！
