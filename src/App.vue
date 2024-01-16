<template>
  <ion-app>
    <ion-router-outlet id="main-content"> </ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

import { Device } from "@capacitor/device";

import { server_url, token } from "./variabili.js";

import { Http } from "@capacitor-community/http";

export var uuid = "";
export var account = null;

export default defineComponent({
  name: "App",
  components: {
    IonRouterOutlet,
  },

  data() {
    return {};
  },

  async mounted() {
    const self = this;
    uuid = await self.get_uuid();

    if (self.get_path() != "/authorize") {
      uuid = await self.get_uuid();

      let options = {
        url: server_url + "/api_app/irrigapp_uuid_authorized",
        headers: { token: token },
        params: { uuid: uuid },
      };

      let response = await Http.request({ ...options, method: "POST" });

      if (response.data == "403") {
        window.location.href = "/authorize";
      } else {
        let options = {
          url: server_url + "/api_app/irrigapp_get_account",
          headers: { token: token },
          params: { uuid: uuid },
        };

        if (
          self.get_path() != "/login" &&
          self.get_path() != "/login_with_qr" &&
          self.get_path() != "/authorize"
        ) {
          let response = await Http.request({ ...options, method: "POST" });

          if (response.data == "403") {
            window.location.href = "/login";
          } else {
            //console.log(account);
          }

          account = response.data;
          var tt = account.Sediatt.slice(0, -1).split("|");
          account.sedi = [];
          for (var t = 0; t < tt.length; t++) {
            let oo = { cd_sede: tt[t] };
            account.sedi.push(oo);
          }

          console.log(account);
        }
      }
    }
    /*
    if (window.location.pathname != "/login") {
      await Http.request({
        ...{
          url: server_url + "/api_app/irrigapp_get_account",
          headers: { "token": token },
          params: { uuid: uuid },
        },
        method: "POST",
      }).then((response) => {
        if (response.data != "403") {
          console.log(response.data);
          self.account = response.data;
        } else {
          window.location.href = "/login";
        }
      });
    }
    */
  },

  methods: {
    get_path() {
      return window.location.pathname;
    },
    async logout() {
      const self = this;

      await Http.request({
        ...{
          url: server_url + "/api_app/irrigapp_logout",
          headers: { token: token },
          params: { uuid: uuid },
        },
        method: "POST",
      }).then((response) => {
        window.location.href = "/login";
      });
    },
    async get_uuid() {
      return await (
        await Device.getId()
      ).uuid;
    },
  },
});
</script>
