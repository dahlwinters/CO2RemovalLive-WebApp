<template>

  <v-container>
    <v-row align="center">
      <v-col align="left">

        <v-card elevation="2">
          <v-card-title class="headline">GeoJSON Data</v-card-title>
          <v-card-subtitle>Data for the map</v-card-subtitle>
          <v-card-text>{{jdata}}</v-card-text>
        </v-card>
        <br />

        <v-card elevation="2">
          <v-card-title class="headline">CSV Data</v-card-title>
          <v-card-subtitle>Data for the chart</v-card-subtitle>
          <v-card-text>{{csvdata}}</v-card-text>
        </v-card>
        <br />

        <v-btn @click="fetch"><a class="subheading mx-3">Fetch</a></v-btn>




      </v-col>
    </v-row>

    <v-spacer><br /></v-spacer>


    <no-ssr>
      <l-map :zoom="zoom" :center="center">
          <l-tile-layer :url="url"/>
          <l-marker :lat-lng="marker"/>
          <l-icon-default :image-path="path"/>
      </l-map>
    </no-ssr>
    <!--
    <div>
    <client-only>
      <div>
        <span v-if="loading">Loading...</span>
        <label for="checkbox">GeoJSON Visibility</label>
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
        <input
          v-model="fillColor"
          type="color"
        >
        <br>
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
    </div>
  -->
  </v-container>





</template>

<script>

import axios from "axios";
import { mapMutations } from "vuex";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LGeoJson } from "vue2-leaflet";

//let Vue2Leaflet = {};
if (!process.env.SERVER) {
  console.log('loading vue2-leaflet')
  //Vue2Leaflet = require('vue2-leaflet')
}


export default {
  name: "Home",
  components: {
    'l-map': Vue2Leaflet.LMap,
    'l-tile-layer': Vue2Leaflet.LTileLayer,
    'l-marker': Vue2Leaflet.LMarker,
    'l-geojson': Vue2Leaflet.LGeoJson
  },
  props: {
    msg: String,
  },
  data: function() {
    return {
      datestr: '2021-06-17T21:44:00',
      jdata: '[]',
      csvdata: '[]',
      options: '[]',
      margin: '[]',
      lazy: true,

      loading: false,
      show: true,
      enableTooltip: true,
      zoom: 6,
      center: [48, -1.219482],
      geojson: null,
      fillColor: "#e4ce7f",
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: latLng(47.41322, -1.219482)
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
          "<div>code:" +
            feature.properties.code +
            "</div><div>nom: " +
            feature.properties.nom +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
    }
  },

  async created() {
    this.loading = true;
    const response = await fetch("https://rawgit.com/gregoiredavid/france-geojson/master/regions/pays-de-la-loire/communes-pays-de-la-loire.geojson")
    const data = await response.json();
    this.geojson = data;
    this.loading = false;
  },

  methods: {
    async fetch() {

      self = this;
      console.log("datestr = ", this.datestr);
      axios({
        url: "/api/v1/fetchddb",
        method: "POST",
        data: {dateseg: this.datestr},
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      }).then(function (resp) {
        console.log("console printout = ", resp.data);
        self.jdata = JSON.stringify(resp.data.data);
        self.csvdata = JSON.stringify(resp.data.csv);
        //window.location.href = resp.data;
      }).catch(function(error) {
        console.log(error);
      })

      this.jdata = self.jdata;
      this.csvdata = self.csvdata;
    }

  },


  ready() {
    this.makeWindow();
  },


}

</script>
