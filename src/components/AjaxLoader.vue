<template>
  <v-progress-circular v-if="ajaxLoader" class="ajax-loader" indeterminate color="primary"></v-progress-circular>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  name: 'AjaxLoader',
  computed: {
    ...mapState(['ajaxLoader'])
  },
  data() {
    return {
      numberOfAjaxCallsPending: 0
    };
  },
  methods: {
    setLoading(value) {
      this.$store.commit('setAjaxLoader', value);
    }
  },
  created() {
    // You can uncomment this to get the global ajax loader
    // Add a loader request interceptor
    // axios.interceptors.request.use(
    //   config => {
    //     this.numberOfAjaxCallsPending++;
    //     this.setLoading(true);
    //     return config;
    //   },
    //   error => {
    //     this.numberOfAjaxCallsPending++;
    //     this.setLoading(false);
    //     return Promise.reject(error);
    //   }
    // );
    // Add a loader response interceptor
    // axios.interceptors.response.use(
    //   response => {
    //     this.numberOfAjaxCallsPending--;
    //     if (this.numberOfAjaxCallsPending === 0) {
    //       this.setLoading(false);
    //     }
    //     return response;
    //   },
    //   error => {
    //     this.numberOfAjaxCallsPending--;
    //     if (this.numberOfAjaxCallsPending === 0) {
    //       this.setLoading(false);
    //     }
    //     return Promise.reject(error);
    //   }
    // );
  }
};
</script>

<style scoped lang="scss">
  .ajax-loader {
    position: fixed;
    top: 20px;
    right: 30px;
  }
</style>

