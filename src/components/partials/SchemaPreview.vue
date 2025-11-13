<script setup lang="ts">
import { SwaggerSchema } from '@/models/swagger-schema.model'
import { useGlobalStore } from '@/stores/global.store'
import { computed, ref } from 'vue'

const arrayType = 'array'
const state = ref<boolean | null>(true)
const globalStore = useGlobalStore()

const props = defineProps<{
  nullable?: boolean | undefined
  schemaName: string | undefined
  text?: string | undefined
}>()

const scheme = computed<SwaggerSchema | null>(() => {
  if (!props.schemaName) return null
  return globalStore.schemas.find((schema) => schema.name === props.schemaName) || null
})
</script>
<template>
  <div v-if="schemaName" class="collapse collapse-arrow bg-base-100 border-base-300">
    <input type="checkbox" v-model="state" />
    <div
      class="collapse-title font-semibold after:start-5 after:end-auto hover:underline pe-4 ps-12 py-2"
    >
      {{ props.text ?? props.schemaName }}
      <span v-if="props.nullable" class="text-secondary font-medium"> (nullable)</span>
    </div>
    <div class="collapse-content text-sm pl-10">
      <table class="table">
        <tbody>
          <tr v-for="(value, key) in scheme?.properties" :key="key">
            <td class="w-1 whitespace-nowrap font-semibold align-top text-start px-1">
              <div class="inline-block" :class="{ 'py-2': value.$ref || value.type === arrayType }">
                {{ key }}
              </div>
            </td>
            <td class="align-top text-start px-1">
              <div class="flex flex-row">
                <span v-if="!value.$ref && value.type !== arrayType"
                  >:
                  <i class="text-secondary">{{ value.type }}</i>
                  <i v-if="value.nullable" class="text-secondary"> (nullable)</i>
                </span>
                <span v-else class="flex-grow flex flex-row">
                  <div class="inline-block py-[0.4rem]">:</div>
                  <SchemaPreview
                    v-if="value.type === arrayType && value.items"
                    :schemaName="value.items.$ref?.split('/').pop()"
                    :text="value.items.$ref?.split('/').pop() + '[]'"
                    :nullable="value.nullable"
                  />
                  <SchemaPreview
                    v-else-if="value.$ref"
                    :schemaName="value.$ref.split('/').pop()"
                    :nullable="value.nullable"
                  />
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
