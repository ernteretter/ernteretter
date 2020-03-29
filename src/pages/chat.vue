<template>
<v-card class="mx-auto" @keyup.enter="createMessage()" max-width="1000">
    <v-card-title>Sie schreiben mit: {{othersName}}</v-card-title>
    <v-container id="container" style="max-height: 400px" class="overflow-y-auto">
        <ul>
            <v-card :class="(message.author == firstUserID) ? 'message1' : 'message2'" v-for="(message, index) in messages" :key="index">
                <p>{{message.text}}</p>
            </v-card>
        </ul>
    </v-container>
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
            built: null,
            currentMessage: null,
            message: {},
            messages: [],
            firstUserID: null,
            secondUserID: null,
            othersName: "",
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
        async fetchMessages() {
            console.log("fetching messages");
            let firestore = firebase.firestore();
            let ref = await firestore.collection("chats").doc(this.chatID).get();

            this.unsubscribe = firestore
                .collection("chats")
                .doc(this.chatID)
                .collection("messages").onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(doc => {
                        console.log("found message: " + doc.doc.data());
                        this.messages.push(doc.doc.data());

                        let seenBefore = [];
                        if (ref.data().seen != null && ref.data().seen <= 2) {
                            seenBefore = ref.data().seen;
                        }
                        seenBefore.push(this.firstUserID);
                        firestore.collection("chats").doc(this.chatID).update({
                            seen: seenBefore,
                        })
                    })

                })
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
