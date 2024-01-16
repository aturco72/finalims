<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="secondary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Irrigazioni</ion-title>

        <ion-icon slot="end" :icon="water" size="large"></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen="true">
      <div v-if="cedolini.length">
        <ion-list>
          <div
            v-for="(cedo, i) in cedolini.filter((value) => {
              if (tiposezsel == '' || value.cd_sede == tiposezsel) return true;
            })"
            :key="i"
          >
            <ion-item
              :lines="cedo == cedolino ? 'none' : 'full'"
              v-on:click="cedolino = cedo"
              :color="cedo == cedolino ? 'light' : ''"
            >
              <ion-label>
                <h3>
                  {{ toLocaleDateString(cedo.Data) }}
                  <span style="float: right">
                    {{ numToString(parseFloat(cedo.Superficie), 4, 4) }} ha
                  </span>
                </h3>
                <p style="color: red">
                  {{ cedo.Pozzo }}
                  <span style="float: right; color: red"
                    >lt.
                    {{ numToString(parseInt(cedo.Quantita), 0, 0) }}
                  </span>
                </p>
              </ion-label>
            </ion-item>
            <ion-item lines="none" v-if="cedo == cedolino" color="light">
              <ion-label>
                <h3>
                  {{ cedo.DSOperatore }}
                  <span style="float: right; color: green">
                    {{ numToString(parseInt(cedo.IR_Lfinale), 0, 0) }}
                  </span>
                </h3>
                <p>
                  {{ toLocaleDateTimeString(cedo.dt_invio) }}
                  <span style="float: right; color: green">
                    {{ numToString(parseInt(cedo.IR_Liniziale), 0, 0) }}
                  </span>
                </p>
              </ion-label>
            </ion-item>
            <ion-item lines="none" v-if="cedo == cedolino" color="light">
              <ion-icon
                slot="start"
                :icon="trash"
                size="medium"
                color="warning"
                v-on:click="cancella()"
              ></ion-icon>
              <ion-label style="text-align: center; font-size: 10px">
                <h3>
                  <ion-chip
                    size="small"
                    :color="cedo.IR_Monitoraggio == 0 ? 'medium' : 'success'"
                    shape="round"
                    style="font-size: 11px"
                  >
                    MONITORAGGIO
                  </ion-chip>
                  <ion-chip
                    size="small"
                    color="secondary"
                    shape="round"
                    style="font-size: 11px"
                    >{{
                      cedo.RA_UM == 1
                        ? "UMIDO"
                        : cedo.RA_UM == 2
                        ? "SECCO"
                        : "BAGNATO"
                    }}</ion-chip
                  >
                  <ion-chip
                    size="small"
                    color="secondary"
                    shape="round"
                    style="font-size: 11px"
                    >{{ cedo.IR_Manutenzione }}</ion-chip
                  >
                </h3>
              </ion-label>
            </ion-item>
          </div>
        </ion-list>
      </div>
      <div v-else id="container">
        <h2>Nessuna irrigazione inserita</h2>
        <div>premere il tasto in basso per inserirne una</div>
      </div>
    </ion-content>

    <ion-fab
      slot="fixed"
      vertical="bottom"
      horizontal="end"
      router-direction="root"
      router-link="/sezioni"
    >
      <ion-fab-button color="secondary">
        <ion-icon :icon="addCircleSharp"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-footer>
      <ion-toolbar v-if="cedolini.length">
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
  toastController,
  alertController,
  IonFab,
  IonIcon,
  IonChip,
  IonFabButton,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonFooter,
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
  name: "ListaIrrigazioniPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonFab,
    IonIcon,
    IonChip,
    IonFabButton,
    IonList,
    IonItem,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonFooter,
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

      cedolini: [],
      optionsDate: {},
      optionsDateTime: {},
      cedolino: {
        idxattivo: 1,
        ID: 0,
        keyinvio: "",
        IDClient: 0,
        IDOperazione: 0,
        cd_attivita: 0,
        TipoAgri: "I",
        Data: new Date().toLocaleDateString(),
        Operatore: 0,
        Superficie: 0,
        Quantita: 0,
        Note: "",
        Nome: "",
        PAttivo: "",
        Patogeno: "",
        Dose: "",
        IntSicurezza: 0,
        RA_UM: 0,
        RA_Taglio: "",
        IR_Pozzo: 0,
        IR_Liniziale: 0,
        IR_Lfinale: 0,
        IR_Concime: 0,
        IR_Monitoraggio: 0,
        IR_Totconsumo: 0,
        IR_QtaAdeg: 0,
        IR_Manutenzione: "",
        cd_utente: 0,
        cd_centro: "",
        Ciclo: "",
        dt_invio: "",
        idrileva: 0,
        IN_Insetto: 0,
        Stato: "N",
        TR_NTrapianto: 1,
        Stampato: 0,
        cd_linea: 0,
      },
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
    self.user = account;
    //self.sedi = self.user.sedi;
    self.getirrigazioni();
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
        cedolino: self.cedolino,
      };
      await Http.post({
        ...{
          headers: { "Content-Type": "application/json", token: token },
          url: server_url + "/api_app/irrigapp_del_irrigazioni",
          data: data,
        },
      }).then((response) => {
        //self.confimrToastok("Preparazione inserita con successo", "middle");
        self.getirrigazioni();

        console.log(response.data);
      });
    },

    async cancella() {
      const self = this;
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

    async getirrigazioni() {
      const self = this;

      await Http.request({
        ...{
          headers: { token: token },
          url: server_url + "/api_app/irrigapp_get_irrigazioni",
          params: {
            cd_utente: self.user.idUtenteRileva.toString(),
            fert: "0",
          },
        },
        method: "GET",
      }).then((response) => {
        self.cedolini = response.data;

        var campo = "cd_sede";
        self.sedi = self.gruppiobj(self.cedolini, campo);
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
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
ion-grid {
  --ion-grid-columns: 6;
}
ion-col {
  background-color: #1c67bdd9;
  border: solid 1px #fff;
  color: #fff;
  text-align: center;
}
ion-col span {
  color: rgb(226, 237, 15);
  font-size: 12px;
}
.sel {
  background-color: #ff4a4add;
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
