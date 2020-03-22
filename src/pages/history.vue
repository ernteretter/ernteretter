<template>
<v-app>
    <v-card width="60%" class="mx-auto mt-5">
        <v-container>
            <v-data-table :headers="headers" :items="mixedOffers" item-key="id" :loading="loading" loading-text="Lädt...Bitte warten" :server-items-length="offers.length" class="elevation-1" :search="search">
                <template v-slot:item.action="{item}">
                    <v-icon small class="mr-2" @click="editItem(item)" v-if="item.agrarianId == user.uid">mdi-pencil-outline </v-icon>
                    <v-icon small class="mr-2" @click="deleteItem(item)" v-if="item.agrarianId == user.uid">mdi-delete</v-icon>
                    <v-icon small class="mr-2" @click="showItem(item)">mdi-eye-outline</v-icon>
                </template>
            </v-data-table>
        </v-container>
    </v-card>
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
            user: false,
            isAgrarian: false,
            mixedOffers: [],
            offers: [],
            offerIDs: [],
            myOffers: [],
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
                    value: 'startDates'
                },
                {
                    text: 'Helper',
                    align: 'right',
                    value: 'maxHelpers'
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
            console.log("user: " + usID);
            firebase.firestore().collection('acceptedOffers').where('helperId', '==', usID).get().then(async (querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    var data = doc.data()
                    this.offerIDs.push(data.offerId)
                })
                for (let offerID of this.offerIDs) {
                    firebase.firestore().collection('offers').doc(offerID).get().then(async (querySnapshot) => {
                        if (querySnapshot.exists) {
                            this.mixedOffers.push(querySnapshot.data())
                            this.offers.push(querySnapshot.data())
                        }
                    })
                }
            })
            firebase.firestore().collection('offers').where('agrarianId', '==', usID).get().then(async (querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    var data = doc.data()
                    this.mixedOffers.push(data)
                    this.myOffers.push(data)
                })
            })
            console.log(this.offers);
            console.log(this.myOffers);
            console.log(this.mixedOffers);
           
            /*
            this.mixedOffers = this.mixedOffers.sort((a, b) => {
                a > b ? 1 : (b > a ? -1 : 0)
            }) */
            
        },
        showItem(item) {
            //TODO
            const index = this.bills.indexOf(item)
            console.log('zeige ' + index);
        },
        editItem(item) {
            this.$router.push("editOffer/" + item)

        },
        deleteItem(item) {
            //TODO
            console.log('lösche ' + item);
        },
    }
}
</script>

<style>

</style>
