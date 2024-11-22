<script lang="ts" setup>
import { ApiEndpoint } from '@/models/api-data.model'

defineProps({
  endpoint: ApiEndpoint,
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col>
        <span class="text-body-1">Request Parameters</span>
        <v-table density="compact" class="bg-surface-light">
            <thead>
              <tr>
                <th class="font-weight-bold">Field</th>
                <th class="font-weight-bold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="parameter in endpoint?.request.parameters">
                <td colspan="2">
                  {{ parameter.name }}
                  <span v-if="parameter.required" class="text-red">*<sup>required</sup></span>
                  ({{ parameter.in }})
                </td>
              </tr>
            </tbody>
          </v-table>
      </v-col>
      <v-col>
        <span class="text-body-1">Response Body</span>
        <v-table density="compact" class="bg-surface-light">
            <thead>
              <tr>
                <th class="font-weight-bold">Status Code</th>
                <th class="font-weight-bold">Body</th>
                <th class="font-weight-bold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2"></td>
              </tr>
            </tbody>
          </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>
