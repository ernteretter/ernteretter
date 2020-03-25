<template>
    <div class="registerAgrarian">
        <v-container fluid>
            <v-row justify="center">
                <v-img :src="require('../assets/ernteretter.png')" max-width="400"></v-img>
            </v-row>
            <br/><br/>

            <h1 align="center">Erstellen Sie Ihr Profil!</h1>
            <br/>
            <v-row justify="center">
                <v-col cols="5" sm="5">
                    <v-text-field v-model="name" label="Wie heißen Sie?" single-line solo></v-text-field>
                    <v-text-field v-model="mail" label="Ihre E-Mail Adresse lautet?" single-line solo></v-text-field>
                    <v-text-field
                            :type="showPassword ? 'text' : 'password'"
                            label="Wählen Sie ein Passwort" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            v-model="password"
                            single-line
                            solo
                    />
                    <v-text-field v-model="placeName" label="Wie heißt Ihr Hof?" single-line solo></v-text-field>
                </v-col>
            </v-row>
            <v-row justify="center">
                <div>
                    <h3>Wo liegt Ihr Hof?</h3>
                </div>
            </v-row>

            <v-row justify="center">
                <v-col cols="1" sm="4">
                    <v-text-field v-model="placeStreet" label="Straße" single-line solo></v-text-field>
                </v-col>
                <v-col cols="5" sm="1">
                    <v-text-field v-model="placeNumber" label="Nummer" single-line solo></v-text-field>
                </v-col>
            </v-row>
            <v-row justify="center" class="mt-n8">
                <v-col cols="5" sm="2">
                    <v-text-field v-model="placePostcode" label="PLZ" single-line solo></v-text-field>
                </v-col>
                <v-col cols="5" sm="3">
                    <v-text-field v-model="placeCity" label="Stadt" single-line solo></v-text-field>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-btn class="rounded-button-left" x-large outlined color="primary" dark @click="registerAgrarian()">
                    Registrieren
                </v-btn>
            </v-row>
        </v-container>

    </div>
</template>

<script>
    import * as firebase from "firebase";
    import 'firebase/firestore';


    export default {
        name: 'registerAgrarian',
        data: () => ({
            name: "",
            mail: "",
            password: "",
            showPassword: false,
            placeName: "",
            placeStreet: "",
            placeNumber: "",
            placePostcode: "",
            placeCity: ""
        }),
        methods: {
            registerAgrarian() {
                firebase.auth().createUserWithEmailAndPassword(this.mail, this.password)
                    .then(data => {
                        let agrarianData = {
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
                            let firestore = firebase.firestore();
                            let newAgrarian = firestore.collection('agrarians').doc(agrarianData.uid);
                            newAgrarian.set(agrarianData).then(function () {
                                console.log("agrarian registered successfully!");
                                router.push('/registerFarmerSuccess');
                            }).catch(function (error) {
                                console.error("Error registering agrarian: ", error);
                            });
                        });
                    }).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if (errorCode == 'auth/weak-password') {
                            alert('The password is too weak.');
                        } else {
                            alert(errorMessage);
                        }
                        console.log(error);
                    });
            }
        }
    }
</script>
