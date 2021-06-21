const { Nuxt, Builder } = require('nuxt')
const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const forceSsl = require('express-force-ssl')
const isProd = (process.env.NODE_ENV === 'production')
const port = process.env.PORT || 3001

const api = require("./server-middleware/api.ts");

const app = module.exports = express()

// We instantiate nuxt.js with the options
const confignuxt = require('./nuxt.config.js')
config.dev = !isProd

async function start() {
  const nuxt = new Nuxt(confignuxt)
  const { host, port } = nuxt.options.server

  const options = {
    key: fs.readFileSync('sslcert/localhost.key'),
    cert: fs.readFileSync('sslcert/localhost.crt')
  };


  // Render every route with Nuxt.js

  // Build only in dev mode with hot-reloading
  /*
  if (config.dev) {
    new Builder(nuxt).build()
      .then(listen)
      .catch((error) => {
        console.error(error)
        //process.exit(1)
      })
  }
  else {
    listen()
  }
  */

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  //Give nuxt middleware to express
  app.use(nuxt.render.use(forceSsl))
  app.use(api)

  https
    .createServer(options, app)
    .listen(port)

  console.log('The server is listening on `localhost:' + port + '`.')

}

start()

/*
function listen() {

  const options = {
    key: fs.readFileSync('sslcert/localhost.key'),
    cert: fs.readFileSync('sslcert/localhost.crt')
  };

  https
    .createServer(options, nuxt.render.use(forceSsl))
    .listen(3001)
  console.log('https server listening on `localhost:' + '3001' + '`.')

  http
    .createServer(options, nuxt.render.use(forceSsl))
    .listen(3000)
  console.log('http server listening on `localhost:' + '3000' + '`.')
}
*/
