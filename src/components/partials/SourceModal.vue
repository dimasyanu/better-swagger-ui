<script setup lang="ts">
import { useGlobalStore } from '@/stores/global.store'
import { computed, ref } from 'vue'

const store = useGlobalStore()
const active = defineModel<boolean>()
const sources = ref(store.source.sources)
</script>

<template>
  <v-dialog v-model="active" max-width="480">
    <v-card title="Source">
      <v-divider></v-divider>

      <v-list select-strategy="leaf">
        <v-list-item>Add new source</v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey grey-darken-2" @click="active = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
