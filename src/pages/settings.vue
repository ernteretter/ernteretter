<template>
<v-card max-width="600" class="mx-auto">
    <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Einstellungen</v-toolbar-title>
    </v-toolbar>
    <v-overlay v-if='overlay'>
        <v-card>
            <v-card-text>Bist du sicher, dass du diesen Account entgültig löschen willst?.</v-card-text>
            <v-container>
                <v-row class="mx-auto">
                    <v-btn color="success" @click="overlay=false">abbrechen</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="activeButton" color="red" @click="finalDeletion">entgültig Löschen</v-btn>
                </v-row>
            </v-container>
        </v-card>
    </v-overlay>
    <v-tabs>
        <v-tab>
            <v-icon left>mdi-account</v-icon>
            Konto
        </v-tab>
        <v-tab>
            <v-icon left>mdi-lock</v-icon>
            Präferenzen
        </v-tab>
        <v-tab-item>
            <v-card flat>
                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <v-text-field v-model="user.displayName" label="Name"></v-text-field>
                        <v-text-field v-model="user.email" label="Mail"></v-text-field>
                        <v-row>
                            <v-col>
                                <v-card-text>du bist ein:</v-card-text>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col>
                                <v-card-text v-if="isAgrarian">Landwirt</v-card-text>
                                <v-card-text v-if="!isAgrarian">Helfer</v-card-text>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-container>
                        <v-row>
                            <v-btn color="red" @click="deleteAccount()">Account löschen</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="success" @click="updateAccount">Fertig</v-btn>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-tab-item>

        <v-tab-item>
            <v-card flat>
                <v-card-text>
                    <v-text-field label="Wie lange willst du helfen?" preferences.durationMin></v-text-field>
                    <v-row>
                        <v-slider v-model="searchRange" class="align-center" :max="130" :min="1" hide-details/>
                        <v-text-field v-model="searchRange"></v-text-field>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
export default {
    name: 'settings',
    async mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.fetch()
            }
        });
    },
    data() {
        return {
            searchRange: 0,
            activeButton: true,
            tabs: null,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            accountData: [],
            overlay: false,
            rightName: false,
            user: [],
            preferences: [],
            isAgrarian: false,
            valid: true,
        }
    },
    methods: {
        deleteAccount() {
            this.overlay = true;
            setTimeout(() => (this.activeButton = false), 3000);
            this.activeButton = true;
        },
        async fetch() {
            this.user = await firebase.auth().currentUser
            console.log(this.user)

            var usID = this.user.uid
            await firebase.firestore().collection('helpers').doc(usID).get().then(async (doc) => {
                if (doc.exists) {
                    this.accountData = doc.data()
                } else {
                    await firebase.firestore().collection('agrarians').doc(usID).get().then((doc) => {
                        if (doc.exists) {
                            this.accountData = doc.data()
                            this.isAgrarian = true
                        }
                    })
                }

            })
        },
        async updateAccount() {
            this.user.updateEmail(this.user.email).then((doc) => console.log(doc)).catch((err) => console.log(err))
            this.user.updateProfile({
                displayName: this.user.displayName,
            })
        },
        async finalDeletion() {
            this.overlay = false
            this.user.delete().then(() => {
                this.$router.push("/")
            })
        }
    },
}
</script>

<style>

</style>
