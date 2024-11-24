<script lang="ts" setup>
import { ApiEndpoint } from '@/models/api-data.model'
import { computed } from 'vue'

defineProps({
  endpoint: ApiEndpoint,
})
</script>
<template>
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
            <tr v-for="parameter in endpoint?.request.parameters">
              <td class="py-3">
                {{ parameter.name }}
                <span v-if="parameter.required" class="text-red">*<sup>required</sup></span
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
            <tr v-if="endpoint?.request.requestBody?.content">
              {{
                endpoint?.request.requestBody?.content['application/json'].schema.$ref
              }}
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
</template>
