<template>
<div v-resize="onResize">
    <v-row>
        <v-col class="col-12 col-md-8" v-show="!mobil || displayMap">
            <v-card style="height: 85vh">
                <l-map style="width: 100%" :zoom="zoom" :center="center">
                    <l-tile-layer :url="url"></l-tile-layer>
                    <l-control position="topright">
                        <v-btn color="primary" @click="displayMap = !displayMap" v-show="displayMap">
                            <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                    </l-control>
                    <l-marker v-for="(offer, index) in offers" :key="index" :lat-lng=offer.geoPointNew>
                        <l-popup>
                            <v-row :key="index*10">
                                <v-col :key="index" cols="7" class="px-0 mx-0">
                                    <v-list-item :key="index*11 + 1">
                                        <v-list-item-content>
                                            <v-list-item-title>{{offer.title}}</v-list-item-title>
                                            <v-list-item-subtitle>{{offer.description}}</v-list-item-subtitle>
                                            <v-list-item-subtitle>vom {{offer.startDate.toDate().toLocaleDateString()}} bis {{offer.endDate.toDate().toLocaleDateString()}} mit einer Mindestdauer: {{offer.minDuration}} Tagen</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col :key="index * 10 + 2" cols="4" align="end" class="pa-0">
                                    <v-list-item-content>
                                        <v-list-item-subtitle aligin="center">{{offer.helperCount}}/{{offer.maxHelpers}}</v-list-item-subtitle>
                                        <v-list-item-subtitle aligin="center">{{offer.address.city}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-card-actions :key="index * 10 + 3">
                                        <v-btn @click="$router.push('offer/' + offer.id)" color="primary" class="rounded-button-left ma-0" x-small> Details </v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-row>
                        </l-popup>
                    </l-marker>
                </l-map>
            </v-card>
        </v-col>
        <v-col class="col-12 col-md-4">
            <v-card height="null" v-show="!displayMap">
                <v-row>
                    <v-col>
                        <v-card-title>Suche nach Anzeigen</v-card-title>
                        <v-row class="justify-center">
                            <v-text-field v-bind="size" class="mb-3 mr-3 ml-3 col-10 cols-xs-4 col-sm-6" outlined type="text" v-model="search" placeholder="Suche nach Titel" />
                            <v-text-field class="mb-md-3 mr-3 ml-3 col-10 col-xs-4 col-sm-4 " outlined type="text" v-model="zipsearch" maxlength="5" minlength="4" minval placeholder="Suche nach PLZ" />
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col id="radiussilder" :align="center_layout" :justify="center_layout" class="ma-md-0 mr-md-0 xs-ma-0 xs-pa-0">
                        <v-responsive :max-width="600" :min-height="60">
                            <v-slider class="pt-7 mr-5 ml-3" v-model="searchradius" label="Radius (km)" :min_="1" :max="100" thumb-label="always" thumb-size="24" thumb-color="primary"></v-slider>
                        </v-responsive>
                    </v-col>
                </v-row>
                <v-row class="justify-center">
                    <v-btn class="rounded-button-right ma-3" v-bind="size" color="primary" id="searchbutton" min-width="11%" @click="displayMap = !displayMap" v-show="mobil">
                        <v-icon class="ma-0 pa-0" v-show="mobil">mdi-map</v-icon>
                        Karte
                    </v-btn>
                    <v-btn v-bind="size" color="primary" id="searchbutton" @click="atSearch();" class="rounded-button-left ma-3" min-width="11%">SUCHE</v-btn>
                    <v-btn v-bind="size" color="secondary" id="createbutton" @click="createOffer();" class="rounded-button-right ma-3" min-width="11%">ANZEIGE ERSTELLEN</v-btn>
                </v-row>
                <v-divider></v-divider>
                <v-card-subtitle> Ihre Suchanfrage hat {{offers.length}} Anzeige(n) ergeben. </v-card-subtitle>
                <v-card-text class="text-center title" v-if="user && (offers.length == 0)">Es wurden keine Anzeigen in ihrere Nähe gefunden.</v-card-text>
                <v-container v-if="!user && (offers.length == 0) && searched">
                    <v-card-text class="text-center title">Es wurden keine Anzeigen in ihrere Nähe gefunden, bitte registrieren Sie sich jedoch, um auf zukünftige Anzeigen hingewiesen zu werden.</v-card-text>
                    <v-row class="justify-center py-0">
                        <v-btn color="primary" outlined @click="$router.push('/register')">registrieren</v-btn>
                        <v-btn color="primary" outlined @click="$router.push('/information')">mehr Erfahren</v-btn>
                    </v-row>
                </v-container>

                <v-container style="max-height: 50%" class="overflow-y-auto">
                    <v-list three-line tile outlined :color="colorEintrag">
                        <template v-for="(offer, index) in offers">
                            <v-row :key="index*10">
                                <v-col :key="index" class="pr-0">
                                    <v-list-item :key="index*11 + 1">
                                        <v-list-item-content>
                                            <v-list-item-title>{{offer.title}}</v-list-item-title>
                                            <v-list-item-subtitle>{{offer.description}}</v-list-item-subtitle>
                                            <v-list-item-subtitle>vom {{offer.startDate.toDate().toLocaleDateString()}} bis {{offer.endDate.toDate().toLocaleDateString()}} mit einer Mindestdauer: {{offer.minDuration}} Tagen</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                                <v-col :key="index * 10 + 2" class="col-3 col-xs-3 col-sm-1 col-md-3 pr-1 mr-2 my-5" align="end">
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-subtitle aligin="center">{{offer.helperCount}}/{{offer.maxHelpers}}</v-list-item-subtitle>
                                        <v-list-item-subtitle aligin="center">{{offer.address.city}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-btn @click="$router.push('offer/' + offer.id)" color="primary" class="rounded-button-left ma-0" x-small> Details </v-btn>
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
    LControl,
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
        user: false,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 7,
        center: [49.877629, 8.654673],
        center_layout: 'center',
        colorEintrag: '#fffff',
        detailbutton: '#fffff',
        item_color: 'primary',
        offers: [],
        search: "",
        searched: false,
        zipsearch: "",
        number_of_plz_nearby: 100,
        searchradius: 5, //war ""
        farm_plz_arr: [],
        offercount: 0,
        mobil: false,
        displayMap: false,
        offerData: null,
    }),
    metaInfo() {
        return {
            title: 'Anzeigen - ernteretter',
            meta: [{
                name: 'description',
                content: 'Alle Anzeigen von Landwirten, denen in deiner Nähe geholfen werden muss'
            }]
        }
    },
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LControl,
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
        details(data) {
            this.offerData = data
        },
        onResize() {
            
            if (window.innerWidth < 960) {
                this.mobil = true
                this.displayMap = false
            } else {
                this.mobil = false
                this.displayMap = false
            }
        },
        async atSearch() {
            this.$router.replace({
                path: 'offers',
                query: {
                    title: this.search,
                    radius: this.searchradius,
                    postcode: this.zipsearch,
                }
            })
            this.searchOffersNew()
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
                    this.searched = true
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
                    this.offers = this.offers.filter(offer => {
                        return offer.title
                            .toLowerCase()
                            .includes(this.search.toLowerCase());
                    });
                })
        },
    },
    mounted() {
        this.searched = false
        if (this.$route.query.postcode) {
            this.zipsearch = this.$route.query.postcode

            if (this.$route.query.title) {
                this.search = this.$route.query.title
            }

            if (this.$route.query.radius) {
                this.searchradius = this.$route.query.radius
            }

            this.zipsearch = this.$route.query.postcode
            this.searchOffersNew()
        } else {
            firebase.auth().onAuthStateChanged((user) => {
                this.user = user
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
}
</script>
