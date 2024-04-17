<template>
  <v-container>
    <h2 class="my-4">Settings</h2>

    <v-row dense>
      <v-col>
        <v-text-field label="path" v-model="config.path" />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-text-field label="URL" v-model="config.url" />
      </v-col>
      <v-col>
        <v-text-field label="Field" v-model="config.field" />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-checkbox label="Move uploads" v-model="config.moveUploads" />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn
          color="primary"
          @click="updateConfig()"
          prepend-icon="mdi-content-save"
          text="Save"
        />
      </v-col>
    </v-row>
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
import { ref, onMounted } from "vue"

const config = ref({
  path: "test",
  url: "test",
  field: "test",
  moveUploads: false,
})

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
})

onMounted(() => {
  window.electronAPI.getConfig()
})

window.electronAPI.onConfig((value: any) => {
  config.value = value
})

function updateConfig() {
  // PROBLEM: Cannot pass config.value as is
  const { url, path, field } = config.value
  // Why not move uploads?
  window.electronAPI.setConfig({ url, path, field })

  snackbar.value.text = "Settings saved"
  snackbar.value.show = true
  snackbar.value.color = "success"
}
</script>
