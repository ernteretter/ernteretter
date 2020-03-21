<template>
<div class="createOffer">
    <h1>Erstelle deinen Aufruf!</h1>
    <v-card>
        <h3>
            Wie viele Helfer werden benötigt?
        </h3>
        <v-col cols="5" sm="5">
            <v-text-field v-model="maxHelpers" label="Anzahl" single-line solo></v-text-field>
        </v-col>
    </v-card>

    <v-card>
        <h3> Wo liegen deine Felder? </h3>
        <v-col cols="5" sm="5">
            <v-text-field v-model="place" label="PLZ/Ort" single-line solo></v-text-field>
        </v-col>
    </v-card>
    <!--
    <v-card>
      <h3> Wobei brauchst du Hilfe? </h3>
      <v-row>
      <v-checkbox
        v-model="checkbox"
        :label="'Ernte'">
      </v-checkbox>
      <v-checkbox
        v-model="checkbox"
        :label="'Saat'">
      </v-checkbox>
      </v-row>
    </v-card>
    -->

    <v-card>
        <h3> Was soll geerntet/gesäht werden? </h3>
        <v-col cols="5" sm="5">

            <v-select v-model="harvestType" :items="items" label="Art der Saat">
            </v-select>
        </v-col>
    </v-card>

    <v-card>
        <h3> In welchem Zeitraum? </h3>
        <v-date-picker v-model="dates" range></v-date-picker>
        <v-text-field v-model="datesText" label="Zeitraum" prepend-icon="mdi-calendar" readonly />
    </v-card>

    <v-card>
        <h3> Welche Vergütung bekommen deine Helfer (in Euro)? </h3>
        <v-col cols="5" sm="5">
            <v-text-field v-model="salary" label="Verguetung" single-line solo></v-text-field>
        </v-col>

    </v-card>

    <v-card>
        <h3> Welche Ausrüstung wird benötigt?</h3>
        <v-col cols="5" sm="5">
            <v-text-field v-model="equipment" label="Ausrüstung" single-line solo></v-text-field>
        </v-col>
    </v-card>

    <v-card>
        <h3> Beschreibe die Tätigkeit für deine Helfer.</h3>
        <v-col cols="5" sm="5">
            <v-textarea v-model="description" solo label="Beschreibung"></v-textarea>
        </v-col>
    </v-card>

    <v-btn rounded color="primary" dark @click="createOffer()">
        Absenden
    </v-btn>
</div>
</template>

<script>
import * as firebase from "firebase";
import 'firebase/firestore';

export default {
    name: 'createOffer',
    data: () => ({
        maxHelpers: 0,
        minDuration: 0,
        harvestType: "",
        place: "",
        salary: 0,
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
    methods: {
        createOffer() {
            let userID = 88; //firebase.auth().currentUser.uid;
            let data = {
                agrarianId: userID,
                description: this.description,
                equipment: this.equipment,
                place: this.place,
                harvestType: this.harvestType,
                helperCount: 0,
                maxHelpers: this.maxHelpers,
                minDuration: 5,
                startDates: this.dates.sort((a, b)),
            }
            let firestore = firebase.firestore();
            var newOffer = firestore.collection('offers').doc();
            newOffer.set(data).then(function () {
                    console.log("Document written successfully!")
                })
                .catch(function (error) {
                    console.error("Error writing Document: ", error);
                })
        }
    }
}
</script>
