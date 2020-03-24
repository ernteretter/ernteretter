<template>
<v-card class="mx-auto" max-width="1200">
    <v-card-title id="title" class="headline font-weight-bold "> Auch in dieser besondern Zeit wachsen unsere Pflanzen und versorgen uns alle mit Nahrung</v-card-title>
    <v-img :src="require('../../Ernteretter-Logo_03.png')" class="mx-auto" @click="$router.push('/')" max-width="80%" style="{cursor: pointer}" />
    <v-row class="justify-center" no-gutters>
        <v-btn color="primary" outlined class="rounded-button-right" :x-small="responiveNeeded" v-resize="onResize" to="/registerFarmers">Ich brauche Hilfe</v-btn>
        <v-btn color="primary" outlined class="rounded-button-left" :x-small="responiveNeeded" to="/offers">Ich möchte helfen</v-btn>
    </v-row>
    <v-spacer></v-spacer>
    <v-card-subtitle id="title" class="title font-weight-bol"> ein hoffnungsvolles Zeichen in der Corona-Krise. Erntehelfer, die größtenteils aus dem Ausland kommen, können aufgrund geschlossener Landesgrenzen nicht zu uns gelangen.
        Lasst uns alle mithelfen, damit die Aussaat, Pflege und Ernte unserer Feldfrüchte auch in motivierte Erntehelfer finden und sich mit ihnen in Verbindung setzten.
    </v-card-subtitle>
    <v-row>
        <router-link to="/information" class="mx-auto display-1">
            <v-btn color="primary" dense outlined class="py-0 my-0">Weitere Informationen</v-btn>
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
    </v-row>
</v-card>
</template>

<script>
export default {
    name: 'landingPage',
    data(){
        return{
            responiveNeeded: 'false'
        }
    },
    methods:{
        onResize(){
            if(window.innerWidth < 452){
                this.responiveNeeded = true
            } else {
                this.responiveNeeded = false
            }
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
#title {
    word-break: keep-all;
    text-align: center;
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
</style>
