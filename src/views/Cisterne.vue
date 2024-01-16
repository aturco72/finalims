<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Nuova Fertigazione</ion-title>

        <ion-icon slot="end" :icon="colorFill" size="large"></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-header>
      <ion-toolbar v-if="step == 1">
        <ion-item lines="full" color="primary">
          <ion-icon
            slot="start"
            :icon="arrowBackCircle"
            v-on:click="
              sedesel = [];
              sezioni = [];
              tiposezsel = '';
              step = 0;
            "
          >
          </ion-icon>
          <ion-label>
            <b style="color: yellow">{{ sedesel.cd_sede }}</b>
            <p>{{ numToString(opeselarea(), 4, 4) }}</p>
          </ion-label>
          <ion-icon
            slot="end"
            :icon="arrowForwardCircle"
            v-on:click="avanti2()"
          >
          </ion-icon>
        </ion-item>
      </ion-toolbar>
      <ion-toolbar v-if="step == 1">
        <ion-segment :value="sedesel.cd_sede">
          <ion-segment-button
            v-on:click="changesede(tipo)"
            v-for="(tipo, i) in sedi"
            :key="i"
            :value="tipo.cd_sede"
          >
            {{ tipo.cd_sede }}
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
      <ion-toolbar v-if="step == 2">
        <ion-item lines="full" color="primary">
          <ion-icon slot="start" :icon="arrowBackCircle" v-on:click="step = 1">
          </ion-icon>
          <ion-label>
            <b style="color: yellow">{{ sedesel.cd_sede }}</b>
            <p>{{ numToString(opeselarea(), 4, 4) }}</p>
          </ion-label>
          <ion-icon
            slot="end"
            :icon="arrowForwardCircle"
            v-on:click="avanti3()"
          >
          </ion-icon>
        </ion-item>
      </ion-toolbar>
      <ion-toolbar v-if="step == 3">
        <ion-item lines="full" color="primary">
          <ion-icon slot="start" :icon="arrowBackCircle" v-on:click="step = 2">
          </ion-icon>
          <ion-label>
            <b style="color: yellow">{{ sedesel.cd_sede }}</b>
            <p>{{ numToString(opeselarea(), 4, 4) }}</p>
          </ion-label>
          <ion-icon
            slot="end"
            :icon="arrowForwardCircle"
            v-on:click="checkcisterne()"
          >
          </ion-icon>
        </ion-item>
      </ion-toolbar>
      <ion-toolbar v-if="step == 4">
        <ion-item lines="full" color="primary">
          <ion-icon
            slot="start"
            :icon="arrowBackCircle"
            v-on:click="
              step = 3;
              operatori = [];
              cedolino.Operatore = 0;
              cedolino.RA_UM = '';
              cedolino.IR_Manutenzione = '';

              cedolino.IR_Liniziale = 0;
              cedolino.IR_Lfinale = '';
              cedolino.Quantita = 0;
              cedolino.IR_QtaAdeg = 0;
              cedolino.Note = '';
            "
          >
          </ion-icon>
          <ion-label>
            <b style="color: yellow">{{ sedesel.cd_sede }}</b>
            <p>{{ numToString(opeselarea(), 4, 4) }}</p>
          </ion-label>
        </ion-item>
        <ion-item lines="full" color="success">
          <ion-label>
            <b style="color: yellow">{{ pozzosel.Descrizione }}</b>
            <p>{{ numToString(pozzosel.lastconta, 0, 0) }}</p>
          </ion-label>
        </ion-item>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div v-if="contacist.length">
        <div v-if="step == 0">
          <ion-card
            :color="i == 1 ? 'medium' : i == 2 ? 'light' : 'light'"
            v-for="(cisterna, i) in cisterne"
            :key="i"
            v-on:click="
              selcisterna(cisterna);
              step = 1;
            "
          >
            <ion-card-header>
              <ion-card-title v-if="cisterna[0].data">
                <h5 style="color: blue; line-height: 0.8">
                  {{ cisterna[0].pozzo }}
                </h5>
                <h6 style="color: blue; line-height: 0.8">
                  {{ cisterna[0].ricetta }}
                </h6>
              </ion-card-title>
              <ion-card-title>
                <h5>
                  <b style="">{{ cisterna[0].cd_sede }}</b> : CISTERNE
                  <b v-for="(cis, t) in cisterne[i]" :key="t">
                    {{ cisterna[0].idx }}{{ cis.cd_anagrafica }}</b
                  >
                </h5>
              </ion-card-title>

              <ion-card-subtitle v-if="cisterna[0].data"
                ><p>
                  DEL: {{ toLocaleDateString(cisterna[0].data) }}

                  <span style="float: right" v-if="cisterna[0].data">
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
                          0,
                          0
                        )
                      }}</b
                    >
                  </span>
                </p>
              </ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </div>
        <div v-if="step == 1">
          <ion-loading
            :is-open="isOpenRef"
            cssClass="my-custom-class"
            message="Please wait..."
            :duration="90000"
            @didDismiss="setOpen(false)"
          >
          </ion-loading>
          <ion-grid>
            <ion-row>
              <ion-col
                size="1"
                v-for="(sezione, i) in sezioni.filter(
                  (val) => tiposezsel == '' || val.tipo == tiposezsel
                )"
                :key="i"
                v-on:click="sezione.sel = sezione.sel == 0 ? 1 : 0"
                :class="[sezione.sel == 1 ? 'sel ' : '']"
              >
                {{ sezione.sezione }}<br />
                <span>{{ numToString(sezione.area, 4, 4) }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div v-if="step == 2">
          <ion-list>
            <div
              v-for="(sezione, i) in sezioni.filter((value) => value.sel == 1)"
              :key="i"
            >
              <ion-item
                lines="full"
                v-on:click="ricettasel = sezione"
                color="secondary"
              >
                <ion-label>
                  SEZIONE: {{ sezione.sezione }}
                  <span style="float: right">
                    {{ numToString(selareasez(sezione), 4, 4) }}</span
                  >
                </ion-label>
              </ion-item>
              <div v-if="sezione.itm.length">
                <div v-for="(itm, t) in sezione.itm" :key="t">
                  <ion-item lines="full" :color="itm.seleziona == 1 ? '' : ''">
                    <ion-icon
                      :icon="
                        selareatun(itm) == 0
                          ? ellipseOutline
                          : radioButtonOnOutline
                      "
                      :style="{ color: selareatun(itm) == 0 ? '' : 'green' }"
                      v-on:click="seltun(itm)"
                      slot="start"
                      size="small"
                    ></ion-icon>
                    <ion-label
                      style="font-size: 12px"
                      v-on:click="
                        itm.seleziona == 0
                          ? (itm.seleziona = 1)
                          : (itm.seleziona = 0)
                      "
                    >
                      <b
                        :style="{ color: !itm.dt_sgombro ? 'green' : 'red' }"
                        >{{ itm.Denominazione }}</b
                      >

                      <span style="color: blue; float: right">
                        {{
                          numToString(parseFloat(selareatun(itm)), 4, 4)
                        }}</span
                      >
                      <br />
                      <span style="color: green; float: left">
                        {{ toLocaleDateString(itm.dt_trapianto) }}</span
                      >
                      <span style="color: red; float: right">
                        {{ toLocaleDateString(itm.dt_sgombro) }}</span
                      >
                      <br />
                      <span style="color: gray; float: left">
                        {{ itm.Tunnels }}
                      </span>
                    </ion-label>
                  </ion-item>
                  <ion-item
                    lines="full"
                    v-if="itm.seleziona == 0"
                    :color="itm.seleziona == 0 ? '' : 'light'"
                  >
                    <ion-label style="font-size: 12px">
                      <ion-row>
                        <ion-col
                          size="2"
                          v-for="(tun, i) in itm.tuns"
                          :key="i"
                          v-on:click="tun.sel = tun.sel == 0 ? 1 : 0"
                          :class="[tun.sel == 1 ? 'sel ' : '']"
                        >
                          {{ tun.tunnel }}<br />
                          <span>{{ numToString(tun.area, 4, 4) }}</span>
                        </ion-col>
                      </ion-row>
                    </ion-label>
                  </ion-item>
                </div>
              </div>
            </div>
          </ion-list>
        </div>
        <div v-if="step == 3">
          <ion-item lines="full" color="danger">
            {{ cisternasel[0].ricetta }} del
            {{ toLocaleDateString(cisternasel[0].data) }}
          </ion-item>
          <ion-item lines="full">
            <ion-label> Ora Inizio </ion-label>
            <ion-datetime-button datetime="inidatetime"></ion-datetime-button>

            <ion-popover :keep-contents-mounted="true">
              <ion-datetime
                minute-values="0,5,10,15,20,25,30,35,40,45,50,55"
                id="inidatetime"
                presentation="time"
                :value="cedolino.hhini"
                @ionChange="eventore($event.detail.value, 1)"
              ></ion-datetime> </ion-popover
          ></ion-item>
          <ion-item lines="full">
            <ion-label> Ora Fine </ion-label>
            <ion-datetime-button datetime="findatetime"></ion-datetime-button>

            <ion-popover :keep-contents-mounted="true">
              <ion-datetime
                minute-values="0,5,10,15,20,25,30,35,40,45,50,55"
                id="findatetime"
                presentation="time"
                :value="cedolino.hhfin"
                @ionChange="eventore($event.detail.value, 2)"
              ></ion-datetime>
            </ion-popover>
          </ion-item>
          <ion-item lines="full">
            <ion-label> Ore Totali </ion-label>
            <ion-datetime-button
              datetime="difdatetime"
              disabled="true"
              class="my-col"
            ></ion-datetime-button>
            <ion-popover :keep-contents-mounted="true">
              <ion-datetime
                id="difdatetime"
                presentation="time"
                :value="cedolino.hhdif"
              ></ion-datetime>
            </ion-popover>
          </ion-item>

          <ion-grid v-for="(cist, i) in cisternasel" :key="i" :fixed="true">
            <ion-row>
              <ion-col class="my-col">
                <ion-item lines="full">
                  <ion-label>
                    <b>CISTERNA: {{ cist.idx }}{{ cist.cd_anagrafica }}</b>
                  </ion-label>
                  <ion-input
                    placeholder=""
                    type="number"
                    readonly="true"
                    :value="cist.Quantita"
                    color="primary"
                    style="text-align: right"
                  >
                  </ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="my-col">
                <ion-item fill="solid" ref="Liniziale">
                  <ion-label> Iniziale </ion-label>
                  <ion-input
                    placeholder=""
                    type="number"
                    :clear-on-edit="true"
                    :value="cist.Liniziale"
                    style="text-align: right"
                    @ionChange="valicisterna($event, 0, cist, i)"
                    :style="{
                      'background-color':
                        cist.Lfinale > cist.Liniziale ? 'red' : '',
                    }"
                  >
                  </ion-input>
                </ion-item>
              </ion-col>
              <ion-col class="my-col">
                <ion-item lines="full" fill="solid" ref="Lfinale">
                  <ion-label> Finale </ion-label>
                  <ion-input
                    placeholder=""
                    type="number"
                    :clear-on-edit="true"
                    :value="cist.Lfinale"
                    style="text-align: right"
                    :style="{
                      'background-color':
                        cist.Lfinale > cist.Liniziale ? 'red' : '',
                    }"
                    @ionChange="valicisterna($event, 1, cist, i)"
                  >
                  </ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div v-if="step == 4">
          <ion-item lines="full">
            <ion-label> Data </ion-label>
            <ion-datetime-button datetime="inidatetime"></ion-datetime-button>

            <ion-popover :keep-contents-mounted="true">
              <ion-datetime
                id="inidatetime"
                presentation="date"
                @ionChange="eventdata($event.detail.value)"
                :value="cedolino.Data"
              ></ion-datetime> </ion-popover
          ></ion-item>
          <!--
          <ion-item>
            <ion-input
              placeholder=""
              type="date"
              :value="cedolino.Data"
              color="primary"
              style="text-align: left"
            >
            </ion-input>
          </ion-item>
          -->
          <ion-item>
            <ion-select
              placeholder="Scegli operatore"
              interface="action-sheet"
              @ionChange="cedolino.Operatore = $event.detail.value"
              style="text-align: right"
            >
              <ion-select-option
                v-for="(operatore, i) in operatori.filter(
                  (value) => value.cd_sede == sedesel.cd_sede
                )"
                :key="i"
                :value="operatore.cd_anagrafica"
                >{{ operatore.Descrizione }}</ion-select-option
              >
            </ion-select>
          </ion-item>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-item fill="solid" ref="Liniziale">
                  <ion-label position="floating"> Lett.Iniziale </ion-label>
                  <ion-input
                    placeholder=""
                    type="number"
                    :clear-on-edit="true"
                    :value="cedolino.IR_Liniziale"
                    @ionInput="validate($event, 0)"
                    style="text-align: right"
                  >
                  </ion-input>
                </ion-item>
              </ion-col>
              <ion-col>
                <ion-item fill="solid" ref="Lfinale">
                  <ion-label position="floating"> Lett.Finale </ion-label>
                  <ion-input
                    placeholder=""
                    type="number"
                    :clear-on-edit="true"
                    :value="cedolino.IR_Lfinale"
                    @ionInput="validate($event, 1)"
                    style="text-align: right"
                  >
                  </ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-item>
            <ion-label>Qta MC</ion-label>
            <ion-input
              placeholder=""
              type="number"
              readonly="true"
              :value="cedolino.Quantita"
              color="primary"
              style="text-align: right"
            >
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="fixed">MC/HA</ion-label>
            <ion-input
              placeholder=""
              type="number"
              :value="cedolino.IR_QtaAdeg"
              readonly="true"
              color="danger"
              style="text-align: right"
            >
            </ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Monitoraggio</ion-label>
            <ion-toggle
              slot="end"
              @ionChange="monitoraggio = $event.detail.checked"
              :checked="monitoraggio"
            ></ion-toggle>
          </ion-item>
          <ion-item>
            <ion-label>Tensiometro:</ion-label>
            <ion-select
              placeholder="Scegli"
              interface="action-sheet"
              @ionChange="cedolino.RA_UM = $event.detail.value"
            >
              <ion-select-option value="1">UMIDO</ion-select-option>
              <ion-select-option value="2">SECCO</ion-select-option>
              <ion-select-option value="3">BAGNATO</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>Manutenzione:</ion-label>
            <ion-select
              placeholder="Scegli"
              interface="action-sheet"
              @ionChange="cedolino.IR_Manutenzione = $event.detail.value"
            >
              <ion-select-option value="INTERNA">INTERNA</ion-select-option>
              <ion-select-option value="ESTERNA">ESTERNA</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>Note</ion-label>
            <ion-textarea
              @ionInput="cedolino.Note = $event.target.value"
              placeholder="Inserisci una nota"
            ></ion-textarea>
          </ion-item>
        </div>
      </div>
      <div v-else id="container">
        <h2>Nessuna Cisterna disponibile</h2>
        <div>tornare al menu preparazione cisterne</div>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar v-if="step == 1">
        <ion-segment :value="tiposezsel">
          <ion-segment-button
            value=""
            v-on:click="tiposezsel = ''"
            v-if="sezioni.length"
          >
            Tutte
          </ion-segment-button>
          <ion-segment-button
            v-on:click="tiposezsel = i"
            v-for="(tipo, i) in gruppiobj(sezioni, 'tipo')"
            :key="i"
            :value="i"
          >
            {{ i }}
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
      <ion-toolbar v-if="step == 2">
        <ion-segment :value="tiposezsel">
          <ion-segment-button
            value=""
            v-on:click="tiposezsel = ''"
            v-if="sezioni.length"
          >
            Tutte
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
      <ion-toolbar v-if="step == 4">
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
            :disabled="buttonok"
            v-on:click="conferma()"
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
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonInput,
  toastController,
  alertController,
  IonDatetime,
  IonDatetimeButton,
  IonLoading,
  //IonModal,
  IonPopover,
} from "@ionic/vue";

