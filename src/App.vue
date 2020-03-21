<template>
  <v-app>

  <v-app-bar app>
    <a href="http://localhost:8081">
      <img src="https://trello-attachments.s3.amazonaws.com/5e753957c9f5682497c30889/5e7617328ea054402b9fbafe/6d952c2ff6cf5e390d0c0eb653cc1184/Ernteretter-Logo_03.png" alt="Logo" width="120" height="30">
    </a>
    
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-content>

  <v-footer app>
    <!-- -->
  </v-footer>
  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
