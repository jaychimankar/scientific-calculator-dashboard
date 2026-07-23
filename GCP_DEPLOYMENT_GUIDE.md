# Google Cloud Hosting Guide - OmniCalc Studio

This project is fully equipped with Google Cloud Platform (GCP) configurations for both **Google App Engine** and **Google Cloud Run**.

---

## Quick Deployment via PowerShell Script

Run the included automated deployment script:

```powershell
# Deploy to Google App Engine
.\deploy-gcp.ps1 -Target appengine -ProjectId "your-gcp-project-id"

# Deploy to Google Cloud Run
.\deploy-gcp.ps1 -Target cloudrun -ProjectId "your-gcp-project-id"
```

---

## Manual Deployment Options

### Option A: Deploy to Google App Engine (Static Hosting)

1. **Authenticate Google Cloud SDK:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Build Production React Bundle:**
   ```bash
   npm run build
   ```

3. **Deploy using `app.yaml`:**
   ```bash
   gcloud app deploy app.yaml --quiet
   ```

4. **Launch Application:**
   ```bash
   gcloud app browse
   ```

---

### Option B: Deploy to Google Cloud Run (Containerized)

1. **Submit Container Build to Google Cloud Container Registry (GCR):**
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/omnicalc-dashboard
   ```

2. **Deploy Service to Cloud Run:**
   ```bash
   gcloud run deploy omnicalc-dashboard \
     --image gcr.io/YOUR_PROJECT_ID/omnicalc-dashboard \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Output:**
   Cloud Run will return your live public HTTPS URL (e.g. `https://omnicalc-dashboard-xyz-uc.a.run.app`).
