<template>
    <div class="registerHelper">

        <v-container fluid>
            <v-row justify="center">
                <v-img :src="require('../assets/ernteretter.png')" max-width="400"></v-img>
            </v-row>
            <br/><br/>

            <h1 align="center">Erstelle dein Profil!</h1>
            <br/>
            <v-row justify="center">
                <v-col cols="5" sm="5">
                    <v-text-field v-model="name" label="Wie heißt du?" single-line solo></v-text-field>
                </v-col>
            </v-row>


            <v-row justify="center">
                <v-col cols="5" sm="5">
                    <v-text-field
                            :type="showPassword ? 'text' : 'password'"
                            label="Wähle ein Passwort" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            v-model="password"
                            single-line
                            solo
                    />
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="5" sm="5">
                    <v-text-field v-model="mail" label="Deine E-Mail-Adresse lautet?" single-line solo></v-text-field>
                </v-col>
            </v-row>
            <br/>

            <v-row justify="center">
                <div>
                    <h3> Für welche Arten der Ernte interessierst du dich? </h3>
                    <v-col cols="5" sm="5">
                        <v-checkbox
                                class="mt-1"
                                v-for="item in harvestTypesOptions"
                                v-bind:key="item"
                                v-model="harvestTypes"
                                :label="item"
                                :value="item"
                        >
                        </v-checkbox>
                    </v-col>
                </div>
            </v-row>
            <br/>

            <v-row justify="center">
                <div>
                    <h3> In welchem Umkreis möchtest du Hilfemöglichkeiten vorgschlagen bekommen? </h3>
                    <v-col cols="10" sm="12">

                        <v-slider
                                v-model="searchRange"
                                class="align-center"
                                :max="searchRangeMax"
                                :min="searchRangeMin"
                                hide-details
                        >
                            <template v-slot:append>
                                <v-text-field
                                        v-model="searchRange"
                                        class="mt-0 pt-0"
                                        hide-details
                                        single-line
                                        type="number"
                                        style="width: 60px"
                                ></v-text-field>
                                <v-chip class="ma-2" outlined>
                                    km
                                </v-chip>
                            </template>
                        </v-slider>
                    </v-col>
                </div>
            </v-row>
            <br/>

            <v-row justify="center">
                <div>
                    <h3> Wie lange möchtest du helfen? </h3>
                </div>
            </v-row>

            <v-row justify="center">
                <v-col md="1">
                    <v-text-field
                            class="ml-12"
                            label="von"
                            v-model="durationMin"
                            type="number"
                            style="width: 30px"
                    >
                    </v-text-field>
                </v-col>
                <v-col md="1">
                    <v-select
                            d-inline-block
                            v-model="durationMinType"
                            :items="durationTypeOptions"
                            style="width: 100px"
                    ></v-select>
                </v-col>
                <v-col md="1">
                    <v-text-field
                            class="ml-12"
                            label="bis"
                            v-model="durationMax"
                            type="number"
                            style="width: 30px"
                    >
                    </v-text-field>
                </v-col>
                <v-col md="1">
                    <v-select
                            v-model="durationMaxType"
                            :items="durationTypeOptions"
                            item-text="text"
                            item-value="value"
                            style="width: 100px"
                    ></v-select>
                </v-col>
            </v-row>
            <br/>

            <v-row justify="center">
                <v-col cols="5" sm="5">
                    <v-textarea v-model="experience" label="Welche Vorerfahrungen hast du?" solo></v-textarea>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-btn rounded color="primary" dark @click="registerHelper()">
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
        name: 'registerHelper',
        data: () => ({
            name: "",
            mail: "",
            password: "",
            showPassword: false,
            harvestTypes: [],
            harvestTypesOptions: ["Obst", "Gemüse"],
            searchRange: 130,
            searchRangeMin: 1,
            searchRangeMax: 500,
            durationMin: 3,
            durationMinType: "days",
            durationMax: 4,
            durationMaxType: "weeks",
            durationTypeOptions: [{value: "days", text: "Tage"}, {value: "weeks", text: "Wochen"}],
            experience: ""
        }),
        methods: {
            registerHelper() {
                firebase.auth().createUserWithEmailAndPassword(this.mail, this.password)
                    .then(data => {
                        let helperData = {
                            uid: data.user.uid,
                            harvestTypes: this.harvestTypes,
                            searchRange: this.searchRange,
                            durationMin: this.durationMin,
                            durationMinType: this.durationMinType,
                            durationMax: this.durationMax,
                            durationMaxType: this.durationMaxType,
                            experience: this.experience
                        };
                        let router = this.$router;
                        data.user.updateProfile({
                            displayName: this.name
                        }).then(() => {
                            let firestore = firebase.firestore();
                            let newHelper = firestore.collection('helpers').doc();
                            newHelper.set(helperData).then(function () {
                                console.log("Helper registered successfully!");
                                router.push('/registerHelperSuccess');
                            }).catch(function (error) {
                                console.error("Error registering Helper: ", error);
                            });
                        });
                    })
                    .catch(function(error) {
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

<style scoped>

</style>
