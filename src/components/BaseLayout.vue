<script setup lang="ts">
import { ref } from "vue";
import IconSwagger from "@/assets/icons/swagger.svg";
const drawer = ref(false);
const searchInputWidth = ref("50");
const searchAll = ref("");
</script>

<template>
  <v-app id="inspire">
    <v-navigation-drawer>
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar>
      <v-container class="mx-4" max-width="100%">
        <v-row no-gutters>
          <v-col
            id="app-title-container"
            class="d-flex align-center"
            cols="12"
            sm="3"
          >
            <v-app-bar-title>
              <v-img
                class="d-sm-inline-block w-100 mr-2"
                :src="IconSwagger"
                max-width="42px"
              ></v-img>
              Better Swagger UI
            </v-app-bar-title>
          </v-col>
          <v-col
            id="search-input-container"
            class="text-center"
            cols="12"
            sm="6"
          >
            <v-text-field
              id="search-input"
              :loading="false"
              class="d-sm-inline-block"
              :class="'w-' + searchInputWidth"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search"
              placeholder="Search"
              variant="outlined"
              hide-details
              single-line
              @update:focused="
                searchInputWidth = $event || searchAll != '' ? '100' : '50'
              "
              v-model="searchAll"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <!--  -->
    </v-main>
  </v-app>
</template>

<style lang="scss">
#search-input-container .v-input {
  transition: width 0.15s ease-out;
  -webkit-transition: width 0.15s ease-out;
  -moz-transition: width 0.15s ease-out;
}

.v-app-bar-title {
  .v-toolbar-title__placeholder {
    display: flex;
    align-items: center;
  }
}
</style>
