<template>
<v-app>
    <v-alert v-if="displayAlert" dismissible :type="alertType" width="400px" class="mx-auto mt-5">{{alertText}}</v-alert>

    <v-col cols="12">
        <v-card class="mx-auto mt-5 col-sm-12 col-md-5" transition="slide-x-transition" v-if="!displayPasswordForgotten">
            <v-card-title class="secondary--text">
                <h1 class="mx-auto">Login</h1>
            </v-card-title>
            <form class="mx-auto col-sm-12 col-md-12" v-on:submit.prevent="onLogin()">
                <v-text-field class="col-12 col-md-8 mx-auto" v-model="mail" label="E-Mail" />
                <v-text-field class="col-12 col-md-8 mx-auto" :type="showPassword ? 'text' : 'password'" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" v-model="password" />
                <v-overlay :absolute="true" :value="overlay">
                    <v-progress-circular indeterminate>
                    </v-progress-circular>
                </v-overlay>
                <v-card-actions>
                    <v-row>
                        <v-btn class="col-12 col-sm-6" color="secondary" @click="displayPasswordForgotten  = !displayPasswordForgotten" outlined>Passwort vergessen?</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" class="rounded-button-left mx-auto" type="submit" outlined @click="onLogin()">login</v-btn>
                    </v-row>
                </v-card-actions>
            </form>
        </v-card>
        <v-card class="mx-auto mt-5 col-sm-12 col-md-5" v-if="displayPasswordForgotten">
            <v-card-title>
                <h1>Login</h1>
            </v-card-title>
            <v-form class="mx-auto col-sm-12 col-md-12">
                <v-text-field v-model="mail" label="E-Mail" />
                <v-overlay :absolute="true" :value="overlay">
                    <v-progress-circular indeterminate>
                    </v-progress-circular>
                </v-overlay>
            </v-form>
            <v-card-actions>
                <v-btn color="secondary" @click="displayPasswordForgotten  = !displayPasswordForgotten" outlined> abbruch</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="resetPassword()" outlined>Passwort zurücksetzen</v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</v-app>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
export default {
    mounted() {
        this.alreadyLoggedIn(this.$router);
    },
    data() {
        return {
            alertText: "",
            alertType: "error",
            displayPasswordForgotten: false,
            mail: '',
            password: '',
            displayAlert: false,
            documents: [],
            showPassword: false,
            overlay: false,
        }
    },
    methods: {
        goLogin() {
            this.$router.push('/login')
        },
        reset() {
            this.$router.push('/reset')
        },
        async onLogin() {
            this.overlay = true
            await firebase.auth().signInWithEmailAndPassword(this.mail, this.password).then(user => {
                if (user) {
                    this.$router.push('/')
                }
            }).catch(() => {
                this.overlay = false
                this.alertText = "Passwort und/oder Nutzname falsch"
                this.alertType = "error"
                this.displayAlert = true
            })
        },
        async alreadyLoggedIn(router) {
            await firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    router.push('/')
                }
            });
        },
        async resetPassword() {
            this.overlay = true
            firebase.auth().useDeviceLanguage();
            await firebase.auth().sendPasswordResetEmail(this.mail).then(() => {
                this.displayAlert = true
                this.alertText = "Zurücksetzen erfolgreich"
                this.alertType = "success"
            }).catch(() => {
                this.displayAlert = true
                this.alertText = "Etwas ist schief gegangen"
                this.alertType = "error"
            });
            this.overlay = false

        }

    },
}
</script>

<style>
form {
    width: 30vh;
    display: grid;
    grid-template-columns: repeat(1fr);
    margin: auto;
    padding: 1vh;
    grid-gap: 1vh;
}

input {
    border: none;
    border-bottom: 0.1vh solid grey;
    padding: 1vh;
}

.buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;

}

button,
a {
    margin: 1vh;
    margin-top: 2vh;
}

button {
    border: none;
    border-radius: 1vh;
    padding: 0.5em;
}

button:hover {
    background-color: darkgray;
}

#error {
    color: black;
    background-color: red;
    border-radius: 2vh;
}

#reset:hover {
    color: darkgrey;
}
</style>
