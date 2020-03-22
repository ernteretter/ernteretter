<template>
    <div class="registerAgrarianSuccess">
        <v-container fluid>
            <h1 align="center">Sie sind erfolgreich Registriert!</h1>

            <v-row justify="center">
                <v-btn color="success" @click="onRelocateLogin()">weiter zum Anzeigen erstellen</v-btn>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "registerAgrarianSuccess",
        methods: {
            onRelocateLogin()
            {
                this.$router.push('/createOffer');
            }
        }
    }
</script>

<style scoped>

</style>
