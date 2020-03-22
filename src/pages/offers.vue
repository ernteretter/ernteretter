<template>
  <div>
    <v-card id="inspire">
      <v-row>
        <v-col>
          <v-text-field outlined type="text" v-model="search" placeholder="Suche nach Titel" />
        </v-col>
        <v-col>
          <v-text-field
            outlined
            type="number"
            v-model="zipsearch"
            maxlength="5"
            minlength="4"
            minval
            placeholder="Suche nach PLZ"
          />
        </v-col>
        <v-col id="radiussilder">
          <v-slider
            v-model="searchradius"
            label="Radius (km)"
            :min_="1"
            :max="50"
            thumb-label="always"
            thumb-size="24"
            thumb-color="primary"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col></v-col>
        <v-col class="text-center" cols="12" sm="4">
          <v-btn big color="primary" id="searchbutton" @click="list_offers();">SEARCH</v-btn>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-card>
    <br />
    Ihre Suchanfrage hat {{offers.length}} Anzeige(n) ergeben.
    <v-card
      class="mx-auto list-item"
      max-width="auto"
      outlined
      v-for="offer in offers"
      :key="offer.id"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">{{offer.title}}</v-list-item-title>
          <v-list-item-subtitle>{{offer.description | snippet}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-avatar tile size="80" color="grey">
        </v-list-item-avatar>
      </v-list-item>

      <v-card-actions>
        <v-btn @click="details(offer.id)" color="primary">Zu den Details</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

export default {
  name: "OfferList",
  data: () => ({
    //filteredList:[],
    offers: [],
    search: "",
    zipsearch: "",
    number_of_plz_nearby: 300,
    searchradius: "",
    farm_plz_arr: [],
    offercount: 0
  }),

  methods: {
    details(id) {
      this.$router.push({ name: "offer-details", params: { offerId: id } });
    },
    //creates array of nearby farms
    async create_farm_plz_arr(x, y) {
      var radius_meter = this.searchradius * 1000;
      var theUrl =
        "https://public.opendatasoft.com/api/records/1.0/search//?dataset=postleitzahlen-deutschland&rows=" +
        this.number_of_plz_nearby +
        "&geofilter.distance=" +
        x +
        "%2C" +
        y +
        "%2C" +
        //radius kann gewaehlt werden vom user
        radius_meter;
      console.log(theUrl);
      const response = await fetch(theUrl);
      const myJson = await response.json(); //extract JSON from the http response
      //console.log(myJson.records);
      var records = myJson.records;
      //console.log(myJson);
      for (var i = 0; i < records.length; i++) {
        this.farm_plz_arr.push(records[i].fields.plz);
      }
      console.log("Farm_Array" + this.farm_plz_arr);
    },
    //gets geodata to postCode
    async getGeoData(worker_plz) {
      console.log("start");
      var url =
        "https://public.opendatasoft.com/api/records/1.0/search//?dataset=postleitzahlen-deutschland&q=" +
        worker_plz;
      const response = await fetch(url);
      console.log("fetched");
      const myJson = await response.json();
      //var records = myJson.records;
      console.log("Records" + myJson.records[0].fields.geo_point_2d);
      return myJson.records[0].fields.geo_point_2d;
    },
    async list_offers() {
      this.offers = [];
      this.farm_plz_arr = [];
      //????????
      if (this.zipsearch.length != 0) {
        console.log("Bin bei if");
        var g_Data = await this.getGeoData(this.zipsearch);

        //call createplzarr
        await this.create_farm_plz_arr(g_Data[0], g_Data[1]);
        let firestore = firebase.firestore();
        for (let i = 0; i <= (this.farm_plz_arr.length - 1) / 10; i++) {
          let plzArr = this.farm_plz_arr.slice(i * 10, i * 10 + 10);
          console.log(plzArr);
          firestore
            .collection("offers")
            //postcodes muessen in farm_plz_arr sein um angezeigt zu werden
            //substring operator bei where(this.search ist substring of title)
            .where("address.postCode", "in", plzArr) //.where("title", "==", this.search)
            .get()
            .then(snapshot => {
              if (!snapshot.empty) {
                this.offers = this.offers.concat(
                  snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                  }))
                );
                this.offers = this.offers.filter(offer => {
                  return offer.title
                    .toLowerCase()
                    .includes(this.search.toLowerCase());
                });
              }
            });
        }
      } else if (this.zipsearch.length == 0) {
        console.log("Bin bei else");
        let firestore = firebase.firestore();
        firestore
          .collection("offers")
          //.where("title", "==", this.search)
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              this.offers = this.offers.concat(
                snapshot.docs.map(doc => ({
                  ...doc.data(),
                  id: doc.id
                }))
              );
              this.offers = this.offers.filter(offer => {
                return offer.title
                  .toLowerCase()
                  .includes(this.search.toLowerCase());
              });
            }
          });
      } else {
        this.offers = [];
      }
    }
  }
};
</script>

<style scoped>
.list-item {
  margin: 15px;
}
.search-wrapper {
  margin-bottom: 20px;
  border-color: lightgrey;
  border-width: 1px;
  border-style: solid;
}
#radiussilder {
  margin-top: 15px;
}
#searchbutton {
  margin-top: -25px;
}
</style>