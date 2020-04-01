<template>
<v-card max-width="1000px" class="mx-auto">
    <v-container>
        <v-card-title>Feedback</v-card-title>
        <v-text-field :v-model="user ? user.displayName : ''" solo single-line label="Name"></v-text-field>
        <v-text-field solo single-line label="E-Mail"></v-text-field>
        <v-textarea solo single-line label="Ihr Anliegen"></v-textarea>
        <v-row>
            <v-btn v-bind="size" color="primary" id="searchbutton" @click="atSearch();" class="rounded-button-left ma-3 ml-auto" min-width="11%">Abschicken</v-btn>
        </v-row>
    </v-container>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
export default {
    data(){
        return{
            user: null,
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.user = user
            } else {
                this.user = false
            }
        })
    }
}
</script>

<style>

</style>
