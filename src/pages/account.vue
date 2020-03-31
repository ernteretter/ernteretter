<template>
<v-card width="1000" class="mx-auto justify-center">
    <v-tabs v-model="tab" background-color="primary" dark>
        <v-tab v-for="item in items" :key="item.tab">
            {{ item.tab }}
        </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
        <v-tab-item>
            <v-card flat>
                <inboxComponent />
            </v-card>
        </v-tab-item>
        <v-tab-item>
            <v-card flat>
                <historyComponent />
            </v-card>
        </v-tab-item>
        <v-tab-item>
            <v-card flat>
                <settingsComponent />
            </v-card>
        </v-tab-item>
    </v-tabs-items>

</v-card>
</template>

<script>
import settingsComponent from '../components/settingsComponent.vue';
import historyComponent from '../components/historyComponent.vue';
import inboxComponent from '../components/inboxComponent.vue';
export default {
    components: {
        settingsComponent,
        historyComponent,
        inboxComponent
    },
    data() {
        return {
            tab: null,
            items: [{
                    tab: 'Nachrichten',
                },
                {
                    tab: 'Termine',
                },
                {
                    tab: 'Einstellungen',
                },
            ],
        }
    },
}
</script>
