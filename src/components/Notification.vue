<template>
  <v-snackbar :timeout="notification.timeout" :color="notification.color" :multi-line="notification.mode === 'multi-line'" :top="notification.y === 'top'" :bottom="notification.y === 'bottom'" :right="notification.x === 'right'" :left="notification.x === 'left'" :vertical="notification.mode === 'vertical'" v-model="notification.show">
    {{ notification.text }}
    <v-btn flat :color="notification.closeColor" @click.native="hideNotification">{{ notification.closeText }}</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Notification',
  computed: {
    ...mapState(['notification'])
  },
  methods: {
    hideNotification() {
      this.$store.commit('notification', { show: false });
    }
  }
};
</script>
