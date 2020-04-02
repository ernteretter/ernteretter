<template>
<div class="offer-details mx-auto">
    <v-snackbar v-model="showRegisterMessage" color="success" top>erfolgreich angemeldet</v-snackbar>
    <v-snackbar v-model="showDisregisterMessage" color="error" top>erfolgreich abgemeldet</v-snackbar>
    <v-alert prominent color="primary" type="info" v-if="showAlert">Wollen sie diese Anzeige wirklich löschen? <v-btn outlined @click="deleteOffer()">Ja</v-btn>
        <v-btn @click="showAlert = false;" outlined>Nein</v-btn>
    </v-alert>
    <div class="inner">
        <div class="details-header">
            <div class="title-section">
                <v-icon class="pa-0 ma-0" @click="$router.go(-1)">mdi-arrow-left</v-icon>
                <div class="page-heading">{{ offer.title }}</div>
                <div class="page-sub-heading">{{ agrarian.name }}</div>
            </div>
            <div class="action-section">
                <div class="accept-cancel">
                    <v-btn class="action-button rounded-button-left" id="btn-edit" v-if="isOwner" @click="gotoGroupchat()">
                        Gruppenchat
                    </v-btn>
                    <v-btn class="action-button rounded-button-left" id="btn-edit" v-if="isOwner" @click="showAlert = true">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn class="action-button rounded-button-left" id="btn-edit" v-if="isOwner" @click="gotoEditOffer()">
                        <v-icon>mdi-pencil-outline</v-icon>
                    </v-btn>
                    <v-btn class="action-button rounded-button-left" id="btn-accept" v-if="!isOwner" @click="gotoChat()">Chat</v-btn>
                    <v-btn class="action-button rounded-button-left" id="btn-cancel" v-if="isAccepted && !isOwner" @click="removeMe">Abmelden</v-btn>
                    <v-btn class="action-button rounded-button-left" id="btn-accept" v-if="!isAccepted && !isOwner" @click="addMe">Anmelden</v-btn>
                </div>
                <div class="status-chip" v-if="offer.maxHelpers">
                    <b>{{ offer.maxHelpers - helperCount }}</b>
                    Helfer fehlen noch
                </div>
            </div>
        </div>

        <section class="harvesttype" v-if="offer.harvestType">
            <div class="equipment-header section-header">
                <div class="section-headline">Ernte/Saat-Typ</div>
            </div>
            <div class="equipment-body section-body">
                {{
            offer.harvestType
          }}
            </div>
        </section>

        <section class="salary" v-if="offer.salary">
            <div class="equipment-header section-header">
                <div class="section-headline">Vergütung</div>
            </div>
            <div class="equipment-body section-body">
                {{
            offer.salary
          }} €
            </div>
        </section>

        <section class="equipment" v-if="offer.equipment">
            <div class="equipment-header section-header">
                <div class="section-headline">Benötigtes Equipment</div>
            </div>
            <div class="equipment-body section-body">
                {{
            Array.isArray(offer.equipment)
              ? offer.equipment.join(", ")
              : offer.equipment
          }}
            </div>
        </section>

        <section class="driverslicence" v-if="offer.driverslicence">
            <div class="equipment-header section-header">
                <div class="section-headline">Benötigter Führerschein</div>
            </div>
            <div class="equipment-body section-body">
                {{
            offer.driverslicence
          }}
            </div>
        </section>

        <section>
            <!-- 
                <div class="section-header">
                <div class="section-headline">Zeitraum</div>
                <p v-if="offer.minDuration">
                    <b>Hinweis:</b> Mindestdauer
                    <b>{{ offer.minDuration }} Tage</b>
                </p>
            </div>
            -->
            <div class="section-body">
                <p v-if="offer.startDate">
                    <v-icon>mdi-calendar</v-icon>{{ new Date(offer.startDate.seconds * 1000) | formatDate }}
                    <span v-if="offer.endDate">
                        bis
                        {{ new Date(offer.endDate.seconds * 1000) | formatDate }}
                    </span>
                </p>
            </div>
        </section>

        <section class="description">
            <div class="description-header section-header">
                <div class="section-headline">Beschreibung</div>
            </div>
            <div class="description-body section-body">
                <span v-html="offer.description"></span>
            </div>
        </section>
        <section>
            <div class="section-header">
                <div class="section-headline">Kontakt</div>
            </div>
            <div class="section-body">
                <div class="address" v-if="offer.address">
                    {{ agrarian.name }}
                    <br />
                    {{ offer.address.street + " " + offer.address.number }}
                    <br />
                    {{ offer.address.postCode + " " + offer.address.city }}
                </div>
                <div class="email">
                    <a :href="'mailto:' + agrarian.publicEmail">
                        {{ agrarian.publicEmail }}
                    </a>
                </div>
            </div>
        </section>
        <v-col class="my-5 map" style="height:30vh;">
            <l-map style="z-index:0;" :zoom="zoom" :center="offer.geoPointNew">
                <l-tile-layer :url="url"></l-tile-layer>
                <l-marker :lat-lng="markerLatLng"></l-marker>
            </l-map>
        </v-col>
    </div>
