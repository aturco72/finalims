<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Preparazioni</ion-title>

        <ion-icon slot="end" :icon="water" size="large"></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen="true">
      <div v-if="contacist.length">
        <ion-list>
          <div v-for="(cisterna, i) in cisterne" :key="i">
            <ion-item
              :lines="cisterna == cedolino ? 'none' : 'full'"
              v-on:click="cedolino = cisterna"
              :color="cisterna == cedolino ? 'light' : ''"
            >
              <ion-label>
                <h3>
                  {{ toLocaleDateString(cisterna[0].data) }}
                  <span style="float: right">
                    preparato:<b>
                      {{ numToString(parseFloat(cisterna[0].qta), 0, 0) }}</b
                    >
                  </span>
                </h3>

                <p style="color: black">
                  {{ cisterna[0].cd_sede }}: {{ cisterna[0].pozzo }}
                  <span style="float: right">
                    residuo:
                    <b
                      :style="{
                        color:
                          parseFloat(cisterna[0].qta) -
                            parseFloat(cisterna[0].consumato) <
                          0
                            ? 'red'
                            : 'green',
                      }"
                    >
                      {{
                        numToString(
                          parseFloat(cisterna[0].qta) -
                            parseFloat(cisterna[0].consumato),
                          1,
                          1
                        )
                      }}</b
                    >
                  </span>
                </p>
                <p style="color: green">
                  {{ cisterna[0].ricetta }}
                </p>
              </ion-label>
            </ion-item>
            <ion-item lines="none" v-if="cisterna == cedolino" color="light">
              <ion-icon
                slot="start"
                :icon="trash"
                size="medium"
                color="warning"
                v-on:click="cancella()"
              ></ion-icon>
              <ion-label>
                <h3>
                  <span style="float: right; color: green">
                    {{ toLocaleDateTimeString(cisterna[0].datacreazione) }}
                  </span>
                </h3>
              </ion-label>
            </ion-item>

            <ion-item lines="none" v-if="cisterna == cedolino" color="light">
              <ion-grid>
                <ion-row>
                  <ion-col
                    size="3"
                    style="font-size: 12px; border-bottom: solid 1px #000"
                    >CISTERNA</ion-col
                  >
                  <ion-col
                    size="3"
                    style="font-size: 12px; border-bottom: solid 1px #000"
                    >Preparato</ion-col
                  >
                  <ion-col
                    size="3"
                    style="font-size: 12px; border-bottom: solid 1px #000"
                    >Consumato</ion-col
                  >
                  <ion-col
                    size="3"
                    style="font-size: 12px; border-bottom: solid 1px #000"
                    >Residuo</ion-col
                  >
                </ion-row>
                <ion-row v-for="(cis, t) in cisterne[i]" :key="t">
                  <ion-col size="3" style="text-align: left; font-size: 14px">
                    <b>{{ cis.idx }}{{ cis.cd_anagrafica }}</b>
                  </ion-col>
                  <ion-col size="3" style="text-align: right; font-size: 14px">
                    {{ numToString(parseFloat(cis.qta), 0, 0, "") }}
                  </ion-col>
                  <ion-col size="3" style="text-align: right; font-size: 14px">
                    {{ numToString(parseFloat(cis.consumato), 0, 0, "") }}
                  </ion-col>
                  <ion-col
                    size="3"
                    style="text-align: right; font-size: 14px"
                    :style="{
                      color:
                        parseFloat(cis.qta) - parseFloat(cis.consumato) < 0
                          ? 'red'
                          : 'green',
                    }"
                  >
                    {{
                      numToString(
                        parseFloat(cis.qta) - parseFloat(cis.consumato),
                        1,
                        1,
                        "lt."
                      )
                    }}
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
          </div>
        </ion-list>
      </div>
      <div v-else id="container">
        <h2>Nessuna Preparazione inserita</h2>
        <div>premere il tasto in basso per inserirne una</div>
      </div>
    </ion-content>
    <ion-fab
      slot="fixed"
      vertical="bottom"
      horizontal="end"
      router-direction="root"
      router-link="/preparazioni"
    >
      <ion-fab-button color="success">
        <ion-icon :icon="addCircleSharp"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-footer>
      <ion-toolbar v-if="contacist.length">
        <ion-segment :value="tiposezsel">
          <ion-segment-button value="" v-on:click="tiposezsel = ''">
            Tutte
          </ion-segment-button>
          <ion-segment-button
            v-on:click="tiposezsel = i"
            v-for="(tipo, i) in sedi"
            :key="i"
            :value="i"
          >
            {{ i }}
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonSelectOption,
  IonTextarea,
  toastController,
  alertController,
  IonFab,
  IonIcon,
  IonFabButton,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";

import { defineComponent } from "vue";
import {
  water,
  addCircleSharp,
  arrowForwardCircle,
  checkmark,
  trash,
} from "ionicons/icons";

import { Http } from "@capacitor-community/http";
import { server_url, token } from "../variabili.js";
import { account } from "../App.vue";
import { uuid } from "../App.vue";

