<template>
<v-card max-width="1000px" class="mx-auto">
    <v-container v-if="haventSendFeedback">
        <v-card-title>Feedback</v-card-title>
        <v-text-field v-model="name" :rules="rules.name" solo single-line label="Name"></v-text-field>
        <v-text-field v-model="mail" :rules="rules.mail" solo single-line label="E-Mail"></v-text-field>
        <v-textarea v-model="text" :rules="rules.text" solo single-line label="Ihr Anliegen"></v-textarea>
        <v-row>
            <v-btn color="primary" id="searchbutton" @click="send();" class="rounded-button-left ma-3 ml-auto" min-width="11%">Abschicken</v-btn>
        </v-row>
    </v-container>
    <v-container v-if="!haventSendFeedback">
        <v-card-title>Danke, für ihr Feedback</v-card-title>
        <v-btn color="primary" outlined @click="$router.go(-1)">zurück</v-btn>
    </v-container>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
export default {
    data() {
        return {
            haventSendFeedback: true,
            name: "",
            mail: "",
            text: "",
            userID: null,
            rules: {
                name: [value => !!value || 'Name wird benötigt.'],
                mail: [
                    value => !!value.trim() || 'E-Mail-Adresse wird benötigt.',
                    value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return pattern.test(value) || 'Ungültige E-Mail-Adresse.';
                    }
                ],
                text: [
                    value => !!value.trim() || 'Text wird benötigt.',
                    value => value.length < 2500 || 'Der Text darf maximal 2500 Zeichen betragen'
                ],
            }
        }
    },
    methods: {
        send() {
            firebase.firestore().collection('feedback').add({
                name: this.name,
                mail: this.mail,
                text: this.text,
                userID: this.userID,
            }).then(() => {
                this.haventSendFeedback = false
            }).catch(err => {
                console.log(err);

            })
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.name = user.displayName
                this.mail = user.email
                this.userID = user.uid
            } else {
                this.user = false
            }
        })
    }
}
</script>

<style>

</style>
