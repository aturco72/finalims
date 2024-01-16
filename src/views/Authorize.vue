<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="light">
        <ion-title>Autorizza dispositivo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <form novalidate>
        <section>
          <p style="font-size: 14px; padding: 20px">
            Questo dispositivo risulta non autorizzato, rivolgiti al tuo
            capoazienda per autorizzarlo.
          </p>
          <ion-item>
            <ion-input
              placeholder="Authcode"
              type="password"
              :value="authcode"
              :rules="{ required: true, min: 6 }"
              @ionInput="authcode = $event.target.value"
            ></ion-input>
          </ion-item>
          <br /><br /><br />

          <ion-button
            expand="block"
            color="primary"
            style="padding-left: 25px; padding-right: 25px"
            v-on:click="authorize()"
            >Autorizza dispositivo</ion-button
          >
        </section>
      </form>
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
  name: "Authorize",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },

  data() {
    return {
      authcode: "Giovanne",
    };
  },

  methods: {
    async authorize() {
      const self = this;
      console.log(self.authcode);
      let options = {
        headers: { token: token },
        url: server_url + "/api_app/agriapp_uuid_authorize",
        params: { uuid: uuid, authcode: self.authcode },
      };

      let response = await Http.request({ ...options, method: "POST" });

      if (response.data == "403") {
        alert(
          "Il dispositivo va autorizzato tramite una procedura interna, contatta un admin."
        );
      } else {
        window.location.href = "/login";
      }
    },
  },
});
</script>
