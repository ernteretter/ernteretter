import Vue from 'vue';
import Vuetify from 'vuetify/lib';

const vuetify = new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#ed9a00",
                secondary: '#4d4238',
                accent: "#ffdf59",
                dunkelgrau: "#282828",
                schwarz: "#000000",
                hellgrau: "#a0a0a0"
            }
        }
    }
})

Vue.use(vuetify);

export default new Vuetify({
});
