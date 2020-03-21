<template>
<v-app>
    <v-app-bar app>
        <!-- -->
        <v-btn color="red" @click="logout()" v-if="!user">log out</v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>

        <!-- Provides the application the proper gutter -->
        <v-container fluid>

            <!-- If using vue-router -->
            <router-view></router-view>
        </v-container>
    </v-content>

    <v-footer app>
        <!-- -->
    </v-footer>
</v-app>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
export default {
    name: 'App',

    components: {},
    mounted(){
      if(firebase.auth().currentUser == null){
        this.user = false;
      }
    },
    data() {
        return {
          user: true,
        }
    },
    methods: {
        logout() {
            firebase.auth().signOut()
        },
    }
};
</script>
