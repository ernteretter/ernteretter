<template>
 <v-app>
     <v-timeline align-top dense>
     <v-timeline-item v-for="elements in Anzeigen" :key="elements.name"
     color="green"
     >
         <v-row class="1">
             <v-col cols="3">
                 <v-expansion-panels>
                 <v-expansion-panel flat>
                 <v-expansion-panel-header> <strong> {{elements.title}}</strong></v-expansion-panel-header>
                 <v-expansion-panel-content>
                     <v-list>
                         <v-list-item>
                         <v-list-item-content>
                             <v-list-item-title v-text="elements.agrarianId"></v-list-item-title>
                              <v-list-item-title v-text="elements.maxHelpers"></v-list-item-title>
                               <v-list-item-title v-text="elements.harvestType"></v-list-item-title>
                                <v-list-item-title v-text="elements.place"></v-list-item-title>
                                 <v-list-item-title v-text="elements.startDates"></v-list-item-title>
                                  <v-list-item-title v-text="elements.salary"></v-list-item-title>
                                   <v-list-item-title v-text="elements.description"></v-list-item-title>
                                    <v-list-item-title v-text="elements.equipment"></v-list-item-title>
                                    <v-list-item-title v-text="elements.helperCount"></v-list-item-title>
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
                title: "Bauer Sigmund",
                agrarianId: "String",
                maxHelpers: "Number",
                minDuration:" Number",
                harvestType: "String",
                place:" GeoPoint",
                startDates: "",
                salary: "Number" ,
                description: "String",
                equipment:"Array",
                helperCount: "Number"

            },
            {
                title: "Bauer Sigmund",
                agrarianId: "String",
                maxHelpers: "Number",
                minDuration:" Number",
                harvestType: "String",
                place:" GeoPoint",
                startDates: "",
                salary: "Number" ,
                description: "String",
                equipment:"Array",
                helperCount: "Number"
            },
            {
                title: "Bauer Sigmund",
                agrarianId: "String",
                maxHelpers: "Number",
                minDuration:" Number",
                harvestType: "String",
                place:" GeoPoint",
                startDates: "",
                salary: "Number" ,
                description: "String",
                equipment:"Array",
                helperCount: "Number"
            },
            {
                title: "Bauer Sigmund",
                agrarianId: "String",
                maxHelpers: "Number",
                minDuration:" Number",
                harvestType: "String",
                place:" GeoPoint",
                startDates: "",
                salary: "Number" ,
                description: "String",
                equipment:"Array",
                helperCount: "Number"
            }],
            AnzeigenID: [],

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
