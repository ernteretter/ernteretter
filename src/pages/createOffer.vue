<template>
<div class="editOffer">
    <v-card max-width="1000" class="mx-auto text-center">
        <v-container id="header">
            <v-card-title class="display-1 justify-center" id="headertitle">Erstellen sie Ihre Anzeige</v-card-title>
        </v-container>

        <v-card-title class="justify-center"> Bitte beschreiben Sie kurz die Tätigkeit.</v-card-title>

        <v-container>
            <v-text-field :rules="helperRule" v-model="title" label="Titel" single-line solo></v-text-field>
            <v-textarea :rules="helperRule" v-model="description" single-line solo label="Beschreibung"></v-textarea>
        </v-container>

        <v-container>
            <v-text-field :rules="helperRule" type="number" v-model="maxHelpers" single-line solo label="Wie viele Helfer brauchen Sie?"></v-text-field>
        </v-container>

        <v-card-title class="justify-center" single-line solo> Wo liegen die Felder auf denen Sie Hilfe benötigen? </v-card-title>
        <v-container>
            <v-text-field :rules="helperRule" v-model="street" label="Straße" single-line solo/>
            <v-text-field :rules="helperRule" v-model="houseNumber" label="Hausnummer" single-line solo/>
            <v-text-field :rules="helperRule" v-model="postCode" type="number" label="Postleitzahl" single-line solo/>
            <v-text-field :rules="helperRule" v-model="city" label="Stadt" single-line solo/>
        </v-container>

        <v-card-title class="justify-center"> Wobei benötigen Sie Hilfe? </v-card-title>
        <v-row justify="center">
            <v-radio-group v-model="radioErnteSaat" row class="justify-center align-center">
                <v-radio label="Ernte"> </v-radio>
                <v-radio label="Aussaat"> </v-radio>
                <v-radio label="Sonstiges"> </v-radio>
            </v-radio-group>
        </v-row>

        <v-container>
            <v-select single-line solo :rules="helperRule" v-model="harvestType" :items="items" label="Was soll geerntet/gesäht werden?">
            </v-select>
        </v-container>

        <v-card-title class="justify-center"> In welchem Zeitraum benötigen Sie Hilfe?
        </v-card-title>

        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
            <template v-slot:activator="{ on }">
                <v-text-field single-line solo :rules="helperRule" v-model="datesText" label="Bitte wählen sie einen Zeitraum aus" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="dates" @input="menu2 = false" range></v-date-picker>
        </v-menu>

        <v-container>
            <v-card-subtitle> optionale Felder </v-card-subtitle>
            <v-text-field single-line solo type="number" :rules="helperRule" v-model="salary" label="Welche Vergütung wird angedacht? (Euro pro Stunde)"></v-text-field>

            <v-text-field :v-model="equipment" label="Welche Ausrüstung sollen die Helfer mitbringen?" single-line solo></v-text-field>

            <v-text-field :v-model="driverslicence" label="Welche Führerscheinklasse sollen die Helfer haben?" single-line solo></v-text-field>

        </v-container>

        <v-btn class="rounded-button-left" x-large outlined color="primary" @click="createOffer()">
            Anzeige Abschicken
        </v-btn>
    </v-card>
</div>
</template>

<script>
import * as firebase from "firebase";
import 'firebase/firestore';

export default {
    name: 'createOffer',
    data: () => ({
        menu2: false,
        helperRule: [
            v => !!v || 'Feld wird benötigt'
        ],
        street: null,
        houseNumber: null,
        postCode: null,
        city: null,
        radioErnteSaat: null,
        title: null,
        maxHelpers: null,
        minDuration: null,
        harvestType: null,
        salary: null,
        description: null,
        equipment: null,
        driverslicence: null,
        dates: [],
        items: ['Äpfel', 'Birnen', 'Spargel', 'Kartoffeln', 'Erdbeeren', 'Trauben', 'Sonstiges']
    }),
    computed: {
        datesText() {
            return this.dates
                .map(d =>
                    new Date(d)
                    .toISOString()
                    .substr(0, 10)
                    .split("-")
                    .reverse()
                    .join("."))
                .join(" bis ");
        }
    },
    methods: {
        createOffer() {
            if (this.street == null || this.houseNumber == null || this.postCode == null || this.city == null || this.title == null || this.maxHelpers == null || this.harvestType == null || this.salary == null || this.description == null || this.dates == null) {
                alert("Bitte füllen Sie alle Felder!");
                return;
            }
            let userID = firebase.auth().currentUser.uid;
            let datesAsDates = this.dates.map((a) => new Date(a));
            let datesSorted = datesAsDates.sort((a, b) => {
                return a > b ? 1 : (b > a ? -1 : 0);
            });
            let firstDate = datesSorted[0];
            let lastDate = datesSorted[1];
            let difference = lastDate.getTime() - firstDate.getTime();
            let duration = difference / 1000 / 60 / 60 / 24;
            let address = {
                street: this.street,
                number: this.houseNumber,
                postCode: this.postCode,
                city: this.city
            };
            let data = {
                title: this.title,
                address: address,
                agrarianId: userID,
                description: this.description,
                equipment: this.equipment,
                driverslicence: this.driverslicence,
                harvestType: this.harvestType,
                helperCount: 0,
                maxHelpers: parseInt(this.maxHelpers),
                minDuration: duration,
                salary: parseInt(this.salary),
                startDate: firstDate,
                endDate: lastDate,
                workType: this.radioErnteSaat == "0" ? true : false
            }

            let firestore = firebase.firestore();
            var newOffer = firestore.collection('offers').doc();
            newOffer.set(data).then(() => {
                    console.log("Document written successfully!")
                    this.$router.push("/history");
                })
                .catch(function (error) {
                    console.error("Error writing Document: ", error);
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
