<template>
  <v-row>
    <v-col>
      <v-text-field v-model="settings.url" label="URL" />
    </v-col>
    <v-col v-if="!props.parser">
      <v-text-field v-model="settings.field" label="field" />
    </v-col>
    <!-- TODO: fields and headers -->
  </v-row>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { type HttpSettings } from "../../config"

const props = defineProps<{
  modelValue: HttpSettings
  parser?: string
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
