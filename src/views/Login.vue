<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="light">
        <ion-title>Accedi al tuo account</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section>
        <svg
          style="
            width: 40%;
            margin-left: 30%;
            padding: 25px;
            padding-bottom: 50px;
          "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 186 255"
          class="w-16 h-16"
        >
          <path
            d="M100 5v214h1v3h1l1 3c3.117.67 4.578 2.896 7 4h3v1c3.792 1.88 6.83 1.423 8 6 1.583 1.705 1.096 6.727 1 10l-3 2v1h-2v1h-4v1H81c-25.47 0-53.146.178-77-1l-3-4H0v-9c1.14-1.14.398-.004 1-2l4-3v-1c4.862-3.282 11.094-2.17 12-10 1.908-2.2 1-9.108 1-13V87c0-18.135.56-38.483-1-55l-4-3v-1h-2v-1H9v-1H7v-1H5l-5-6v-9c3.146-1.873 2.838-3.7 8-4 2.485-2.173 18.937-1 24-1h68zm12 0h74v44c0 9.28.395 20.283-1 28l-3 2v1h-2v1c-3.212 1.174-10.1-1.89-11-3v-2l-2-1-1-3h-1v-3h-1l-1-4h-1v-3h-1l-1-4h-1l-1-4-2-1v-2c-7.617-10.842-26.4-22.075-44-23V5zm40 72c.733 2.942 1.663 2.264 2 3v4h1v25c0 20.014 1.318 44.187-2 61-4.073 2.366-3.755 3.073-11 3-1.14-1.14-.004-.398-2-1l-2-3h-1l-2-6h-1v-3h-1l-1-5h-1l-1-4h-1v-3l-2-1v-2l-7-6h-2v-1l-6-2v-23c7.76-3.225 14.632-6.52 18-14v-3h1v-2h1v-3h1v-2h1v-3h1c2.238-4.566 2.666-8.564 8-10v-1h5c1.166 1.36 1.825 1.528 4 2z"
            fill="#c52020"
            fill-rule="evenodd"
          ></path>
        </svg>
        <br /><br />

        <ion-item>
          <ion-input
            placeholder="Username"
            :value="username"
            :rules="{ required: true, min: 6 }"
            @ionInput="username = $event.target.value"
          ></ion-input>
        </ion-item>
        <br />

        <ion-item>
          <ion-input
            placeholder="Password"
            type="password"
            :value="password"
            :rules="{ required: true, min: 6 }"
            @ionInput="password = $event.target.value"
          ></ion-input>
        </ion-item>

        <br /><br /><br />

        <ion-button
          v-on:click="auth()"
          expand="block"
          color="primary"
          style="padding-left: 25px; padding-right: 25px"
          >Accedi</ion-button
        >
        <ion-button
          v-on:click="login_with_qr()"
          expand="block"
          color="light"
          style="padding-left: 25px; padding-right: 25px"
          >Scansione QRCode</ion-button
        >
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { server_url, token } from "../variabili.js";
import { uuid } from "../App.vue";
import { Http } from "@capacitor-community/http";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },

  data() {
    return {
      username: "",
      password: "",
    };
  },
  async mounted() {
    const self = this;
  },
  methods: {
    async auth() {
      const self = this;

      let options = {
        url: server_url + "/api_app/agriapp_auth_user",
        headers: { token: token },
        params: {
          uuid: uuid,
          username: self.username,
          password: self.password,
        },
      };

      let response = await Http.request({ ...options, method: "POST" });

      if (response.data == "403") {
        alert("Nome utente o password errata");
      } else {
        window.location.href = "/";
      }
    },

    login_with_qr() {
      window.location.href = "/login_with_qr";
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
