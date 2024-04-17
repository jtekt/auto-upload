<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title> Auto-upload </v-app-bar-title>

      <v-spacer></v-spacer>
      <!-- <ThemeToggle /> -->
      <v-tabs v-model="tab">
        <v-tab value="settings">Settings</v-tab>
        <v-tab value="history">History</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <v-window v-model="tab">
        <v-window-item value="settings">
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
        </v-window-item>

        <v-window-item value="history">
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
        </v-window-item>
      </v-window>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color">
        {{ snackbar.text }}
        <v-spacer></v-spacer>
        <template v-slot:actions>
          <v-btn @click="snackbar.show = false" icon="mdi-close" />
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useTheme } from "vuetify"
import ThemeToggle from "./components/ThemeToggle.vue"

const theme = useTheme()

const tab = ref(null)

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

  if (!value.success) {
    snackbar.value.text = "Upload failed"
    snackbar.value.show = true
    snackbar.value.color = "error"
  }
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
