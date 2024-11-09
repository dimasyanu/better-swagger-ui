<script setup lang="ts">
import { isNullOrEmpty } from '@/helpers/helper'
import { ApiSourceItem } from '@/models/api-source.model'
import type { SwaggerRoot } from '@/models/swagger-root.model'
import api from '@/plugins/api'
import { useApiSourceStore } from '@/stores/api-source.store'
import { useGlobalStore } from '@/stores/global.store'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { v4 as uuid } from 'uuid'
import { computed, onMounted, reactive, ref } from 'vue'

class SourceForm {
  public id: string = ''
  public name: string = ''
  public jsonUrl: string = ''
}

const form = new SourceForm()
const formState = reactive({ ...form })
const formRules = {
  name: { required },
  jsonUrl: { required },
}

const v$ = useVuelidate(formRules, formState)

enum SourceMode {
  Select,
  Create,
  Edit,
}

const globalStore = useGlobalStore()
const sourceStore = useApiSourceStore()
const sourceMode = ref(SourceMode.Select)

const clearForm = function () {
  formState.id = ''
  formState.name = ''
  formState.jsonUrl = ''
}

const saveSource = async function () {
  v$.value.$reset()
  var valid = await v$.value.$validate()
  if (!valid) return

  if (isNullOrEmpty(formState.id))
    sourceStore.addSource(new ApiSourceItem(uuid(), formState.name, formState.jsonUrl))
  else {
    sourceStore.updateSource(new ApiSourceItem(formState.id, formState.name, formState.jsonUrl))
    if (formState.id === sourceStore.currentId) {
    }
  }

  clearForm()
  v$.value.$reset()
  sourceMode.value = SourceMode.Select
}

const editSource = function (id: string) {
  sourceMode.value = SourceMode.Edit
  let source = sourceStore.sources.find((x) => x.id === id)
  formState.id = id
  formState.name = source!.name
  formState.jsonUrl = source!.jsonUrl
}

const cancelForm = function () {
  v$.value.$reset()
  clearForm()
  sourceMode.value = SourceMode.Select
}

onMounted(() => {
  sourceStore.loadFromLocalStorage()
  if (isNullOrEmpty(sourceStore.currentId)) {
    sourceStore.$patch({ active: true })
    return
  }
  const source = sourceStore.sources.find((x) => x.id === sourceStore.currentId)
  if (source == null) return
  api
    .get<SwaggerRoot>(source.jsonUrl)
    .then((res) => globalStore.storeData(res))
    .catch((err) => {})
    .finally(() => {})
})

const isEdit = computed(() => sourceMode.value === SourceMode.Edit)
const isCreate = computed(() => sourceMode.value === SourceMode.Create)
</script>

<template>
  <v-dialog
    v-model="sourceStore.active"
    max-width="480"
    @after-leave="sourceMode = SourceMode.Select"
  >
    <v-card>
      <v-card-title class="px-5">
        <v-icon v-if="isCreate || isEdit" @click="cancelForm()" title="Back" size="small">
          mdi-arrow-left
        </v-icon>
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

      <v-card-text v-if="isCreate || isEdit">
        <v-container>
          <v-row>
            <v-col>
              <v-form>
                <v-text-field
                  v-model="formState.name"
                  label="Name"
                  variant="solo"
                  density="compact"
                  :error-messages="v$.name.$errors.map(e => e.$message as string)"
                  required
                  @blur="v$.name.$touch"
                  @input="v$.name.$touch"
                ></v-text-field>

                <v-text-field
                  v-model="formState.jsonUrl"
                  label="JSON Url"
                  variant="solo"
                  density="compact"
                  :error-messages="v$.jsonUrl.$errors.map(e => e.$message as string)"
                  required
                  @blur="v$.jsonUrl.$touch"
                  @input="v$.jsonUrl.$touch"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center">
              <v-btn variant="flat" size="small" color="grey" @click="cancelForm()">Cancel</v-btn>
              <v-btn class="ml-2" variant="flat" size="small" color="success" @click="saveSource()">
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-text v-else>
        <v-list lines="one">
          <v-list-item
            v-for="(source, i) in sourceStore.sources"
            :key="i"
            density="compact"
            class="py-0"
          >
            <v-btn-group class="d-flex" density="compact">
              <v-btn
                class="text-none text-left flex-grow-1"
                size="small"
                density="compact"
                variant="outlined"
                :active="source.id === sourceStore.currentId"
                @click="sourceStore.changeCurrentSource(source.id)"
              >
                {{ source.name }}
              </v-btn>
              <v-btn
                size="small"
                density="compact"
                color="danger"
                variant="outlined"
                @click="editSource(source.id)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                size="small"
                density="compact"
                color="danger"
                variant="outlined"
                @click="sourceStore.removeSource(source.id)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-btn-group>
          </v-list-item>
        </v-list>

        <div class="d-flex justify-center pb-2 mt-2">
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
