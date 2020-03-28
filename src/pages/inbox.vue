<template>
<v-card max-width="1000" class="mx-auto">
    <v-card-title>Nachrichten</v-card-title>
    <v-card v-for="(chat, index) in chatrooms" :key="index">
        {{chat.author}}
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
    mounted() {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.$router.push("/login");
                return;
            } else {
                this.currentUser = user.uid;
                console.log("currentUser: " + this.currentUser);
                firebase
                    .firestore()
                    .collection("chats")
                    .where("author1", "==", this.currentUser)
                    .get().then(snapshot => {
                        console.log("found new chatrooms: " + snapshot.size);
                        snapshot.forEach(c => this.chatrooms.push(c.data()));
                        console.log("chatrooms contains: " + this.chatrooms);
                    })
            }
        });
    }
};
</script>

<style>
</style>
