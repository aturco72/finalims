<style>
ion-range::part(tick) {
  background: #a2d2ff;
}

ion-range::part(tick-active) {
  background: #bde0fe;
}

ion-range::part(pin) {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #ffafcc;
  color: #fff;

  border-radius: 50%;
  transform: scale(1.01);

  top: -20px;

  min-width: 28px;
  height: 28px;
  transition: transform 120ms ease, background 120ms ease;
}

ion-range::part(pin)::before {
  content: none;
}

ion-range::part(knob) {
  background: #ffc8dd;
}

ion-range::part(bar) {
  background: #a2d2ff;
}

ion-range::part(bar-active) {
  background: #bde0fe;
}
</style>
<template>
  <ion-page>
    <ion-header style="background: white">
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Ricetta {{ sedesel }}</ion-title>

        <ion-icon slot="end" :icon="reader" size="large"></ion-icon>
      </ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-datetime-button datetime="inidatetime"></ion-datetime-button>

              <ion-popover :keep-contents-mounted="true">
                <ion-datetime
                  id="inidatetime"
                  presentation="date"
                  @ionChange="eventdata($event.detail.value)"
                  :value="datacisterna"
                ></ion-datetime>
              </ion-popover>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item fill="solid">
              <ion-label> Residuo: </ion-label>
              <ion-input
                placeholder=""
                type="number"
                :clear-input="true"
                @ionChange="eventresiduo($event.detail.value)"
                :value="residuo"
                min="0"
              >
              </ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col button v-for="(cis, i) in cisterne" :key="i">
            <ion-item fill="solid" :ref="'item' + cis.cd_anagrafica">
              <ion-label position="floating">
                Cisterna {{ cis.cd_anagrafica }}
              </ion-label>
              <ion-input
                placeholder=""
                type="number"
                :clear-on-edit="true"
                :value="cis.qta"
                @ionInput="validate(i, cis.cd_anagrafica, $event)"
                min="0"
                :max="cis.qtamax"
              >
              </ion-input>
              <ion-note v-if="!cis.errore" slot="helper">
                Capienza max {{ cis.qtamax }}
              </ion-note>
              <ion-note v-else slot="helper" style="color: red">
                Superato il limite
              </ion-note>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-header>

    <ion-content fullscreen>
      <div button v-for="(ric, i) in ricetta" :key="i">
        <ion-item
          :lines="ric.conf.length > 1 ? 'none' : 'full'"
          :color="ric.sel == 0 ? 'warning' : ric.conf.length > 1 ? 'light' : ''"
        >
          <ion-label>
            <h3>
              <b>{{ ric.pri_att }}</b>
              <ion-badge
                style="float: right"
                :color="
                  parseFloat(ric.confsel.giac) >=
                  parseFloat(
                    ((cisterne[idxatt[ric.serbatoio]].qta / 10) *
                      ric.quantita) /
                      1000
                  )
                    ? 'success'
                    : 'danger'
                "
                >{{ numToString(parseFloat(ric.confsel.giac)) }} Kg.</ion-badge
              >
            </h3>

            <p>
              <b>
                {{ numToString(parseFloat(ric.quantita)) }} {{ ric.umc }}
                <span v-if="ric.sel" style="color: green; float: right">
                  {{
                    numToString(
                      parseFloat(
                        ((cisterne[idxatt[ric.serbatoio]].qta / 10) *
                          ric.quantita) /
                          1000
                      )
                    )
                  }}
                  Kg.
                </span>
              </b>
            </p>
          </ion-label>
          <ion-button
            slot="end"
            v-on:click="selprod(ric)"
            :color="ric.sel == 1 ? 'tertiary' : 'light'"
          >
            {{ ric.serbatoio }}
          </ion-button>
        </ion-item>
        <ion-item
          v-if="ric.conf.length > 1"
          :color="ric.conf.length > 1 ? 'light' : ''"
        >
          <ion-select
            style="width: 100%; padding: 0px; margin: 2px; color: red"
            interface="action-sheet"
            :selected-text="ric.confsel.articolo + ' - ' + ric.confsel.conf"
            v-model="ric.confsel"
            @ionChange="onchangeFormato($event, i, ric)"
          >
            <ion-select-option
              v-for="(confe, c) in ric.conf"
              :key="c"
              :value="confe"
            >
              {{ confe.articolo }} -
              {{ confe.conf }}
              <br />
              ({{ numToString(parseFloat(confe.giac)) }})</ion-select-option
            >
          </ion-select>
        </ion-item>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title></ion-title>
        <ion-buttons slot="secondary">
          <ion-button fill="solid" color="danger" v-on:click="annulla()">
            Annulla
            <ion-icon slot="start" :icon="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button
            fill="solid"
            color="success"
            v-on:click="conferma()"
            :disabled="isOpenRef"
          >
            <ion-icon slot="end" :icon="checkmark"></ion-icon>
            Conferma
          </ion-button>
        </ion-buttons>
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
  IonFooter,
  IonBackButton,
  toastController,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonInput,
  IonIcon,
  IonItem,
  IonLabel,
  IonCol,
  IonGrid,
  IonRow,
  IonPopover,

  //IonRange,
} from "@ionic/vue";

