<template>
<v-card max-width="1000" class="mx-auto">
    <v-card-title>Sie schreiben mit: {{othersName}}</v-card-title>
    <v-card v-for="(message, index) in messages" :key="index">
        <p v-if="messages[index].author == firstUserID" class="message1">{{messages[index].text}}</p>
        <p v-if="messages[index].author == secondUserID" class="message2">{{messages[index].text}}</p>
    </v-card>
    <v-text-field v-model="currentMessage" label="Nachricht eingeben"></v-text-field>
    <v-btn color="primary" class="rounded-button-left" @click="createMessage()">Nachricht abschicken</v-btn>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";

export default {
    data() {
        return {
            chatID: null,
            currentMessage: null,
            message: {},
            messages: [],
            firstUserID: null,
            secondUserID: null,
            othersName: ""
        };
    },
    mounted() {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.$router.push("/login");
                return;
            } else {
                this.firstUserID = user.uid;
                this.secondUserID = this.$route.params.agrarianId;

                firebase
                    .firestore()
                    .collection("helpers")
                    .doc(this.secondUserID)
                    .get()
                    .then(snapshot => {
                        if (snapshot.exists) {
                            console.log("othersname: " + snapshot.data().name);
                            this.othersName = snapshot.data().name;
                        } else {
                            firebase
                                .firestore()
                                .collection("agrarians")
                                .doc(this.secondUserID)
                                .get()
                                .then(snapshot => {
                                    console.log("othersname: " + snapshot.data().name);
                                    this.othersName = snapshot.data().name;
                                });
                        }
                    });

                this.chatID = this.firstUserID + "_" + this.secondUserID;
                this.chatID2 = this.secondUserID + "_" + this.firstUserID;

                let firestore = firebase.firestore();
                firestore
                    .collection("chats")
                    .doc(this.chatID)
                    .get()
                    .then(snapshot => {
                        if (!snapshot.exists) {
                            firestore
                                .collection("chats")
                                .doc(this.chatID2)
                                .get()
                                .then(snapshot => {
                                    if (!snapshot.exists) {
                                        this.createRoom();
                                    } else {
                                        this.chatID = this.chatID2;
                                        this.fetchMessages();
                                    }

                                });
                        } else {
                            this.fetchMessages();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    },
    methods: {
        createRoom() {
            console.log("creating room");
            let data = {
                authors: [this.firstUserID, this.secondUserID],
            };
            let firestore = firebase.firestore();
            firestore
                .collection("chats")
                .doc(this.chatID)
                .set(data)
                .catch(error => {
                    console.log("logged in as: " + this.firstUserID);
                    console.log("second user: " + this.secondUserID);
                    console.log(this.chatID);
                    console.log(data);
                    console.log(error);
                });
        },
        fetchMessages() {
            console.log("fetching messages");
            let firestore = firebase.firestore();

            firestore
                .collection("chats")
                .doc(this.chatID)
                .collection("messages")
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        console.log("found message: " + doc.data());
                        this.messages.push(doc.data());
                    });
                });
        },
        createMessage() {
            console.log("creating message");
            if (this.currentMessage == null) {
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
                    this.messages.push(message);
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
