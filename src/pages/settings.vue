<template>
<v-card max-width="600" class="mx-auto">
    <v-toolbar color="teal" dark>
        <v-toolbar-title>Einstellungen</v-toolbar-title>
        <template v-slot:extension>
            <v-tabs v-model="tab" align-with-title>
                <v-tab v-for="item in tabs" :key="item">
                    {{ item }}
                </v-tab>
            </v-tabs>
        </template>
    </v-toolbar>
    
    <v-tabs-items v-model="tabs">
        <v-tab-item>
            <v-card>
                <v-card-text>
                    tab1
                </v-card-text>
            </v-card>
        </v-tab-item>
        <v-tab-item>
            <v-card>
                <v-card-text>
                    tab2
                </v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs-items>
</v-card>
</template>

<script>
export default {
    data() {
        return {
            tab: null,
            tabs: ['Konto', 'Präferenz'],

        }
    }
}
</script>

<style>

</style>
