<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="danger">
        <ion-buttons slot="start">
          <ion-button> 8.3 </ion-button>
        </ion-buttons>
        <ion-title v-if="user && user.id_operatore != 0">{{
          user.username
        }}</ion-title>
        <ion-title v-else-if="user && user.username != ''">{{
          user.username
        }}</ion-title>
        <ion-title v-else-if="!user">Ottengo info utente...</ion-title>
        <ion-title v-else>NO NAME</ion-title>
        <ion-icon
          slot="end"
          :icon="exit"
          size="large"
          v-on:click="logout()"
        ></ion-icon>
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

        <ion-button
          expand="block"
          color="success"
          style="height: 90px"
          router-direction="root"
          router-link="/listaprep"
        >
          <ion-icon slot="start" :icon="reader" size="large"></ion-icon>
          <p>Preparazione Cisterne</p></ion-button
        >
        <div style="padding: 5px"></div>
        <ion-button
          expand="block"
          color="primary"
          style="height: 90px"
          router-direction="root"
          router-link="/listaferti"
        >
          <ion-icon slot="start" :icon="colorFill" size="large"></ion-icon>
          <p>Fertirrigazioni</p></ion-button
        >
        <div style="padding: 5px"></div>
        <ion-button
          expand="block"
          color="secondary"
          style="height: 90px"
          router-direction="root"
          router-link="/listairrigazioni"
        >
          <ion-icon slot="start" :icon="water" size="large"></ion-icon>
          <p>Irrigazioni</p></ion-button
        >
      </section>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-title></ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  //IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  alertController,
} from "@ionic/vue";

import { defineComponent } from "vue";

import {
  colorFill,
  water,
  reader,
  exit,
  addCircleOutline,
} from "ionicons/icons";
import { Http } from "@capacitor-community/http";
import { server_url, token } from "../variabili.js";
import { account } from "../App.vue";
import { uuid } from "../App.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    IonContent,
    //IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonButton,
  },
  data() {
    return { user: null };
  },
  mounted() {
    const self = this;

    //controlla finchè user non è null e poi assegna il valore
    const interval = setInterval(() => {
      if (account != null) {
        self.user = account;
        clearInterval(interval);
      }
    }, 100);
  },
  methods: {
    async chiedi() {
      const alert = await alertController.create({
        header: "Vuoi disconnetterti?",
        cssClass: "custom-alert",
        buttons: [
          {
            text: "NO",
            cssClass: "alert-button-cancel",
            role: "cancel",
            handler: () => {
              return false;
            },
          },
          {
            text: "SI",
            cssClass: "alert-button-confirm",
            role: "confirm",
            handler: () => {
              //this.logout();
              return true;
            },
          },
        ],
      });

      await alert.present();
      const result = await alert.onDidDismiss();
      const resultData = result.role;

      return resultData;
    },
    async logout() {
      const self = this;
      this.chiedi().then(
        (res) => {
          if (res == "confirm") {
            this.disconnetti();
          }
        },
        (err) => {
          console.log("err ->>>>>>>>>>>>>>> ", err);
        }
      );

      /*

      */
    },
    async disconnetti() {
      await Http.request({
        ...{
          headers: { token: token },
          url: server_url + "/api_app/irrigapp_logout",
          params: { uuid: uuid },
        },
        method: "POST",
      }).then((response) => {
        window.location.href = "/login";
      });
    },
  },
  setup() {
    return { colorFill, water, reader, exit, addCircleOutline };
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
