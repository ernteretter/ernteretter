<template>
<v-card max-width="1000" min-height="600" class="mx-auto">
    <v-card-title id="header">Nachrichten</v-card-title>
    <v-divider />
    <v-card class="ma-10" @click="gotoChat(index)" v-for="(chat, index) in chatroomsSorted" :key="index">
        <v-card-title>{{chatroomsSorted[index].name}}</v-card-title>
        <v-divider />
        <v-row>
            <v-card-text :class="chatroomsSorted[index].iSentLast ? 'secondary--text' : 'primary--text'">{{chatroomsSorted[index].lastMessage}}</v-card-text>
        </v-row>
    </v-card>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";

export default {
    data: () => ({
        currentUser: null,
        lastLogin: null,
        chatrooms: [],
        chatroomsSorted: [],
        chatroomsNew: [],
    }),
    methods: {
        gotoChat(index) {
            let otherUser = this.chatrooms[index].userID;
            this.$router.push("/chat/" + otherUser);
        }
    },
    watch: {
        chatrooms: {
            handler: function () {
                this.chatroomsSorted = this.chatrooms.slice();
                this.chatroomsSorted.sort((a, b) => {
                    return (a.time > b.time ? -1 : (b.time > a.time ? 1 : 0));
                });
                this.chatroomsNew = this.chatrooms.slice().filter(m => m.seen.includes(this.currentUser));
                console.log(this.chatroomsNew);
                
            },
            deep: true,
        }
    },
    async mounted() {
        let firestore = firebase.firestore();
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.$router.push("/login");
                return;
            } else {
                this.currentUser = user.uid;
                firestore
                    .collection("chats")
                    .where("authors", "array-contains", this.currentUser)
                    .get().then(snapshot => {
                        snapshot.forEach(async c => {
                            let data = c.data();
                            let otherAuthor = data.authors.filter(a => a != this.currentUser)[0];
                            let messageSnapshot = await firestore.collection("chats").doc(c.id).collection("messages").get().catch(e => {console.error(e)});
                            let currentMessages = [];
                            messageSnapshot.forEach(d => currentMessages.push({
                                data: d.data(),
                                id: d.id
                            }));
                            currentMessages = currentMessages.sort();

                            firestore.collection("helpers").doc(otherAuthor).get().then((doc) => {
                                if (doc.exists) {
                                    let lastMessage = currentMessages[currentMessages.length - 1];
                                    let iSentLast = false;
                                    if (lastMessage.data.author == this.currentUser) {
                                        iSentLast = true;
                                    }
                                    this.chatrooms.push({
                                        name: doc.data().name,
                                        seen: c.data().seen,
                                        userID: doc.id,
                                        lastMessage: lastMessage.data.text,
                                        iSentLast: iSentLast,
                                        time: lastMessage.id
                                    });
                                } else {
                                    firestore.collection("agrarians").doc(otherAuthor).get().then((doc) => {
                                        if (doc.exists) {
                                            let lastMessage = currentMessages[currentMessages.length - 1];
                                            let iSentLast = false;
                                            if (lastMessage.data.author == this.currentUser) {
                                                iSentLast = true;
                                            }
                                            this.chatrooms.push({
                                                name: doc.data().name,
                                                seen: c.data().seen,
                                                userID: doc.id,
                                                lastMessage: lastMessage.data.text,
                                                iSentLast: iSentLast,
                                                time: lastMessage.id
                                            });
                                        }
                                    }).catch(e => {
                                        console.log(e);
                                        
                                    })
                                }
                            }).catch(e => {
                                console.error(e);
                                
                            })
                        });
                    }).catch(e => {
                        console.error(e);
                        
                    })
            }
        });
    }
};
</script>

<style>
#header {
    color: white;
    background: var(--v-primary-base);
}
</style>
