<template>
<v-card max-width="600" class="mx-auto">
    <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Einstellungen</v-toolbar-title>
    </v-toolbar>
    <v-overlay v-if='overlay' light>
        <v-card light="true">
            <v-card-text light="true">Du bist dabei deinen Account zu löschen. Wenn du dir sicher bist, tippe unten deinen Benutzername zum Bestätigen ein.</v-card-text>
            <v-container light="true">
                <v-text-field v-model="writtenName"></v-text-field>
                <v-row class="mx-auto">
                    <v-btn color="success" @click="overlay=false">abbrechen</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="red" disabled="rightName">entgültig Löschen</v-btn>
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
                    <v-from>
                        <v-text-field v-model="user.displayName" label="Name"></v-text-field>
                        <v-text-field v-model="user.email" label="Mail"></v-text-field>
                        <v-text-field v-model="user.phoneNumber" label="Telefonnummer"></v-text-field>
                    </v-from>
                    <v-container>
                        <v-row>
                            <v-btn color="red" @click="deleteAccount()">Account löschen</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="success">Fertig</v-btn>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-tab-item>

        <v-tab-item>
            <v-card flat>
                <v-card-text>
                    <p>
                        Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
                    </p>

                    <p>
                        Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
                    </p>

                    <p>
                        Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
                    </p>

                    <p>
                        Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
                    </p>

                    <p class="mb-0">
                        Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
                    </p>
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
    async mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.fetch()
            }
        });
    },
    data() {
        return {
            tabs: null,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            accountData: [],
            overlay: false,
            rightName: false,
            writtenName: "",
            user: [],
            isAgrarian: false,
        }
    },
    methods: {
        deleteAccount() {
            this.overlay = true;
        },
        async fetch() {
            this.user = await firebase.auth().currentUser
            console.log(this.user);
            
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
        }
    },
    watch: {
        writtenName: () => {
            if (this.writtenName == this.user.displayName) {
                this.rightName = true;
            }
        }
    }
}
</script>

<style>

</style>
