<template>
    <div class="registerHelper">
        <h1>Erstelle deinen Profil!</h1>
        <v-card>
            <h3>
                Wie heißt du?
            </h3>
            <v-col cols="5" sm="5">
                <v-text-field v-model="name" label="Name" single-line solo></v-text-field>
            </v-col>
        </v-card>

        <v-card>
            <h3> Für welche Arten der Ernte interessierst du dich? </h3>
            <v-col cols="5" sm="5">
                <v-checkbox v-for="item in harvestTypesOptions" v-bind:key="item" v-model="harvestTypes" :label="item" :value="item"></v-checkbox>
            </v-col>
        </v-card>

        <v-card>
            <h3> In welchem Umkreis möchtest du Hilfemöglichkeiten vorgschlagen bekommen? </h3>
            <v-col cols="5" sm="5">

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
        </v-card>

        <v-card>
            <h3> Wie lange möchtest du helfen? </h3>
            <v-col cols="5" sm="5">
                <v-text-field
                        label="von"
                        v-model="durationMin"
                        type="number"
                        style="width: 40px"
                >
                </v-text-field>

                <v-select
                        d-inline-block
                        v-model="durationMinType"
                        :items="durationTypeOptions"
                        dense
                        style="width: 100px"
                ></v-select>
            </v-col>
            <v-col cols="5" sm="5">
                <v-text-field
                        label="bis"
                        v-model="durationMax"
                        type="number"
                        style="width: 40px"
                >
                </v-text-field>
                <v-select
                        v-model="durationMinType"
                        :items="durationTypeOptions"
                        dense
                        style="width: 100px"
                ></v-select>
            </v-col>
        </v-card>

        <v-card>
            <h3> welche Vorerfahrungen hast du? </h3>
            <v-col cols="5" sm="5">
                <v-textarea v-model="experience" label="Vorerfahrungen" solo></v-textarea>
            </v-col>
        </v-card>

        <v-btn rounded color="primary" dark @click="registerHelper()">
            Absenden
        </v-btn>
    </div>
</template>

<script>
    import * as firebase from "firebase";
    import 'firebase/firestore';

    export default {
        name: 'registerHelper',
        data: () => ({
            name: "",
            harvestTypes: [],
            harvestTypesOptions: ["Obst", "Gemüse"],
            searchRange: 130,
            searchRangeMin: 1,
            searchRangeMax: 500,
            durationMin: 3,
            durationMinType: "Tage",
            durationMax: 4,
            durationMaxType: "Wochen",
            durationTypeOptions: ["Tage", "Wochen"],
            experience: "",
            harvestType: ""
        }),
        methods: {
            registerHelper() {
                if (firebase.auth().currentUser != null) {
                    let userID = firebase.auth().currentUser.uid;
                    let data = {
                        userId: userID,
                        harvestTypes: this.harvestTypes,
                        searchRange: this.searchRange,
                        durationMin: this.durationMin,
                        durationMinType: this.durationMinType,
                        durationMax: this.durationMax,
                        durationMaxType: this.durationMaxType,
                        experience: this.experience
                    };
                    let firestore = firebase.firestore();
                    let newHelper = firestore.collection('helpers').doc();
                    newHelper.set(data).then(function () {
                        console.log("Helper registered successfully!")
                    }).catch(function (error) {
                        console.error("Error registering Helper: ", error);
                    });
                } else {
                    alert("Bitte loggen sie sich ein!");
                }
            }
        }
    }
</script>

<style scoped>

</style>
