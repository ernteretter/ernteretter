<template>
<v-card class="mx-auto" max-width="1200">
    <v-card-title id="title" class="headline font-weight-bold "> Auch in dieser besondern Zeit wachsen unsere Pflanzen und versorgen uns alle mit Nahrung</v-card-title>
    <v-img :src="require('../../Ernteretter-Logo_03.png')" class="mx-auto" @click="$router.push('/')" max-width="80%" style="{cursor: pointer}" />
    <v-row class="justify-center">
            <v-btn color="primary" outlined class="rounded-button-right title" @click="$router.push('/registerFarmers')">Ich brauche Hilfe</v-btn>
            <v-btn color="primary" outlined class="rounded-button-left title" @click="$router.push('/offers')">Ich möchte helfen</v-btn>
    </v-row>
    <v-spacer></v-spacer>
    <v-card-subtitle id="title" class="title font-weight-bol"> ein hoffnungsvolles Zeichen in der Corona-Krise. Erntehelfer, die größtenteils aus dem Ausland kommen, können aufgrund geschlossener Landesgrenzen nicht zu uns gelangen.
        Lasst uns alle mithelfen, damit die Aussaat, Pflege und Ernte unserer Feldfrüchte auch in motivierte Erntehelfer finden und sich mit ihnen in Verbindung setzten.
    </v-card-subtitle>
    <v-row class="justify-center">
        <a href="https://www.youtube.com/channel/UCYcy5b6rDekeSvZsIwmd9ZQ">
            <v-icon>mdi-youtube</v-icon>
        </a>
        <a href="https://twitter.com/ernteretter">
            <v-icon>mdi-twitter</v-icon>
        </a>
        <a href="https://www.facebook.com/ernte.retter.52">
            <v-icon>mdi-facebook</v-icon>
        </a>
        <a href="https://www.instagram.com/ernteretter/">
            <v-icon>mdi-instagram</v-icon>
        </a>
    </v-row>
</v-card>
</template>

<script>
export default {
    name: 'landingPage',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
#title {
    word-break: keep-all;
    text-align: center;
}
</style>
