<template>
  <v-card max-width="1000px" class="mx-auto" id="hello">
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Einstellungen</v-toolbar-title>
    </v-toolbar>
    <v-overlay v-if="overlay">
      <v-card>
        <v-card-text>Bist du sicher, dass du diesen Account entgültig löschen willst?.</v-card-text>
        <v-container>
          <v-row class="mx-auto">
            <v-btn color="success" @click="overlay=false">abbrechen</v-btn>
            <v-spacer></v-spacer>
            <v-btn :disabled="activeButton" color="red" @click="finalDeletion">entgültig Löschen</v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-overlay>
    <v-tabs>
      <v-tab>
        <v-icon left>mdi-account</v-icon>Konto
      </v-tab>
      <v-tab>
        <v-icon left>mdi-home</v-icon>Präferenzen
      </v-tab>
      <v-tab>
        <v-icon left>mdi-lock</v-icon>Passwort ändern
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-form ref="formAccount" v-model="validAccount" class="col-md-6 col-sm-12 col-sx-12">
              <v-text-field v-model="user.displayName" :rules="rules.name" label="Name"></v-text-field>
              <v-text-field v-model="user.email" :rules="rules.mail" label="Mail"></v-text-field>
              <v-row>
                <v-col cols="7" class="px-0 mx-0">
                  <v-card-text class="px-0 mx-0">Account:</v-card-text>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="px-0 mx-0">
                  <v-card-text v-if="isAgrarian" class="px-0 mx-0">Landwirt</v-card-text>
                  <v-card-text v-if="!isAgrarian" class="px-0 mx-0">Helfer</v-card-text>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-alert
                  dense
                  outlined
                  type="error"
                  v-if="!validAccount"
                >Das Formular ist nicht vollständig ausgefüllt</v-alert>
              </v-row>
            </v-form>
            <v-container>
              <v-row>
                <v-btn color="red" @click="deleteAccount()">Account löschen</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" :disabled="!validAccount" @click="updateAccount">Fertig</v-btn>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text v-if="isAgrarian">
            Wo liegt Ihr Hof?
            <v-row justify="center">
              <v-col cols="7" sm="6">
                <v-text-field v-model="place.street" label="Straße" single-line solo></v-text-field>
              </v-col>
              <v-col cols="3" sm="3">
                <v-text-field v-model="place.number" label="Nummer" single-line solo></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" class="mt-n8">
              <v-col cols="5" sm="3">
                <v-text-field v-model="place.postcode" label="PLZ" single-line solo></v-text-field>
              </v-col>
              <v-col cols="5" sm="6">
                <v-text-field v-model="place.city" label="Stadt" single-line solo></v-text-field>
              </v-col>
            </v-row>
            <v-container>
              <v-row>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="updatePreferences">Fertig</v-btn>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-text v-if="!isAgrarian">
            Für welche Arten der Ernte interessierst du dich?
            <v-row>
              <v-col cols="5" sm="5">
                <v-checkbox
                  class="mt-1 ml-4"
                  v-for="item in harvestTypesOptions"
                  v-bind:key="item"
                  v-model="harvestTypes"
                  :label="item"
                  :value="item"
                ></v-checkbox>
              </v-col>
            </v-row>Wie lange willst du helfen?
            <v-row justify="center">
              <v-col md="2">
                <v-text-field
                  class="ml-12"
                  label="von"
                  v-model="durationMin"
                  type="number"
                  style="width: 30px"
                ></v-text-field>
              </v-col>
              <v-col md="3">
                <v-select
                  d-inline-block
                  v-model="durationMinType"
                  :items="durationTypeOptions"
                  style="width: 100px"
                ></v-select>
              </v-col>
              <v-col md="1">
                <v-text-field
                  class="ml-0"
                  label="bis"
                  v-model="durationMax"
                  type="number"
                  style="width: 30px"
                ></v-text-field>
              </v-col>
              <v-col md="4">
                <v-select
                  v-model="durationMaxType"
                  :items="durationTypeOptions"
                  item-text="text"
                  item-value="value"
                  style="width: 100px"
                ></v-select>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-card-text>
                In welchem Umkreis möchtest du Hilfemöglichkeiten vorgschlagen bekommen?
                <v-col cols="10" sm="12">
                  <v-slider
                    label="Umkreis (km)"
                    v-model="searchRange"
                    class="align-center mt-7"
                    :max="searchRangeMax"
                    :min="searchRangeMin"
                    hide-details
                    thumb-label="always"
                    thumb-size="24"
                    thumb-color="primary"
                  >
                  </v-slider>
                </v-col>
              </v-card-text>
            </v-row>
            <v-row justify="center">
              <v-card-text>
                Welche Vorerfahrungen hast du?
                <v-textarea v-model="experience" label solo></v-textarea>
              </v-card-text>
            </v-row>
            <v-container>
              <v-row>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="updatePreferences">Fertig</v-btn>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-form ref="formAccount" v-model="validAccount" class="col-md-6 col-sm-12 col-sx-12">
              <v-text-field
                v-model="oldpassword"
                :rules="rules.password"
                :type="showPasswordOld ? 'text' : 'password'"
                label="Altes Passwort"
                :append-icon="showPasswordOld ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPasswordOld = !showPasswordOld"
              ></v-text-field>
              <v-text-field
                v-model="newpassword"
                :rules="rules.password"
                :type="showPasswordNew ? 'text' : 'password'"
                label="Neues Passwort"
                :append-icon="showPasswordNew ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPasswordNew = !showPasswordNew"
              ></v-text-field>
              <v-row justify="center">
                <v-alert
                  dense
                  outlined
                  type="error"
                  v-if="!validAccount"
                >Die Felder sind nicht vollständig ausgefüllt</v-alert>
              </v-row>
            </v-form>
            <v-container>
              <v-row>
                <v-spacer></v-spacer>
                <v-btn color="success" :disabled="!validAccount" @click="updatePassword">Fertig</v-btn>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-snackbar v-model="snackbar" color="blue">Daten wurden gespeichert.</v-snackbar>
    <v-snackbar v-model="snackbarAlert" color="red">Ein Fehler ist aufgetreten.</v-snackbar>
    <v-snackbar v-model="snackbarPasswordAlert" color="red">Das alte Passwort ist falsch.</v-snackbar>
  </v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
