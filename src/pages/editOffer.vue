<template>
<div class="editOffer">
    <v-card max-width="1000" class="mx-auto text-center">
        <v-form ref="form" v-model="valid" lazy-validation style="width: 100%">
            <v-container id="header">
                <v-card-title class="display-1 justify-center" id="headertitle">Updaten sie Ihre Anzeige</v-card-title>
            </v-container>

            <v-card-title> Bitte beschreiben Sie kurz die Tätigkeit.</v-card-title>

            <v-container>
                <v-text-field :rules="rules.title" v-model="title" label="Titel" single-line solo></v-text-field>
                <v-textarea :rules="rules.description" v-model="description" single-line solo label="Beschreibung"></v-textarea>
            </v-container>

            <v-container>
                <v-text-field :rules="rules.maxHelpers" type="number" v-model="maxHelpers" single-line solo label="Wie viele Helfer brauchen Sie?"></v-text-field>
            </v-container>

            <v-card-title class="justify-center" single-line solo> Wo liegen die Felder auf denen Sie Hilfe benötigen? </v-card-title>
            <v-container>
                <v-text-field :rules="rules.street" v-model="street" label="Straße" single-line solo/>
                <v-text-field :rules="rules.houseNumber" v-model="houseNumber" label="Hausnummer" single-line solo/>
                <v-text-field :rules="rules.postCode" v-model="postCode" type="number" label="Postleitzahl" single-line solo/>
                <v-text-field :rules="rules.city" v-model="city" label="Stadt" single-line solo/>
            </v-container>

            <v-card-title class="justify-center"> Wobei benötigen Sie Hilfe? </v-card-title>
            <v-row justify="center">
                <v-radio-group :rules="rules.radioErnteSaat" v-model="radioErnteSaat" row class="justify-center align-center">
                    <v-radio value="harvest" label="Ernte"> </v-radio>
                    <v-radio value="seed" label="Aussaat"> </v-radio>
                    <v-radio value="other" label="Sonstiges"> </v-radio>
                </v-radio-group>
            </v-row>

            <v-container>
                <v-select single-line solo :rules="rules.harvestType" v-model="harvestType" :items="items" label="Was soll geerntet/gesäht werden?">
                </v-select>
            </v-container>

            <v-card-title class="justify-center"> In welchem Zeitraum benötigen Sie Hilfe? </v-card-title>

            <v-row justify="center">
                <v-col cols="10" sm="3">
                    <v-menu
                            ref="menuStartDate"
                            v-model="menuStartDate"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                    single-line
                                    solo
                                    :rules="rules.startDateText"
                                    v-model="startDateText"
                                    label="Anfangsdatum"
                                    hint="von"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                            />
                        </template>
                        <v-date-picker
                                v-model="startDate"
                                :min="dateNow"
                                locale="de-DE"
                        >
                            <v-spacer></v-spacer>
                            <v-btn text outlined color="primary" @click="menuStartDate = false">Abbrechen</v-btn>
                            <v-btn text outlined color="primary" @click="$refs.menuStartDate.save(startDate)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="100" sm="1" class="mt-3">
                    <p>bis</p>
                </v-col>
                <v-col cols="10" sm="3">
                    <v-menu
                            ref="menuEndDate"
                            v-model="menuEndDate"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                    single-line
                                    solo
                                    :rules="rules.endDateText"
                                    v-model="endDateText"
                                    label="Enddatum"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                            />
                        </template>
                        <v-date-picker
                                v-model="endDate"
                                :min="(startDate && (startDate > dateNow)) ? startDate : dateNow"
                                locale="de-DE"
                        >
                            <v-spacer></v-spacer>
                            <v-btn text outlined color="primary" @click="menuEndDate = false">Abbrechen</v-btn>
                            <v-btn text outlined color="primary" @click="$refs.menuEndDate.save(endDate)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>

            <v-container>

            <v-card-subtitle> optionale Felder </v-card-subtitle>

                <v-text-field single-line solo type="number" :rules="rules.salary" v-model="salary" label="Welche Vergütung wird angedacht? (Euro pro Stunde)"></v-text-field>

                <v-text-field :v-model="equipment" label="Welche Ausrüstung sollen die Helfer mitbringen?" single-line solo></v-text-field>
                
                <v-text-field :v-model="driverslicence" label="Welche Führerscheinklasse sollen die Helfer haben?" single-line solo></v-text-field>

            </v-container>
            <v-row justify="center" v-if="formWarning && !valid">
                <v-alert dense outlined  type="error">
                    Das Formular ist nicht vollständig ausgefüllt
                </v-alert>
            </v-row>

            <v-btn class="rounded-button-left" :disabled="formWarning && !valid" x-large outlined color="primary" @click="updateOffer()">
                Anzeige Updaten
            </v-btn>
        </v-form>
    </v-card>
</div>
</template>

<script>
import * as firebase from "firebase";
import 'firebase/firestore';

