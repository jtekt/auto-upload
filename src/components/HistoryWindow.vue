<template>
  <v-container>
    <h2 class="mt-4">Uploads</h2>
    <p>Last 10 uploads</p>
    <v-data-table :headers="headers" :items="uploads">
      <template v-slot:item.success="{ item }">
        <v-icon v-if="item.success" color="success">mdi-check</v-icon>
        <v-icon v-else color="error">mdi-close</v-icon>
      </template>
    </v-data-table>
  </v-container>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color">
    {{ snackbar.text }}
    <v-spacer></v-spacer>
    <template v-slot:actions>
      <v-btn @click="snackbar.show = false" icon="mdi-close" />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from "vue"

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
})

const headers = ref([
  { title: "Time", value: "time" },
  { title: "Path", value: "path" },
  // { title: "URL", value: "url" },
  { title: "Success", value: "success" },
])

const uploads = ref<any[]>([])

// @ts-ignore
window.electronAPI.onPost((value: any) => {
  uploads.value.push(value)
  if (uploads.value.length > 10) uploads.value.shift()

  if (value.success) {
    snackbar.value.text = "Upload successful"
    snackbar.value.show = true
    snackbar.value.color = "success"
  } else {
    snackbar.value.text = "Upload failed"
    snackbar.value.show = true
    snackbar.value.color = "error"
  }
})
</script>
