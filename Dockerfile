# ==========================================
# Stage 1: Build the Vite project
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# 先複製 package.json 進行安裝 (利用 Docker Cache 機制)
COPY package*.json ./
RUN npm install

# 複製其他原始碼並進行建置
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve the app with Nginx
# ==========================================
FROM nginx:alpine

# Cloud Run 預設要求 container 聽 8080 port，我們用自訂的 nginx.conf 去覆蓋
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 刪除原有的 nginx 預設 html
RUN rm -rf /usr/share/nginx/html/*

# 將 Stage 1 編譯出的 dist 資料夾放入 Nginx 的 serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run 預設就是 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
