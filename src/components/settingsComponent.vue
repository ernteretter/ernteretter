<template>
<v-card max-width="1000px" class="mx-auto" id="hello">
    <v-overlay v-if="overlay">
        <v-card>
            <v-card-text>Bist du sicher, dass du diesen Account entgültig löschen willst?</v-card-text>
            <v-container>
                <v-row class="mx-auto">
                    <v-btn color="success" @click="overlay=false">abbrechen</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="activeButton" color="red" @click="finalDeletion">entgültig Löschen</v-btn>
                </v-row>
            </v-container>
        </v-card>
    </v-overlay>
    <v-tabs centered height="60">
        <v-tab>
            <v-icon left>mdi-account</v-icon>
            <v-card-text class="d-none d-md-inline">Konto</v-card-text>
        </v-tab>
        <v-tab>
            <v-icon left>mdi-home</v-icon>
            <v-card-text class="d-none d-md-inline">Präferenzen</v-card-text>
        </v-tab>
        <v-tab>
            <v-icon left>mdi-lock</v-icon>
            <v-card-text class="d-none d-md-inline">Passwort ändern</v-card-text>
        </v-tab>
        <v-tab-item>
            <v-card flat>
                <v-divider />
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
                            <v-alert dense outlined type="error" v-if="!validAccount">Das Formular ist nicht vollständig ausgefüllt</v-alert>
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
            <v-divider />
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
                            <v-checkbox class="mt-1 ml-4" v-for="item in harvestTypesOptions" v-bind:key="item" v-model="harvestTypes" :label="item" :value="item"></v-checkbox>
                        </v-col>
                    </v-row>Wie lange willst du helfen?
                    <v-row justify="center">
                        <v-col md="2">
                            <v-text-field class="ml-12" label="von" v-model="durationMin" type="number" style="width: 30px"></v-text-field>
                        </v-col>
                        <v-col md="3">
                            <v-select d-inline-block v-model="durationMinType" :items="durationTypeOptions" style="width: 100px"></v-select>
                        </v-col>
                        <v-col md="1">
                            <v-text-field class="ml-0" label="bis" v-model="durationMax" type="number" style="width: 30px"></v-text-field>
                        </v-col>
                        <v-col md="4">
                            <v-select v-model="durationMaxType" :items="durationTypeOptions" item-text="text" item-value="value" style="width: 100px"></v-select>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-card-text>
                            In welchem Umkreis möchtest du Hilfemöglichkeiten vorgschlagen bekommen?
                            <v-col cols="10" sm="12">
                                <v-slider label="Umkreis (km)" v-model="searchRange" class="align-center mt-7" :max="searchRangeMax" :min="searchRangeMin" hide-details thumb-label="always" thumb-size="24" thumb-color="primary">
                                </v-slider>
                            </v-col>
                        </v-card-text>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-select single-line solo v-model="experience" :items="experienceItems" label="Wie viel Erfahung hast du?"></v-select>
                        </v-col>
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
            <v-divider />
            <v-card flat>
                <v-card-text>
                    <v-form ref="formAccount" class="col-md-6 col-sm-12 col-sx-12">
                        <v-text-field v-model="oldpassword"  :type="showPasswordOld ? 'text' : 'password'" label="Altes Passwort" :append-icon="showPasswordOld ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPasswordOld = !showPasswordOld"></v-text-field>
                        <v-text-field v-model="newpassword"  :type="showPasswordNew ? 'text' : 'password'" label="Neues Passwort (Mindestens 8 Zeichen)" :append-icon="showPasswordNew ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPasswordNew = !showPasswordNew"></v-text-field>
                        <v-text-field v-model="repeatPassword"  :type="showPasswordRepeat ? 'text' : 'password'" label="Neues Passwort wiederholen" :append-icon="showPasswordRepeat ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPasswordRepeat = !showPasswordRepeat"></v-text-field>
                    </v-form>
                    <v-container>
                        <v-row>
                            <v-spacer></v-spacer>
                            <v-btn color="success" @click="updatePassword">Fertig</v-btn>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs>
    <v-snackbar v-model="snackbar" color="blue">Daten wurden gespeichert.</v-snackbar>
    <v-snackbar v-model="snackbarAlert" color="red">Ein Fehler ist aufgetreten.</v-snackbar>
    <v-snackbar v-model="snackbarPasswordAlert" color="red">Das alte Passwort ist falsch.</v-snackbar>
     <v-snackbar v-model="shortPasswordAlert" color="red">Das neue Passwort ist zu kurz.</v-snackbar>
    <v-snackbar v-model="samePasswordAlert" color="red">Die Passwörter dürfen nicht übereinstimmen.</v-snackbar>
    <v-snackbar v-model="repeatPasswordAlert" color="red">Passwortwiederholung stimmt nicht mit neuem Passwort überein.</v-snackbar>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
export default {
    name: "settingsComponent",
    async mounted() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.fetch();
            }
        });
    },
    data() {
        return {
            experienceItems: ['keine Vorerfahrung', 'wenig Vorerfahrung', 'viel Vorerfahrung', 'ich kann Wissen vermitteln'],
            oldpassword: "",
            newpassword: "",
            repeatPassword: "",
            showPasswordOld: false,
            showPasswordNew: false,
            showPasswordRepeat: false,
            shortPasswordAlert: false,
            snackbar: false,
            snackbarAlert: false,
            snackbarPasswordAlert: false,
            samePasswordAlert: false,
            repeatPasswordAlert: false,
            erfahrung: ["keine", "wenig", "viel", "kann lehren"],
            activeButton: true,
            tabs: null,
            text: "",
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
            durationTypeOptions: [{
                    value: "days",
                    text: "Tage"
                },
                {
                    value: "weeks",
                    text: "Wochen"
                }
            ],
            searchRangeMin: 0,
            searchRangeMax: 100,
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
                        querySnapshot.forEach(function (doc) {
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
                                    querySnapshot.forEach(function (doc) {
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
                        setTimeout(function () {
                            this.snackbar = false
                        }, 3000);
                    });
            } catch {
                this.snackbarAlert = true;
                setTimeout(function () {
                    this.snackbarAlert = false
                }, 3000);
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
                    if (userS && this.newpassword.length > 7 && this.oldpassword != this.newpassword && this.newpassword == this.repeatPassword) {
                        this.user.updatePassword(this.newpassword);
                        this.snackbar = true;
                        setTimeout(function () {
                            this.snackbar = false
                        }, 3000);
                        this.oldpassword = "";
                        this.newpassword = "";
                        this.repeatPassword ="";
                    }
                    else if(this.newpassword.length <= 7){
                        this.shortPasswordAlert = true;
                        setTimeout(function(){this.shortPasswordAlert = false}, 3000);
                    }
                    else if(this.newpassword == this.oldpassword){
                        this.samePasswordAlert = true;
                        setTimeout(function(){this.samePasswordAlert = false}, 3000);
                    }
                    else if(this.newpassword != this.repeatPassword){
                        this.repeatPasswordAlert = true;
                        setTimeout(function(){this.repeatPasswordAlert = false}, 3000);
                    }
                })
                .catch(() => {
                    this.snackbarPasswordAlert = true;
                    setTimeout(function () {
                        this.snackbarPasswordAlert = false
                    }, 3000);
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
