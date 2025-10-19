# Deployment Checklist

## Pre-Deployment Verification

- [x] Docker image built successfully (`jurix-frontend:latest`)
- [x] Next.js configured for standalone deployment
- [x] Environment variables configured
- [x] Backend communication configured (http://34.56.99.80:8000)
- [x] CORS headers configured
- [x] Deployment script created and executable

## Deployment Steps

### 1. Verify Azure CLI is Installed and Authenticated

```bash
# Check Azure CLI version
az --version

# Login to Azure (if not already logged in)
az login

# Verify you're using the correct subscription
az account show
```

### 2. Run the Deployment Script

```bash
# Make sure you're in the project directory
cd /Users/navruz/Projects/jurix/jurix-frontend

# Run the deployment script
./deploy-azure.sh
```

The script will automatically:
- Set your Azure subscription
- Create Azure Container Registry (if it doesn't exist)
- Login to ACR
- Tag and push the Docker image
- Configure Azure Web App to use the container
- Set all environment variables
- Enable continuous deployment
- Restart the Web App

### 3. Monitor Deployment

```bash
# Watch the deployment logs
az webapp log tail --name jurix --resource-group jurix
```

### 4. Verify Deployment

```bash
# Check Web App status
az webapp show --name jurix --resource-group jurix --query state

# Open the Web App in browser
az webapp browse --name jurix --resource-group jurix
```

Or visit: **https://jurix.azurewebsites.net**

### 5. Test Backend Communication

1. Open https://jurix.azurewebsites.net in your browser
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Check for any errors related to backend communication
5. Go to Network tab and verify API calls to http://34.56.99.80:8000

## Post-Deployment Verification

### Check Environment Variables

```bash
az webapp config appsettings list \
  --name jurix \
  --resource-group jurix \
  --query "[].{Name:name, Value:value}" \
  --output table
```

Expected variables:
- NODE_ENV=production
- NEXT_TELEMETRY_DISABLED=1
- OPENAI_API_KEY=sk-proj-...
- NEXT_PUBLIC_API_URL=http://34.56.99.80:8000
- WEBSITES_PORT=3000
- PORT=3000

### Check Container Status

```bash
# View container settings
az webapp config container show \
  --name jurix \
  --resource-group jurix
```

### Check Application Logs

```bash
# Stream live logs
az webapp log tail --name jurix --resource-group jurix

# Download logs
az webapp log download \
  --name jurix \
  --resource-group jurix \
  --log-file logs.zip
```

## Troubleshooting

### If Deployment Fails

1. **Check Azure CLI authentication**
   ```bash
   az account show
   ```

2. **Verify Docker image exists locally**
   ```bash
   docker images | grep jurix-frontend
   ```

3. **Check Azure subscription permissions**
   - Ensure you have Contributor role on the resource group
   - Verify the subscription ID is correct

4. **Review error messages**
   - Read the deployment script output carefully
   - Check Azure Portal for any alerts

### If Web App Doesn't Start

1. **Check container logs**
   ```bash
   az webapp log tail --name jurix --resource-group jurix
   ```

2. **Verify port configuration**
   ```bash
   az webapp config appsettings list --name jurix --resource-group jurix | grep PORT
   ```

3. **Check container health**
   ```bash
   az webapp show --name jurix --resource-group jurix --query state
   ```

4. **Restart the Web App**
   ```bash
   az webapp restart --name jurix --resource-group jurix
   ```

### If Backend Communication Fails

1. **Check for CORS errors in browser console**
   - Ensure backend has CORS enabled
   - Verify backend allows requests from https://jurix.azurewebsites.net

2. **Check for mixed content warnings**
   - Your backend is HTTP, frontend is HTTPS
   - See BACKEND_COMMUNICATION.md for solutions

3. **Test backend availability**
   ```bash
   curl http://34.56.99.80:8000
   ```

4. **Verify NEXT_PUBLIC_API_URL is set correctly**
   ```bash
   az webapp config appsettings list \
     --name jurix \
     --resource-group jurix \
     --query "[?name=='NEXT_PUBLIC_API_URL']"
   ```

## Common Issues

### Issue: "Container didn't respond to HTTP pings"

**Solution**: Check WEBSITES_PORT is set to 3000
```bash
az webapp config appsettings set \
  --name jurix \
  --resource-group jurix \
  --settings WEBSITES_PORT="3000"
```

### Issue: "Mixed content" warnings in browser

**Solution**: Either enable HTTPS on backend or use API proxy pattern (see BACKEND_COMMUNICATION.md)

### Issue: CORS errors

**Solution**: Ensure backend CORS configuration allows:
- Origin: https://jurix.azurewebsites.net
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

### Issue: Environment variables not working

**Solution**: Rebuild Docker image and redeploy
```bash
docker build -t jurix-frontend:latest .
./deploy-azure.sh
```

Note: Environment variables prefixed with `NEXT_PUBLIC_` are baked into the build, so changes require a rebuild.

## Updating the Application

When you make code changes:

1. **Rebuild Docker image**
   ```bash
   docker build -t jurix-frontend:latest .
   ```

2. **Redeploy**
   ```bash
   ./deploy-azure.sh
   ```

This will automatically:
- Push new image to ACR
- Update Web App configuration
- Restart with new image

## Performance Optimization

### Enable Application Insights

```bash
az webapp config appsettings set \
  --name jurix \
  --resource-group jurix \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="your-key"
```

### Enable CDN (Optional)

For better performance, consider using Azure CDN for static assets.

### Scale Up/Out

```bash
# Scale up (better VM)
az appservice plan update \
  --name your-plan \
  --resource-group jurix \
  --sku P1V2

# Scale out (more instances)
az appservice plan update \
  --name your-plan \
  --resource-group jurix \
  --number-of-workers 2
```

## Security Recommendations

1. **Move API keys to Azure Key Vault**
   ```bash
   # Create Key Vault
   az keyvault create \
     --name jurix-vault \
     --resource-group jurix \
     --location eastus

   # Store secret
   az keyvault secret set \
     --vault-name jurix-vault \
     --name openai-api-key \
     --value "your-api-key"

   # Reference in Web App
   az webapp config appsettings set \
     --name jurix \
     --resource-group jurix \
     --settings OPENAI_API_KEY="@Microsoft.KeyVault(SecretUri=...)"
   ```

2. **Enable HTTPS only**
   ```bash
   az webapp update \
     --name jurix \
     --resource-group jurix \
     --https-only true
   ```

3. **Restrict backend CORS** - Don't use `*`, specify exact origins

4. **Enable Web App Firewall** - Restrict access to specific IPs if needed

## Resources

- Deployment script: `deploy-azure.sh`
- Backend communication guide: `BACKEND_COMMUNICATION.md`
- Full Azure deployment guide: `AZURE_DEPLOYMENT.md`
- Docker documentation: `DEPLOYMENT.md`

## Support

If you encounter issues:
1. Check the logs: `az webapp log tail --name jurix --resource-group jurix`
2. Review Azure Portal for alerts
3. Verify all environment variables are set correctly
4. Test backend connectivity separately

---

**Ready to deploy?** Run: `./deploy-azure.sh`
