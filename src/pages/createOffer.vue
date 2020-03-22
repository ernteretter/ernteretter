<template>
<div class="editOffer">
    <v-card max-width="800" class="mx-auto text-center">
        <v-card-title class="display-1 justify-center">Erstellen sie Ihren Aufruf</v-card-title>
        <v-container>
            <v-text-field type="number" v-model="maxHelpers" label="Wie viele Helfer brauchen Sie?" single-line></v-text-field>
        </v-container>

        <v-card-title class="justify-center"> Wo liegen die Felder auf denen Sie Hilfe benötigen? </v-card-title>
        <v-container>
            <v-text-field v-model="street" label="Straße" />
            <v-text-field v-model="houseNumber" label="Hausnummer" />
            <v-text-field v-model="postCode" type="number" label="Postleitzahl" />
            <v-text-field v-model="city" label="Stadt" />
        </v-container>

        <v-card-title class="justify-center"> Wobei benötigen Sie Hilfe? </v-card-title>
        <v-row justify="center">
            <v-radio-group v-model="radioErnteSaat" row class="justify-center align-center">
                <v-radio label="Ernte"> </v-radio>
                <v-radio label="Aussaat"> </v-radio>
            </v-radio-group>
        </v-row>

        <v-container>
            <v-select v-model="harvestType" :items="items" label="Was soll geerntet/gesäht werden?">
            </v-select>
        </v-container>

        <v-card-title> In welchem Zeitraum benötigen Sie Hilfe?
        </v-card-title>

        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
            <template v-slot:activator="{ on }">
                <v-text-field v-model="datesText" label="Bitte wählen sie einen Zeitraum aus" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="dates" @input="menu2 = false" range></v-date-picker>
        </v-menu>

        <v-container>
            <!-- <v-row>
                <v-date-picker v-model="dates" range></v-date-picker>
                <v-text-field v-model="datesText" label="Zeitraum" prepend-icon="mdi-calendar" disabled></v-text-field>
            </v-row> -->

            <v-text-field type="number" v-model="salary" label="Welche Vergütung wird angedacht? (Euro pro Stunde)" single-line></v-text-field>

            <v-text-field v-model="equipment" label="Welche Ausrüstung sollen die Helfer mitbringen?" single-line></v-text-field>

        </v-container>

        <v-card-title> Bitte beschreiben Sie kurz die Tätigkeit.</v-card-title>

        <v-container>
            <v-text-field v-model="title" label="Titel"></v-text-field>
            <v-textarea v-model="description" outlined label="Beschreibung"></v-textarea>
        </v-container>

        <v-btn rounded color="primary" dark @click="updateOffer()">
            Aufruf abschicken
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
        dates: [],
        items: ['Aepfel', 'Birnen', 'JOhnnyStinkt']
    }),
    computed: {
        datesText() {
            return this.dates.join(" bis ");
        }
    },
    mounted: function () {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let docRef = firebase.firestore().collection("agrarians").doc(user.uid);

                docRef.get().then((doc) => {
                    if (!doc.exists) {
                        console.log(2);
                        this.$router.push("/login");
                        alert("Du bist kein Landwirt!");
                        return;
                    }
                })
            }
        });

    },
    methods: {
        createOffer() {
            let userID = firebase.auth().currentUser.uid;
            let datesAsDates = this.dates.map((a) => new Date(a));
            let datesSorted = datesAsDates.sort((a, b) => {
                return a > b ? 1 : (b > a ? -1 : 0);
            });
            let firstDate = datesSorted[0];
            let lastDate = datesSorted[1];
            let difference = lastDate.getTime() - firstDate.getTime();
            let duration = difference / 1000 / 60 / 60 / 24;
            let address = {street: this.street, number: this.houseNumber, postCode: this.postCode, city: this.city};
            let data = {
                title: this.title,
                address: address,
                agrarianId: userID,
                description: this.description,
                equipment: this.equipment,
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
</style>
