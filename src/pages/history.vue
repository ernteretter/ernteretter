<template>
<v-app>
    <v-card class="mx-auto mt-5" max-width="1000px">
        <v-card-title class="primary">
            <span class="headline white--text">Termine</span>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Suche" single-line hide-details color="white" dark @change="atSearch"></v-text-field>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="$router.push('createOffer')">
                        <v-icon color="primary">mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </template>
                <span>neue Anzeige erstellen</span>
            </v-tooltip>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-container>
            <v-data-table :headers="headers" :items="mixedOffers" item-key="id" :loading="loading" loading-text="Lädt...Bitte warten" :server-items-length="mixedOffers.length" class="elevation-1">
                <template v-slot:item.action="{item}">
                    <v-icon small class="mr-2" @click="editItem(item)" v-if="item.agrarianId == user.uid">mdi-pencil-outline </v-icon>
                    <v-icon small class="mr-2" @click="deleteItem(item)" v-if="item.agrarianId == user.uid">mdi-delete</v-icon>
                    <v-icon small class="mr-2" @click="showItem(item)">mdi-eye-outline</v-icon>
                </template>
            </v-data-table>
        </v-container>
    </v-card>
    <v-snackbar v-if="deleteSnackSuccess" color="success">Termin erfolgreich gelöscht</v-snackbar>
    <v-snackbar v-if="deleteSnackFail" color="red">Termin konnte nicht gelöscht werden</v-snackbar>
</v-app>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
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
            deleteSnackSuccess: true,
            deleteSnackFail: true,
            user: false,
            isAgrarian: false,
            mixedOffers: [],
            offerIDs: [],
            search: '',
            loading: false,
            headers: [{
                    text: 'Name',
                    align: 'left',
                    value: 'title',
                },
                {
                    text: 'Datum',
                    align: 'left',
                    value: 'startDate'
                },
                {
                    text: 'fehlende Helfer',
                    align: 'right',
                    value: 'helperCount'
                },
                {
                    text: 'Aktionen',
                    value: 'action',
                    align: 'right',
                    sortable: false
                },
            ]
        }
    },
    methods: {
        async fetch() {
            var usID = await firebase.auth()
            this.user = usID.currentUser
            usID = usID.currentUser.uid
            firebase.firestore().collection('acceptedOffers').where('helperId', '==', usID).get().then(async (querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    var data = doc.data()
                    this.offerIDs.push(data.offerId)
                })
                for (let offerID of this.offerIDs) {
                    firebase.firestore().collection('offers').doc(offerID).get().then(async (querySnapshot) => {
                        if (querySnapshot.exists) {
                            this.mixedOffers.push({
                                ...querySnapshot.data(),
                                id: querySnapshot.id,
                                startDate: querySnapshot.data().startDate.toDate().toLocaleDateString(),
                                helperCount: querySnapshot.data().maxHelpers - querySnapshot.data().helperCount
                            })
                        }
                    })
                }
            })
            await firebase.firestore().collection('offers').where('agrarianId', '==', usID).get().then(async (querySnapshot) => {
                console.log("Hello");
                
                querySnapshot.forEach(async (doc) => {
                    this.mixedOffers.push({
                        ...doc.data(),
                        id: doc.id,
                        startDate: doc.data().startDate.toDate().toLocaleDateString()
                    })
                })
            })
        },
        async atSearch(){
            this.mixedOffers = []
            this.offerIDs = []
            var usID = await firebase.auth()
            this.user = usID.currentUser
            usID = usID.currentUser.uid
            console.log(this.search);
            if(this.search){
            firebase.firestore().collection('acceptedOffers').where('helperId', '==', usID).where('title', '==', this.search).get().then(async (querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    var data = doc.data()
                    this.offerIDs.push(data.offerId)
                })
                for (let offerID of this.offerIDs) {
                    firebase.firestore().collection('offers').doc(offerID).get().then(async (querySnapshot) => {
                        if (querySnapshot.exists) {
                            this.mixedOffers.push({
                                ...querySnapshot.data(),
                                id: querySnapshot.id,
                                startDate: querySnapshot.data().startDate.toDate().toLocaleDateString(),
                                helperCount: querySnapshot.data().maxHelpers - querySnapshot.data().helperCount
                            })
                        }
                    })
                }
            })
            } else {
                this.fetch()
            }
            await firebase.firestore().collection('offers').where('agrarianId', '==', usID).where('title', '==', this.search).get().then(async (querySnapshot) => {
                console.log("Hello");
                
                querySnapshot.forEach(async (doc) => {
                    this.mixedOffers.push({
                        ...doc.data(),
                        id: doc.id,
                        startDate: doc.data().startDate.toDate().toLocaleDateString()
                    })
                })
            })
        },
        showItem(item) {
            this.$router.push("offer/" + item.id)
        },
        editItem(item) {
            this.$router.push("editOffer/" + item.id)

        },
        deleteItem(item) {
            try {
                firebase.firestore().collection('offers').doc(item.id).delete().then(() => {
                    setTimeout(() => (this.deleteSnackSuccess = true), 3000);
                    this.deleteSnackSuccess = false
                    this.mixedOffers = this.mixedOffers.filter((a) => {
                        return a.id != item.id
                    })

                })
            } catch {
                setTimeout(() => (this.deleteSnackFail = true), 3000);
                this.deleteSnackFail = false

            }
        },
    }
}
</script>

<style>

</style>
