<template>
<v-app>
    <v-app-bar app>
        <v-row align="center" justify="center">
            <v-col>
                <v-icon>mdi-barley</v-icon>
                <router-link to="/">Startseite</router-link>
                <router-link to="/offers">Anzeigen</router-link>
                <router-link to="/history">Termine</router-link>
                <router-link to="/settings">Einstellungen</router-link>
            </v-col>
                <v-img :src="require('../Ernteretter-Logo_03.png')" contain width="5" height="50" />
            <v-col>
            <!-- </v-col>
            <v-col> -->
                <v-btn color="success" @click="$router.push('/login')" v-if="!user" outlined>login</v-btn>
                <v-btn color="red" @click="logout()" v-if="user" outlined>log out</v-btn>
            </v-col>
        </v-row>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>

        <!-- Provides the application the proper gutter -->
        <v-container fluid>

            <!-- If using vue-router -->
            <router-view></router-view>
        </v-container>
    </v-content>

    <v-footer app padless color="grey">
        <v-col class="text-center" cols="12">
            <v-card-text class="py-2 white--text text-center">
                {{ new Date().getFullYear() }} — <strong>ernteretter</strong>
            </v-card-text>
        </v-col>
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

<style>
    .rounded-button-right {
        border-radius: 0px 40px 0px 40px !important;
    }

    .rounded-button-left {
        border-radius: 40px 0px 40px 0px !important;
    }
</style>
