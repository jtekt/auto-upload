<template>
  <v-row>
    <v-col>
      <v-text-field v-model="settings.host" label="Host" />
    </v-col>
    <v-col>
      <v-text-field type="number" v-model.number="settings.port" label="Port" />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-text-field v-model="settings.username" label="Username" />
    </v-col>
    <v-col>
      <v-text-field
        type="password"
        v-model="settings.password"
        label="Password"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-text-field v-model="settings.database" label="Database" />
    </v-col>
    <v-col>
      <v-text-field v-model="settings.table" label="Table" />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-checkbox label="SSL" v-model="settings.ssl" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { type PostgresSettings } from "../../config"

const props = defineProps<{
  modelValue: PostgresSettings
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
