<template>
<v-card max-width="1000" min-height="600" class="mx-auto">
    <v-card-title v-if="chatroomsNew.length > 0" id="header">Neue Nachrichten</v-card-title>
    <v-divider />
    <v-list three-line class="ma-10" @click="gotoChat(chat)" v-for="(chat, index1) in chatroomsNew" :key="index1">
        <v-subheader>{{chat.name}}</v-subheader>
        <v-list-item>{{formatDate(chat.time)}</v-list-item>
        <v-divider />
        <v-row>
            <v-card-text class="body-1" :class="chat.iSentLast ? 'secondary--text' : 'primary--text'">{{chat.lastMessage}}</v-card-text>
        </v-row>
    </v-list>

    <v-card-title v-if="chatroomsOld.length > 0" id="header">Alte Nachrichten</v-card-title>
    <v-divider />
    <v-card class="ma-10" @click="gotoChat(chat)" v-for="(chat, index) in chatroomsOld" :key="index">
        <v-card-title>{{chat.name}}</v-card-title>
        <v-card-text class="caption">{{formatDate(chat.time)}}</v-card-text>
        <v-divider />
        <v-row>
            <v-card-text class="body-1" :class="chat.iSentLast ? 'secondary--text' : 'primary--text'">{{chat.lastMessage}}</v-card-text>
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
        chatroomsNew: [],
        chatroomsOld: [],
    }),
    methods: {
        gotoChat(chat) {
            let otherUser = chat.userID;
            this.$router.push("/chat/" + otherUser);
        },
        formatDate(date) {
            var options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            let t = firebase.firestore.Timestamp.fromMillis(date).toDate().toLocaleString('de-DE', options);
            return t;
        }
    },
    watch: {
        chatrooms: {
            handler: function () {
                function sorter(a, b) {
                    return (a.time > b.time ? -1 : (b.time > a.time ? 1 : 0));
                }
                this.chatroomsNew = this.chatrooms.slice().filter(m => !m.seen.includes(this.currentUser)).sort(sorter);
                this.chatroomsOld = this.chatrooms.slice().filter(m => m.seen.includes(this.currentUser)).sort(sorter);
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
                            let messageSnapshot = await firestore.collection("chats").doc(c.id).collection("messages").get().catch(e => {
                                console.error(e)
                            });
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
                                    console.log("seen: " + data.seen);
                                    this.chatrooms.push({
                                        name: doc.data().name,
                                        seen: data.seen,
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
                                            console.log("seen: " + data.seen);
                                            this.chatrooms.push({
                                                name: doc.data().name,
                                                seen: data.seen,
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
