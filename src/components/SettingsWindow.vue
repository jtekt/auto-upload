<template>
  <v-container>
    <h2 class="my-4">Settings</h2>
    <v-progress-linear :indeterminate="true" v-if="loading" />
    <template v-else>
      <v-row>
        <v-col>
          <v-text-field label="path" v-model="config.path" />
        </v-col>
        <v-col cols="auto">
          <v-checkbox
            label="Move files after processing"
            v-model="config.moveProcessed"
          />
        </v-col>
      </v-row>

      <v-row v-if="VITE_ALLOW_PARSING">
        <v-col cols="">
          <v-select
            label="Action"
            :items="parsers"
            v-model="config.parser"
            @update:model-value="
              ($event) => {
                if ($event === null) config.target = 'http'
              }
            "
          />
        </v-col>
        <v-col cols="">
          <v-select
            :disabled="!config.parser"
            label="Target"
            :items="targets"
            v-model="config.target"
          />
        </v-col>
      </v-row>

      <HttpSettings
        v-if="config.target === 'http'"
        v-model="config.http"
        :parser="config.parser"
      />

      <PostgresSettings
        v-if="config.target === 'postgres'"
        v-model="config.postgres"
      />

      <v-row class="mt-2">
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="updateConfig()"
            prepend-icon="mdi-content-save"
            text="Save settings"
          />
        </v-col>
      </v-row>
    </template>
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
import { defaultsettings } from "../config"
import PostgresSettings from "./targets/PostgresSettings.vue"
import HttpSettings from "./targets/HttpSettings.vue"

// @ts-ignore
const { VITE_ALLOW_PARSING } = import.meta.env

const config = ref(defaultsettings)

const parsers = ref([
  { title: "Send as file", value: null },
  { title: "Convert CSV to JSON", value: "csv" },
])

const targets = ref([
  { title: "HTTP server", value: "http" },
  { title: "PostgreSQL", value: "postgres" },
])

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
})

const loading = ref(true)

onMounted(() => {
  // @ts-ignore
  window.electronAPI.getConfig()
})

// @ts-ignore
window.electronAPI.onConfig((value: any) => {
  config.value = value
  loading.value = false
})

function updateConfig() {
  const configObject = JSON.parse(JSON.stringify(config.value))

  // @ts-ignore
  window.electronAPI.setConfig(configObject)

  snackbar.value.text = "Settings saved"
  snackbar.value.show = true
  snackbar.value.color = "success"
}
</script>
