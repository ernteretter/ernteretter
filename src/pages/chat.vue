<template>
<div>
    <v-text-field v-model="currentMessage" label="Nachricht eingeben"></v-text-field>
    <v-card v-for="(message, index) in messages" :key="index">{{messages[index].text}}</v-card>
    <v-btn @click="createMessage()">createMessage</v-btn>
</div>
</template>

<script>
import * as firebase from "firebase";
import 'firebase/firestore'

export default {
    data() {
        return {
            chatID: null,
            currentMessage: null,
            message: {

            },
            messages: [],
            firstUserID: null,
            secondUserID: null,
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.$router.push("/login");
                alert("Du bist nicht eingeloggt!");
                return;
            } else {
                this.firstUserID = user.uid;
                this.secondUserID = this.$route.params.agrarianId
                this.chatID = this.firstUserID + "_" + this.secondUserID;
                let firestore = firebase.firestore();
                firestore.collection("chats").doc(this.chatID).get().then((snapshot) => {
                    if (!snapshot.exists) {
                        this.createRoom();
                    } else {
                        this.fetchMessages();
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        });

    },
    methods: {
        createRoom() {
            console.log("creating room");
            let data = {
                author1: this.firstUserID,
                author2: this.secondUserID
            };
            let firestore = firebase.firestore();
            firestore.collection("chats").doc(this.chatID).set({
                data
            }).catch(error => {
                console.log(this.chatID);
                console.log(data);
                console.log(error);
            });
        },
        fetchMessages() {
            console.log("fetching messages");
            let firestore = firebase.firestore();
            firestore.collection("chats").doc(this.chatID).collection(this.chatID).get()
                .then((snapshot) => {
                    snapshot.forEach(doc => {
                        this.messages.push(doc.data().message);
                    });
                }).catch(error => {
                    alert("Konnte Nachrichten nicht lesen.");
                    this.$router.push("/error");
                    console.log(error);
                })
        },
        createMessage() {
            if (this.currentMessage == null) {
                return;
            }
            let firestore = firebase.firestore();
            var newMessage = firestore.collection("chats").doc(this.chatID).collection(this.chatID).doc(Date.now().toString());
            let message = {
                author: firebase.auth().currentUser.uid,
                text: this.currentMessage,
            }
            newMessage.set({
                message
            }).then(() => {
                console.log("Chat written!");
                this.messages.push(message);
            }).catch(error => {
                alert("Konnte nachricht nicht abschicken.");
                console.log(error);
                this.$router.push("/error");
            })
        }
    }
}
</script>

<style>
</style>
