<script setup lang="ts">
import { ApiSourceItem } from '@/models/api-source.model'
import { useApiSourceStore } from '@/stores/api-source.store'
import { useGlobalStore } from '@/stores/global.store'
import { v4 as uuid } from 'uuid'
import { computed, ref } from 'vue'

enum SourceMode {
  Select,
  Create,
  Edit,
}

const store = useGlobalStore()
const sourceStore = useApiSourceStore()
const sourceMode = ref(SourceMode.Select)

const isEdit = computed(() => sourceMode.value === SourceMode.Edit)
const isCreate = computed(() => sourceMode.value === SourceMode.Create)

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
    <v-card>
      <v-card-title class="px-5">
        <v-icon v-if="isCreate || isEdit" @click="sourceMode = SourceMode.Select" title="Back"
          >mdi-arrow-left</v-icon
        >
        <span class="valign-middle ml-4">
          {{
            sourceMode === SourceMode.Create
              ? 'Create Source'
              : sourceMode === SourceMode.Edit
              ? 'Edit Source'
              : 'Sources'
          }}
        </span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text v-if="isCreate"> </v-card-text>

      <v-card-text v-else>
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
          <v-btn variant="outlined" size="small" @click="sourceMode = SourceMode.Create"
            >Add new source</v-btn
          >
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="sourceStore.closeSourceModal()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
