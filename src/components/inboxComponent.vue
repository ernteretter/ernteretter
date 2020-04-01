<template>
<v-card max-width="1000" min-height="600" class="mx-auto">
    <v-card-title v-if="chatroomsNew.length > 0" id="headerOld">neue Nachrichten</v-card-title>
    <!-- <v-divider v-if="chatroomsNew.length > 0" /> -->
    <div style="vertical-align: middle;">
        <v-card-title v-if="!(chatrooms.length > 0)" id="headerNew" class="noMessages">Du hast noch keine Nachrichten :(</v-card-title>
    </div>
    <v-list three-line class="ma-2 ma-md-10" @click="gotoChat(chat)" v-for="(chat, index1) in chatroomsNew" :key="index1">
        <v-list-item-content style="cursor: pointer; border-bottom: 2px solid #ed9a00;" @click="gotoChat(chat)">
            <v-row class="px-3">
                <v-list-item-title class="title col-6 col-md-5 pa-0">{{chat.name}}</v-list-item-title>
                <v-list-item-subtitle class="col-5 text-end pa-0"> {{formatDate(chat.time)}} </v-list-item-subtitle>
            </v-row>
            <v-list-item-subtitle class="body-1" :class="chat.iSentLast ? 'secondary--text' : 'primary--text'">{{chat.lastMessage}}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list>

    <v-card-title v-if="chatroomsOld.length > 0" id="headerOld">gelesene Nachrichten</v-card-title>
    <!-- <v-divider /> -->
    <v-list three-line class="ma-2 ma-md-10" @click="gotoChat(chat) " v-for="(chat, index1) in chatroomsOld" :key="index1">
        <v-list-item-content style="cursor: pointer; border-bottom: 2px solid #ed9a00;" @click="gotoChat(chat)">
            <v-row class="px-3">
                <v-list-item-title class="title col-6 col-md-5 pa-0">{{chat.name}}</v-list-item-title>
                <v-list-item-subtitle class="col-5 text-end pa-0"> {{formatDate(chat.time)}} </v-list-item-subtitle>
            </v-row>
            <v-list-item-subtitle class="body-1" :class="chat.iSentLast ? 'secondary--text' : 'primary--text'">{{chat.lastMessage}}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import inboxComponent from '../components/inboxComponent.vue';

export default {
    name: inboxComponent,
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
                            console.log(data);
                            if (data.isGroupchat) {
                                console.log("found groupchat1: " + c.id);
                                let offerSnapshot = await firebase.firestore().collection("offers").doc(c.id).get();
                                if (offerSnapshot.data() != null) {
                                    console.log("found groupchat");
                                    let lastMessage = currentMessages[currentMessages.length - 1];
                                    let iSentLast = false;
                                    if (lastMessage.data.author == this.currentUser) {
                                        iSentLast = true;
                                    }
                                    this.chatrooms.push({
                                        name: offerSnapshot.data().title,
                                        seen: data.seen,
                                        userID: c.id,
                                        lastMessage: lastMessage.data.text,
                                        iSentLast: iSentLast,
                                        time: lastMessage.id
                                    });
                                }
                            } else {
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
                            }
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
#headerNew {
    color: var(--v-primary-base);
    background: white;
    height: 60px;
}

#headerOld {
    color: var(--v-primary-base);
    background: white;
    height: 60px;
}

@media (min-width: 714px){
    .noMessages {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
}

@media (max-width: 714px) {
    .noMessages {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
    }
}
</style>
