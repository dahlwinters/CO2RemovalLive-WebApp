var fs = require('fs');

module.exports = {
  devServer: {
    https: true,
    host: "0.0.0.0",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Access-Control-Allow-Origin, X-Requested-With, content-type, Authorization"
    },
    key: fs.readFileSync("D:/Dev/Software/firebase/FirebaseUI/sslcert/localhost.key"),
    cert: fs.readFileSync("D:/Dev/Software/firebase/FirebaseUI/sslcert/localhost.crt"),
  },

  "transpileDependencies": [
    "vuetify"
  ]
}
