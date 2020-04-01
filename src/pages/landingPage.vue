<template>
<div class="mx-auto" style="max-width:1000px;">
    <div class="picture">
        <v-img :src="require('../../Ernteretter-Logo_03.png')" class="mx-auto " @click="$router.push('/')" max-width="100%" v-if="picture" />
    </div>
    <v-spacer></v-spacer>
    <div class="pb-md-10 text">
        <h1>Auch in dieser besonderen Zeit </h1>
        <h3 class="mx-auto">wachsen unsere Pflanzen und versorgen uns alle mit Nahrung ein hoffnungsvolles Zeichen in der Corona-Krise. Erntehelfer, die größtenteils aus dem Ausland kommen, können aufgrund geschlossener Landesgrenzen nicht zu uns gelangen.
            Lasst uns alle mithelfen, damit die Aussaat, Pflege und Ernte unserer Feldfrüchte auch in motivierte Erntehelfer finden und sich mit ihnen in Verbindung setzten.</h3>
    </div>
    <v-row class="button" no-gutters>
        <v-hover v-slot:default="{ hover }" class="col-12 col-md-6">
            <v-btn color="primary" :outlined="!hover" style="stroke-width: 50px" :max-width="responiveNeeded ? '100%' : '48%'" height="8vh" :class="responiveNeeded ? 'rounded-button-right mx-0 pa-0 font-weight-bold title font-regular' : 'rounded-button-right mx-0 pa-0 font-weight-bold display-1 font-regular'" :small="responiveNeeded" :large="!responiveNeeded" v-resize="onResize" to="/registerFarmers">Ich brauche Hilfe</v-btn>
        </v-hover>
        <v-spacer></v-spacer>
        <v-hover v-slot:default="{ hover }" class="col-12 col-md-6">
            <v-btn color="primary" :outlined="!hover" :max-width="responiveNeeded ? '100%' : '48%'" height="8vh" :class="responiveNeeded ? 'rounded-button-left mx-0 pa-0 font-weight-bold title' : 'rounded-button-left mx-0 pa-0 font-weight-bold display-1'" :small="responiveNeeded" :large="!responiveNeeded" to="/offers">Ich möchte helfen</v-btn>
        </v-hover>
    </v-row>
    <v-row>
        <router-link to="/information" :style="responiveNeeded ? 'padding-top: 10vh; padding-bottom: 3vh; text-decoration: none' : 'padding-top: 0vh; padding-bottom: 3vh; text-decoration: none'" class="mx-auto display-1">
            <v-btn color="primary" large dense outlined class="py-2 my-0">
                <v-icon>mdi-information-outline</v-icon>
                Weitere Informationen
            </v-btn>
        </router-link>
    </v-row>
    <v-row>
        <v-col>
            <div id="iframeContainer">
                <iframe id="yt" src="https://www.youtube.com/embed/UDoYsQH1l-s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </v-col>
    </v-row>
    <v-row class="justify-center">
        <a class="px-1" href="https://www.youtube.com/channel/UCYcy5b6rDekeSvZsIwmd9ZQ">
            <v-icon large>mdi-youtube</v-icon>
        </a>
        <a class="px-1" href="https://twitter.com/ernteretter">
            <v-icon large>mdi-twitter</v-icon>
        </a>
        <a class="px-1" href="https://www.facebook.com/ernte.retter.52">
            <v-icon large>mdi-facebook</v-icon>
        </a>
        <a class="px-1" href="https://www.instagram.com/ernteretter/">
            <v-icon large>mdi-instagram</v-icon>
        </a>
        <a class="px-1" href="https://github.com/iBims1JFK/ernteretter">
            <v-icon large>mdi-github</v-icon>
        </a>
    </v-row>
</div>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

export default {
    name: 'landingPage',
    data() {
        return {
            picture: true,
            needHelp: '/registerFarmers',
            responiveNeeded: false
        }
    },
    metaInfo() {
        return {
            title: 'Startseite - ernteretter',
            meta: [{
                    name: 'og:title',
                    content: 'Ernteretter'
                },
                {
                    name: 'og:description',
                    content: 'Eine Plattform zum Vermitteln von Helfern und Landwirten'
                },
                {
                    name: 'og:image',
                    content: require('../assets/ernteretter.png')
                },
                {
                    name: 'description',
                    content: 'Eine Plattform zum Vermitteln von Helfern und Landwirten'
                }
            ]
        }
    },
    methods: {
        onResize() {
            console.log(window.innerWidth);

            if (window.innerWidth <= 320) {
                this.picture = false
            } else if (window.innerWidth < 960) {
                this.picture = true
                this.responiveNeeded = true
            } else {
                this.picture = true
                this.responiveNeeded = false
            }
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.firestore().collection('agrarians').doc(user.uid).get().then(async (doc) => {
                    if (doc.exists) {

                        this.needHelp = '/createOffer'
                    } else {
                        this.needHelp = '/offers'
                    }
                })
            } else {
                this.needHelp = '/registerFarmers'
            }
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
#title {
    word-break: keep-all;
}

#iframeContainer {
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;
}

#yt {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
}

@media (max-width: 320px) {
    .picture {
        padding-top: 0vh;
        padding-bottom: 0vh;
    }
}

@media (max-width: 960px) {
    .picture {
        padding-top: 2vh;
        padding-bottom: 4vh;
    }

    .text h1 {
        font-weight: 600;
        font-size: 1.5rem;
        line-height: 3vh;
        font-family: 'Open Sans', sans-serif;
        color: black;
        display: inline;
    }

    .text h3 {
        font-weight: 500;
        line-height: 3.5vh;
        display: inline;
    }

    .button {
        padding-top: 4vh;
        padding-bottom: 4vh;
    }

}

@media (min-width: 960px) {
    .picture {
        padding-top: 8vh;
        padding-bottom: 4vh;
    }

    .text h1 {
        font-weight: 700;
        font-size: 2rem;
        font-family: 'Open Sans', sans-serif;
        color: black;
        display: inline;
    }

    .text h3 {
        font-weight: 600;
        display: inline;
    }

    .button {
        padding-top: 8vh;
        padding-bottom: 4vh;
    }
}
</style>
