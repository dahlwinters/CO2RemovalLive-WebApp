<template>
  <v-app dark>

    <v-app-bar color="#003EFF" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"  color="#ffffff" />


    <v-spacer />
    <v-toolbar dark>
      <v-toolbar-title v-text="title" />
    </v-toolbar>

      <v-spacer />

      <div style="color:#ffffff">Enabling the Real-Time Carbon Market</div>


      <br>
      <v-spacer />
      <div class="d-flex align-center">

      </div>

      <v-spacer></v-spacer>
      <!--<v-btn icon @click.stop="rightDrawer = !rightDrawer" color="#ffffff">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    -->


    </v-app-bar>

    <v-main>
      <client-only>

        <!--
        <l-map :zoom="zoom" :center="center">
            <l-tile-layer :url="url"/>
            <l-marker :lat-lng="marker"/>
            <l-icon-default :image-path="path"/>
        </l-map>
      -->

      <div>
        <span v-if="loading">Loading...</span>
        <p><br></p>
        <center><label for="checkbox">CO2 Measurement Layer Visibility</label>
        <input
          id="checkbox"
          v-model="show"
          type="checkbox"
        >
        <label for="checkboxTooltip">Enable tooltip</label>
        <input
          id="checkboxTooltip"
          v-model="enableTooltip"
          type="checkbox"
        >
      </center>
        <!--<input
          v-model="fillColor"
          type="color"
        >-->
        <p><br></p>
      </div>
      <l-map
        :zoom="zoom"
        :center="center"
        style="height: 500px; width: 100%"
      >
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        />
        <l-geo-json
          v-if="show"
          :geojson="geojson"
          :options="options"
          :options-style="styleFunction"
        />
        <l-marker :lat-lng="marker" />
      </l-map>

      </client-only>



      <v-container v-show="cardvisible">

        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8">
            <v-card>
              <v-card-title class="headline">Welcome!</v-card-title>
              <v-card-text>

                CO2Removal.live is a web app intended to display automatically
                reported CO2 concentrations from live carbon removal devices in real time. <br><br>

                <p><b>Enabling Carbon Credit Transactions</b></p>

                If you are accessing this instance from a 5G Verizon phone in the Denver area,
                you are being served with the lowest latencies possible through AWS Wavelength. These low
                latencies will allow the construction of future applications that will
                be able to determine trends in carbon removal amounts, and allow users
                to buy or sell carbon credits using those trends.<br><br>

                <p><b>Behind the Scenes</b></p>

                <p><u>Data Ingestion</u></p>
                AWS IoT Core is used to collect incoming data from Wi-Fi or Bluetooth enabled CO2
                sensors. This was tested with a Sensirion SCD40 sensor connected to an Adafruit
                Bluefruit LE Feather M0 device that outputs a CO2 concentration value via Bluetooth to an Android cell
                phone acting as a wireless gateway.<br><br>

                <p><u>Data Collection</u></p>
                To simulate a large quantity of such devices over a large
                geographic area, we have generated data trends using an EventBridge-initiated AWS Lambda function
                outputting to DynamoDB. This application reads from DynamoDB and displays
                the latest data on this dashboard which resides inside an AWS Wavelength
                Zone. <br><br>

                Click the button below to hide this introductory window.

              </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" @click="hidecard"> Hide </v-btn>
                </v-card-actions>

            </v-card>
          </v-col>
        </v-row>

        <!--<nuxt />-->
      </v-container>
    </v-main>
    <!--
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  -->

  </v-app>
</template>

<script>

import axios from "axios";

let Vue2Leaflet = {}
if (process.client)
    Vue2Leaflet = require('vue2-leaflet')

export default {
  middleware(context) {
    //console.log(context);
    const { store, redirect } = context;
    // If the user is not authenticated
    let user = store.state.user;
    if (user) this.user = user;
  },
  activated() {
    if (this.$fetchState.timestamp <= Date.now() - 30000) {
      this.$fetch();
    }
  },
  components: {
      'l-map': Vue2Leaflet.LMap,
      'l-tile-layer': Vue2Leaflet.LTileLayer,
      'l-marker': Vue2Leaflet.LMarker
  },
  async fetch() {
    if (this.user) {
      this.items = this.items.concat(
        {
          icon: "mdi-pencil",
          title: "Generate Sig",
          to: "/sig/generate",
        },
        {
          icon: "mdi-pencil-box-outline",
          title: "Verify Sig",
          to: "/sig/verify",
        },
        {
          icon: "mdi-account",
          title: "My Account",
          to: "/account",
        }
      );
    }
  },
  computed: {
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    styleFunction() {
      const fillColor = this.fillColor; // important! need touch fillColor in computed for re-calculate when change fillColor
      return () => {
        return {
          weight: 2,
          color: "#ECEFF1",
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: 1
        };
      };
    },
    onEachFeatureFunction() {
      if (!this.enableTooltip) {
        return () => {};
      }
      return (feature, layer) => {
        layer.bindTooltip(
          "<div>Date:" +
            feature.properties.Date +
            "</div><div>Address: " +
            feature.properties.Num + " " + feature.properties.St + " " + feature.properties.Unit +
            "</div><div>CO2 Measurement: " +
            feature.properties.Value +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
    }
  },
  async mounted() {
    this.loading = true;
    //const response = await fetch("https://rawgit.com/gregoiredavid/france-geojson/master/regions/pays-de-la-loire/communes-pays-de-la-loire.geojson")
    //const data = await response.json();
    //this.geojson = data;

    self = this;
    console.log("datestr = ", this.datestr);
    await axios({
      url: "/api/v1/fetchddb",
      method: "POST",
      data: {dateseg: this.datestr},
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    }).then(function (resp) {
      //console.log("console printout = ", resp.data);
      self.jdata = JSON.stringify(resp.data.data);
      self.csvdata = JSON.stringify(resp.data.csv);
      //window.location.href = resp.data;
    }).catch(function(error) {
      console.log(error);
    })

    this.geojson = JSON.parse(self.jdata);
    this.csvdata = self.csvdata;

    this.loading = false;

  },
  methods: {
    async hidecard() {
      this.cardvisible = false;
    }
  },
  data() {
    return {
      user: null,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-login-variant",
          title: "Login",
          to: "/login",
        },
        {
          icon: "mdi-account-plus",
          title: "Register",
          to: "/sign-up",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "CO2Removal.live",

      datestr: '2021-06-17T21:44:00',
      jdata: '[]',
      csvdata: '[]',
      //options: '[]',
      margin: '[]',
      lazy: true,

      loading: false,
      show: true,
      enableTooltip: true,
      zoom: 10,
      center: [39.742043, -104.991531],
      geojson: null,
      fillColor: "#e4ce7f",
      path: '/images/',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: (process.client)?L.latLng(39.742043, -104.991531):null,

      cardvisible: true,
    };
  },
};
</script>


<style>
#app {
  background: url('assets/blue-5136251_1920.jpg')
    no-repeat right center fixed !important;
  background-size: cover;
}
.v-navigation-drawer {
  opacity: 0.7;
}
</style>