export var excisterna = { qta: 0, qtamax: 0 };
export var excisterne = [{ cd_anagrafica: "A", qta: 0, errore: false }];
export var expozzo = {};

export default defineComponent({
  name: "ListaPreparazioniPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonList,
    IonItem,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
  },
  data() {
    return {
      step: 0,
      user: {
        username: "",
        idUtenteRileva: 0,
        Sediatt: "",
        sedi: [{ cd_sede: "" }],
      },
      tiposezsel: "",
      sedi: [],
      sedesel: { cd_sede: "" },

      cisterne: [],
      contacist: [],
      optionsDate: {},
      optionsDateTime: {},
      cedolino: [
        {
          consumato: 0,
        },
      ],
    };
  },
  mounted() {
    const self = this;
    this.optionsDate = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    this.optionsDateTime = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    //self.user = account;
    const interval = setInterval(() => {
      if (account != null) {
        self.user = account;
        self.loadcisterne();
        clearInterval(interval);
      }
    }, 100);
    //self.sedi = self.user.sedi;
  },
  methods: {
    async confimrToastok(mess: any, position: "top" | "middle" | "bottom") {
      const toast = await toastController.create({
        message: mess,
        duration: 1500,
        position: position,
        color: "success",
      });

      await toast.present();
      const { role } = await toast.onDidDismiss();
      window.location.href = "/";
      //this.roleMessage = `Dismissed with role: ${role}`;
    },

    async confimrToast(
      mess: any,
      color: "success" | "danger",
      position: "top" | "middle" | "bottom"
    ) {
      const toast = await toastController.create({
        header: "Errore",
        message: mess,
        duration: 1500,
        position: position,
        color: color,
        icon: "arrowForwardCircle",
      });

      await toast.present();
      const { role } = await toast.onDidDismiss();
      //this.roleMessage = `Dismissed with role: ${role}`;
    },
    async chiedi() {
      const alert = await alertController.create({
        header: "Confermi la cancellazione?",
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
    async delete() {
      const self = this;
      let data = {
        cedolino: self.cedolino[0],
      };
      await Http.post({
        ...{
          url: server_url + "/api_app/irrigapp_del_preparazione",
          headers: { "Content-Type": "application/json", token: token },
          data: data,
        },
      }).then((response) => {
        //self.confimrToastok("Preparazione inserita con successo", "middle");
        self.loadcisterne();

        console.log(response.data);
      });
    },

    async cancella() {
      const self = this;
      console.log(self.cedolino);

      if (self.cedolino[0].consumato > 0) {
        self.confimrToast(
          "Impossibile cancellare ci sono dei cedolini di fertirrigazione associati",
          "danger",
          "middle"
        );
      } else {
        this.chiedi().then(
          (res) => {
            if (res == "confirm") {
              self.delete();
            }
          },
          (err) => {
            console.log("err ->>>>>>>>>>>>>>> ", err);
          }
        );
      }
    },
    toLocaleDateString(date: any, optionsDate = {}) {
      if (!date) return "";
      return new Date(date.replace(" ", "T")).toLocaleDateString(
        "default",
        this.optionsDate
      );
    },
    toLocaleDateTimeString(date: any, optionsDate = {}) {
      if (!date) return "";
      return new Date(date.replace(" ", "T")).toLocaleDateString(
        "default",
        this.optionsDateTime
      );
    },

    async loadcisterne() {
      //this.gridOptions.api.setRowData(null);
      //this.gridOptions.api.showLoadingOverlay();

      const self = this;

      await Http.request({
        ...{
          url: server_url + "/api_app/irrigapp_get_vasche",
          headers: { token: token },
          params: {
            cd_utente: self.user.idUtenteRileva.toString(),
          },
        },
        method: "GET",
      }).then((response) => {
        self.contacist = response.data;
        self.cisterne = self.gruppiobj(response.data, "keyinvio");

        var campo = "cd_sede";
        self.sedi = self.gruppiobj(response.data, campo);
        console.log(self.sedi);
      });
    },
    gruppiobj(lista: any, campo: any) {
      const self = this;
      //var campo = "lt_CodiceGruppo";
      var pp = lista.reduce(function (rv: any, x: any) {
        (rv[x[campo]] = rv[x[campo]] || []).push(x);

        return rv;
      }, {});
      return pp;
    },
    numToString: function (n: any, min = 2, max = 5) {
      return n.toLocaleString(undefined, {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      });
    },
  },
  computed: {},
  setup() {
    return { water, addCircleSharp, arrowForwardCircle, checkmark, trash };
  },
});
</script>

<style scoped>
ion-grid {
  --ion-grid-columns: 12;
}
ion-col {
  background-color: #f5f6f9;
  border: solid 0px #000;
  color: #000;
  text-align: center;
}
ion-col span {
  color: rgb(226, 237, 15);
  font-size: 12px;
}
.sel {
  background-color: #ff4a4add;
}
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
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