export default {
    name: 'createOffer',
    data: () => ({
        valid: true,
        formWarning: false,
        dateNow: new Date().toISOString().substr(0, 10),
        startDate: null,
        endDate: null,
        startDateText: "",
        endDateText: "",
        menuStartDate: false,
        menuEndDate: false,
        street: "",
        houseNumber: "",
        postCode: "",
        city: "",
        radioErnteSaat: "",
        title: "",
        maxHelpers: "",
        minDuration: "",
        harvestType: "",
        salary: "",
        description: "",
        equipment: "",
        driverslicence: "",
        items: ['Äpfel', 'Birnen', 'Spargel', 'Kartoffeln', 'Erdbeeren', 'Trauben', 'Sonstiges'],
        rules: {
            title: [value => !!value.trim() || 'Titel wird benötigt.'],
            description: [value => !!value || 'Beschreibung wird benötigt.'],
            maxHelpers: [value => !!value || 'Anzahl Helfer wird benötigt.'],
            street: [value => !!value || 'Straße wird benötigt.'],
            houseNumber: [value => !!value || 'Hausnummer wird benötigt.'],
            postCode: [
                value => !!value.trim() || 'PLZ wird benötigt.',
                value => {
                    const pattern = /^[0-9]{4,5}$/;
                    return pattern.test(value) || 'Ungültige PLZ.';
                }
            ],
            city: [value => !!value || 'Stadt wird benötigt.'],
            radioErnteSaat: [value => !!value || 'Hilfe-Typ wird benötigt.'],
            harvestType: [value => !!value || 'Art der Ernte/Aussaat wird benötigt.'],
            startDateText: [value => !!value || 'Anfangsdatum wird benötigt.'],
            endDateText: [value => !!value || 'Enddatum wird benötigt.']
        }
    }),
    mounted() {
        let offerId = this.$route.params.offerId;
        let firestore = firebase.firestore();
        let docRef = firestore.collection("offers").doc(offerId);
        docRef.get().then((doc) => {
            if (doc.exists) {
                this.address = doc.data().address;
                this.street = doc.data().address.street;
                this.postCode = doc.data().address.postCode;
                this.houseNumber = doc.data().address.number;
                this.city = doc.data().address.city;
                this.title = doc.data().title;
                this.radioErnteSaat = doc.data().workType ? 1 : 0;
                this.maxHelpers = doc.data().maxHelpers;
                this.place = doc.data().postCode;
                this.harvestType = doc.data().harvestType;
                this.startDate = this.formatDateObject(doc.data().startDate.toDate());
                this.endDate = this.formatDateObject(doc.data().endDate.toDate());
                this.salary = doc.data().salary;
                this.equipment = doc.data().equipment;
                this.driverslicence = doc.data().driverslicence;
                this.description = doc.data().description;
                this.radioErnteSaat = doc.data().workType;
            }
        })
    },
    watch: {
        startDate(val) {
            this.startDateText = this.formatDate(val);
            if (this.endDate && (val > this.endDate)) {
                this.endDate = val;
            }
        },
        endDate(val) {
            this.endDateText = this.formatDate(val);
        }
    },
    methods: {
        formatDateObject(date) {
            if (!date) {
                return "";
            }
            let day = date.getDate();
            let month = date.getMonth()+1;
            return date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
        },
        formatDate(date) {
            if (!date) {
                return null;
            }
            const [year, month, day] = date.split('-');
            return `${day}.${month}.${year}`;
        },
        updateOffer() {
            this.formWarning = !this.$refs.form.validate();
            if (this.formWarning) {
                return;
            }
            let userID = firebase.auth().currentUser.uid;
            let startDate = new Date(this.startDate);
            let endDate = new Date(this.endDate);
            let difference = startDate.getTime() - endDate.getTime();
            let duration = difference / 1000 / 60 / 60 / 24;
            let address = {
                street: this.street,
                number: this.houseNumber,
                postCode: this.postCode,
                city: this.city
            };
            let data = {
                address: address,
                title: this.title,
                agrarianId: userID,
                description: this.description,
                equipment: this.equipment,
                driverslicence: this.driverslicence,
                harvestType: this.harvestType,
                helperCount: 0,
                maxHelpers: parseInt(this.maxHelpers),
                minDuration: duration,
                salary: parseInt(this.salary),
                startDate: startDate,
                endDate: endDate,
                workType: this.radioErnteSaat
            }

            let offerId = this.$route.params.offerId;
            let firestore = firebase.firestore();
            var newOffer = firestore.collection('offers').doc(offerId);
            newOffer.update(data).then(() => {
                    this.$router.push("/history");
                })
                .catch(() => {
                    alert("Konnte Datenbank nicht erreichen. Haben sie Internetzugang?");
                })
        }
    }
}
</script>
<style>
#header {
    background: #ed9a00;
}
#headertitle {
    color: white;
}
</style>
