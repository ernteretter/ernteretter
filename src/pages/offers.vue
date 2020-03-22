<template>
  <div>
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
          <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar tile size="80">
          <img src="profilBildbauer.png" />
        </v-list-item-avatar>
      </v-list-item>

      <v-card-actions>
        <v-btn @click="details(offer.id)">Zu den Details</v-btn>
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
    offers: false,
    farm_plz_arr: []
  }),

  methods: {
    details(id) {
      this.$router.push({ name: "offer-details", params: { offerId: id } });
    },
    async create_farm_plz_arr(x, y) {
      var theUrl =
        "https://public.opendatasoft.com/api/records/1.0/search//?dataset=postleitzahlen-deutschland&geofilter.distance=" +
        x +
        "%2C" +
        y +
        "%2C" +
        "10000";
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

    async getGeoData(worker_plz){
      console.log("start");
      var url = "https://public.opendatasoft.com/api/records/1.0/search//?dataset=postleitzahlen-deutschland&q=" + worker_plz;
      const response = await fetch(url);
      console.log("fetched");
      const myJson = await response.json();
      //var records = myJson.records;
      console.log("Records" + myJson.records[0].fields.geo_point_2d);
      return myJson.records[0].fields.geo_point_2d;
    }
  },
  async created() {
    //get plz
    //translate plz to geo data
    var g_Data = await this.getGeoData(/*localStorage.plz*/64287);
    
    //call createplzarr
    console.log("x" + g_Data[0]);
    console.log("y" + g_Data[1]);
    await this.create_farm_plz_arr(g_Data[0], g_Data[1]);
    console.log("this farms array" + this.farm_plz_arr);
    let firestore = firebase.firestore();
    firestore
      .collection("offers")
      //postcodes muessen in farm_plz_arr sein um angezeigt zu werden
      .where("postCode", "in" ,this.farm_plz_arr)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          this.offers = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          console.log("Offers" + this.offers);
        }
      });
  }
};
</script>

<style scoped>
.list-item {
  margin: 15px;
}
</style>