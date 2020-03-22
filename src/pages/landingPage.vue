<template>
<v-card class="mx-auto" max-width="800">
    <v-card-title id="title" class="headline font-weight-bold " > Auch in dieser besondern Zeit wachsen unsere Pflanzen und versorgen uns alle mit Nahrung</v-card-title>
    <v-spacer></v-spacer>
    <v-card-subtitle id="title" class="title font-weight-bol"> ein hoffnungsvolles Zeichen in der Corona-Krise. Erntehelfer, die größtenteils aus dem Ausland kommen, können aufgrund geschlossener Landesgrenzen nicht zu uns gelangen.
        Lasst uns alle mithelfen, damit die Aussaat, Pföege und Ernte unserer Feldfrüchte auch in motivierte Erntehelfer finden und sich mit ihnen in Verbindung setzten.
    </v-card-subtitle>
    <v-container>
        <v-row class="justify-center">
            <v-btn-group>
                <v-btn color="primary" @click="$router.push('/registerFarmers')">Ich brauche Hilfe</v-btn>
                <v-btn color="primary" @click="$router.push('/offers')">Ich möchte helfen</v-btn>
            </v-btn-group>
        </v-row>
    </v-container>
</v-card>
</template>

<script>
export default {
    name: 'landingPage',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
#title {
    word-break: keep-all;
    text-align: center;
}
</style>
