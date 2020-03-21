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
</v-app> 


</template>


<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
export default {
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
            }],
            AnzeigenID: [],
            
        }
    },
    methods: {
        async fetch() {
            var user = firebase.auth().currentUser
            this.AnzeigenID = await firebase.firestore().collection("AcceptedOffers").where('helperID', '==', user.uid).oderBy('desc').limit(15)
        },
    }
}
</script>

<style>

</style>