import { defineComponent, ref } from "vue";
import {
  reader,
  arrowBackCircle,
  checkmark,
  trash,
  alertCircleOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";

import { Http } from "@capacitor-community/http";
import { server_url, token } from "../variabili.js";
import { account } from "../App.vue";
import { uuid } from "../App.vue";
import { useRoute } from "vue-router";

import { excisterna, excisterne, expozzo } from "./Preparazioni.vue";

export default defineComponent({
  name: "RicettaPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFooter,
    IonBackButton,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonDatetimeButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonInput,
    IonIcon,
    IonItem,
    IonLabel,
    IonCol,
    IonGrid,
    IonRow,
    IonPopover,

    //IonRange,
  },
  data() {
    return {
      step: 0,
      isOpenRef: false,
      user: { username: "", idUtenteRileva: 0 },
      pozzi: [],
      pozzosel: { idpozzo: 0 },
      ricetta: [],
      ricettasel: {},
      cd_deposito: {},
      sedesel: {},
      datacisterna: new Date().toISOString().slice(0, 10),
      residuo: 0,
      pozzo: {},
      fasesel: {},
      cisterna: { qta: 0, qtamax: 0 },
      piaselected: { id_ricetta: 0, id_fase: 0 },
      optionsDate: {},
      cisterne: [],
      idxatt: [],
    };
  },
  mounted() {
    const self = this;
    this.optionsDate = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    self.cisterna = excisterna;
    self.cisterne = [...excisterne];
    self.pozzo = expozzo;
    //self.residuo = 0;
    for (var t = 0; t < self.cisterne.length; t++) {
      self.idxatt[self.cisterne[t].cd_anagrafica] = t;
      self.residuo =
        self.cisterne[t].qta - parseInt(self.cisterne[t].consumato);
      self.cisterne[t].qta = self.cisterne[t].qtamax;
    }
    if (self.residuo < 0) self.residuo = 0;
    self.user = account;

    //console.log(self.user);
    const route = useRoute();

    self.ricettasel = route.params.ricettasel;
    self.fasesel = route.params.fasesel;
    self.sedesel = route.params.sedesel;
    self.cd_deposito = route.params.cd_deposito;
    console.log(self.cd_deposito);

    //self.datacisterna = new Date();
    //self.cisterna = route.params.cisterna;

    self.getricetta();
  },
  methods: {
    onchangeFormato(ev: any, i: any, ric: any) {
      const self = this;
      const value = ev.target.value;
      ric.formato = value.formato;
      ric.descrizione = value.articolo;
      ric.giac = value.giac;
    },
    numToString: function (n: any, min = 2, max = 5) {
      return n.toLocaleString(undefined, {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      });
    },
    validate(i: any, codice: any, ev: any) {
      const self = this;

      const value = ev.target.value;
      //self.idxatt[codice] = i;
      //console.log("validate: " + i);

      //[this.$refs["item" + codice]][0].classList.remove("ion-invalid");

      console.log(this.$refs["item" + codice]);
      //this.$refs.item.$el.classList.remove("ion-invalid");
      if (value === "") {
        return;
      }
      if (parseInt(value) > self.cisterne[i].qtamax) {
        //this.$refs.item.$el.classList.add("ion-invalid");
        self.cisterne[i].errore = true;
        //
      } else {
        //this.$refs.item.$el.classList.add("ion-valid");
        self.cisterne[i].errore = false;
      }
      self.cisterne[i].qta = value;
      if (i == 0) self.cisterne[1].qta = value;
    },

    toLocaleDateString(date: any, optionsDate = {}) {
      if (!date) return "";
      return new Date(date.replace(" ", "T")).toLocaleDateString(
        "default",
        this.optionsDate
      );
    },
    selprod(ric) {
      const self = this;

      ric.sel = ric.sel == 0 ? 1 : 0;
      console.log(ric);
    },
    async getricetta() {
      const self = this;

      await Http.request({
        ...{
          url: server_url + "/api_app/irrigapp_get_ricetta",
          headers: { token: token },
          params: {
            idricetta: self.ricettasel.toString(),
            idfase: self.fasesel.toString(),
            conserb: "1",
            cd_deposito: self.cd_deposito.toString(),
          },
        },
        method: "GET",
      }).then((response) => {
        self.ricetta = response.data;
        for (var i = 0; i < self.ricetta.length; i++) {
          var itm = self.ricetta[i];
          itm.sel = 1;
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
                giac: parseFloat(cc[3]),
              };
              itm.conf.push(tt);
              if (itm.conf.length < 2 || itm.confsel.giac < parseFloat(cc[3])) {
                itm.formato = cc[0];
                itm.confsel = tt;
              }
            }
          }
        }

        console.log(self.ricetta);
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
    async annulla() {
      window.location.href = "/";
    },
    eventdata(e: any) {
      const self = this;
      self.datacisterna = e.slice(0, 10);
      console.log(e);
      console.log(self.datacisterna);
    },
    eventresiduo(e: any) {
      const self = this;
      console.log(e);
      self.residuo = 0;
      if (e != "") self.residuo = parseInt(e);
    },
    async conferma() {
      const self = this;

      for (var t = 0; t < self.cisterne.length; t++) {
        var itm = self.cisterne[t];
        var errore = 0;
        if (parseInt(itm.qta) == 0 || itm.qta == "" || !itm.qta) errore = 1;
        if (parseInt(itm.qta) > parseInt(itm.qtamax)) errore = 1;
        if (parseInt(itm.qta) + self.residuo > parseInt(itm.qtamax)) errore = 3;
        console.log(parseInt(itm.qta) + self.residuo);
      }
      var ricesel = self.ricetta.filter((value) => value.sel == 1);
      console.log(ricesel);
      if (ricesel.length == 0) errore = 2;
      if (errore == 1) {
        self.confimrToast("Quantità Errate", "danger", "middle");
      } else if (errore == 2) {
        self.confimrToast(
          "Non ci sono concimi da scaricare",
          "danger",
          "middle"
        );
      } else if (errore == 3) {
        self.confimrToast(
          "La quantità + il residuo superano la capienza massima",
          "danger",
          "middle"
        );
      } else {
        self.isOpenRef = true;
        let data = {
          user: account.idUtenteRileva,
          record: self.pozzo,
          listavasche: self.cisterne,
          ricetta: ricesel,
          datacisterna: self.datacisterna,
          idricetta: self.ricettasel.toString(),
          cd_sede: self.sedesel,
          idfase: self.fasesel.toString(),
          residuo: self.residuo,
        };

        await Http.post({
          ...{
            url: server_url + "/api_app/irrigapp_add_preparazione",
            headers: { "Content-Type": "application/json", token: token },
            data: data,
          },
        }).then((response) => {
          self.confimrToastok("Preparazione inserita con successo", "middle");

          console.log(response.data);
        });
      }
    },
    async confimrToastok(mess: any, position: "top" | "middle" | "bottom") {
      const toast = await toastController.create({
        message: mess,
        duration: 1500,
        position: position,
        color: "success",
        icon: shieldCheckmarkOutline,
      });

      await toast.present();
      const { role } = await toast.onDidDismiss();
      window.location.href = "/";
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
        icon: alertCircleOutline,
      });

      await toast.present();

      const { role } = await toast.onDidDismiss();
      //this.roleMessage = `Dismissed with role: ${role}`;
    },
  },
  computed: {},
  setup() {
    return {
      reader,
      arrowBackCircle,
      checkmark,
      trash,
      alertCircleOutline,
      shieldCheckmarkOutline,
    };
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
