<script lang="ts" setup>
import { ApiEndpoint } from '@/models/api-data.model'
import { Dictionary } from '@/models/dictionary.model'
import { SwaggerSchemaProperty } from '@/models/swagger-schema-property.model'
import { useGlobalStore } from '@/stores/global.store'

const globalStore = useGlobalStore()

const getSchemaProperties = function (
  schemaPath: String | undefined
): Dictionary<SwaggerSchemaProperty> | undefined {
  if (schemaPath === undefined) return new Dictionary<SwaggerSchemaProperty>()
  let segments = schemaPath.split('/')
  let schemaName = segments[segments.length - 1]
  let schema = globalStore.schemas.find((x) => x.name == schemaName)
  for (let prop in schema?.properties) {
    if (!schema?.properties.hasOwnProperty(prop)) continue
    schema.properties[prop]!.name = prop
  }
  return schema?.properties
}

defineProps({
  endpoint: ApiEndpoint,
})
</script>
<template>
  <div class="container flex flex-row w-full gap-6">
    <div class="w-1/2 bg-base-200 py-2 px-4">
      <span class="text-body-1">Request Parameters</span>
      <div class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th class="font-weight-bold">Field</th>
              <th class="font-weight-bold">Description</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="endpoint?.request.requestBody?.content">
              <tr
                v-for="property in getSchemaProperties(
                  endpoint?.request.requestBody?.content['application/json']?.schema.$ref
                )"
              >
                <td class="py-3">
                  {{ property.name }}
                  <span v-if="!property.nullable" class="text-error">*<sup>required</sup></span
                  >:
                  <span>
                    {{ property.type }}{{ property.format ? `(${property.format})` : '' }}
                  </span>
                  <br />
                  <span class="text-grey">(body)</span>
                </td>
              </tr>
            </template>
            <template v-if="endpoint?.request.requestBody?.content">
              <tr
                v-for="(property, k) in getSchemaProperties(
                  endpoint?.request.requestBody?.content['multipart/form-data']?.schema.$ref
                )"
              >
                <td class="py-3">
                  {{ k }}
                  <span v-if="!property.nullable" class="text-error">*<sup>required</sup></span
                  >:
                  <span>
                    {{ property.type }}{{ property.format ? `(${property.format})` : '' }}
                  </span>
                  <br />
                  <span class="text-grey">(body)</span>
                </td>
              </tr>
            </template>
            <tr v-for="parameter in endpoint?.request.parameters">
              <td class="py-3">
                {{ parameter.name }}
                <span v-if="parameter.required" class="text-error">*<sup>required</sup></span
                >:
                <span
                  >{{ parameter.schema.type
                  }}{{ parameter.schema.format ? `(${parameter.schema.format})` : '' }}</span
                >
                <br />
                <span class="text-grey">({{ parameter.in }})</span>
              </td>
              <td>
                {{ parameter.description }}
              </td>
            </tr>
            <tr v-if="(endpoint?.request.parameters?.length ?? 0) < 1" class="bg-surface-light">
              <td class="text-center text-grey" colspan="2">No item</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="w-1/2 bg-base-200 py-2 px-4">
      <span class="text-body-1">Response Body</span>
      <table class="table table-sm">
        <thead>
          <tr>
            <th class="font-weight-bold">Status Code</th>
            <th class="font-weight-bold">Body</th>
            <th class="font-weight-bold">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(response, key) in endpoint?.request.responses">
            <td>
              {{ key }}
            </td>
            <td></td>
            <td>
              {{ response.description }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- 
  <v-container>
    <v-row>
      <v-col>
        <span class="text-body-1">Request Parameters</span>
        <v-table density="compact" class="h-max-360px" fixed-header>
          <thead>
            <tr>
              <th class="font-weight-bold">Field</th>
              <th class="font-weight-bold">Description</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="endpoint?.request.requestBody?.content">
              <tr
                v-for="property in getSchemaProperties(
                  endpoint?.request.requestBody?.content['application/json']?.schema.$ref
                )"
              >
                <td class="py-3">
                  {{ property.name }}
                  <span v-if="!property.nullable" class="text-error">*<sup>required</sup></span
                  >:
                  <span>
                    {{ property.type }}{{ property.format ? `(${property.format})` : '' }}
                  </span>
                  <br />
                  <span class="text-grey">(body)</span>
                </td>
              </tr>
            </template>
            <template v-if="endpoint?.request.requestBody?.content">
              <tr
                v-for="(property, k) in getSchemaProperties(
                  endpoint?.request.requestBody?.content['multipart/form-data']?.schema.$ref
                )"
              >
                <td class="py-3">
                  {{ k }}
                  <span v-if="!property.nullable" class="text-error">*<sup>required</sup></span
                  >:
                  <span>
                    {{ property.type }}{{ property.format ? `(${property.format})` : '' }}
                  </span>
                  <br />
                  <span class="text-grey">(body)</span>
                </td>
              </tr>
            </template>
            <tr v-for="parameter in endpoint?.request.parameters">
              <td class="py-3">
                {{ parameter.name }}
                <span v-if="parameter.required" class="text-error">*<sup>required</sup></span
                >:
                <span
                  >{{ parameter.schema.type
                  }}{{ parameter.schema.format ? `(${parameter.schema.format})` : '' }}</span
                >
                <br />
                <span class="text-grey">({{ parameter.in }})</span>
              </td>
              <td>
                {{ parameter.description }}
              </td>
            </tr>
            <tr v-if="(endpoint?.request.parameters?.length ?? 0) < 1" class="bg-surface-light">
              <td class="text-center text-grey" colspan="2">No item</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col>
        <span class="text-body-1">Response Body</span>
        <v-table density="compact" class="bg-surface-light h-max-360px" fixed-header>
          <thead>
            <tr>
              <th class="font-weight-bold">Status Code</th>
              <th class="font-weight-bold">Body</th>
              <th class="font-weight-bold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(response, key) in endpoint?.request.responses">
              <td>
                {{ key }}
              </td>
              <td></td>
              <td>
                {{ response.description }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
 -->
</template>
