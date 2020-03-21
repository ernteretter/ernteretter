<template>
<v-app>
    <v-app-bar app>
        <v-spacer>
            <v-icon>mdi-barley</v-icon>
            <router-link to="/">Startseite</router-link>
            <router-link to="/offers">Anzeigen</router-link>
            <router-link to="/history">Termine</router-link>
            <router-link to="/settings">Einstellungen</router-link>
        </v-spacer>
        <v-btn color="success" @click="$router.push('/login')" v-if="!user" outlined>login</v-btn>
        <v-btn color="red" @click="logout()" v-if="user" outlined>log out</v-btn>
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
    async mounted() {
        await firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = true;
            } else {
                this.user = false;
            }
        })
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
