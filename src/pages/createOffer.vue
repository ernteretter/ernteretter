<template>
<div class="createOffer">
    <h1>Erstelle deinen Aufruf!</h1>
    <v-card>
        <h3>
            Wie viele Helfer werden benötigt?
        </h3>
        <v-col cols="5" sm="5">
            <v-text-field type="number" v-model="maxHelpers" label="Anzahl" single-line solo></v-text-field>
        </v-col>
    </v-card>

    <v-card>
        <h3> Wo findet die Ernte/Saat statt? </h3>
        <v-col cols="5" sm="5">
            <v-text-field v-model="place" type="number" label="Postleitzahl" single-line solo></v-text-field>
        </v-col>
    </v-card>

    <v-card>
        <h3> Wobei brauchst du Hilfe? </h3>
        <v-row>
            <v-radio-group v-model="radioErnteSaat">
                <v-radio :label="'Ernte'" />
                <v-radio :label="'Saat'" />
            </v-radio-group>
        </v-row>
    </v-card>

    <v-card>
        <h3> Was soll geerntet/gesäht werden? </h3>
        <v-col cols="5" sm="5">

            <v-select v-model="harvestType" :items="items" label="Art der Saat/Ernte">
            </v-select>
        </v-col>
    </v-card>

    <v-card>
        <h3> In welchem Zeitraum? </h3>
        <v-date-picker v-model="dates" range></v-date-picker>
        <v-text-field v-model="datesText" label="Zeitraum" prepend-icon="mdi-calendar" readonly />
    </v-card>

    <v-card>
        <h3> Welche Vergütung bekommen deine Helfer (Euro pro Stunde)? </h3>
        <v-col cols="5" sm="5">
            <v-text-field type="number" v-model="salary" label="Vergütung" single-line solo></v-text-field>
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
            <v-text-field v-model="title" solo label="Titel"></v-text-field>
        </v-col>
        <v-col cols="5" sm="5">
            <v-textarea v-model="description" solo label="Beschreibung"></v-textarea>
        </v-col>
    </v-card>

    <v-card>
        <h3> Teile deinen Helfern mit, wo sie hinkommen sollen. </h3>
        <v-col cols="5" sm="5">
            <v-textarea v-model="address" solo label="Adresse"></v-textarea>
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
        address: "",
        radioErnteSaat: "",
        title: "",
        maxHelpers: "",
        minDuration: "",
        harvestType: "",
        place: "",
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
        // console.log(firebase.auth().currentUser);
        // if (firebase.auth().currentUser == null) {
        //     this.$router.push("/login");
        //     alert("Bitte logge dich ein.");
        //     return;
        // }
        // let userID = firebase.auth().currentUser.uid;
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
            console.log("duration: " + duration);
            let data = {
                address: this.address,
                title: this.title,
                agrarianId: userID,
                description: this.description,
                equipment: this.equipment,
                place: this.place,
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
            newOffer.set(data).then(function () {
                    console.log("Document written successfully!")
                })
                .catch(function (error) {
                    console.error("Error writing Document: ", error);
                    alert("Konnte Datenbank nicht erreichen. Haben sie Internetzugang?");
                })
        }
    }
}
</script>
