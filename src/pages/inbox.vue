<template>
<v-card>
    <v-card-title>Nachrichten</v-card-title>
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
                firebase
                    .firestore()
                    .collection("chats")
                    .where("author1", "==", this.currentUser)
                    .where("author2", "==", this.currentUser)
                    .get()
            }
        });
    }
};
</script>

<style>
</style>
