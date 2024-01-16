<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Preparazioni</ion-title>

        <ion-icon slot="end" :icon="reader" size="large"></ion-icon>
      </ion-toolbar>
    </ion-header>
    <ion-header>
      <ion-toolbar v-if="step == 0"> </ion-toolbar>
      <ion-toolbar v-if="step == 1">
        <ion-item lines="full" color="success">
          <ion-icon
            slot="start"
            :icon="arrowBackCircle"
            v-on:click="
              pozzosel = [];
              step = 0;
            "
          ></ion-icon>
          <ion-label>
            <b style="color: yellow">{{ pozzosel.pozzo }}</b>
          </ion-label>
        </ion-item>
      </ion-toolbar>
      <ion-toolbar v-if="step == 2">
        <ion-item lines="full" color="success">
          <ion-icon
            slot="start"
            :icon="arrowBackCircle"
            v-on:click="
              pozzosel = [];
              ricettasel = [];
              sedesel = '';
              step = 0;
            "
          ></ion-icon>
          <ion-label>
            <b style="color: yellow">{{ pozzosel.pozzo }}</b>
            <p>{{ sedesel }}</p>
          </ion-label>
        </ion-item>
        <ion-item lines="full" color="danger">
          <ion-icon
            slot="start"
            :icon="arrowBackCircle"
            v-on:click="
              ricettasel = [];
              sedesel = '';
              step = 1;
            "
          >
          </ion-icon>
          <ion-label>
            <h3>
              <b>{{ ricettasel.descrizione }} </b>
            </h3>
            <p style="color: black">
              {{ ricettasel.fase }}
            </p>
          </ion-label>
        </ion-item>
      </ion-toolbar>
      <ion-toolbar v-if="step == 3"> </ion-toolbar>
      <ion-toolbar v-if="step == 4"> </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <div v-if="step == 0">
        <ion-card
          v-for="(pozzo, i) in pozzi"
          :key="i"
          v-on:click="
            pozzosel = pozzo[0];
            ricettepozzo();

            step = 1;
          "
          color="success"
        >
          <ion-card-header>
            <ion-card-subtitle>
              Matr.: {{ pozzo[0].Matricola }}
              <span style="float: right">
                Contatore: {{ pozzo[0].lastconta }}
              </span>
            </ion-card-subtitle>
            <!--
            <ion-card-title>{{ pozzo[0].cd_sede }}</ion-card-title>
            -->
          </ion-card-header>
          <ion-card-content>
            <b style="color: yellow"> {{ i }} </b></ion-card-content
          >
        </ion-card>
        <!--
        <ion-list>
          <ion-item
            button
            detail="true"
            v-for="(pozzo, i) in pozzi"
            :key="i"
            v-on:click="
              pozzosel = pozzo[0];
              ricettepozzo();

              step = 1;
            "
          >
            <ion-label>
              <h2 style="color: green">{{ pozzo[0].cd_sede }}: {{ i }}</h2>
              <p>Contatore: {{ pozzo[0].lastconta }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
        -->
      </div>
      <div v-if="step == 1">
        <ion-item
          :color="ricetta.lvl == 0 ? 'danger' : ''"
          button
          :lines="ricetta.lvl == 0 ? 'none' : 'full'"
          :detail="ricetta.lvl == 0 ? false : true"
          v-for="(ricetta, i) in ricette"
          :key="i"
        >
          <ion-icon
            v-if="ricetta.lvl == 1"
            :icon="eye"
            color="secondary"
            v-on:click="setOpen(true, ricetta)"
            slot="start"
            size="medium"
          ></ion-icon>
          <ion-label
            v-on:click="
              ricettasel = ricetta.lvl == 0 ? null : ricetta;
              sedesel = ricetta.cd_sede;
              step = ricetta.lvl == 0 ? 1 : 2;
            "
          >
            <h3 v-if="ricetta.lvl == 0">
              <b>{{ ricetta.cd_sede }} : {{ ricetta.descrizione }}</b>
            </h3>
            <h3 v-if="ricetta.lvl == 1">{{ ricetta.fase }}</h3>
            <p v-if="ricetta.lvl == 1">
              Conducibilità:{{ ricetta.conducibilita }}
            </p>
          </ion-label>
        </ion-item>
      </div>
      <div v-if="step == 2">
        <ion-card
          :color="cisterna[0].data ? 'warning' : 'success'"
          v-for="(cisterna, i) in cisterne"
          :key="i"
          v-on:click="goricetta(cisterne[i], i, cisterne)"
        >
          <ion-card-header>
            <ion-card-subtitle>
              CM: {{ cisterna[0].ltxcm }}
              <span style="float: right">
                CAPIENZA:
                {{ numToString(parseFloat(cisterna[0].qtamax), 0, 0) }}
              </span>
            </ion-card-subtitle>
            <ion-card-title>
              CISTERNE
              <b v-for="(cis, t) in cisterne[i]" :key="t"
                >{{ i }}{{ cis.cd_anagrafica }}</b
              >
            </ion-card-title>

            <ion-card-subtitle v-if="!cisterna[0].data">
              <h4><b>VUOTA</b></h4>
            </ion-card-subtitle>
            <ion-card-subtitle v-if="cisterna[0].data">
              <h5 style="color: red; line-height: 0.8">
                {{ cisterna[0].ricetta }}
              </h5>
            </ion-card-subtitle>
            <ion-card-subtitle v-if="cisterna[0].data"
              ><p>
                DEL: {{ toLocaleDateString(cisterna[0].data) }}

                <span style="float: right" v-if="cisterna[0].data">
                  {{ numToString(parseFloat(cisterna[0].consumato), 0, 0) }} di
                  {{ numToString(parseFloat(cisterna[0].qta), 0, 0) }}
                </span>
              </p>
            </ion-card-subtitle>
            <ion-card-subtitle v-if="cisterna[0].data">
              RESIDUO:
              <b
                :style="{
                  color:
                    parseFloat(cisterna[0].qta) -
                      parseFloat(cisterna[0].consumato) <
                    0
                      ? 'red'
                      : '',
                }"
                style="float: right"
                v-if="cisterna[0].data"
              >
                {{
                  numToString(
                    parseFloat(cisterna[0].qta) -
                      parseFloat(cisterna[0].consumato),
                    0,
                    0
                  )
                }}
              </b>
            </ion-card-subtitle>
          </ion-card-header>
        </ion-card>
      </div>

      <ion-modal :is-open="isOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>Ricetta</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false, null)">CHIUDI</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item lines="full" color="success">
            <ion-label>
              <b style="color: yellow">{{ viewric.ricetta }}</b>
              <p>{{ viewric.fase }}</p>
            </ion-label>
          </ion-item>
          <div>
            <ion-item
              button
              v-for="(ric, i) in ricetta"
              :key="i"
              :lines="ric.conf.length > 1 ? 'full' : 'full'"
              :color="ric.conf.length > 1 ? 'light' : ''"
            >
              <ion-label>
                <h3>
                  <b>{{ ric.pri_att }}</b>
                  <b style="float: right">{{ ric.serbatoio }}</b>
                </h3>

                <p>
                  <b>
                    {{ numToString(parseFloat(ric.quantita)) }}
                    <span style="color: green; float: right">
                      {{ ric.umc }}
                    </span>
                  </b>
                </p>
              </ion-label>
            </ion-item>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
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
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonModal,
  IonCard,
  IonLabel,
  IonItem,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { reader, arrowBackCircle, eye } from "ionicons/icons";

