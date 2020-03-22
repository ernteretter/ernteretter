<template>
    <div class="registerHelperSuccess">
        <v-container fluid>
            <h1 align="center">Du bist erfolgreich Registriert!</h1>

            <v-row justify="center">
                <v-btn color="success" @click="onRelocateLogin()">weiter zum Login</v-btn>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "registerHelperSuccess",
        methods: {
            onRelocateLogin()
            {
                this.$router.push('/offers');
            }
        }
    }
</script>

<style scoped>

</style>
