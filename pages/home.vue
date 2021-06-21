<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="text-center">
        <v-card-title class="headline">Home</v-card-title>
        <v-card-text>
          <Home msg="Welcome!" />

        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";


// @ is an alias to /src
import Home from "../components/Home.vue";

export default {
  name: "home",

  components: {
    Home,
  },
  methods: {

  },
};
</script>
