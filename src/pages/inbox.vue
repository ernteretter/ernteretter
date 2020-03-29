<template>
<v-card max-width="1000" class="mx-auto">
    <v-card-title>Nachrichten</v-card-title>
    <v-card v-for="(chat, index) in chatrooms" :key="index">
        {{chatrooms[index].name}}
        <v-divider />
        {{chatrooms[index].lastMessage}}
    </v-card>
</v-card>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";

export default {
    data: () => ({
        currentUser: null,
        chatrooms: []
    }),
    async mounted() {
        let firestore = firebase.firestore();
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.$router.push("/login");
                return;
            } else {
                this.currentUser = user.uid;
                console.log("currentUser: " + this.currentUser);
                    firestore
                    .collection("chats")
                    .where("authors", "array-contains", this.currentUser)
                    .get().then(snapshot => {
                        console.log("found new chatrooms: " + snapshot.size);
                        snapshot.forEach(async c => {
                            let data = c.data();
                            let otherAuthor = data.authors.filter(a => a != this.currentUser)[0];
                            let messageSnapshot = await firestore.collection("chats").doc(c.id).collection("messages").get();
                            let currentMessages = [];
                            messageSnapshot.forEach(d => currentMessages.push({
                                data: d.data(),
                                id: d.id
                                }));
                            currentMessages = currentMessages.sort();
                            console.log("current messages: " + currentMessages[0].id);
                            


                            firestore.collection("helpers").doc(otherAuthor).get().then((doc) => {
                                if (doc.exists) {
                                    this.chatrooms.push(doc.data().name);
                                } else {
                                    firestore.collection("agrarians").doc(otherAuthor).get().then((doc) => {
                                        if (doc.exists) {
                                            console.log("other user is a farmer: " + doc.data().name);
                                            let lastMessage = currentMessages[currentMessages.length-1];
                                            this.chatrooms.push({
                                                name: doc.data().name,
                                                lastMessage: lastMessage.data.text,
                                                time: lastMessage.id});
                                        }
                                    })
                                }
                            })
                        });
                        console.log("chatrooms contains: " + this.chatrooms);
                    })
            }
        });
    }
};
</script>

<style>
</style>
