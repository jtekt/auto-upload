<template>
  <v-card variant="outlined">
    <v-card-title> S3 settings </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field v-model="settings.endPoint" label="Endpoint" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model.number="settings.port"
            type="number"
            label="Port"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field v-model="settings.accessKey" label="Access key" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            type="password"
            v-model="settings.secretKey"
            label="Secret key"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-checkbox label="Use SSL" v-model="settings.useSSL" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-text-field v-model="settings.bucket" label="Bucket" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { S3Settings } from "../../config"

const props = defineProps<{
  modelValue: S3Settings
}>()

const emit = defineEmits(["update:modelValue"])

const settings = ref(JSON.parse(JSON.stringify(props.modelValue)))

watch(
  settings,
  () => {
    emit("update:modelValue", settings.value)
  },
  { deep: true }
)
</script>