import { Http } from "@capacitor-community/http";
import { server_url, token } from "../variabili.js";
import { account } from "../App.vue";
import { uuid } from "../App.vue";

export var excisterna = { qta: 0, qtamax: 0 };
export var excisterne = [{ cd_anagrafica: "A", qta: 0, errore: false }];
export var expozzo = {};

export default defineComponent({
  name: "PreparazioniPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonModal,
    IonCard,
    IonLabel,
    IonItem,
  },
  data() {
    return {
      step: 0,
      user: { username: "", idUtenteRileva: 0 },
      sedesel: "",
      isOpen: false,
      viewric: { ricetta: "", fase: "" },
      pozzi: [],
      pozzisedi: [],
      ricetta: [],
      pozzosel: { idpozzo: 0 },
      ricette: [],
      ricettasel: { idricetta: 0, id: 0, cd_deposito: "" },
      ricettedett: [],
      optionsDate: {},
      cisterne: [],
    };
  },
  mounted() {
    const self = this;
    this.optionsDate = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    self.user = account;
    self.getricette();
  },
  methods: {
    numToString: function (n: any, min = 2, max = 5) {
      return n.toLocaleString(undefined, {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      });
    },
    async getricetta(pp) {
      const self = this;
      self.ricetta = [];

      await Http.request({
        ...{
          url: server_url + "/api_app/irrigapp_get_ricetta",
          headers: { token: token },
          params: {
            idricetta: pp.idricetta,
            idfase: pp.id,
            conserb: "1",
          },
        },
        method: "GET",
      }).then((response) => {
        self.ricetta = response.data;
        for (var i = 0; i < self.ricetta.length; i++) {
          var itm = self.ricetta[i];
          var szs = itm.confezioni.split("|");
          itm.confsel = {};
          itm.conf = [];
          for (var t = 0; t < szs.length; t++) {
            var cc = szs[t].split(":");

            if (szs[t].length > 1 && cc.length > 1) {
              var tt = {
                formato: cc[0],
                articolo: cc[1],
                conf: cc[2],
              };
              itm.conf.push(tt);
              itm.formato = cc[0];
              itm.confsel = tt;
            }
          }
        }

        console.log(self.ricetta);
      });
    },
    setOpen(isOpen: boolean, ricetta: any) {
      const self = this;
      this.isOpen = isOpen;

      if (ricetta) {
        self.viewric.ricetta = ricetta.descrizione;
        self.viewric.fase = ricetta.fase;
        self.getricetta(ricetta);
      } else {
        self.viewric.ricetta = "";
        self.viewric.fase = "";
      }
    },
    toLocaleDateString(date: any, optionsDate = {}) {
      if (!date) return "";
      return new Date(date.replace(" ", "T")).toLocaleDateString(
        "default",
        this.optionsDate
      );
    },
    goricetta(cisterna: any, i: any, cisterne: any) {
      const self = this;
      console.log(i);
      console.log(cisterne);
      excisterna = cisterna[0];
      excisterne = cisterne[i];
      expozzo = self.pozzosel;
      this.$router.push({
        name: "Ricetta",
        params: {
          ricettasel: self.ricettasel.idricetta,
          fasesel: self.ricettasel.id,
          sedesel: self.sedesel,
          cd_deposito: self.ricettasel.cd_deposito,
        },
      });
    },
    async getricette() {
      const self = this;

      await Http.request({
        ...{
          url: server_url + "/api_app/irrigapp_get_ricette",
          headers: { token: token },
          params: { username: self.user.idUtenteRileva.toString() },
        },
        method: "GET",
      }).then((response) => {
        self.ricettedett = response.data;
        var campo = "pozzo";
        self.pozzi = self.gruppiobj(self.ricettedett, campo);

        console.log(self.ricettedett);
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

    ricettepozzo() {
      const self = this;
      var campo = "idricetta";
      self.ricette = [];
      if (self.pozzosel) {
        self.loadcisterne();
        var tt = self.ricettedett.filter(
          (r) => r.idpozzo == self.pozzosel.idpozzo
        );
        self.pozzisedi = self.gruppiobj(tt, "cd_sede");
        console.log(self.pozzisedi);

        var idric = 0;
        for (var i = 0; i < tt.length; i++) {
          var itm = tt[i];
          if (itm["idricetta"] != idric) {
            idric = itm["idricetta"];
            self.ricette.push({
              lvl: 0,
              cd_sede: itm.cd_sede,
              cd_deposito: itm.cd_deposito,
              descrizione: itm.descrizione,
              fase: itm.fase,
              id: 0,
              idricetta: 0,
              nome: "",
              conducibilita: 0,
            });
          }
          self.ricette.push({
            lvl: 1,
            descrizione: itm.descrizione,
            cd_sede: itm.cd_sede,
            cd_deposito: itm.cd_deposito,
            fase: itm.fase,
            id: itm.id,
            idricetta: itm.idricetta,
            nome: itm.nome,
            conducibilita: itm.conducibilita,
          });
        }
      }
    },
    async loadricetta() {
      //this.gridOptions.api.setRowData(null);
      //this.gridOptions.api.showLoadingOverlay();

      const self = this;
      if (self.ricettasel.idricetta > 0 && self.ricettasel.id > 0) {
        await Http.request({
          ...{
            url: server_url + "/api_app/irrigapp_get_ricetta",
            headers: { token: token },
            params: {
              idricetta: self.ricettasel.idricetta.toString(),
              idfase: self.ricettasel.id.toString(),
              conserb: "1",
            },
          },
          method: "GET",
        }).then((response) => {
          self.ricettedett = response.data;

          console.log(self.ricettedett);
        });
      }
    },
    async loadcisterne() {
      //this.gridOptions.api.setRowData(null);
      //this.gridOptions.api.showLoadingOverlay();

      const self = this;
      if (self.pozzosel.idpozzo > 0) {
        await Http.request({
          ...{
            url: server_url + "/api_app/irrigapp_get_vasche",
            headers: { token: token },
            params: {
              idpozzo: self.pozzosel.idpozzo.toString(),
            },
          },
          method: "GET",
        }).then((response) => {
          self.cisterne = self.gruppiobj(response.data, "idx");

          console.log(self.cisterne);
        });
      }
    },
  },
  computed: {},
  setup() {
    return { reader, arrowBackCircle, eye };
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
