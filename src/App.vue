<template>
<v-app>

    <v-navigation-drawer app disable-resize-watcher v-model="displayDrawer" hide-overlay fixed>
        <template>
            <v-btn color="primary" @click="$router.push('/login')" v-if="!user" outlined class="justify-center">login</v-btn>
            <v-btn color="secondary" @click="$router.push('/register')" v-if="!user" outlined>registrieren</v-btn>
            <v-btn color="red" @click="logout()" v-if="user" outlined class="justify-center">log out</v-btn>
            <v-spacer></v-spacer>
            <v-divider class="mt-5"></v-divider>
        </template>
        <v-list dense nav>
            <v-list-item :to="item.condition? item.route : user ? item.route : null" v-for="(item, index) in drawerItems" :key="index">
                    <v-list-item-icon v-if="item.condition ? true : user">
                        <v-icon color="primary">{{item.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content v-if="item.condition ? true : user">
                        <v-list-item-title>{{item.title}}</v-list-item-title>
                    </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar app :dense="drawer" v-resize="onResize">

        <v-row align="center" justify="center">
            <v-col cols="4">
                <v-row>
                    <v-icon color="secondary" >mdi-barley</v-icon>
                    <v-icon color="primary" @click="displayDrawer = !displayDrawer" v-if="drawer" elevation="0" class="symbol-header">mdi-menu</v-icon>
                    <div v-for="(item, index) in drawerItems" :key="index">
                        <v-tooltip bottom v-if="!drawer && (item.condition ? true : user) && ir" >
                            <template v-slot:activator="{ on }">
                                <v-btn icon :to="item.route" class="symbol-header">
                        <v-avatar x-small color-text="white" v-on="on" >
                            <!--{{item.title}}-->
                            
                            <v-icon color="primary" small > {{item.icon}} </v-icon>
                        </v-avatar>
                                </v-btn>
                            </template>
                            <span>{{item.title}}</span>
                        </v-tooltip>
                        <v-btn outlined v-if="fulltextr" color="primary" small class="mr-1 ml-0 mb-1 mt-0 mb-0" :to="item.route">{{item.title}} <v-icon color="primary" small> {{item.icon}} </v-icon></v-btn>
                    </div>
                </v-row> 
            </v-col>
            <v-col cols="4">
            <v-img :src="require('../Ernteretter-Logo_03.png')" contain max-width="256" height="50" @click="$router.push('/')" id="bild" class="mx-auto" />
            </v-col>
            <v-col cols="1"><v-spacer></v-spacer></v-col>
            <v-col cols="1">
                <v-btn color="primary" @click="$router.push('/login')" v-if="!user && !drawer" outlined right>login</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn color="red" @click="logout()" v-if="user && !drawer" outlined >log out</v-btn>
                <v-btn color="secondary" @click="$router.push('/register')" v-if="!user && !drawer" outlined>registrieren</v-btn>
            </v-col>
        </v-row>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
        <!-- Provides the application the proper gutter -->
        <v-container fluid>
            <v-alert type="info" color="primary" v-model="prototype" to="/information">
                <v-row>
                    Dies ist ein Prototyp, wir bitten um Verständnis.
                    <v-btn class="ma-0 ml-3" outlined small @click="$router.push('information')"> Weitere Informationen</v-btn>
                    <v-spacer></v-spacer>
                    <v-icon class="pa-0 ma-0 mr-2" @click="prototype = false">mdi-close</v-icon>
                </v-row>
            </v-alert>
            <!-- If using vue-router -->
            <router-view></router-view>
        </v-container>
    </v-content>
    <v-footer app padless absolute color=dunkelgrau>
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
                <v-btn class="skew" @click="gotoDatenschutz">
                    <span>Datenschutz</span>
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
        console.log("Version 0.9");
        this.onResize()
        await firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = true;
            } else {
                this.user = false;
            }
       })
    },
    data() {
        return {
            fulltextr :false,
            ir :false,
            prototype: true,
            drawer: false,
            displayDrawer: false,
            user: true,
            drawerItems: [
                {
                    title: 'Informationen',
                    icon: 'mdi-information',
                    route: '/information',
                    condition: true
                },
                {
                    title: 'Anzeigen',
                    icon: 'mdi-view-dashboard-outline',
                    route: '/offers',
                    condition: true,
                },
                {
                    title: 'Termine',
                    icon: 'mdi-calendar-range',
                    route: '/history',
                    condition: false
                },
                {
                    title: 'Einstellungen',
                    icon: 'mdi-cog-outline',
                    route: '/settings',
                    condition: false
                },
                
            ]
        };
    },
    methods: {
        async logout() {
            await firebase.auth().signOut().then(() => {
                this.$router.push('/')
            })
        },
        onResize() {
            if (window.innerWidth <= 720) {
                this.drawer = true;
                this.ir = false;
                this.fulltextr = false;
            }
            else if(window.innerWidth > 720 && window.innerWidth <= 1685) 
            {
                this.drawer = false;
                this.ir = true;
                this.fulltextr = false;
            }
            else {
                this.fulltextr = true;
                this.ir = false;
                this.drawer = false
                this.displayDrawer = false
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

.symbol-header 
{
    margin-left: 1px !important;
    margin-right: 2px !important;
    margin-top: 1px !important;
    margin-bottom: 1px !important;
}
</style>
