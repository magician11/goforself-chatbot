const express = require('express');
const https = require('https');
const rpn = require('request-promise-native');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./ssl-config.json'); // path to location of SSL data

const app = express();
app.use(cors());

// start up the port based on the environment it's being run in (NODE_ENV)
const environment = app.get('env');
const port = 6932;

// be able to parse post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/query', async (req, res) => {
  const queryText = req.query.text;
  const nluOfText = await rpn({
    uri: `http://localhost:5000/parse?q=${queryText}`,
    json: true
  });

  const responseForClient = {
    originalText: queryText,
    intent: nluOfText.intent.name,
    confidenceOfThisIntent: nluOfText.intent.confidence,
    entitiesInText: nluOfText.entities
  };

  console.log(`Responding on ${new Date().toString()}`);
  console.log(responseForClient);
  res.json(responseForClient);
});

// setup encryption dependent on whether we're running this locally or on our server
const welcomeMesssage = `Go For Self bot server started at ${new Date().toString()} listening on port ${port} [${environment} - ${environment ===
'production'
  ? 'https'
  : 'http'}]`;

if (environment === 'production') {
  // encrypt connections
  const sslPath = config.sslPath;
  const sslOptions = {
    key: fs.readFileSync(`${sslPath}privkey.pem`),
    cert: fs.readFileSync(`${sslPath}fullchain.pem`),
    ca: fs.readFileSync(`${sslPath}chain.pem`)
  };

  // startup the https server
  https.createServer(sslOptions, app).listen(port, () => {
    console.log(welcomeMesssage);
  });
} else if (environment === 'development') {
  // startup the http server
  app.listen(port, () => {
    console.log(welcomeMesssage);
  });
}
