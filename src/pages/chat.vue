<template>
<v-card class="mx-auto" @keyup.enter="createMessage()" max-width="1000" max-height="100vh">
    <v-row class="px-3">
        <v-icon @click="$router.go(-1)" class="pa-0 ma-0">mdi-arrow-left</v-icon>
        <v-card-title>{{othersName}}</v-card-title>
        <v-btn @click="gotoOffer()" color="primary ml-auto" class="rounded-button-left">Anzeige anschauen</v-btn>
    </v-row>
    <v-container v-if="!isGroupchat" id="container" style="max-height: 65vh" class="overflow-y-auto">
        <v-card :class="(message.author == firstUserID) ? 'pa-0 col-8 col-md-5 ml-auto my-2' : 'pa-0 col-8 col-md-5 mr-auto my-2'" v-for="(message, index) in messages" :key="index">
            <v-card-text :class="(message.author == firstUserID) ? 'message2 white--text pa-2 text-end' : 'message1 white--text pa-2'">{{message.text}}</v-card-text>
        </v-card>
    </v-container>
    <v-container v-if="isGroupchat" id="container" style="max-height: 65vh" class="overflow-y-auto">
        <v-card :class="(message.author != groupchatFarmerID) ? 'pa-0 col-8 col-md-5 ml-auto my-2' : 'pa-0 col-8 col-md-5 mr-auto my-2'" v-for="(message, index) in messages" :key="index">
            <v-card-text :class="(message.author == groupchatFarmerID) ? 'message1 white--text pa-2 text-end' : 'message2 white--text pa-2'">{{message.text}}</v-card-text>
        </v-card>
    </v-container>
    <v-text-field class="px-2" color="primary" v-model="currentMessage" label="Nachricht eingeben" append-outer-icon="mdi-send" @click:append-outer="createMessage()"></v-text-field>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";

export default {
    data() {
        return {
            chatID: null,
            built: null,
            currentMessage: null,
            message: {},
            messages: [],
            firstUserID: null,
            pathID: null,
            othersName: "",
            isGroupchat: false,
            groupchatFarmerID: "",
            hasToSetFarmerID: false,
            unsubscribe: () => {},
        };
    },
    watch: {
        messages: {
            handler: function () {
                var container = this.$el.querySelector("#container");
                container.scrollTop = container.scrollHeight;
            },
            deep: true,
        },
    },

    beforeDestroy() {
        this.unsubscribe();

    },
    mounted() {
        //check if user is checked in
        firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
                this.$router.push("/login");
                return;
            } else {
                this.firstUserID = user.uid;
                this.pathID = this.$route.params.agrarianId;
                //check if other user is helper, farmer or groupchat
                let helperSnapshot = await firebase
                    .firestore()
                    .collection("helpers")
                    .doc(this.pathID)
                    .get();
                //helper
                if (helperSnapshot.data() != null) {
                    this.othersName = helperSnapshot.data().name;
                } else {
                    let farmerSnapshot = await firebase
                        .firestore()
                        .collection("agrarians")
                        .doc(this.pathID)
                        .get()
                    //farmer
                    if (farmerSnapshot.data() != null) {
                        this.othersName = farmerSnapshot.data().name;
                    }
                    //groupchat
                    else {
                        let offerSnapshot = await firebase.firestore().collection("offers").doc(this.pathID).get();
                        if (offerSnapshot.data() != null) {
                            this.isGroupchat = true;
                            this.othersName = offerSnapshot.data().title;
                            if(offerSnapshot.data().agrarianId == this.firstUserID && offerSnapshot.data().groupchatFarmerID != this.firstUserID){
                                this.hasToSetFarmerID = true;
                            }
                        }
                    }
                }
            }

            this.chatID = this.firstUserID + "_" + this.pathID;
            this.chatID2 = this.pathID + "_" + this.firstUserID;
            if (this.isGroupchat) {
                this.chatID = this.pathID;
            }

            //check if room exists already
            let firestore = firebase.firestore();
            firestore
                .collection("chats")
                .doc(this.chatID)
                .get()
                .then(snapshot => {
                    if (!snapshot.exists && !this.isGroupchat) {
                        firestore
                            .collection("chats")
                            .doc(this.chatID2)
                            .get()
                            .then(snapshot => {
                                //if not -> create Room
                                if (!snapshot.exists) {
                                    this.createRoom();
                                    //else just fetch all messages
                                } else {
                                    this.chatID = this.chatID2;
                                    this.fetchMessages();
                                }

                            });
                    } else if (!snapshot.exists && this.isGroupchat) {
                        //its a groupchat and we need to create the room
                        this.createRoom();
                    } else {
                        this.fetchMessages();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        });
    },
    methods: {
        gotoOffer() {
            this.$router.push("/offer/" + this.pathID);
        },
        async createRoom() {
            let firestore = firebase.firestore();
            let data = {
                authors: [],
                isGroupchat: false,
            };
            let authors = [];
            if (this.isGroupchat) {
                let allAcceptedOffers = await firestore.collection("acceptedOffers").where("offerId", "==", this.pathID).get();
                allAcceptedOffers.forEach(a => authors.push(a.data().helperId));
                data.isGroupchat = true;
                if(this.hasToSetFarmerID){
                    data.groupchatFarmerID = this.firstUserID;
                    authors.push(this.firstUserID);
                }
            } else {
                authors = [this.firstUserID, this.pathID];
            }
            data.authors = authors;
            console.log("data to create:");
            console.log(data);
            await firestore
                .collection("chats")
                .doc(this.chatID)
                .set(data)
                .catch(error => {
                    console.log("logged in as: " + this.firstUserID);
                    console.log("second user: " + this.pathID);
                    console.log(this.chatID);
                    console.log(authors);
                    console.log(error);
                });
            this.fetchMessages();
        },
        async fetchMessages() {
            let firestore = firebase.firestore();
            let ref = await firestore.collection("chats").doc(this.chatID).get();
            if(this.isGroupchat){
                this.groupchatFarmerID = ref.data().groupchatFarmerID;
                
            }
            this.messages = [];
            this.unsubscribe = firestore
                .collection("chats")
                .doc(this.chatID)
                .collection("messages").onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(doc => {
                        this.messages.push(doc.doc.data());

                        let seenBefore = [];
                        if (ref.data().seen != null) {
                            seenBefore = ref.data().seen;
                        }
                        if (!seenBefore.includes(this.firstUserID)) {
                            seenBefore.push(this.firstUserID);
                            firestore.collection("chats").doc(this.chatID).update({
                                seen: seenBefore,
                            });
                        }

                    })

                })
        },
        createMessage() {
            if (this.currentMessage == null || this.currentMessage == "") {
                return;
            }
            let firestore = firebase.firestore();

            firestore.collection("chats").doc(this.chatID).update({
                seen: [this.firstUserID],
            }).catch(e => console.error(e));

            var newMessage = firestore
                .collection("chats")
                .doc(this.chatID)
                .collection("messages")
                .doc(Date.now().toString());
            let message = {
                author: firebase.auth().currentUser.uid,
                text: this.currentMessage
            };
            newMessage
                .set(message)
                .then(() => {
                    console.log("Chat written!");
                    this.currentMessage = "";
                })
                .catch(error => {
                    console.log("message:" + message.text);
                    console.log(error);
                    alert("Konnte nachricht nicht abschicken.");
                    this.$router.push("/error");
                });
        },
    }
};
</script>

<style>
.message1 {
    color: white;
    background: var(--v-primary-base);
    padding-left: 10px;
}

.message2 {
    color: white;
    background: var(--v-secondary-base);
    padding-left: 10px;
}
</style>
