<template>
<div>
    <div style="z-index: 2; width: 90vw; height: 100vh; position: relative;" v-if="displaySearch">
        <v-icon class="jusitfy-center pa-0 ma-0" @click="displaySearch = false">mdi-close</v-icon>
        <v-text-field autofocus clearable label="PLZ" v-model="zipsearch" class="mx-2 mt-2" single-line solo></v-text-field>
        <v-slider v-if="!mobil" class="px-10 mr-5 ml-3 ma-md-0 mr-md-0 xs-ma-0 xs-pa-0" v-model="searchradius" label="Radius (km)" :min_="1" :max="100" thumb-label="always" thumb-size="24" thumb-color="primary"></v-slider>
        <v-select clearable single-line solo v-model="harvestType" :items="items" class="mx-2" label="Was soll geerntet/gesäht werden?"></v-select>
        <v-row justify="center">
            <v-col>
                <v-menu ref="menuStartDate" v-model="menuStartDate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on }">
                        <v-text-field clearable single-line solo v-model="startDateText" label="Anfangsdatum" hint="von" prepend-inner-icon="mdi-calendar" readonly v-on="on" />
                    </template>
                    <v-date-picker v-model="startDate" :min="dateNow" :max="endDate" locale="de-DE">
                        <v-spacer></v-spacer>
                        <v-btn text outlined color="primary" @click="menuStartDate = false">Abbrechen</v-btn>
                        <v-btn text outlined color="primary" @click="$refs.menuStartDate.save(startDate)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
                <v-menu ref="menuEndDate" v-model="menuEndDate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on }">
                        <v-text-field clearable single-line solo v-model="endDateText" label="Enddatum" prepend-inner-icon="mdi-calendar" readonly v-on="on" />
                    </template>
                    <v-date-picker v-model="endDate" :min="(startDate && (startDate > dateNow)) ? startDate : dateNow" locale="de-DE">
                        <v-spacer></v-spacer>
                        <v-btn text outlined color="primary" @click="menuEndDate = false">Abbrechen</v-btn>
                        <v-btn text outlined color="primary" @click="$refs.menuEndDate.save(endDate)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
            </v-col>
        </v-row>
        <v-container class="justify-center">
            <v-btn outlined color="primary" class="ma-auto" @click="searchradius = 5; harvestType = ''; harvestTypeSpecial = ''; zipsearch = ''; endDate = '', menuEndDate = false; endDateText = false; startDate = ''; menuStartDate = false; startDateText = false;">alles zurücksetzen</v-btn>
            <v-btn v-bind="size" style="margin: 0.5vw 1vw 0vw 1vw" color="primary" id="searchbutton" @click="getOffersByFilter(); displaySearch = false" class="rounded-button-left" min-width="11%">SUCHE</v-btn>
            <v-btn v-bind="size" color="secondary" id="createbutton" @click="$router.push('/createOffer');" class="rounded-button-right ma-3 mr-0" min-width="11%">ANZEIGE ERSTELLEN</v-btn>
        </v-container>
    </div>

    <div v-resize="onResize" v-if="!displaySearch">

        <v-row>
            <v-col v-if="!mobil || displayMap">
                <v-card style="height: 85vh">
                    <l-map style="z-index:0;" :zoom="zoom" :center="center" ref="map">
                        <l-tile-layer :url="url"></l-tile-layer>
                        <l-control position="topright">
                            <v-btn color="primary" @click="displayMap = !displayMap" v-show="displayMap">
                                <v-icon>mdi-arrow-right</v-icon>
                            </v-btn>
                        </l-control>
                        <l-circle :lat-lng="radiusMarker" :radius="searchradius * 1000" color="#4d4238" fillColor="#ed9a00" v-if="searched" />
                        <l-marker v-for="(offer, index) in offers" :key="index" :lat-lng=offer.geoPointNew>
                            <l-popup>
                                <v-row :key="index*10">
                                    <v-col :key="index" cols="7" class="px-0 mx-0">
                                        <v-list-item :key="index*11 + 1">
                                            <v-list-item-content>
                                                <v-list-item-title>{{offer.title}}</v-list-item-title>
                                                <v-list-item-subtitle v-html="offer.description"></v-list-item-subtitle>
                                                <v-list-item-subtitle>vom {{offer.startDate.toDate().toLocaleDateString()}} bis {{offer.endDate.toDate().toLocaleDateString()}}</v-list-item-subtitle>
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
                    <v-container class="pt-0 mt-0">
                        <v-row>
                            <v-col class="pb-0" @keyup.enter="atSearch()">
                                <v-row>
                                    <v-card-title class="pa-0 pl-3 pa-md-auto">Suche nach Anzeigen</v-card-title>
                                    <v-spacer></v-spacer>

                                </v-row>
                                <v-row class="justify-center">

                                    <v-text-field hide-details class="mb-md-1 mx-3 pl-3" single-line solo type="text" v-model="zipsearch" maxlength="5" minlength="4" minval placeholder="PLZ" @focus="decideMobilSearch()"></v-text-field>
                                    <v-btn class="rounded-button-right ma-3 ma-md-0 my-md-2" v-bind="size" color="primary" id="searchbutton" v-if="mobil" min-width="11%" @click="activeMap()">
                                        <v-icon class="ma-0 pa-0">mdi-map</v-icon>
                                        Karte
                                    </v-btn>
                                </v-row>
                                <v-container v-if="!mobil">
                                    <v-slider v-if="!mobil" class="px-10 mr-5 ml-3 ma-md-0 mr-md-0 xs-ma-0 xs-pa-0" v-model="searchradius" label="Radius (km)" :min_="1" :max="100" thumb-label="always" thumb-size="24" thumb-color="primary"></v-slider>
                                    <v-expand-transition>
                                        <v-row class="col-12" v-show="collapse">
                                            <v-menu ref="menuStartDate" v-model="menuStartDate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="150px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field clearable single-line solo v-model="startDateText" label="Anfangsdatum" hint="von" prepend-inner-icon="mdi-calendar" readonly v-on="on" class="col-5"  />
                                                </template>
                                                <v-date-picker v-model="startDate" :min="dateNow" :max="endDate" locale="de-DE">
                                                    <v-spacer></v-spacer>
                                                    <v-btn text outlined color="primary" @click="menuStartDate = false; startDateText = ''">Abbrechen</v-btn>
                                                    <v-btn text outlined color="primary" @click="$refs.menuStartDate.save(startDate)">OK</v-btn>
                                                </v-date-picker>
                                            </v-menu>
                                            <v-col class="px-auto mx-auto col-2 ">
                                                <p style="text-align: center">bis</p>
                                            </v-col>
                                            <v-menu ref="menuEndDate" v-model="menuEndDate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="150px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field clearable single-line solo v-model="endDateText" label="Enddatum" prepend-inner-icon="mdi-calendar" readonly v-on="on" class="col-5" />
                                                </template>
                                                <v-date-picker v-model="endDate" :min="(startDate && (startDate > dateNow)) ? startDate : dateNow" locale="de-DE">
                                                    <v-spacer></v-spacer>
                                                    <v-btn text outlined color="primary" @click="menuEndDate = false; endDateText = '';">Abbrechen</v-btn>
                                                    <v-btn text outlined color="primary" @click="$refs.menuEndDate.save(endDate)">OK</v-btn>
                                                </v-date-picker>
                                            </v-menu>
                                            <v-row>
                                                <v-select clearable class="px-3" hide-details single-line solo v-model="harvestType" :items="items" label="Was soll geerntet/gesäht werden?"></v-select>
                                                <v-spacer></v-spacer>
                                                <v-btn outlined color="primary" class="ma-auto" @click="searchradius = 5; harvestType = ''; harvestTypeSpecial = ''; zipsearch = ''; endDate = '', menuEndDate = false; endDateText = false; startDate = ''; menuStartDate = false; startDateText = false;">alles zurücksetzen</v-btn>
                                            </v-row>
                                        </v-row>
                                    </v-expand-transition>
                                    <v-row class="justify-center" @click="collapse = !collapse">
                                        {{!collapse ? 'mehr' : 'weniger'}}
                                        <v-icon color="primary" v-show="!collapse">mdi-chevron-down</v-icon>
                                        <v-icon color="primary" v-show="collapse">mdi-chevron-up</v-icon>
                                    </v-row>
                                </v-container>
                                <v-row class="justify-center">
                                    <v-btn v-if="!mobil" @click="$router.push('createOffer')" v-bind="size" color="secondary" id="createbutton" class="rounded-button-right">
                                        Anzeige erstellen
                                    </v-btn>
                                    <v-btn v-if="!mobil" class="rounded-button-right" v-bind="size" color="primary" id="searchbutton" min-width="11%" @click="  q()">
                                        Suche
                                    </v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>

                        </v-row>
                    </v-container>
                    <v-divider id="Anzeigen"></v-divider>
                    <v-card-subtitle v-if="searched"> Ihre Suchanfrage hat {{offers.length}} Anzeige(n) ergeben. </v-card-subtitle>
                    <v-card-text class="pt-md-10 display-1 pb-0 font-weight-black" v-if="!searched">Die letzten {{offers.length}} Einträge.</v-card-text>
                    <v-card-text class="text-center title" v-if="mobil && (offers.length == 0) && !searched">Bitte spezifizieren Sie zunächst ihre Suche</v-card-text>
                    <v-card-text class="text-center title" v-if="user && (offers.length == 0) && searched">Es wurden keine Anzeigen in ihrere Nähe gefunden.</v-card-text>
                    <v-container v-if="!user && (offers.length == 0) && searched">
                        <v-card-text class="text-center title">Es wurden keine Anzeigen in ihrere Nähe gefunden, bitte registrieren Sie sich trotzdem, um auf zukünftige Anzeigen hingewiesen zu werden.</v-card-text>
                        <v-row class="justify-center py-0">
                            <v-btn color="primary" outlined @click="$router.push('/register')">registrieren</v-btn>
                            <v-btn color="primary" outlined @click="$router.push('/information')">mehr Erfahren</v-btn>
                        </v-row>
                    </v-container>

                    <v-container style="max-height: 50%" class="overflow-y-auto">
                        <v-list three-line tile outlined :color="colorEintrag">
                            <template v-for="(offer, index) in offers">
                                <v-row :key="index*10" @click="$router.push('offer/' + offer.id)" class="offer">
                                    <v-col :key="index" class="pr-0 pa-0 col-8">
                                        <v-list-item :key="index*11 + 1" class="pr-0">
                                            <v-list-item-content>
                                                <v-list-item-title class="font-weight-bold">{{offer.title}}</v-list-item-title>
                                                <v-list-item-subtitle v-if="offer.harvestType != 'Sonstiges'"> {{offer.harvestType}}</v-list-item-subtitle>
                                                <v-list-item-subtitle v-if="offer.harvestType == 'Sonstiges'"> {{offer.harvestTypeSpecial}} </v-list-item-subtitle>
                                                <v-list-item-subtitle>vom {{offer.startDate.toDate().toLocaleDateString()}} bis {{offer.endDate.toDate().toLocaleDateString()}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-col>
                                    <v-col :key="index * 10 + 2" class="col-xs-3 col-sm-1 col-md-4" align="end">
                                        <v-list-item-content class="pa-0">
                                            <v-list-item-subtitle class="font-weight-bold" aligin="center">{{offer.helperCount}}/{{offer.maxHelpers}}</v-list-item-subtitle>
                                            <v-list-item-subtitle class="font-weight-bold" aligin="center">{{offer.address.city}}</v-list-item-subtitle>
                                        </v-list-item-content>
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
    LCircle,
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
        harvestType: "",
        dateNow: new Date().toISOString().substr(0, 10),
        startDate: null,
        endDate: null,
        startDateText: "",
        endDateText: "",
        menuStartDate: false,
        menuEndDate: false,
        displaySearch: false,
        user: false,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 7,
        radiusMarker: [49.877629, 8.654673],
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
        map: null,
        items: ['Sonstiges', 'Apfel', 'Aprikose', 'Aubergine', 'Birne', 'Blaubeeren', 'Blumenkohl', 'Bohnen', 'Brokkoli', 'Butterrüben', 'Erbsen', 'Erdbeeren', 'Fenchel', 'Grünkohl', 'Gruke', 'Himbeeren', 'Holdunderbeeren', 'Johannisbeeren', 'Kartoffeln', 'Karotten', 'Kirschen' , 'Kohlrabi', 'Kürbis', 'Lauch', 'Mais', 'Mangold', 'Mirabellen', 'Paprika', 'Pastinaken', 'Pflaumen', 'Radischen', 'Rhabarber', 'Rosenkohl', 'Schwarzwurzeln', 'Spargel', 'Spinat', 'Spitzkohl', 'Stachelbeeren', 'Staudensellerie', 'Steckrüben', 'Tomaten', 'Topinambur', 'Weintrauben', 'Weißkohl', 'Wirsingkohl', 'Zucchini', 'Zuckerschoten', 'Zwetschgen', 'Zwiebeln'],
        collapse: false,
        harvestTypeSpecial: "",
    }),

    metaInfo() {
        return {
            title: 'Anzeigen - ernteretter',
            meta: [{
                    name: 'og:title',
                    content: 'Ernteretter'
                },
                {
                    name: 'og:description',
                    content: 'Alle Anzeigen von Landwirten, denen in deiner Nähe geholfen werden muss'
                },
                {
                    name: 'og:image',
                    content: require('../assets/ernteretter.png')
                },
                {
                    name: 'description',
                    content: 'Alle Anzeigen von Landwirten, denen in deiner Nähe geholfen werden muss'
                }
            ]
        }
    },
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LControl,
        LCircle,
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
    watch: {
        startDate(val) {
            this.startDateText = this.formatDate(val);
            if (this.endDate && (val > this.endDate)) {
                this.endDate = val;
            }
        },
        endDate(val) {
            this.endDateText = this.formatDate(val);
        }
    },
    methods: {
        decideMobilSearch() {
            if (this.mobil) {
                this.displaySearch = true
            }
        },
        activeMap() {
            this.displayMap = !this.displayMap

            setTimeout(() => {

            }, 1000);

            this.$vuetify.goTo(0)
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
                    harvestType: this.harvestType,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    radius: this.searchradius,
                    postcode: this.zipsearch,
                }
            })
            if (this.zipsearch) {
                this.searchOffersPostcode()
            } else {
                this.searchOffersOnlyTitle()
            }
            if (this.mobil) {
                this.$vuetify.goTo('#Anzeigen')
            }
            this.searched = true

        },
        formatDate(date) {
            if (!date) {
                return null;
            }
            const [year, month, day] = date.split('-');
            return `${day}.${month}.${year}`;
        },
        async getOffersByFilter() {
            var query = firebase.firestore().collection('offers')
            if (this.zipsearch) {
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
                this.radiusMarker = [lat, lon]
                var newZoom = 15 - Math.round(Math.log(this.searchradius) / Math.log(2))
                if (this.mobil) {
                    this.center = this.radiusMarker
                } else {
                    this.map.flyTo(this.radiusMarker, newZoom)
                }
                query.where('geoPoint', '<=', upperPoint).where('geoPoint', '>=', lowerPoint)
                    .get().then((snapshot) => {
                        this.offers = []
                        this.searched = true
                        snapshot.forEach((doc) => {
                            var data = doc.data()
                            if (upperPoint.longitude > data.geoPoint.longitude && data.geoPoint.longitude > lowerPoint.longitude) {
                                this.offers.push({
                                    ...doc.data(),
                                    id: doc.id,
                                    geoPointNew: [doc.data().geoPoint.latitude, doc.data().geoPoint.longitude],
                                })
                            }
                        })
                        this.offers = this.offers.filter(offer => {
                            return offer.harvestType
                                .toLowerCase()
                                .includes(this.harvestType.toLowerCase());
                        });
                        if (this.startDate) {
                            var startDateTimestamp = new Date(this.startDate)
                            this.offers = this.offers.filter(offer => {
                                return offer.startDate.toDate().getTime() >= startDateTimestamp
                            });
                        }
                        if (this.endDate) {
                            var endDateTimestamp = new Date(this.endDate)
                            this.offers = this.offers.filter(offer => {
                                return offer.endDate.toDate().getTime() <= endDateTimestamp
                            });
                        }

                    })
            } else if (this.startDate) {
                query.where('startDate', '>=', new Date(this.startDate)).get().then((snapshot) => {
                    this.offers = []
                    this.searched = true
                    snapshot.forEach((doc) => {

                        this.offers.push({
                            ...doc.data(),
                            id: doc.id,
                            geoPointNew: [doc.data().geoPoint.latitude, doc.data().geoPoint.longitude],
                        })

                    })
                    if (this.endDate) {
                        var endDateTimestamp = new Date(this.endDate)
                        this.offers = this.offers.filter(offer => {
                            return offer.endDate.toDate().getTime() <= endDateTimestamp
                        });
                    }
                    this.offers = this.offers.filter(offer => {
                        return offer.harvestType
                            .toLowerCase()
                            .includes(this.harvestType.toLowerCase());
                    });

                })
            } else if (this.endDate) {
                query.where('endDate', '<=', new Date(this.endDate)).get().then((snapshot) => {
                    this.offers = []
                    this.searched = true
                    snapshot.forEach((doc) => {

                        this.offers.push({
                            ...doc.data(),
                            id: doc.id,
                            geoPointNew: [doc.data().geoPoint.latitude, doc.data().geoPoint.longitude],
                        })

                    })
                    this.offers = this.offers.filter(offer => {
                        return offer.harvestType
                            .toLowerCase()
                            .includes(this.harvestType.toLowerCase());
                    });

                })
            } else if (this.harvestType) {
                query.where('harvestType', '==', this.harvestType).get().then((snapshot) => {
                    this.offers = []
                    this.searched = true
                    snapshot.forEach((doc) => {

                        this.offers.push({
                            ...doc.data(),
                            id: doc.id,
                            geoPointNew: [doc.data().geoPoint.latitude, doc.data().geoPoint.longitude],
                        })

                    })
                    this.offers = this.offers.filter(offer => {
                        return offer.harvestTypeSpecial == this.harvestTypeSpecial
                    });
                })
            } else {
                firebase.firestore().collection('offers').limit(10).get().then((docs) => {
                    docs.forEach((doc) => {
                        this.offers.push({
                            ...doc.data(),
                            id: doc.id,
                            geoPointNew: [doc.data().geoPoint.latitude, doc.data().geoPoint.longitude]
                        })
                    })
                })
            }
        },
        async searchOffersOnlyTitle() {
            firebase.firestore().collection('offers').where('title', '>=', this.search).limit(50).get().then((snapshot) => {
                this.offers = []
                this.searched = true
                snapshot.forEach((doc) => {
                    this.offers.push({
                        ...doc.data(),
                        id: doc.id,
                        geoPointNew: [doc.data().geoPoint.latitude, doc.data().geoPoint.longitude]
                    })

                })
            })
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.mobil)
                this.map = this.$refs.map.mapObject // work as expected
        })
        this.searched = false
        var URLquery = this.$route.query
        if (URLquery.postcode) {
            this.zipsearch = URLquery.postcode

            if (URLquery.title) {
                this.search = URLquery.title
            }
            if (URLquery.harvestType) {
                this.harvestType = URLquery.harvestType
            }
            if (URLquery.startDate) {
                this.startDate = URLquery.startDate
            }
            if (URLquery.endDate) {
                this.endDate = URLquery.endDate
            }
            if (URLquery.radius) {
                this.searchradius = URLquery.radius
                this.zoom = 15 - Math.round(Math.log(this.searchradius) / Math.log(2))
            }

            this.zipsearch = URLquery.postcode
            this.searchOffersPostcode()
        } else {
            /*
            code dafür dass postleitzahl aus dem user document raus geladen wird
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.user = user
                    firebase.firestore().collection('helpers').doc(user.uid).get().then((doc) => {
                        if (doc.exists) {
                            if (doc.data().searchRange > 0) {
                                this.searchradius = doc.data().searchRange
                            }
                            if (doc.data().place.postcode) {
                                this.zipsearch = doc.data().place.postcode
                                this.searchOffersPostcode()
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
                                    this.searchOffersPostcode()
                                }
                            })
                        }
                    })
                }
            })
            */
            firebase.firestore().collection('offers').limit(10).get().then((docs) => {
                docs.forEach((doc) => {
                    this.offers.push({
                        ...doc.data(),
                        id: doc.id,
                        geoPointNew: [doc.data().geoPoint.latitude, doc.data().geoPoint.longitude]
                    })
                })
            })

        }
    }
}
</script>

<style>
.map {
    width: 100vw;
}

.offer {
    cursor: pointer;
}
</style>
