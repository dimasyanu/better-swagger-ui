<script setup lang="ts">
import { ref } from 'vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import TopBar from '@/components/TopBar.vue';
const drawer = ref(false)

</script>

<template>
  <v-app id="inspire">
    <navigation-drawer></navigation-drawer>

    <top-bar></top-bar>

    <v-main>
      <!--  -->
    </v-main>
  </v-app>
</template>

<style lang="scss">
.v-app-bar-title {
  .v-toolbar-title__placeholder {
    display: flex;
    align-items: center;
  }
}
</style>
