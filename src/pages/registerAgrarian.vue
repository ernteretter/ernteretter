<template>
<v-card class="registerAgrarian mx-auto " max-width="1000">
    <v-form ref="form" v-model="valid" lazy-validation class="justify-center">
        <v-container fluid class="col-10 col-md-12">

            <v-img :src="require('../assets/ernteretter.png')" max-width="400" />
            <br /><br />

            <v-card-title align="center">Erstellen Sie Ihr Profil!</v-card-title>
            <br />
            <v-col>
                <v-text-field v-model="name" :rules="rules.name" label="Wie heißen Sie?" single-line solo />
                <v-text-field :type="showPassword ? 'text' : 'password'" label="Wählen Sie ein Passwort" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" v-model="password" :rules="rules.password" single-line solo />
                <v-text-field v-model="mail" :rules="rules.mail" label="Ihre E-Mail Adresse lautet?" single-line solo />
                <p id="hinweis">Hinweis: Helfer werden sich bei dieser E-Mail melden.</p>
                <v-text-field v-model="placeName" :rules="rules.placeName" label="Wie heißt Ihr Hof?" single-line solo />
            </v-col>

            <div>
                <h3>Wo liegt Ihr Hof?</h3>
            </div>

            <v-row justify="center">
                <v-col class="col-8">
                    <v-text-field v-model="placeStreet" :rules="rules.placeStreet" label="Straße" single-line solo />
                </v-col>
                <v-col>
                    <v-text-field v-model="placeNumber" :rules="rules.placeNumber" label="Nr." single-line solo />
                </v-col>
            </v-row>
            <v-row justify="center" >
                <v-col >
                    <v-text-field v-model="placePostcode" :rules="rules.placePostcode" label="PLZ" single-line solo />
                </v-col>
                <v-col>
                    <v-text-field v-model="placeCity" :rules="rules.placeCity" label="Stadt" single-line solo />
                </v-col>
            </v-row>
            <v-row justify="center" v-if="!valid">
                <v-alert dense outlined type="error">
                    Das Formular ist nicht vollständig ausgefüllt
                </v-alert>
            </v-row>
            <v-row justify="center">
                <v-btn class="rounded-button-left" x-large outlined color="primary" @click="registerAgrarian()" :disabled="!valid">
                    Registrieren
                </v-btn>
            </v-row>
        </v-container>
    </v-form>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import 'firebase/firestore';

export default {
    name: 'registerAgrarian',
    data: () => ({
        valid: true,
        name: "",
        mail: "",
        password: "",
        showPassword: false,
        placeName: "",
        placeStreet: "",
        placeNumber: "",
        placePostcode: "",
        placeCity: "",
        rules: {
            name: [value => !!value.trim() || 'Name wird benötigt.'],
            password: [value => !!value || 'Passwort wird benötigt.'],
            mail: [
                value => !!value.trim() || 'E-Mail-Adresse wird benötigt.',
                value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return pattern.test(value) || 'Ungültige E-Mail-Adresse.';
                }
            ],
            placeName: [value => !!value.trim() || 'Name des Hofes wird benötigt.'],
            placeStreet: [value => !!value.trim() || 'Straße wird benötigt.'],
            placeNumber: [value => !!value.trim() || 'Nr. benötigt.'],
            placePostcode: [
                value => !!value.trim() || 'PLZ benötigt.',
                value => {
                    const pattern = /^[0-9]{5,5}$/;
                    return pattern.test(value) || 'Ungültige PLZ.';
                }
            ],
            placeCity: [value => !!value.trim() || 'Stadt wird benötigt.'],
        }
    }),
    methods: {
        registerAgrarian() {
            if (!this.$refs.form.validate()) {
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(this.mail, this.password)
                .then(data => {
                    let agrarianData = {
                        name: this.name,
                        uid: data.user.uid,
                        publicEmail: data.user.email,
                        photoURL: data.user.photoURL,
                        place: {
                            name: this.placeName,
                            street: this.placeStreet,
                            number: this.placeNumber,
                            postcode: this.placePostcode,
                            city: this.placeCity
                        }
                    };
                    let router = this.$router;

                    data.user.updateProfile({
                        displayName: this.name
                    }).then(() => {
                        firebase.auth().useDeviceLanguage();
                        firebase.auth().currentUser.sendEmailVerification().catch((err) => {
                            console.log(err + " E-Mail wurde nicht versandt");   
                        })
                        let firestore = firebase.firestore();
                        let newAgrarian = firestore.collection('agrarians').doc(agrarianData.uid);
                        newAgrarian.set(agrarianData).then(function () {
                            router.push('/createOffer');
                        }).catch(function (error) {
                            console.error("Error registering agrarian: ", error);
                        });
                    });
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode == 'auth/weak-password') {
                        alert('The password is too weak.');
                    } else {
                        alert(errorMessage);
                    }
                });
        }
    }
}
</script>

<style>
#hinweis {
    font-size: small;
    padding-bottom: 30px;
}
</style>
