<template>
  <div class="offer-list">
    <h1>Anzeigen</h1>

    <router-link
      v-for="offer in offers"
      :key="offer.id"
      :to="{ name: 'offer-details', params: { offerId: offer.id } }"
      ><v-card>{{ offer.title }}</v-card>
      </router-link>
  </div>
</template>
<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

export default {
  name: "OfferList",
  data: () => ({
    offers: false
  }),
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
