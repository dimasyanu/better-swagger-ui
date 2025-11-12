<script setup lang="ts">
import { useGlobalStore } from '@/stores/global.store'
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const globalStore = useGlobalStore()

const currentView = ref<'preview' | 'typescript'>('preview')

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
    <div class="modal-box flex flex-col min-w-10/12 md:min-w-8/12 max-h-5/6">
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
            <input type="text" placeholder="Filter.." class="input" />
          </div>
          <div class="divider flex-shrink-0"></div>
          <div class="flex-1 min-h-0">
            <ul class="menu flex-nowrap h-full overflow-y-auto">
              <li v-for="(schema, i) in globalStore.schemas" :key="i">
                <a>{{ schema.name }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="divider divider-horizontal h-full"></div>

        <!-- Right side -->
        <div class="flex flex-col h-full">
          <div role="tablist" class="tabs">
            <a
              role="tab"
              class="tab"
              :class="{ 'tab-active': currentView === 'preview' }"
              @click="currentView = 'preview'"
              >Preview</a
            >
            <a
              role="tab"
              class="tab"
              :class="{ 'tab-active': currentView === 'typescript' }"
              @click="currentView = 'typescript'"
              >Typescript</a
            >
          </div>
        </div>
      </div>
    </div>
    <label class="modal-backdrop" for="schema-modal" @click="closeModal"></label>
  </dialog>
</template>
