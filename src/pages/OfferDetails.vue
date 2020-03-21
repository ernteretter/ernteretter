<template>
  <div class="offer-details" v-if="offer && agrarian">
    <div class="inner">
      <h1>{{ offer.title }}</h1>
      <h2>{{ agrarian.name }}</h2>
      <p>{{ offer }}</p>
    </div>
  </div>
</template>
<script>
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

export default {
  name: "OfferDetails",
  data: () => ({
    offer: false,
    agrarian: false
  }),
  created() {
    let firestore = firebase.firestore();
    let offerId = this.$route.params.offerId;

    firestore
      .doc("offers/" + offerId)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          this.offer = { ...snapshot.data(), id: snapshot.id };
          console.log(snapshot.data());
          return firestore.doc("agrarians/" + snapshot.data().agrarianId).get();
        } else {
          throw snapshot;
        }
      })
      .then(snapshot => {
        if (snapshot.exists) {
          this.agrarian = { ...snapshot.data(), id: snapshot.id };
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style scoped lang="scss">
.inner {
    width: 95vw;
    max-width: 1200px;
}
</style>