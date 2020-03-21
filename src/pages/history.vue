<template>
<v-app>
    <v-timeline align-top dense>
        <v-timeline-item v-for="elements in Anzeigen" :key="elements.name" color="green">
            <v-row class="1">
                <v-col cols="3">
                    <v-expansion-panels>
                        <v-expansion-panel flat>
                            <v-expansion-panel-header> <strong> {{elements.name}}</strong></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                {{elements.Content}}
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </v-timeline-item>

    </v-timeline>
    <v-btn @click="fetch()"></v-btn>
</v-app>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
export default {
    async mounted(){
        this.fetch()
    },
    data() {
        return {
            Anzeigen: [{
                    name: "Thomas",
                    Ort: "Bonn",
                    Content: "Hallo Welt hier sind infos"
                },
                {
                    name: "Martin",
                    Ort: "Hamburg",
                    Content: "Hallo Welt hier sind infos"
                }
            ],
            offerIDs: [],

        }
    },
    methods: {
        async fetch() {
            var usID =  firebase.auth().currentUser.uid;
                console.log("user: " + usID);
                    firebase.firestore().collection('AcceptedOffers').where('helperId', '==', usID).get().then(async (querySnapshot) => {
                        querySnapshot.forEach(async (doc) => {
                            var data = doc.data()
                            console.log(data.offerId);
                            this.offerIDs.push(data.offerId)
                            console.log(this.offerIDs);
                        })
                        console.log("ids:");  
                        console.log(this.offerIDs);
                    })
                    
                    
            },
        }
    }
</script>

<style>

</style>
