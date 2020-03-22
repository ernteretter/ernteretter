<template>
    <div class="registerHelperSuccess">
        <v-card-title>
            <h1>Du bist erfolgreich Registriert!</h1>
        </v-card-title>
        <v-card-actions>
            <v-btn color="success" @click="onRelocateLogin()">weiter zum Login</v-btn>
        </v-card-actions>
    </div>
</template>

<script>
    export default {
        name: "registerHelperSuccess",
        methods: {
            onRelocateLogin()
            {
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>

</style>
