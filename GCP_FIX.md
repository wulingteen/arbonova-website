# 最終修正版 WIF Provider 與綁定指令

在你的 Cloud Shell 執行這整段：

```bash
export PROJECT_ID="valiant-memory-488306-h4"
export POOL_NAME="github-actions2-pool"  # 這是 GCP 裡面真正建出來的名字
export PROVIDER_NAME="github-actions-provider"
export SA_NAME="github-actions-deploy"
export SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
export GITHUB_REPO="wulingteen/arbonova-website"
export PROJECT_NUMBER="487079191712"

export WORKLOAD_IDENTITY_POOL_ID="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}"

# 1. 在現有的 Pool 中建立 OIDC Provider
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
  --location="global" \
  --workload-identity-pool=$POOL_NAME \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == '${GITHUB_REPO}'" \
  --issuer-uri="https://token.actions.githubusercontent.com"

export WORKLOAD_IDENTITY_PROVIDER_ID="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/providers/${PROVIDER_NAME}"

# 2. 授權 GitHub Actions 偽裝成 Service Account 
# (此步驟一樣需要 GCP 管理員權限，如果出現 setIamPolicy 錯誤，請整段交給管理員跑)
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${GITHUB_REPO}"

echo -e "\n\n👉 PLEASE ADD THIS TO GITHUB SECRETS (覆寫原本的 PROVIDER Secret):"
echo "--------------------------------------------------"
echo "Name: GCP_WORKLOAD_IDENTITY_PROVIDER"
echo "Secret: ${WORKLOAD_IDENTITY_PROVIDER_ID}"
echo "--------------------------------------------------"
```
