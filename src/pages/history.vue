<template>
 <v-app>
     <v-btn @click="fetch">fetch</v-btn>
</v-app> 
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
export default {
    data() {
        return {
            Anzeigen: [],
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