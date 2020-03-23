<template>
<v-app>
    <v-navigation-drawer app disable-resize-watcher v-model="displayDrawer" hide-overlay>
        <v-list>
                <v-list-item>

                </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-app-bar app :dense="drawer" v-resize="onResize">
        <v-row align="center" justify="center">
            <v-col>
                <v-row>
                    <v-icon>mdi-barley</v-icon>
                    <v-icon color="primary" @click="displayDrawer = !displayDrawer" v-if="drawer">mdi-menu</v-icon>
                    <v-btn v-if="!drawer" small outlined color=primary to="/offers" min-width="115">
                        Anzeigen
                        <v-spacer />
                        <v-icon small> mdi-view-dashboard-outline </v-icon>
                    </v-btn>
                    <v-btn small outlined color=primary to="/history" v-if="user && !drawer" min-width="110">
                        Termine
                        <v-spacer />
                        <v-icon small> mdi-calendar-range </v-icon>
                    </v-btn>
                    <v-btn small outlined color=primary to="/settings" v-if="user && !drawer" min-width="155">
                        Einstellungen
                        <v-spacer />
                        <v-icon small> mdi-cog-outline </v-icon>
                    </v-btn>
                </v-row>
            </v-col>
            <v-img :src="require('../Ernteretter-Logo_03.png')" contain width="5" height="50" @click="$router.push('/')" id="bild" />
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
        <v-col>
            <v-row class="justify-center" no-gutters>
                <v-col class="flex-grow-0">
                    <v-card-text id="bild" @click="gotoDatenschutz()" class="py-2 white--text"> Datenschutz</v-card-text>
                </v-col>
                <v-col class="flex-grow-0">
                    <v-card-text class="py-2 white--text">|</v-card-text>
                </v-col>
                <v-col class="flex-grow-0">
                    <v-card-text id="bild" @click="gotoImpressum()" class="py-2 white--text">Impressum</v-card-text>
                </v-col>
            </v-row>
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
        this.onResize()
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
            drawer: false,
            displayDrawer: false,
            user: true
        };
    },
    methods: {
        logout() {
            firebase.auth().signOut();
        },
        onResize(){
            if(window.innerWidth < 960){
                this.drawer = true
            } else {
                this.drawer = false
            }
        },
        gotoDatenschutz() {
            this.$router.push("/datenschutz");
        },
        gotoImpressum() {
            this.$router.push("/impressum");
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
