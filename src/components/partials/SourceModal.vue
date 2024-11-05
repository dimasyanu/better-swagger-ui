<script setup lang="ts">
import { ApiSourceItem } from '@/models/api-source.model'
import { useApiSourceStore } from '@/stores/api-source.store'
import { useGlobalStore } from '@/stores/global.store'
import { v4 as uuid } from 'uuid'

const store = useGlobalStore()
const sourceStore = useApiSourceStore()

sourceStore.$patch((state) => {
  state.sources.push(
    new ApiSourceItem(
      uuid(),
      'xapi.instamobile.be',
      'https://xapi.instamobile.be/swagger/v1/swagger.json'
    )
  )
  state.sources.push(
    new ApiSourceItem(uuid(), 'xmobile.yanoo.mi', 'http://xmobile.yanoo.mi/swagger/v1/swagger.json')
  )
})
</script>

<template>
  <v-dialog v-model="sourceStore.active" max-width="480">
    <v-card title="Sources">
      <v-divider></v-divider>

      <v-list :activatable="true">
        <v-list-item
          v-for="(source, i) in sourceStore.sources"
          :key="i"
          append-icon="mdi-close"
          :active="source.id === sourceStore.currentId"
          @click="sourceStore.changeCurrentSource(source.id)"
        >
          <v-list-item-title>{{ source.name }}</v-list-item-title>
          <template v-slot:append>
            <v-list-item-action end @click="sourceStore.removeSource(source.id)">
              <v-icon>mdi-close</v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>

      <div class="d-flex justify-center pb-4">
        <v-btn variant="outlined" size="small">Add new source</v-btn>
      </div>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="sourceStore.closeSourceModal()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
