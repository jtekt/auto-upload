<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>Auto-upload</h1>
        <h2>Settings</h2>

        <v-row dense>
          <v-col>
            <v-text-field label="path" v-model="config.path" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-text-field label="URL" v-model="config.url" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-text-field label="Field" v-model="config.field" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-btn @click="updateConfig()" text="Update" />
          </v-col>
        </v-row>

        <h2 class="mt-4">Uploads</h2>
        <p>Last 10 uploads</p>
        <v-data-table :headers="headers" :items="uploads"> </v-data-table>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

const config = ref({
  path: "test",
  url: "test",
  field: "test",
})

const headers = ref([
  { title: "Time", value: "time" },
  { title: "Path", value: "path" },
  { title: "URL", value: "url" },
  { title: "Success", value: "success" },
])

const uploads = ref<any[]>([])

onMounted(() => {
  window.electronAPI.getConfig()
})

window.electronAPI.onPost((value: any) => {
  uploads.value.push(value)
  if (uploads.value.length > 10) uploads.value.shift()
})

window.electronAPI.onConfig((value: any) => {
  config.value = value
})

function updateConfig() {
  // PROBLEM: Cannot pass config.value as is
  const { url, path, field } = config.value
  window.electronAPI.setConfig({ url, path, field })
}
</script>
