<template>
<div>
    <v-row>
        <v-col cols="8">
            <v-card style="height: 80vh;">
                <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center">
                    <l-tile-layer :url="url"></l-tile-layer>
                    <l-marker v-for="(offer, index) in offers" :key="index" :lat-lng=offer.geoPointNew>
                        <l-popup>
                            <v-row :key="index*10">
                                <v-col :key="index" cols="7" class="px-0">
                                    <v-list-item :key="index*11 + 1">
                                        <!-- <v-list-item-avatar>
                                        <v-img src=offer.photoURL></v-img>
                                    </v-list-item-avatar>
                                    -->
                                        <v-list-item-content>
                                            <v-list-item-title>{{offer.title}}</v-list-item-title>
                                            <v-list-item-subtitle>{{offer.description}}</v-list-item-subtitle>
                                            <v-list-item-subtitle>vom {{offer.startDate.toDate().toLocaleDateString()}} bis {{offer.endDate.toDate().toLocaleDateString()}} mit einer Mindestdauer: {{offer.minDuration}} Tagen</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col :key="index * 10 + 2" cols="4" align="end" class="px-0">
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-subtitle aligin="center">{{offer.helperCount}}/{{offer.maxHelpers}}</v-list-item-subtitle>
                                        <v-list-item-subtitle aligin="center">{{offer.address.city}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-card-actions :key="index * 10 + 3">
                                        <v-btn @click="details(offer.id)" color="primary" class="rounded-button-left ma-0" x-small> Details </v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </l-popup>
                    </l-marker>
                </l-map>
            </v-card>
        </v-col>
        <v-col cols="4">
            <v-card height="80vh">
                <v-row>
                    <v-col>
                        <v-responsive :min-width="230" :height="64">
                            <v-text-field v-bind="size" class="mb-3 mr-3 ml-3" outlined type="text" v-model="search" placeholder="Suche nach Titel" />
                        </v-responsive>
                    </v-col>
                    <v-col>
                        <v-responsive :min-width="230" :height="64">
                            <v-text-field class="mb-3 mr-3 ml-3" outlined type="text" v-model="zipsearch" maxlength="5" minlength="4" minval placeholder="Suche nach PLZ" />
                        </v-responsive>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col id="radiussilder" :align="center_layout" :justify="center_layout" class="ma-3 mr-6">
                        <v-responsive :max-width="600" :min-height="60">
                            <v-slider class="pt-7 mr-5 ml-3" v-model="searchradius" label="Radius (km)" :min_="1" :max="50" thumb-label="always" thumb-size="24" thumb-color="primary"></v-slider>
                        </v-responsive>
                    </v-col>
                </v-row>
                <v-row class="justify-center">
                    <v-btn v-bind="size" color="primary" id="searchbutton" @click="searchOffersNew();" class="rounded-button-left ma-3" min-width="11%">SUCHE</v-btn>
                    <v-btn v-bind="size" color="secondary" id="createbutton" @click="createOffer();" class="rounded-button-right ma-3" min-width="11%">ANZEIGE ERSTELLEN</v-btn>
                </v-row>
                <v-divider></v-divider>
                <v-card-subtitle> Ihre Suchanfrage hat {{offers.length}} Anzeige(n) ergeben. </v-card-subtitle>

                <v-container style="max-height: 50%" class="overflow-y-auto">
                    <v-list three-line tile outlined :color="colorEintrag">
                        <template v-for="(offer, index) in offers">
                            <v-row :key="index*10">
                                <v-col :key="index" cols="10">
                                    <v-list-item :key="index*11 + 1">
                                        <!-- <v-list-item-avatar>
                                        <v-img src=offer.photoURL></v-img>
                                    </v-list-item-avatar>
                                    -->
                                        <v-list-item-content>
                                            <v-list-item-title>{{offer.title}}</v-list-item-title>
                                            <v-list-item-subtitle>{{offer.description}}</v-list-item-subtitle>
                                            <v-list-item-subtitle>vom {{offer.startDate.toDate().toLocaleDateString()}} bis {{offer.endDate.toDate().toLocaleDateString()}} mit einer Mindestdauer: {{offer.minDuration}} Tagen</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col :key="index * 10 + 2" cols="2" align="end">
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-subtitle aligin="center">{{offer.helperCount}}/{{offer.maxHelpers}}</v-list-item-subtitle>
                                        <v-list-item-subtitle aligin="center">{{offer.address.city}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-card-actions :key="index * 10 + 3">
                                        <v-btn @click="details(offer.id)" color="primary" class="rounded-button-left ma-0" x-small> Details </v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                            <v-divider :key="index * 10 + 4" color="orange"></v-divider>
                        </template>
                    </v-list>
                </v-container>
            </v-card>
        </v-col>
    </v-row>
</div>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import {
    GeoCoordinate
} from 'geocoordinate';
import {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
} from 'vue2-leaflet';
//marker fix
import {
    Icon
} from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
export default {
    name: "OfferList",
    data: () => ({
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 7,
        center: [49.877629, 8.654673],
        center_layout: 'center',
        colorEintrag: '#fffff',
        detailbutton: '#fffff',
        //filteredList:[],
        item_color: 'primary',
        offers: [],
        search: "",
        zipsearch: "",
        number_of_plz_nearby: 100,
        searchradius: 5, //war ""
        farm_plz_arr: [],
        offercount: 0
    }),
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
    },
    computed: {
        size() {
            const size = {
                sm: 'small',
                lg: 'large',
                xl: 'x-large'
            } [this.$vuetify.breakpoint.name];
            return size ? {
                [size]: true
            } : {}
        }
    },
    methods: {
        createOffer() {
            this.$router.push("/createOffer");
        },
        details(id) {
            this.$router.push({
                name: "offer-details",
                params: {
                    offerId: id
                }
            });
        },
        async searchOffersNew() {
            var URL = "https://nominatim.openstreetmap.org/search/de"
            URL = URL + "/" + this.zipsearch.replace(" ", "%20") + "?format=json&addressdetails=1&limit=1"
            var response = await fetch(URL)
            var responseJSON = await response.json()
            var lat = parseFloat(responseJSON[0].lat)
            var lon = parseFloat(responseJSON[0].lon)
            const center = new GeoCoordinate(lat, lon)
            var distance = this.searchradius * 1000
            var North = center.pointAtDistance(distance, 0)
            var East = center.pointAtDistance(distance, 0.5 * Math.PI)
            var South = center.pointAtDistance(distance, Math.PI)
            var West = center.pointAtDistance(distance, 1.5 * Math.PI)
            North = North._coordinate
            East = East._coordinate
            South = South._coordinate
            West = West._coordinate
            var upperPoint = new firebase.firestore.GeoPoint(North[0], East[1])
            var lowerPoint = new firebase.firestore.GeoPoint(South[0], West[1])
            firebase.firestore().collection('offers').where('geoPoint', '<=', upperPoint).where('geoPoint', '>=', lowerPoint)
                .get().then((snapshot) => {
                    this.offers = []
                    snapshot.forEach((doc) => {
                        var data = doc.data()
                        if (upperPoint.longitude > data.geoPoint.longitude && data.geoPoint.longitude > lowerPoint.longitude) {
                            this.offers.push({
                                ...doc.data(),
                                id: doc.id,
                                geoPointNew: [doc.data().geoPoint.latitude, doc.data().geoPoint.longitude]
                            })
                        }
                    })
                })
        },
    },
    mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            firebase.firestore().collection('helpers').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    if (doc.data().searchRange > 0) {
                        this.searchradius = doc.data().searchRange
                    }
                    if (doc.data().place.postcode) {
                        this.zipsearch = doc.data().place.postcode
                        this.searchOffersNew()
                    }
                } else {
                    firebase.firestore().collection('agrarians').doc(user.uid).get().then((doc) => {
                        console.log(user.uid);
                        
                        console.log(doc.data());
                        if (doc.data().searchRange > 0) {
                            this.zipsearch = doc.data().searchRange
                        }
                        if (doc.data().place.postcode) {
                            this.zipsearch = doc.data().place.postcode
                            this.searchOffersNew()
                        }
                    })
                }
            })
        })
    }
}
</script>
