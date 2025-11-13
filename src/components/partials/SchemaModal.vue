<script setup lang="ts">
import { useGlobalStore } from '@/stores/global.store'
import { computed, ref, watch } from 'vue'
import SchemaPreview from './SchemaPreview.vue'
import SchemaTypescript from './SchemaTypescript.vue'
import { isNullOrEmpty } from '@/helpers/helper'

enum SchemaView {
  preview = 'preview',
  typescript = 'typescript',
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const globalStore = useGlobalStore()
const keywordFilter = ref<string>('')
const filteredSchemas = computed(() => {
  const keyword = keywordFilter.value.trim()
  let schemas = globalStore.schemas

  if (!isNullOrEmpty(keyword)) {
    let regex: RegExp
    try {
      regex = new RegExp(keyword, 'i')
    } catch {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      regex = new RegExp(escaped, 'i')
    }

    schemas = schemas.filter((x) => regex.test(x.name))
    return schemas.map<{ key: string; html: string }>((x) => ({
      key: x.name,
      html: x.name.replace(regex, (match) => `<span class="highlight">${match}</span>`),
    }))
  }
  return schemas.map<{ key: string; html: string }>((x) => ({ key: x.name, html: x.name }))
})

const selectedSchemaName = ref<string | undefined>(undefined)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const currentView = ref<SchemaView>(SchemaView.typescript)

const closeModal = () => {
  const modal = document.querySelector('#schema-modal') as HTMLDialogElement
  if (modal == null || !modal.open) return
  modal.close()
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (newVal) => {
    const modal = document.querySelector('#schema-modal') as HTMLDialogElement
    if (modal == null || modal.open) return

    if (!newVal) {
      modal.close()
      return
    }
    modal.showModal()
  }
)
</script>

<template>
  <dialog id="schema-modal" class="modal" :class="{ hidden: !props.modelValue }">
    <div class="modal-box flex flex-col min-w-10/12 md:min-w-8/12 min-h-5/6">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
        ✕
      </button>

      <div class="flex flex-row gap-2 justify-start items-center">
        <h3 class="text-xl valign-middle ml-4">API Schema</h3>
      </div>

      <div class="divider"></div>

      <div class="flex flex-row w-full min-h-0">
        <!-- Left side -->
        <div class="flex flex-col min-h-0">
          <div class="px-4 flex-shrink-0">
            <input type="text" placeholder="Filter.." class="input" v-model="keywordFilter" />
          </div>
          <div class="divider flex-shrink-0"></div>
          <div class="flex-1 min-h-0">
            <ul class="menu flex-nowrap w-full h-full overflow-y-auto">
              <li
                v-for="(schema, i) in filteredSchemas"
                :key="i"
                @click="selectedSchemaName = schema.key"
                :class="{ active: schema.key === selectedSchemaName }"
              >
                <div>
                  <a v-html="schema.html || schema.key"></a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="divider divider-horizontal h-full"></div>

        <!-- Right side -->
        <div class="flex flex-col w-full">
          <div role="tablist" class="tabs">
            <a
              role="tab"
              class="tab"
              :class="{ 'tab-active': currentView === SchemaView.preview }"
              @click="currentView = SchemaView.preview"
              >Preview</a
            >
            <a
              role="tab"
              class="tab"
              :class="{ 'tab-active': currentView === SchemaView.typescript }"
              @click="currentView = SchemaView.typescript"
              >Typescript</a
            >
          </div>
          <div
            v-if="selectedSchemaName"
            id="preview-content"
            class="container min-h-0 overflow-y-auto"
          >
            <SchemaPreview
              v-if="currentView === SchemaView.preview"
              :schemaName="selectedSchemaName"
            />
            <SchemaTypescript
              v-if="currentView === SchemaView.typescript"
              :schemaName="selectedSchemaName"
              @change-schema="(schema) => (selectedSchemaName = schema)"
            />
          </div>
        </div>
      </div>
    </div>
    <label class="modal-backdrop" for="schema-modal" @click="closeModal"></label>
  </dialog>
</template>

<style lang="scss" scoped>
ul.menu {
  li.active > div {
    background-color: var(--color-primary);
    color: var(--color-primary-content);
  }
}
#preview-content {
  font-family: 'Courier New', Courier, monospace;
}
</style>
