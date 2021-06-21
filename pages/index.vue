<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
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
          geographic area, we have generated data trends using an EC2 instance
          outputting to DynamoDB. This application reads from DynamoDB and displays
          the latest data on this dashboard which resides inside an AWS Wavelength
          Zone. <br><br>

          Click the button below to hide this introductory window.

        </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary"> Hide </v-btn>
          </v-card-actions>

      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  components: {},

  methods: {

  },
};
</script>