export default {
  name: "settings",
  async mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.fetch();
      }
    });
  },
  data() {
    return {
      oldpassword: "",
      newpassword: "",
      showPasswordOld: false,
      showPasswordNew: false,
      snackbar: false,
      snackbarAlert: false,
      snackbarPasswordAlert: false,
      erfahrung: ["keine", "wenig", "viel", "kann lehren"],
      activeButton: true,
      tabs: null,
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      accountData: [],
      overlay: false,
      rightName: false,
      user: {
        displayName: "",
        email: ""
      },
      harvestTypes: [],
      durationMin: 0,
      durationMinType: "days",
      durationMax: 0,
      durationMaxType: "days",
      searchRange: 0,
      experience: "",
      harvestTypesOptions: ["Obst", "Gemüse"],
      durationTypeOptions: [
        { value: "days", text: "Tage" },
        { value: "weeks", text: "Wochen" }
      ],
      searchRangeMin: 0,
      searchRangeMax: 50,
      place: {},
      isAgrarian: false,
      doc_id: "",
      validAccount: true,
      rules: {
        name: [value => !!value.trim() || "Name wird benötigt."],
        mail: [
          value => !!value.trim() || "E-Mail-Adresse wird benötigt.",
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Ungültige E-Mail-Adresse.";
          }
        ],
        password: [value => !!value || "Passwort wird benötigt."]
      }
    };
  },
  methods: {
    deleteAccount() {
      this.overlay = true;
      setTimeout(() => (this.activeButton = false), 3000);
      this.activeButton = true;
    },
    async fetch() {
      this.user = await firebase.auth().currentUser;
      let usID = this.user.uid;
      let settings = this;
      await firebase
        .firestore()
        .collection("helpers")
        .where("uid", "==", usID)
        .get()
        .then(async querySnapshot => {
          if (querySnapshot.size === 1) {
            querySnapshot.forEach(function(doc) {
              let data = doc.data();
              settings.doc_id = doc.id;
              settings.harvestTypes = data.harvestTypes;
              settings.durationMin = data.durationMin;
              settings.durationMinType = data.durationMinType;
              settings.durationMax = data.durationMax;
              settings.durationMaxType = data.durationMaxType;
              settings.searchRange = data.searchRange;
              settings.experience = data.experience;
              settings.isAgrarian = false;
            });
          } else {
            await firebase
              .firestore()
              .collection("agrarians")
              .where("uid", "==", usID)
              .get()
              .then(querySnapshot => {
                if (querySnapshot.size === 1) {
                  querySnapshot.forEach(function(doc) {
                    let data = doc.data();
                    settings.doc_id = doc.id;
                    settings.place = data.place;
                    settings.isAgrarian = true;
                  });
                }
              });
          }
        });
    },
    async updateAccount() {
      if (!this.$refs.formAccount.validate()) {
        return;
      }
      try {
        this.user
          .updateEmail(this.user.email)
          .then(doc => console.log(doc))
          .catch(err => console.log(err));
        this.user
          .updateProfile({
            displayName: this.user.displayName
          })
          .then(() => {
            this.snackbar = true;
            setTimeout(function(){this.snackbar = false}, 3000);
          });
      } catch {
        this.snackbarAlert = true;
        setTimeout(function(){this.snackbarAlert = false}, 3000);
      }
    },
    async updatePassword() {
        const credential = firebase.auth.EmailAuthProvider.credential(
            this.user.email,
            this.oldpassword
      );
      this.user
        .reauthenticateWithCredential(credential)
        .then(userS => {
          if (userS) {
            this.user.updatePassword(this.newpassword);
            this.snackbar = true;
            setTimeout(function(){this.snackbar = false}, 3000);
          }
        })
        .catch(() => {
          this.snackbarPasswordAlert = true;
          setTimeout(function(){this.snackbarPasswordAlert = false}, 3000);
        });
    },
    async updatePreferences() {
      try {
        if (this.isAgrarian) {
          firebase
            .firestore()
            .collection("agrarians")
            .doc(this.doc_id)
            .update({
              place: this.place
            })
            .then(() => {
              setTimeout(() => (this.snackbar = true), 3000);
              this.snackbar = false;
            });
        } else {
          firebase
            .firestore()
            .collection("helpers")
            .doc(this.doc_id)
            .update({
              harvestTypes: this.harvestTypes,
              durationMin: this.durationMin,
              durationMinType: this.durationMinType,
              durationMax: this.durationMax,
              durationMaxType: this.durationMaxType,
              searchRange: this.searchRange,
              experience: this.experience
            })
            .then(() => {
            this.snackbar = true;
              setTimeout(() => (this.snackbar = false), 3000);
              
            });
        }
      } catch {
        this.snackbarAlert = true;  
        setTimeout(() => (this.snackbarAlert = false), 3000);
      }
    },
    async finalDeletion() {
      this.overlay = false;
      this.user.delete().then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>

<style>
</style>
