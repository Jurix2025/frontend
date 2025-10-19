# Azure Deployment Guide for Jurix Frontend

## Prerequisites

- Azure CLI installed and configured
- Docker installed and running
- Azure subscription with appropriate permissions
- Azure Web App already created with Linux container support

## Quick Deployment

### Method 1: Using the Automated Script (Recommended)

1. Make the deployment script executable:
```bash
chmod +x deploy-azure.sh
```

2. Run the deployment script:
```bash
./deploy-azure.sh
```

This script will:
- Create Azure Container Registry if it doesn't exist
- Build and push Docker image to ACR
- Configure Azure Web App to use the container
- Set all required environment variables
- Restart the Web App

### Method 2: Manual Deployment

If you prefer to deploy manually or need more control:

#### Step 1: Set Azure Subscription

```bash
az account set --subscription ef0a6e89-eeb1-4702-9baa-2286ec4a58b1
```

#### Step 2: Create Azure Container Registry (if needed)

```bash
az acr create \
  --resource-group jurix \
  --name jurix \
  --sku Basic \
  --admin-enabled true
```

#### Step 3: Login to ACR

```bash
az acr login --name jurix
```

#### Step 4: Tag and Push Docker Image

```bash
# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name jurix --query loginServer -o tsv)

# Tag the image
docker tag jurix-frontend:latest $ACR_LOGIN_SERVER/jurix-frontend:latest

# Push to ACR
docker push $ACR_LOGIN_SERVER/jurix-frontend:latest
```

#### Step 5: Configure Web App

```bash
# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name jurix --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name jurix --query "passwords[0].value" -o tsv)

# Configure container
az webapp config container set \
  --name jurix \
  --resource-group jurix \
  --docker-custom-image-name $ACR_LOGIN_SERVER/jurix-frontend:latest \
  --docker-registry-server-url https://$ACR_LOGIN_SERVER \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
```

#### Step 6: Set Environment Variables

```bash
az webapp config appsettings set \
  --name jurix \
  --resource-group jurix \
  --settings \
    NODE_ENV="production" \
    NEXT_TELEMETRY_DISABLED="1" \
    OPENAI_API_KEY="your-openai-api-key" \
    NEXT_PUBLIC_API_URL="http://34.56.99.80:8000" \
    WEBSITES_PORT="3000"
```

#### Step 7: Restart Web App

```bash
az webapp restart --name jurix --resource-group jurix
```

## Configuration Details

### Azure Resources

- **Web App Name**: jurix
- **Resource Group**: jurix
- **Container Registry**: jurix.azurecr.io
- **Subscription ID**: ef0a6e89-eeb1-4702-9baa-2286ec4a58b1

### Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | production | Node environment mode |
| `NEXT_TELEMETRY_DISABLED` | 1 | Disable Next.js telemetry |
| `OPENAI_API_KEY` | sk-proj-... | OpenAI API key for content generation |
| `NEXT_PUBLIC_API_URL` | http://34.56.99.80:8000 | Backend API endpoint |
| `WEBSITES_PORT` | 3000 | Port the container listens on |

## Accessing Your Application

After deployment, your application will be available at:
**https://jurix.azurewebsites.net**

## Monitoring and Troubleshooting

### View Live Logs

```bash
az webapp log tail --name jurix --resource-group jurix
```

### View Container Logs

```bash
az webapp log download \
  --name jurix \
  --resource-group jurix \
  --log-file logs.zip
```

### Check Deployment Status

```bash
az webapp show \
  --name jurix \
  --resource-group jurix \
  --query state
```

### Common Issues

#### Container fails to start

1. Check the logs:
```bash
az webapp log tail --name jurix --resource-group jurix
```

2. Verify environment variables are set:
```bash
az webapp config appsettings list \
  --name jurix \
  --resource-group jurix
```

3. Verify the container image is accessible:
```bash
az acr repository show \
  --name jurix \
  --image jurix-frontend:latest
```

#### Application not responding

1. Check if the Web App is running:
```bash
az webapp show --name jurix --resource-group jurix --query state
```

2. Restart the Web App:
```bash
az webapp restart --name jurix --resource-group jurix
```

3. Verify the port configuration:
```bash
az webapp config appsettings list \
  --name jurix \
  --resource-group jurix \
  --query "[?name=='WEBSITES_PORT']"
```

## Updating the Application

To deploy a new version:

1. Build the new Docker image locally:
```bash
docker build -t jurix-frontend:latest .
```

2. Run the deployment script:
```bash
./deploy-azure.sh
```

Or manually:
```bash
# Tag and push
docker tag jurix-frontend:latest jurix.azurecr.io/jurix-frontend:latest
docker push jurix.azurecr.io/jurix-frontend:latest

# Restart Web App (if continuous deployment is enabled, this happens automatically)
az webapp restart --name jurix --resource-group jurix
```

## Continuous Deployment

The deployment script enables continuous deployment from ACR. This means:
- When you push a new image with the same tag to ACR
- Azure Web App will automatically pull and deploy the new image
- No manual restart required

To disable continuous deployment:
```bash
az webapp deployment container config \
  --name jurix \
  --resource-group jurix \
  --enable-cd false
```

## Cost Optimization

- **ACR Basic SKU**: ~$5/month (includes 10 GB storage)
- **Web App**: Depends on your App Service Plan
- Consider using staging slots for testing before production

## Security Best Practices

1. **API Keys**: Never commit API keys to git. Use Azure Key Vault for sensitive data:
```bash
# Store in Key Vault
az keyvault secret set \
  --vault-name your-keyvault \
  --name openai-api-key \
  --value "your-api-key"

# Reference in Web App
az webapp config appsettings set \
  --name jurix \
  --resource-group jurix \
  --settings OPENAI_API_KEY="@Microsoft.KeyVault(SecretUri=...)"
```

2. **ACR Access**: Use managed identity instead of admin credentials in production:
```bash
az webapp identity assign \
  --name jurix \
  --resource-group jurix

# Grant ACR pull permission to Web App
az role assignment create \
  --assignee <webapp-principal-id> \
  --scope <acr-resource-id> \
  --role AcrPull
```

3. **HTTPS Only**: Ensure HTTPS is enforced:
```bash
az webapp update \
  --name jurix \
  --resource-group jurix \
  --https-only true
```

## Scaling

### Vertical Scaling (Change App Service Plan)

```bash
az appservice plan update \
  --name your-plan-name \
  --resource-group jurix \
  --sku P1V2
```

### Horizontal Scaling (Add Instances)

```bash
az appservice plan update \
  --name your-plan-name \
  --resource-group jurix \
  --number-of-workers 3
```

## Support

For issues or questions:
- Check Azure Web App logs
- Review Docker container logs
- Verify all environment variables are correctly set
- Ensure ACR credentials are valid

## Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Container Registry Documentation](https://docs.microsoft.com/en-us/azure/container-registry/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
