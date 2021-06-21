const { Nuxt, Builder } = require('nuxt')
const express = require('express')
const https = require('https')
const fs = require('fs')
const forceSsl = require('express-force-ssl')
const isProd = (process.env.NODE_ENV === 'production')
const port = process.env.PORT || 3000

const confignuxt = require('./nuxt.config.ts')

const app = module.exports = express()

const configDev = !isProd

async function start() {
  //const nuxtConfig = await import('nuxt.config')
  const nuxt = new Nuxt(confignuxt)
  var { host, port } = nuxt.options.server

  //DW - absolutely important to have here - otherwise we get requests that never complete
  await nuxt.ready()

  // Build only in dev mode

  if (configDev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  //Give nuxt middleware to express
  app.use(nuxt.render.use(forceSsl))

  host = '0.0.0.0'
  https.createServer(nuxt.options.server.https, app).listen(port, host);

  console.log('The server is listening on `localhost:' + port + '`.')

}

start()
