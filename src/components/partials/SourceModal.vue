<script setup lang="ts">
import { isNullOrEmpty } from '@/helpers/helper'
import { ApiSourceItem } from '@/models/api-source.model'
import { useApiSourceStore } from '@/stores/api-source.store'
import { useGlobalStore } from '@/stores/global.store'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { v4 as uuid } from 'uuid'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import PencilIcon from '../icons/PencilIcon.vue'
import TrashIcon from '../icons/TrashIcon.vue'
import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue'

const defaultSourceName = 'Default'
const defaultSourceUrl = '/swagger.test.json'

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
  let valid = await v$.value.$validate()
  if (!valid) return

  if (isNullOrEmpty(formState.id))
    sourceStore.addSource(new ApiSourceItem(uuid(), formState.name, formState.jsonUrl))
  else {
    const source = new ApiSourceItem(formState.id, formState.name, formState.jsonUrl)
    sourceStore.updateSource(source)
    if (formState.id === sourceStore.currentId) {
      sourceStore.fetchFromSource()
    }
  }

  closeModal()
}

const selectSource = function (id: string) {
  closeModal()
  sourceStore.changeCurrentSource(id)
}

const editSource = function (id: string) {
  sourceMode.value = SourceMode.Edit
  let source = sourceStore.sources.find((x) => x.id === id)
  formState.id = id
  formState.name = source!.name
  formState.jsonUrl = source!.jsonUrl
}

const useDefaultSource = function () {
  sourceStore.addSource(new ApiSourceItem(uuid(), defaultSourceName, defaultSourceUrl))
}

const cancelForm = function () {
  v$.value.$reset()
  clearForm()
  sourceMode.value = SourceMode.Select
}

const closeModal = function () {
  clearForm()
  v$.value.$reset()

  const modal = document.querySelector('#source-modal') as HTMLDialogElement
  if (modal == null || !modal.open) return
  modal.close()
  sourceStore.closeSourceModal()
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
  sourceStore.fetchFromSource()
})

const isEdit = computed(() => sourceMode.value === SourceMode.Edit)
const isCreate = computed(() => sourceMode.value === SourceMode.Create)
watch(
  () => sourceStore.active,
  (newVal) => {
    const modal = document.querySelector('#source-modal') as HTMLDialogElement
    if (modal == null || modal.open) return

    if (!newVal) {
      sourceMode.value = SourceMode.Select
      clearForm()
      v$.value.$reset()
      modal.close()
      return
    }
    modal.showModal()
  }
)
</script>

<template>
  <dialog id="source-modal" class="modal" :class="{ hidden: !sourceStore.active }">
    <div class="modal-box">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
        ✕
      </button>

      <div class="flex flex-row gap-2 justify-start items-center">
        <div v-if="isCreate || isEdit" class="cursor-pointer" @click="cancelForm">
          <ArrowLeftIcon />
        </div>
        <h3 class="text-xl valign-middle ml-4">
          {{
            sourceMode === SourceMode.Create
              ? 'Create Source'
              : sourceMode === SourceMode.Edit
              ? 'Edit Source'
              : 'Sources'
          }}
        </h3>
      </div>

      <div class="divider"></div>

      <div v-if="isCreate || isEdit">
        <div class="form-control w-full mb-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Name</legend>
            <input
              v-model="formState.name"
              type="text"
              placeholder="Source Name"
              class="input input-bordered w-full"
            />
          </fieldset>
          <span v-if="v$.name.$error" class="text-sm text-red-600 mt-1">
            <ul class="validator-hint">
              <li v-for="(error, i) in v$.name.$errors" :key="i">{{ error.$message }}</li>
            </ul>
          </span>

          <fieldset class="fieldset">
            <legend class="fieldset-legend mt-4">JSON Url</legend>
            <input
              v-model="formState.jsonUrl"
              type="text"
              placeholder="https://example.com/api.json"
              class="input input-bordered w-full"
            />
          </fieldset>
          <span v-if="v$.jsonUrl.$error" class="text-sm text-red-600 mt-1">
            <ul class="validator-hint">
              <li v-for="(error, i) in v$.jsonUrl.$errors" :key="i">{{ error.$message }}</li>
            </ul>
          </span>

          <div class="mt-6 w-full flex justify-center">
            <div class="btn btn-sm mr-4" @click="cancelForm">Cancel</div>
            <div class="btn btn-sm btn-primary" @click="saveSource">Save Source</div>
          </div>
        </div>
      </div>

      <div v-else id="source-list" class="flex flex-col gap-2">
        <div
          v-for="(source, i) in sourceStore.sources"
          :key="i"
          class="flex flex-row"
          :class="{ active: source.id === sourceStore.currentId }"
        >
          <div class="btn flex-grow rounded-r-none" @click="selectSource(source.id)">
            {{ source.name }}
          </div>
          <div class="btn rounded-none" @click="editSource(source.id)">
            <PencilIcon />
          </div>
          <div class="btn rounded-l-none" @click="sourceStore.removeSource(source.id)">
            <TrashIcon />
          </div>
        </div>

        <div class="mt-3 w-full flex flex-row justify-center items-center">
          <div class="btn btn-sm" @click="sourceMode = SourceMode.Create">Add a new source</div>
          <template v-if="sourceStore.sources.length < 1">
            <div class="divider divider-horizontal text-xs">OR</div>
            <div class="btn btn-sm" @click="useDefaultSource">Use Default Source</div>
          </template>
        </div>
      </div>
    </div>

    <label class="modal-backdrop" for="source-modal" @click="closeModal"></label>
  </dialog>
</template>

<style lang="scss" scoped>
#source-list .active .btn {
  background-color: var(--color-secondary);
  color: var(--color-secondary-content);
  border: none;

  transition: all 0.2s ease-in-out;

  &:hover {
    filter: brightness(0.9);
  }
}
</style>
