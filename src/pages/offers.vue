<template>
  <div>
    Es sind {{offercount}} Anzeige(n) online.
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

        <v-list-item-avatar size="100" color="grey">
          <img src="profilbildBauer.png" alt="Profilbild Bauer" size="100" />
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
    offercount: 0
  }),

  methods: {
    details(id) {
      this.$router.push({ name: "offer-details", params: { offerId: id } });
    }
  },
  created() {
    let firestore = firebase.firestore();
    firestore
      .collection("offers")
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          this.offers = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          console.log(this.offers);
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