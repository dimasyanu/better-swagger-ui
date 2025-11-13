<script setup lang="ts">
import { computed, ref } from 'vue'
import CopyIcon from '../icons/CopyIcon.vue'
import { useGlobalStore } from '@/stores/global.store'
import EyeSlashIcon from '../icons/EyeSlashIcon.vue'
import EyeIcon from '../icons/EyeIcon.vue'
import { useSnackbarStore } from '@/stores/snackbar.store'

const arrayType = 'array'
const props = defineProps<{
  schemaName: string
  nullable?: boolean | undefined
}>()
const globalStore = useGlobalStore()
const snackbar = useSnackbarStore()
const showDependencies = ref(true)

const emit = defineEmits<{
  (e: 'changeSchema', value: string): void
}>()

declare global {
  interface Window {
    changeScheme: (schema: string) => void
  }
}
window.changeScheme = (schema: string) => {
  emit('changeSchema', schema)
}

const getSchemaByName = (name: string) => {
  return globalStore.schemas.find((x) => x.name === name) || null
}

const buildCode = (schemaName: string, showDependencies: boolean = false): string => {
  let result = `\ninterface ${schemaName} {\n`

  const _schema = computed(() => getSchemaByName(schemaName))
  if (_schema.value == null) {
    return result + ` // Schema not found\n}`
  }

  for (const [key, type] of Object.entries(_schema.value.properties)) {
    result += `  ${key}${type.nullable ? '?:' : ':'} `

    // Primitive types
    if (!type.$ref && type.type !== arrayType) {
      result += `${type.type}${type.nullable ? ' | undefined' : ''}\n`
      continue
    }

    // Array type
    if (type.type === arrayType && type.items != null && type.items.$ref) {
      const refType = type.items.$ref.split('/').pop()
      result += `<span class="text-teal-500 hover:underline cursor-pointer" onclick="changeScheme('${refType}')">${refType}</span>[]${
        type.nullable ? ' | undefined' : ''
      }\n`

      if (!showDependencies) continue
      result = buildCode(refType!, true) + '\n' + result
      continue
    }

    // Reference type
    if (type.$ref) {
      const refType = type.$ref.split('/').pop()
      result += `<span class="text-teal-500 hover:underline cursor-pointer" onclick="changeScheme('${refType}')">${refType}</span>${
        type.nullable ? ' | undefined' : ''
      }\n`

      if (!showDependencies) continue
      result = buildCode(refType!, true) + '\n' + result
    }
  }

  result += `}`

  return result
}

const code = computed(() => buildCode(props.schemaName, showDependencies.value))
const coloredCode = computed(() => {
  return code.value
    .replace(/integer/g, 'number')
    .replace(
      /(interface\ )(.+)(\ {)/g,
      '$1<span class="text-teal-500 font-medium">$2</span><span class="text-secondary font-medium"> {</span>'
    )
    .replace(/(interface|\[\])/g, '<span class="text-blue-400 font-medium">$1</span>')
    .replace(
      /(number|string|boolean|undefined)/g,
      '<span class="text-teal-500 font-medium">$1</span>'
    )
    .replace(/([{}])/g, '<span class="text-yellow-400 font-medium">$1</span>')
    .replace(/(;)/g, '<span class="text-gray-100 font-medium">$1</span>')
})

const fallbackCopyToClipboard = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed' // Prevents scrolling to bottom of page in some browsers
  textarea.style.opacity = '0' // Makes it invisible
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  try {
    document.execCommand('copy')
    console.log('Content copied to clipboard using fallback')
  } catch (err) {
    console.error('Fallback: Failed to copy', err)
  } finally {
    document.body.removeChild(textarea)
  }
}
const copy = async () => {
  const _code = code.value.trim()
  try {
    await navigator.clipboard.writeText(_code)
    snackbar.success('Code copied to clipboard', 20000)
  } catch (error) {
    snackbar.error('Failed to copy code')
    fallbackCopyToClipboard(_code)
  }
}
</script>

<template>
  <div class="mockup-code w-full">
    <div class="absolute right-2 top-2">
      <div
        class="tooltip tooltip-left tooltip-accent"
        :data-tip="`${showDependencies ? 'Hide' : 'Show'} dependencies`"
      >
        <div
          class="btn btn-square btn-sm btn-neutral"
          @click="showDependencies = !showDependencies"
        >
          <EyeIcon v-if="showDependencies" />
          <EyeSlashIcon v-else />
        </div>
      </div>
      <div class="tooltip tooltip-bottom tooltip-accent ml-1" data-tip="Copy">
        <div class="btn btn-square btn-sm btn-neutral" @click="copy">
          <CopyIcon />
        </div>
      </div>
    </div>
    <pre class="px-8"><code class="text-blue-200" v-html="coloredCode"></code></pre>
  </div>
</template>
