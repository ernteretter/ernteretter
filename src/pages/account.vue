<template>
<v-card width="1000" class="mx-auto justify-center">
    <v-tabs mobile-break-point="400" grow centered v-model="tab" background-color="primary" dark>
        <v-tab v-for="item in items" :key="item.tab">
            <v-icon> {{item.icon}}</v-icon>
            <v-card-text class="d-none d-md-inline">{{ item.tab }}</v-card-text>
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
                    icon: 'mdi-message'
                },
                {
                    tab: 'Termine/Anzeigen',
                    icon: 'mdi-calendar'
                },
                {
                    tab: 'Einstellungen',
                    icon: 'mdi-cog'
                },
            ],
        }
    },
    watch: {
        tab(val){
            var url 
            if(val == 0){
                url = 'messages'
            } else if(val == 1) {
                url = 'offers'
            } else if(val == 2) {
                url = 'settings'
            }
            this.$router.replace({
                path: 'account',
                query: {
                    view: url,
                }
            })
        }
    },
    created(){
        var url = this.$route.query.view
            if(url == 'messages'){
                this.tab = 0
            } else if(url == 'offers') {
                this.tab = 1
            } else if(url == 'settings') {
                this.tab = 2
            }
        }
}
</script>
