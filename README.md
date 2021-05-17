# Node.JS example with MySQL and AAD

Be sure to rename `config_sample.json` to `config.json` with your app specific settings.

## Setup config.json

```json
{
    "REDIRECT_URI": "http://localhost:3000/redirect", // AAD Redirect URI
    "APPINSIGHTS_KEY": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // App Insights Instrumentation Key
    "mysql_pool_info": { // MySQL connection info
        "connectionLimit": 10,
        "host": "xxxx",
        "user": "xxxx",
        "password": "xxxx",
        "database": "xxxx"
    },
    "msal_config": { // MSAL AAD settings, clientId and clientSecret
        "auth": {
            "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "authority": "https://login.microsoftonline.com/common",
            "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }
    }
}
```

## Deploying to Kubernetes

```sh
kubectl apply -f aksnodemsal-deployment.yaml
kubectl apply -f aksnodemsal-service.yaml
```