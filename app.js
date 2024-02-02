
const express = require("express"); 
const morgan = require("morgan"); 
const { createProxyMiddleware } = require("http-proxy-middleware"); 
require("dotenv").config(); 
const cors = require('cors');
  
// Create Express Server 
const app = express(); 

app.use(cors());
  
// Configuration 
const PORT = 3002; 
const HOST = "localhost"; 
const API_SERVICE_URL = `http://localhost:8080`; 
  
// Logging the requests 
app.use(morgan("dev")); 
  
// Proxy Logic :  Proxy endpoints 
app.use( 
    '/alfresco',
    createProxyMiddleware({ 
        target: API_SERVICE_URL, 
        changeOrigin: false,
        pathRewrite: {
            '^/alfresco/alfresco': ''
        },
        secure: false,
        logLevel: 'debug',
        onProxyRes: function (proxyRes, req, res) {
            const header = proxyRes.headers['www-authenticate'];
            if (header && header.startsWith('Basic')) {
              proxyRes.headers['www-authenticate'] = 'x' + header;
            }
          }
    }) 
); 
  
//  http://localhost:8080/alfresco/api/-default-/public/authentication/versions/1/tickets
//  http://localhost:3002/alfresco/api/-default-/public/authentication/versions/1/tickets

// Starting our Proxy server 
app.listen(PORT, HOST, () => { 
    console.log(`Starting Proxy at ${HOST}:${PORT}`); 
});