<template>
<div class="editOffer">
    <v-card max-width="1000" class="mx-auto text-center">
        <v-container id="header">
            <v-card-title class="display-1 justify-center" id="headertitle">Erstellen sie Ihren Aufruf</v-card-title>
        </v-container>

        <v-card-title> Bitte beschreiben Sie kurz die Tätigkeit.</v-card-title>

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
            </v-radio-group>
        </v-row>

        <v-container>
            <v-select single-line solo :rules="helperRule" v-model="harvestType" :items="items" label="Was soll geerntet/gesäht werden?">
            </v-select>
        </v-container>

        <v-card-title> In welchem Zeitraum benötigen Sie Hilfe?
        </v-card-title>

        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
            <template v-slot:activator="{ on }">
                <v-text-field single-line solo :rules="helperRule" v-model="datesText" label="Bitte wählen sie einen Zeitraum aus" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="dates" @input="menu2 = false" range></v-date-picker>
        </v-menu>

        <v-container>

            <v-text-field single-line solo type="number" :rules="helperRule" v-model="salary" label="Welche Vergütung wird angedacht? (Euro pro Stunde)"></v-text-field>

            <v-text-field :v-model="equipment" label="Welche Ausrüstung sollen die Helfer mitbringen?" single-line solo></v-text-field>

        </v-container>

        <v-btn class="rounded-button-left" x-large outlined color="primary" @click="createOffer()">
            Aufruf Abschicken
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
        dates: [],
        items: ['Äpfel', 'Birnen', 'Spargel', 'Kartoffeln', 'Erdbeeren']
    }),
    computed: {
        datesText() {
            let niceDates = this.dates.map(a => a.toDate().toLocaleDateString())
            console.log(niceDates);
            return niceDates.join(" bis ");
        }
    },
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
                this.dates = [doc.data().startDate.toDate().toISOString(), doc.data().endDate.toDate().toISOString()];
                this.salary = doc.data().salary;
                this.equipment = doc.data().equipment;
                this.description = doc.data().description;
            } else {
                console.log("Error");
            }
        })
    },
    methods: {
        updateOffer() {
            if (this.street == null || this.houseNumber == null || this.postCode == null || this.city == null || this.title == null || this.maxHelpers == null || this.harvestType == null || this.salary == null || this.description == null || this.equipment == null || this.dates == null) {
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
                address: address,
                title: this.title,
                agrarianId: userID,
                description: this.description,
                equipment: this.equipment,
                postCode: parseInt(this.place),
                harvestType: this.harvestType,
                helperCount: 0,
                maxHelpers: parseInt(this.maxHelpers),
                minDuration: duration,
                salary: parseInt(this.salary),
                startDate: firstDate,
                endDate: lastDate,
                workType: this.radioErnteSaat == "0" ? true : false
            }

            let offerId = this.$route.params.offerId;
            let firestore = firebase.firestore();
            var newOffer = firestore.collection('offers').doc(offerId);
            newOffer.update(data).then(() => {
                    console.log("Document updated successfully!")
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
