<template>
<v-app>
    <v-app-bar app>
        <v-row align="center" justify="center">
            <v-col>
                <v-row>
                    <v-icon>mdi-barley</v-icon>
                    <v-btn small outlined color=primary to="/offers" min-width="115">
                        Anzeigen
                        <v-spacer />
                        <v-icon small> mdi-view-dashboard-outline </v-icon>
                    </v-btn>
                    <v-btn small outlined color=primary to="/history" v-if="user" min-width="110">
                        Termine
                        <v-spacer />
                        <v-icon small> mdi-calendar-range </v-icon>
                    </v-btn>
                    <v-btn small outlined color=primary to="/settings" v-if="user" min-width="155">
                        Einstellungen
                        <v-spacer />
                        <v-icon small> mdi-cog-outline </v-icon>
                    </v-btn>
                </v-row>
            </v-col>
            <v-img :src="require('../Ernteretter-Logo_03.png')" contain width="5" height="50" @click="$router.push('/')" id="bild"/>
            <v-col>
                <!-- </v-col>
          <v-col>-->
                <v-btn color="success" @click="$router.push('/login')" v-if="!user" outlined>login</v-btn>
                <v-btn color="primary" @click="$router.push('/registerHelper')" v-if="!user" outlined>als Helfer Registrieren</v-btn>
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

    <v-footer app padless color=dunkelgrau>
        <v-col class="text-center" cols="12">
            <v-card-text class="py-2 white--text text-center"> Datenschutz | Impressum </v-card-text>
            <v-card-text class="py-2 white--text text-center">
                <v-icon color="primary">mdi-copyright</v-icon>
                {{ new Date().getFullYear() }} —
                <strong>ernteretter</strong>
            </v-card-text>
        </v-col>
        <cookie-law>
            <div slot-scope="props">
                <p>
                    Diese Seite verwendet Cookies, um Ihnen ein tolles Surferlebnis zu ermöglichen.
                    <router-link to="Datenschutz">Mehr erfahren.</router-link>
                </p>
                <v-btn class="skew" @click="props.accept">
                    <span>Ich akzeptiere</span>
                </v-btn>
                <v-btn class="skew" @click="props.close">
                    <span>Ich lehne ab</span>
                </v-btn>
            </div>
        </cookie-law>
    </v-footer>
</v-app>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import CookieLaw from "vue-cookie-law";

export default {
    name: "App",
    components: {
        CookieLaw
    },
    async mounted() {
        await firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = true;
            } else {
                this.user = false;
            }
        });
    },
    data() {
        return {
            user: true
        };
    },
    methods: {
        logout() {
            firebase.auth().signOut();
        }
    }
};
</script>

<style>
#bild {
  cursor: pointer;
}

.header123 {
  display: initial;
}

.rounded-button-right {
    border-radius: 0px 40px 0px 40px !important;
}

.rounded-button-left {
    border-radius: 40px 0px 40px 0px !important;
}
</style>
