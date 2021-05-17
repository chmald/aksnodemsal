const express = require('express')
const mysql = require('mysql')
const msal = require('@azure/msal-node')
const appInsights = require('applicationinsights')

const app = express()
const port = process.env.PORT || 3000;

const config = require('./config')

const mysql_pool = mysql.createPool(config.mysql_pool_info)
const cca = new msal.ConfidentialClientApplication(config.msal_config)

appInsights.setup(config.APPINSIGHTS_KEY)
    .setSendLiveMetrics(true)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .start()

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.get('/db', (req, res) => {
    mysql_pool.query('SELECT * from posts LIMIT 100', function(error, results, fields) {
        if(error) {
            res.sendStatus(500).send("App Error")
            throw error
        }

        res.json(results)
    })
})

app.get('/auth', (req, res) => {
    const authParams = {
        scopes: ["user.read"],
        redirectUri: config.REDIRECT_URI
    }
    cca.getAuthCodeUrl(authParams).then((response) => {
        res.redirect(response)
    }).catch((error) => console.log(JSON.stringify(error)))
})

app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: config.REDIRECT_URI
    }

    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response)
        res.send(`Welcome, ${response.account.name}!`)
    }).catch((error) => {
        console.log(error)
        res.status(500).send(error)
    })
})

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
})