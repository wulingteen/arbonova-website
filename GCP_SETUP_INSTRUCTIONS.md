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
# Create Workload Identity Pool
gcloud iam workload-identity-pools create $POOL_NAME \
  --location="global" \
  --display-name="GitHub Actions Pool"

export WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe $POOL_NAME \
  --location="global" \
  --format="value(name)")

# Create OIDC Provider
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
  --location="global" \
  --workload-identity-pool=$POOL_NAME \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

export WORKLOAD_IDENTITY_PROVIDER_ID=$(gcloud iam workload-identity-pools providers describe $PROVIDER_NAME \
  --location="global" \
  --workload-identity-pool=$POOL_NAME \
  --format="value(name)")

# Allow GitHub Actions to impersonate the Service Account
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${GITHUB_REPO}"
```

### 6. Output GitHub Secrets
Run this block. Copy the two outputs and add them as secrets in your GitHub Repository (`Settings > Secrets and variables > Actions > New repository secret`):

```bash
echo -e "\n\n👉 PLEASE ADD THESE TO GITHUB SECRETS:"
echo "--------------------------------------------------"
echo "Name: GCP_SERVICE_ACCOUNT"
echo "Secret: ${SA_EMAIL}"
echo "--------------------------------------------------"
echo "Name: GCP_WORKLOAD_IDENTITY_PROVIDER"
echo "Secret: ${WORKLOAD_IDENTITY_PROVIDER_ID}"
echo "--------------------------------------------------"
```
