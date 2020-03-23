<template>
    <div class="registerAgrarianSuccess">
        <v-container fluid>
            <h1 align="center">Sie sind erfolgreich Registriert!</h1>

            <v-row justify="center">
                <v-btn color="primary" @click="gotoCreateOffer()">Anzeige erstellen</v-btn>
                <v-btn color="primary" @click="gotoOffers()">bestehende Anzeigen</v-btn>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "registerAgrarianSuccess",
        methods: {
            gotoCreateOffer()
            {
                this.$router.push('/createOffer');
            },
            gotoOffers() {
                this.$router.push('/offers');
            }
        }
    }
</script>

<style scoped>

</style>