</div>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import {
    LMap,
    LTileLayer,
    LMarker
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
    name: "OfferDetails",
    data() {
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            markerLatLng: [47.313220, -1.319482],
            zoom: 14,
            showAlert: false,
            offer: false,
            agrarian: false,
            isAccepted: false,
            isOwner: false,
            uid: false,
            helperCount: 0,
            showRegisterMessage: false,
            showDisregisterMessage: false,
        }
    },
    components: {
        LMap,
        LTileLayer,
        LMarker
    },
    metaInfo() {
        return {
            title: this.offer.title,
            meta: [{
                    name: 'description',
                    content: this.offer.title
                },
                {
                    name: 'og:title',
                    content: 'Ernteretter'
                },
                {
                    name: 'og:description',
                    content: this.offer.title
                },
                {
                    name: 'og:image',
                    content: require('../assets/ernteretter.png')
                },
            ]
        }
    },
    async created() {
        let offerId = this.$route.params.offerId;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.uid = user.uid;
            } else {
                this.uid = false;
                this.isAccepted = false;
            }
        });
        firebase
            .firestore()
            .doc("offers/" + offerId)
            .get()
            .then(snapshot => {
                if (snapshot.exists) {
                    this.offer = {
                        ...snapshot.data(),
                        id: snapshot.id,
                        geoPointNew: [snapshot.data().geoPoint.latitude, snapshot.data().geoPoint.longitude],
                    };
                    this.markerLatLng = this.offer.geoPointNew
                    return firebase
                        .firestore()
                        .doc("agrarians/" + snapshot.data().agrarianId)
                        .get();
                } else {
                    alert("Anzeige nicht gefunden");
                    this.$router.push("/offers");
                    throw "offer not found";
                }
            })
            .then(snapshot => {
                if (snapshot.exists) {
                    this.agrarian = {
                        ...snapshot.data(),
                        id: snapshot.id
                    };
                    if (this.uid == this.agrarian.uid) {
                        console.log("changed Owner to true!");
                        this.isOwner = true;
                    }
                } else {
                    alert("Ein Fehler ist aufgetreten: Landwirt nicht gefunden");
                    this.$router.push("/offers");
                }
                if (this.uid) {
                    return firebase
                        .firestore()
                        .collection("acceptedOffers")
                        .where("helperId", "==", this.uid)
                        .where("offerId", "==", this.offer.id)
                        .get();
                } else {
                    throw "user not logged in";
                }
            })
            .then(snapshot => {
                if (!snapshot.empty) {
                    this.isAccepted = true;
                }
            })
        firebase
            .firestore()
            .collection("acceptedOffers")
            .where("offerId", "==", offerId)
            .get()
            .then(snapshot => {
                this.helperCount = snapshot.size;
            });
    },
    filters: {
        formatDate: d =>
            d
            .toISOString()
            .substr(0, 10)
            .split("-")
            .reverse()
            .join(".")
    },
    methods: {
        gotoChat() {
            this.$router.push("/chat/" + this.agrarian.id);
        },
        gotoGroupchat() {
            this.$router.push("/chat/" + this.offer.id);
        },
        gotoEditOffer() {
            this.$router.push("/editOffer/" + this.offer.id);
        },
        deleteOffer() {
            this.showAlert = false;
            firebase.firestore().collection("offers").doc(this.offer.id).delete();
            this.$router.push("/offers");
        },
        addMe() {
            if (!this.uid) {
                alert("Bitte melde Dich erst an");
                this.$router.push("/login?redirect=/offers/" + this.offer.id);
                return;
            }
            if (this.isAccepted) {
                return;
            }
            firebase
                .firestore()
                .collection("acceptedOffers")
                .add({
                    offerId: this.offer.id,
                    helperId: this.uid,
                    acceptDate: new Date()
                })
                .then(() => {
                    this.showRegisterMessage = true
                    this.showDisregisterMessage = false
                    this.isAccepted = true;
                    this.helperCount++;
                });
        },
        removeMe() {
            firebase
                .firestore()
                .collection("acceptedOffers")
                .where("helperId", "==", this.uid)
                .where("offerId", "==", this.offer.id)
                .get()
                .then(snapshot => {
                    if (!snapshot.empty) {
                        firebase
                            .firestore()
                            .doc("acceptedOffers/" + snapshot.docs[0].id)
                            .delete()
                            .then(() => {
                                this.showRegisterMessage = false
                                this.showDisregisterMessage = true
                                this.isAccepted = false;
                                this.helperCount--;
                            });
                    }
                });
        }
    }
};
</script>

<style lang="scss" scoped>
a {
    margin: 0;
}

@media only screen and (min-width: 1000px) {
    .inner {
        max-width: 800px;
        margin: 0 auto;
        box-shadow: 0 0 5px 3px #ccc;
        padding: 16px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
}

.map {
    width: 100vw;
}

section {
    margin-top: 16px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
}

.section-header {
    min-width: 300px;
}

.section-headline {
    font-size: 24px;
    font-weight: 300;
}

.page-heading {
    font-size: 32px;
    font-weight: 400;
}

.page-sub-heading {
    font-size: 16px;
    font-weight: 300;
    color: #444;
    margin-bottom: 16px;
}

.contact-box {
    display: flex;
    flex-direction: column;
}

.contact-card {
    padding: 8px;
}

.details-header {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    width: 100%;
    justify-content: space-between;
    border-bottom: 2px solid #ed9a00;
}

.action-section {
    margin: 16px 0;
    display: flex;
    align-items: center;
}

.action-button {
    margin: 0 8px 0 0;
}

.action-button#btn-accept {
    background-color: #ed9a00;
    color: white;
}

.action-button#btn-cancel {
    background-color: white;
    border: 1px solid #ed9a00;
}

.action-button#btn-edit {
    background-color: #4d4238;
    color: white;
}

.status-chip b {
    color: red;
}
</style>
