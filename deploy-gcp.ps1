# Google Cloud Platform Deployment Script (PowerShell)
param(
    [string]$Target = "appengine", # "appengine" or "cloudrun"
    [string]$ProjectId = ""
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "OmniCalc Studio - GCP Deployment Helper" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Google Cloud SDK (gcloud) is not found in PATH." -ForegroundColor Red
    Write-Host "Please install GCP SDK or restart your terminal after installation." -ForegroundColor Yellow
    exit 1
}

# Prompt for Project ID if not supplied
if ($ProjectId -eq "") {
    $ProjectId = Read-Host "Enter your Google Cloud Project ID"
}

if ($ProjectId -eq "") {
    Write-Host "Error: Project ID is required." -ForegroundColor Red
    exit 1
}

Write-Host "`nSetting active GCP Project to: $ProjectId..." -ForegroundColor Green
gcloud config set project $ProjectId

# Building project
Write-Host "`nBuilding React Vite production assets..." -ForegroundColor Green
npm run build

if ($Target -eq "appengine") {
    Write-Host "`nDeploying to Google App Engine..." -ForegroundColor Cyan
    gcloud app deploy app.yaml --quiet
    Write-Host "`nDeployment Complete! Opening App Engine URL..." -ForegroundColor Green
    gcloud app browse
} elseif ($Target -eq "cloudrun") {
    Write-Host "`nSubmitting Container Build to Cloud Build..." -ForegroundColor Cyan
    gcloud builds submit --tag "gcr.io/$ProjectId/omnicalc-dashboard"
    
    Write-Host "`nDeploying Container to Google Cloud Run..." -ForegroundColor Cyan
    gcloud run deploy omnicalc-dashboard --image "gcr.io/$ProjectId/omnicalc-dashboard" --platform managed --allow-unauthenticated --region us-central1
} else {
    Write-Host "Unknown target option. Use 'appengine' or 'cloudrun'." -ForegroundColor Red
}