import { defineComponent } from "vue";
import {
  colorFill,
  arrowBackCircle,
  arrowForwardCircle,
  arrowDownCircleOutline,
  arrowUpCircleOutline,
  checkmark,
  trash,
  alertCircleOutline,
  shieldCheckmarkOutline,
  ellipseOutline,
  radioButtonOnOutline,
} from "ionicons/icons";

import { Http } from "@capacitor-community/http";
import { server_url, token } from "../variabili.js";
import { account } from "../App.vue";
import { uuid } from "../App.vue";

export var excisterna = { qta: 0, qtamax: 0 };
export var excisterne = [{ cd_anagrafica: "A", qta: 0, errore: false }];
export var expozzo = {};

export default defineComponent({
  name: "SezioniPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonInput,
    IonDatetime,
    IonDatetimeButton,
    IonLoading,
    //IonModal,
    IonPopover,
  },
  data() {
    return {
      monitoraggio: false,
      buttonok: false,
      isOpenRef: false,
      step: 0,
      user: {
        username: "",
        idUtenteRileva: 0,
        Sediatt: "",
        sedi: [{ cd_sede: "" }],
      },
      datainvio: "",
      tiposezsel: "",
      sedi: [],
      sedesel: { cd_sede: "" },
      statosezioni: [],
      sezioni: [],
      pozzi: [],
      pozzosel: { cd_anagrafica: 0, lastconta: 0 },
      ricettasel: { idricetta: 0, id: 0 },
      ricettedett: [],
      optionsDate: {},
      cisterne: [],
      contacist: [],
      cisternasel: [],
      tiposezioni: [],
      operatori: [],

      cedolino: {
        idxattivo: 1,
        ID: 0,
        keyinvio: "",
        IDClient: 0,
        IDOperazione: 0,
        cd_attivita: 0,
        TipoAgri: "I",
        Data: new Date().toISOString().slice(0, 10),
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
        IR_Lfinale: "",
        IR_Concime: 1,
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
        hhini: new Date().toISOString().slice(0, 13) + ":00",
        hhfin: new Date().toISOString().slice(0, 13) + ":00",
        hhdif: "",
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
    var res = new Date();
    //self.cedolino.Data = res.toISOString().slice(0, 10);
    console.log(res);
    self.user = account;
    self.sedi = self.user.sedi;
    console.log(self.sedi);
    self.eventore(self.cedolino.hhini, 1);
    self.eventore(self.cedolino.hhfin, 2);
    self.loadcisterne();
  },
  methods: {
    checkcisterne() {
      const self = this;
      var errore = 0;
      self.cedolino.IR_Liniziale = self.pozzosel.lastconta;
      self.getoperatori();
      for (var t = 0; t < self.cisternasel.length; t++) {
        var itm = self.cisternasel[t];
        console.log(itm);
        if (itm.Quantita == 0) errore = 1;
        if (itm.Lfinale > itm.Liniziale) errore = 1;
        if (itm.Liniziale == "") errore = 1;
      }
      if (errore > 0) {
        self.confimrToast("Letture Errate", "danger", "middle");
      } else self.step = 4;
    },
    eventdata(e: any) {
      const self = this;
      self.cedolino.Data = e;
      console.log(e);
      console.log(self.cedolino.Data);
    },
    eventore(e: any, campo: any) {
      const self = this;
      if (campo == 1) {
        self.cedolino.hhini = e.slice(0, 16);

        if (self.cedolino.hhfin == null) self.cedolino.hhfin = e.slice(0, 16);
      } else {
        self.cedolino.hhfin = e.slice(0, 16);
      }
      const msInHour = 1000 * 60;
      var date1 = new Date(self.cedolino.hhini);
      var date2 = new Date(self.cedolino.hhfin);
      console.log(self.cedolino.hhini);
      console.log(self.cedolino.hhfin);
      var hours = Math.round(
        Math.abs(date2.getTime() - date1.getTime()) / msInHour
      );
      console.log(hours);
      var mm = hours % 60;
      var hh = hours / 60;
      console.log(mm);
      console.log(hh);
      var tt = new Date(
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate(),
        hh + 1,
        mm
      );
      self.cedolino.hhdif = tt.toISOString().slice(0, 16);
      console.log(self.cedolino.hhdif);
    },
    selcisterna(cis: any) {
      const self = this;
      console.log(cis);
      self.cisternasel = cis;
      self.sedesel.cd_sede = cis[0].cd_sede;
      self.cedolino.IR_Pozzo = cis[0].id_pozzo;
      for (var t = 0; t < cis.length; t++) {
        var itm = cis[t];
        var valini = parseInt(itm.ltxcm);
        if (parseInt(itm.qtamax) > 0)
          valini =
            (parseInt(itm.qta) * parseInt(itm.ltxcm)) / parseInt(itm.qtamax);
        if (!itm.Liniziale)
          itm.Liniziale = itm.lastini > 0 ? itm.lastini : valini;
        if (!itm.Lfinale) itm.Lfinale = "";
        if (!itm.Quantita) itm.Quantita = 0;
      }
      console.log(self.cisternasel);
      self.getstato();
    },
    async annulla() {
      window.location.href = "/";
    },
    async conferma() {
      const self = this;
      if (self.cedolino.IR_Pozzo == 0) {
        self.confimrToast(
          "Devi selezionare almeno un Pozzo",
          "danger",
          "middle"
        );
        return;
      }
      if (self.cedolino.Operatore == 0) {
        self.confimrToast(
          "Devi selezionare almeno un Operatore",
          "danger",
          "middle"
        );
        return;
      }
      /*
      if (self.cedolino.IR_Liniziale < self.pozzosel.lastconta) {
        self.confimrToast(
          "Lettura iniziale è inferiore all'ultima lettura",
          "danger",
          "middle"
        );
        return;
      }
      */
      if (self.cedolino.IR_Liniziale == 0) {
        self.confimrToast(
          "La lettura iniziale deve essere maggiore di 0",
          "danger",
          "middle"
        );
        return;
      }
      if (
        self.cedolino.IR_Lfinale == "" ||
        parseInt(self.cedolino.IR_Lfinale) == 0
      ) {
        self.confimrToast(
          "La lettura finale deve essere maggiore di 0",
          "danger",
          "middle"
        );
        return;
      }
      if (self.cedolino.IR_Liniziale >= parseInt(self.cedolino.IR_Lfinale)) {
        self.confimrToast(
          "La lettura finale deve essere maggiore di quella iniziale",
          "danger",
          "middle"
        );
        return;
      }
      if (self.cedolino.IR_Liniziale != self.pozzosel.lastconta) {
        self.presentToast();
      } else self.aggiungi();
      //self.cedolino.RA_UM = e;
    },
    async aggiungi() {
      const self = this;
      self.buttonok = true;
      self.cedolino.Superficie = self.opeselarea();
      //self.cedolino.Data = new Date(self.cedolino.Data).toLocaleDateString();
      self.cedolino.IR_Monitoraggio = self.monitoraggio ? 1 : 0;

      let data = {
        user: account.idUtenteRileva,
        cedolino: self.cedolino,
        preparazioni: self.cisternasel,
        sezioni: self.sezioni.filter((value) => value.sel == 1),
      };

      await Http.post({
        ...{
          headers: { "Content-Type": "application/json", token: token },
          url: server_url + "/api_app/irrigapp_add_irrigazione",
          data: data,
        },
      }).then((response) => {
        self.confimrToastok("Preparazione inserita con successo", "middle");

        console.log(response.data);
      });
    },
    async presentToast() {
      const self = this;
      const alert = await alertController.create({
        header: "Lettura iniziale modificata, Confermare?",
        buttons: [
          {
            text: "Cancel",
            role: "KO",
          },
          {
            text: "OK",
            role: "OK",
            handler: () => {
              self.aggiungi();
            },
          },
        ],
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
      //roleMessage.value = `Dismissed with role: ${role}`;
    },

    async confimrToastok(mess: any, position: "top" | "middle" | "bottom") {
      const toast = await toastController.create({
        message: mess,
        duration: 1500,
        position: position,
        color: "success",
        icon: alertCircleOutline,
      });

      await toast.present();
      const { role } = await toast.onDidDismiss();
      window.location.href = "/";
      //this.roleMessage = `Dismissed with role: ${role}`;
    },
    validate(ev: any, quale: any) {
      const self = this;

      const value = ev.target.value;

      //console.log(this.$refs["item" + codice]);
      //this.$refs.item.$el.classList.remove("ion-invalid");
      self.cedolino.Quantita = 0;
      self.cedolino.IR_QtaAdeg = 0;

      if (value === "") {
        return;
      }
      quale == 0
        ? (self.cedolino.IR_Liniziale = parseInt(value))
        : (self.cedolino.IR_Lfinale = value);
      if (self.cedolino.IR_Liniziale < parseInt(self.cedolino.IR_Lfinale)) {
        self.cedolino.Quantita =
          parseInt(self.cedolino.IR_Lfinale) - self.cedolino.IR_Liniziale;
        self.cedolino.IR_QtaAdeg = self.cedolino.Quantita / self.opeselarea();
        self.cedolino.IR_QtaAdeg = parseFloat(
          self.cedolino.IR_QtaAdeg.toFixed(3)
        );
      }
      console.log(self.cedolino.IR_Lfinale);
    },
    valicisterna(ev: any, quale: any, cist: any, idx: any) {
      const self = this;

      const value = ev.target.value;

      //console.log(this.$refs["item" + codice]);
      //this.$refs.item.$el.classList.remove("ion-invalid");
      cist.Quantita = 0;
      console.log(quale);
      console.log(idx);

      if (value === "") {
        quale == 0 ? (cist.Liniziale = "") : (cist.Lfinale = "");
      } else {
        quale == 0
          ? (cist.Liniziale = parseInt(value))
          : (cist.Lfinale = parseInt(value));
        if (cist.Liniziale > 0 && cist.Lfinale >= 0) {
          var costante = 1;
          if (cist.ltxcm)
            costante = parseFloat(cist.qtamax) / parseFloat(cist.ltxcm);
          cist.Quantita = (cist.Liniziale - cist.Lfinale) * costante;
        }
      }
      if (idx == 0) {
        for (var t = 0; t < self.cisternasel.length; t++) {
          if (t > 0) {
            var itm = self.cisternasel[t];
            itm.Liniziale = cist.Liniziale;
            itm.Lfinale = cist.Lfinale;

            itm.Quantita = cist.Quantita;
          }
        }
      }
    },
    avanti2() {
      const self = this;
      if (self.opeselarea() == 0) {
        self.confimrToast(
          "Devi selezionare almeno una sezione",
          "danger",
          "middle"
        );
      } else self.step = 2;
    },
    avanti3() {
      const self = this;
      self.getpozzi();
      self.step = 3;
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
        icon: shieldCheckmarkOutline,
      });

      await toast.present();
      //const { role } = await toast.onDidDismiss();
      //this.roleMessage = `Dismissed with role: ${role}`;
    },
    opeselareaold() {
      var cc = 0.0;
      this.sezioni.filter((value) => {
        if (value.sel == 1) cc += parseFloat(value.area.toFixed(4));
      });
      return cc;
    },
    toLocaleDateString(date: any, optionsDate = {}) {
      if (!date) return "";
      return new Date(date.replace(" ", "T")).toLocaleDateString(
        "default",
        this.optionsDate
      );
    },
    setOpen(flg) {
      const self = this;
      self.isOpenRef = flg;
    },
    changesede(tipo) {
      const self = this;

      self.sedesel.cd_sede = tipo.cd_sede;
      self.getstato();
    },
    async getstato() {
      const self = this;
      self.setOpen(true);
      await Http.request({
        ...{
          headers: { token: token },
          url: server_url + "/api_app/irrigapp_get_statosezioni",
          params: {
            cd_utente: self.user.idUtenteRileva.toString(),
            cd_sede: self.sedesel.cd_sede,
          },
        },
        method: "GET",
      })
        .then((response) => {
          self.statosezioni = response.data;
          console.log(self.sedesel.cd_sede);
          self.sezionisedi();
          //var campo = "cd_sede";
          //self.sedi = self.gruppiobj(self.statosezioni, campo);
        })
        .finally(() => {
          self.setOpen(false);
        });
    },
    async getpozzi() {
      const self = this;

      await Http.request({
        ...{
          headers: { token: token },
          url: server_url + "/api_app/irrigapp_get_pozzi",
          params: { cd_utente: self.user.idUtenteRileva.toString() },
        },
        method: "GET",
      }).then((response) => {
        self.pozzi = response.data;
        if (self.pozzi.length)
          self.pozzosel = self.pozzi.filter(
            (val) => val.cd_anagrafica == self.cisternasel[0].id_pozzo
          )[0];
        console.log(self.pozzi);
      });
    },
    async loadcisterne() {
      //this.gridOptions.api.setRowData(null);
      //this.gridOptions.api.showLoadingOverlay();

      const self = this;

      await Http.request({
        ...{
          headers: { token: token },
          url: server_url + "/api_app/irrigapp_get_vasche",
          params: {
            cd_utente: self.user.idUtenteRileva.toString(),
          },
        },
        method: "GET",
      }).then((response) => {
        self.contacist = response.data;
        self.cisterne = self.gruppiobj(response.data, "keyinvio");

        console.log(self.cisterne);
      });
    },
    async getoperatori() {
      //this.gridOptions.api.setRowData(null);
      //this.gridOptions.api.showLoadingOverlay();

      const self = this;

      if (self.pozzosel.cd_anagrafica > 0) {
        await Http.request({
          ...{
            headers: { token: token },
            url: server_url + "/api_app/irrigapp_get_operatori",
            params: {
              cd_utente: self.user.idUtenteRileva.toString(),
            },
          },
          method: "GET",
        }).then((response) => {
          self.operatori = response.data;

          console.log(self.operatori);
        });
      }
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
    opeselarea() {
      const self = this;
      var cc = 0.0;
      self.sezioni.filter((value) => {
        if (value.sel == 1) cc += self.selareasez(value);
      });
      return cc;
    },

    selareasez(sezione) {
      const self = this;
      var cc = 0.0;
      for (var i = 0; i < sezione.itm.length; i++) {
        var itm = sezione.itm[i];
        cc += self.selareatun(itm);
      }
      return cc;
    },

    seltun(itm) {
      const self = this;
      if (self.selareatun(itm) == 0) {
        itm.tuns.filter((value) => {
          value.sel = 1;
        });
      } else {
        itm.tuns.filter((value) => {
          value.sel = 0;
        });
      }
    },

    selareatun(itm) {
      var cc = 0.0;
      itm.tuns.filter((value) => {
        if (value.sel == 1) cc += parseFloat(value.area.toFixed(4));
      });
      return cc;
    },
    sezionisedi() {
      const self = this;

      self.sezioni = [];

      if (self.sedesel) {
        var tt = self.statosezioni.filter(
          (r) => r.cd_sede == self.sedesel.cd_sede
        );

        var sezione = "";
        var idx = 0;
        for (var i = 0; i < tt.length; i++) {
          var itm = tt[i];
          itm.seleziona = 1;

          if (self.cedolino.cd_centro == "")
            self.cedolino.cd_centro = itm["cd_centro"];
          if (self.cedolino.cd_utente == 0)
            self.cedolino.cd_utente = self.user.idUtenteRileva;
          if (itm["Sezione"] != sezione) {
            sezione = itm["Sezione"];
            idx = self.sezioni.push({
              sezione: itm["Sezione"],
              tipo: itm["Tipo"],
              sel: 0,
              area: 0,
              itm: [],
            });
          }
          self.sezioni[idx - 1].area =
            self.sezioni[idx - 1].area + parseFloat(itm["Area"]);
          if (itm.Tunnel) {
            var sz = itm.Tunnel;
            var szs = sz.split(" ");
            itm.tuns = [];

            for (var t = 0; t < szs.length; t++) {
              var cc = szs[t].split(":");
              if (cc.length > 1) {
                itm.tuns.push({
                  tunnel: cc[0],
                  area: parseFloat(cc[1]),
                  idtunnel: parseInt(cc[2]),
                  id: parseInt(cc[3]),
                  idtra: parseInt(cc[4]),
                  sel: 1,
                });
              }
            }
          }

          self.sezioni[idx - 1].itm.push(itm);
        }
        var campo = "tipo";
        self.tiposezioni = self.gruppiobj(self.sezioni, campo);
      }
    },
  },
  computed: {},
  setup() {
    return {
      colorFill,
      arrowBackCircle,
      arrowForwardCircle,
      checkmark,
      trash,
      alertCircleOutline,
      shieldCheckmarkOutline,
      ellipseOutline,
      radioButtonOnOutline,
      arrowDownCircleOutline,
      arrowUpCircleOutline,
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

.my-grid {
  --ion-grid-columns: 6;
}
.my-col {
  background-color: #a0c8f6d9;
  border: solid 0px #fff;
  color: #fff;
  text-align: center;
}
.my-col span {
  color: rgb(226, 237, 15);
  font-size: 12px;
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
