<template>
  <v-app id="app">
    <v-container fluid fill-height>
      <Builder />

      <!-- <v-layout align-center justify-center>
        <v-flex xs12 sm10 md8>
          <v-card class="elevation-12" :class="{unclickable: ajaxLoader}">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Select table to make a scenario:</v-toolbar-title>
              <v-spacer></v-spacer>
   
            </v-toolbar>

           

            <v-card-actions class="main-action-buttons">
              <v-layout text-xs-right>
                <v-flex>
                  <v-btn color="normal" large v-if="config.CANCEL_PATH" :href="config.CANCEL_PATH">
                    Cancel
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>

          </v-card>
        </v-flex>
      </v-layout> -->
    </v-container>

    <Notification />
    <AjaxLoader />
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

import Notification from './components/Notification';
import AjaxLoader from './components/AjaxLoader';
import Builder from './components/Builder';

import * as config from './config.js';

export default {
  name: 'app',
  components: {
    Notification,
    AjaxLoader,
    Builder
  },
  data() {
    return {
      config
    };
  },
  created() {
    // this.$store.dispatch('');
    // this.$store.dispatch('');
  },
  computed: {
    ...mapState(['ajaxLoader'])
  }
};
</script>

<style>
.unclickable {
  pointer-events: none;
}
.main-action-buttons {
  padding-bottom: 20px;
  padding-right: 10px;
}
</style>
