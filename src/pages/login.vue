<template>
<v-app>
    <v-alert v-if="error" dismissible type="error" width="400px" class="mx-auto mt-5">Passwort und/oder Nutzname falsch</v-alert>
    <v-col cols="12">
        <v-card class="mx-auto mt-5 col-sm-12 col-md-5 ">
            <v-card-title>
                <h1>Login</h1>
            </v-card-title>
            <v-form class="mx-auto col-sm-12 col-md-12">
                <v-text-field v-model="mail" label="Username" />
                <v-text-field :type="showPassword ? 'text' : 'password'" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" v-model="password" />
                <v-overlay :absolute="true" :value="overlay">
                    <v-progress-circular indeterminate>
                    </v-progress-circular>
                </v-overlay>
            </v-form>
            <v-card-actions>
                <v-btn color="success" @click="onLogin()">login</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="rounded-button-left" outlined @click="onRegisterHelper()">als Helfer Registrieren</v-btn>
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
            mail: '',
            password: '',
            error: false,
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
            try {
                this.overlay = true
                await firebase.auth().signInWithEmailAndPassword(this.mail, this.password).then(user => {
                    if (user) {
                        this.$router.push('/')
                    }
                })
            } catch (err) {
                this.overlay = false
                this.error = true;
            }
        },
        async onRegisterHelper() {
            this.$router.push('/registerHelper');
        },
        async alreadyLoggedIn(router) {
            await firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    router.push('/')
                }
            });
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
