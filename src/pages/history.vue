<template>
<v-app>
    <v-card width="60%" class="mx-auto mt-5">
        <v-container>
            <v-data-table :headers="headers" :items="offers" item-key="id" fixed-header height="300px">
                <template v-slot:item.action="{item}">
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil-outline </v-icon>
                    <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
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
            offers: [],
            offerIDs: [],
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
            ]
        }
    },
    methods: {
        async fetch() {
            var usID = await firebase.auth();
            console.log(usID);
            usID = usID.currentUser.uid
            console.log("user: " + usID);
            firebase.firestore().collection('AcceptedOffers').where('helperId', '==', usID).get().then(async (querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    var data = doc.data()
                    this.offerIDs.push(data.offerId)
                })
                for (let offerID of this.offerIDs) {
                    firebase.firestore().collection('offers').doc(offerID).get().then(async (querySnapshot) => {
                        this.offers.push(querySnapshot.data())
                    })
                }
            })
        },
        showItem(item) {
            //TODO
            const index = this.bills.indexOf(item)
            console.log('zeige ' + index);
        },
        editItem(item) {
            //TODO
            console.log('bearbeite ' + item);

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
