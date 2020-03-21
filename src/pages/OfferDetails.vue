<template>
  <div class="offer-details" v-if="offer && agrarian">
    <div class="inner">
      <h1>{{ offer.title }}</h1>
      <div class="status-chip">
        Status:
        {{
          offer.maxHelpers -
            offer.helperCount +
            "/" +
            offer.maxHelpers +
            " Helfern fehlen noch"
        }}
      </div>

      <div class="description">
        <div class="description-header section-header">
          Beschreibung
        </div>
        <div class="description-body section-body">
          {{ offer.description }}
        </div>
      </div>

      <div class="equipment">
          <div class="equipment-header section-header">
              Benötigtes Equipment
          </div>
          <div class="equipment-body section-body">
              {{offer.equipment.join(', ')}}
          </div>
      </div>

      <div class="section-header">Starttermine</div>
      <p><b>Hinweis:</b> Die Mindestdauer der Arbeit beträgt <b>{{offer.minDuration}} Tage</b></p>
      <v-list>
        <v-card
          v-for="startDate in offer.startDates"
          :key="startDate.seconds"
          class="date-list-item"
        >
          <v-list-item>
            <div class="list-date">{{ new Date(startDate.seconds) }}</div>
          </v-list-item>
        </v-card>
      </v-list>
      <h2>Kontakt</h2>
      <div class="contact-box">
        <div class="address">
          {{ agrarian.name }}
          <br />
          {{ agrarian.address.street + " " + agrarian.address.number }}
          <br />
          {{ agrarian.address.postcode + " " + agrarian.address.city }}
        </div>
        <div class="email">
          <a :href="'mailto:' + agrarian.publicEmail">{{
            agrarian.publicEmail
          }}</a>
        </div>
      </div>
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
          console.log(snapshot.data().startDates);
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
  },
  filters: {}
};
</script>
<style lang="scss" scoped>
h1,
h2 {
  font-weight: 300;
}
.contact-box {
  display: flex;
  flex-direction: column;
}
.contact-card {
  padding: 8px;
}
.status-chip {
  padding: 8px;
  border: 1px solid red;
  border-radius: 5px;
  display: inline-block;
}
.date-list-item {
  margin-bottom: 8px;
}
.section-header {
    font-size: 24px;
    font-weight: 300;
    margin: 8px 0;
}
</style>
