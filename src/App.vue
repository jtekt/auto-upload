<template>
  <h1>Auto-upload</h1>
  <h2>Settings</h2>
  <p>
    <label>Path</label>
    <input type="text" v-model="config.path" />
  </p>
  <p>
    <label>URL</label>
    <input type="text" v-model="config.url" />
  </p>
  <p>
    <label>Field</label>
    <input type="text" v-model="config.field" />
  </p>
  <p>
    <button @click="updateConfig()">Update</button>
  </p>
  <h2>Uploads</h2>
  <p>Last 10 uploads</p>
  <p>
    <div v-for="(upload, i) in uploads" :key="i">
      {{ upload }}
    </div>
  </p>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

const config = ref({
  path: "test",
  url: "test",
  field: "test",
})

const uploads = ref([])

onMounted(() => {
  window.electronAPI.getConfig()
})

window.electronAPI.onPost((value: any) => {
  uploads.value.push(value)
  if(uploads.value.length > 10) uploads.value.shift()
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
