<template>
<v-app>
    <v-timeline align-top dense>
        <v-timeline-item v-for="offer in offers" :key="offer.name" color="green">
            <v-row class="1">
                <v-col cols="3">
                    <v-expansion-panels>
                        <v-expansion-panel flat>
                            <v-expansion-panel-header> <strong> {{offer.title}}</strong></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title v-text="offer.agrarianId"></v-list-item-title>
                                            <v-list-item-title v-text="offer.maxHelpers"></v-list-item-title>
                                            <v-list-item-title v-text="offer.harvestType"></v-list-item-title>
                                            <v-list-item-title v-text="offer.place"></v-list-item-title>
                                            <v-list-item-title v-text="offer.startDates"></v-list-item-title>
                                            <v-list-item-title v-text="offer.salary"></v-list-item-title>
                                            <v-list-item-title v-text="offer.description"></v-list-item-title>
                                            <v-list-item-title v-text="offer.equipment"></v-list-item-title>
                                            <v-list-item-title v-text="offer.helperCount"></v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </v-timeline-item>
    </v-timeline>
</v-app>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
export default {
    async mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.fetch()
            }
        });
    },
    data() {
        return {
            offers: [],
            offerIDs: [],

        }
    },
    methods: {
        async fetch() {
            var usID = await firebase.auth();
            console.log(usID);
            usID = usID.currentUser.uid
            console.log("user: " + usID);
            firebase.firestore().collection('AcceptedOffers').where('helperId', '==', usID).get().then(async (querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    var data = doc.data()
                    this.offerIDs.push(data.offerId)
                })
                for (let offerID of this.offerIDs) {
                    firebase.firestore().collection('offers').doc(offerID).get().then(async (querySnapshot) => {
                        this.offers.push(querySnapshot.data())
                    })
                }
            })
        },
    }
}
</script>

<style>

</style>
