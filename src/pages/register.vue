<template>
<v-card max-width="1000" class="mx-auto my-10">
    <v-container class="py-10">
        <v-card-text class="text-center display-2">Wer bist du?</v-card-text>
        <v-row class="justify-center" no-gutters>
            <v-btn color="primary" outlined class="rounded-button-right" large v-resize="onResize" to="/registerFarmers">Landwirt</v-btn>
            <v-btn color="primary" outlined class="rounded-button-left" min-width="121.63" large to="/registerHelper">Helfer</v-btn>
        </v-row>
        <v-card-subtitle class="text-center">Diese Entscheidung kann nicht mehr geändert werden.</v-card-subtitle>
    </v-container>
</v-card>
</template>

<script>
export default {
    data() {
        return {
            responiveNeeded: false
        }
    },
    metaInfo() {
            return {
                title: 'Registere dich - ernteretter',
                meta: [{
                        name: 'description',
                        content: 'Regestiere dich bei ernteretter und werde Helfer oder lasse dir helfen'
                    },
                    {
                        name: 'og:title',
                        content: 'Ernteretter'
                    },
                    {
                        name: 'og:description',
                        content: 'Regestiere dich bei ernteretter und werde Helfer oder lasse dir helfen'
                    },
                    {
                        name: 'og:image',
                        content: require('../assets/ernteretter.png')
                    },
                ]
            }
        },
    methods: {
        onResize() {
            if (window.innerWidth < 452) {
                this.responiveNeeded = true
            } else {
                this.responiveNeeded = false
            }
        }
    }
}
</script>

<style>

</style>
