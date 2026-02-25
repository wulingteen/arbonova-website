# GCP Cloud Shell Setup Script

Please open [Google Cloud Console](https://console.cloud.google.com/), select your project **valiant-memory-488306-h4**, and open **Cloud Shell** (the terminal icon `>_` at the top right). 

Then copy and paste the following commands step-by-step:

### 1. Set environment variables
```bash
export PROJECT_ID="valiant-memory-488306-h4"
export REGION="asia-east1"
export REPO_NAME="cloud-run-source-deploy"
export SA_NAME="github-actions-deploy"
export POOL_NAME="github-actions-pool"
export PROVIDER_NAME="github-actions-provider"
export GITHUB_REPO="wulingteen/arbonova-website"

gcloud config set project $PROJECT_ID
```

### 2. Enable Required APIs
```bash
gcloud services enable \
  iamcredentials.googleapis.com \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com
```

### 3. Create Artifact Registry (Docker Repo)
```bash
gcloud artifacts repositories create $REPO_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="Docker repository for Cloud Run deployments"
```

### 4. Create Service Account & Grant Roles
```bash
# Create Service Account
gcloud iam service-accounts create $SA_NAME \
  --display-name="GitHub Actions Deploy Service Account"

# Grant roles
export SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"
  
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"
```

### 5. Setup Workload Identity Federation (WIF)
```bash
# 重設環境變數
export PROJECT_ID="valiant-memory-488306-h4"
export POOL_NAME="github-actions-pool-2"  # 換一個新名稱確保不衝突
export PROVIDER_NAME="github-actions-provider-2"
export SA_NAME="github-actions-deploy"
export SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
export GITHUB_REPO="wulingteen/arbonova-website"
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# 1. 確保新建一個 Pool
gcloud iam workload-identity-pools create $POOL_NAME \
  --location="global" \
  --display-name="GitHub Actions Pool 2"

export WORKLOAD_IDENTITY_POOL_ID="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}"

# 2. 建立 OIDC Provider
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
  --location="global" \
  --workload-identity-pool=$POOL_NAME \
  --display-name="GitHub Actions Provider 2" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == '${GITHUB_REPO}'" \
  --issuer-uri="https://token.actions.githubusercontent.com"

export WORKLOAD_IDENTITY_PROVIDER_ID="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/providers/${PROVIDER_NAME}"

# 3. 授權 GitHub Actions 偽裝成 Service Account
# ⚠️ 注意：如果你在這裡遇到 PERMISSION_DENIED (iam.serviceAccounts.setIamPolicy)，
# 代表你需要請貴公司的 GCP 管理員幫你執行下面這行指令。
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${GITHUB_REPO}"
```

### 6. Output GitHub Secrets
Run this block. Copy the two outputs and add them as secrets in your GitHub Repository (`Settings > Secrets and variables > Actions > New repository secret`):

```bash
echo -e "\n\n👉 PLEASE ADD THESE TO GITHUB SECRETS (如果是請管理員代跑，請把這兩行記下來):"
echo "--------------------------------------------------"
echo "Name: GCP_SERVICE_ACCOUNT"
echo "Secret: ${SA_EMAIL}"
echo "--------------------------------------------------"
echo "Name: GCP_WORKLOAD_IDENTITY_PROVIDER"
echo "Secret: ${WORKLOAD_IDENTITY_PROVIDER_ID}"
echo "--------------------------------------------------"
```
