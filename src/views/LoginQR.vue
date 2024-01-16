<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="light">
        <ion-title>Scansiona QRCode</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <qrcode-stream @decode="onDecode" @init="onInit"></qrcode-stream>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { server_url, token } from "../variabili.js";
import { uuid } from "../App.vue";
import { Http } from "@capacitor-community/http";
import { QrcodeStream } from "vue-qrcode-reader";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginQR",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    QrcodeStream,
  },

  data() {
    return {
      camera: "auto",
    };
  },
  async mounted() {
    const self = this;
  },
  methods: {
    async onInit(promise) {
      // show loading indicator

      try {
        const { capabilities } = await promise;

        // successfully initialized
      } catch (error) {
        alert(error);
      } finally {
        // hide loading indicator
      }
    },

    async onDecode(decodedString: any) {
      let options = {
        url: server_url + "/api_app/irrigapp_auth_user_qr",
        headers: { token: token },
        params: {
          uuid: uuid,
          chiave: decodedString,
        },
      };

      let response = await Http.request({ ...options, method: "POST" });

      if (response.data == "200") {
        window.location.href = "/";
      } else {
        alert(response.data);
        window.location.reload();
      }
    },
  },
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

section {
  margin: 5%;
  font-weight: bold;
}

section p {
  font-weight: bold;
  font-size: 150%;
}
</style>
