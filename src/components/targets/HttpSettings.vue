<template>
  <v-row>
    <v-col>
      <v-text-field v-model="settings.url" label="URL" />
    </v-col>
    <v-col v-if="!props.parser">
      <v-text-field v-model="settings.field" label="field" />
    </v-col>
  </v-row>
  <!-- TODO: headers -->

  <v-row>
    <v-col>
      <h3>Fields</h3>
    </v-col>
  </v-row>

  <v-row v-for="(field, index) in settings.fields" :key="index">
    <v-col>
      <v-text-field v-model="field.key" label="Key" />
    </v-col>
    <v-col>
      <v-text-field v-model="field.value" label="Value" />
    </v-col>
    <v-col cols="auto">
      <v-btn @click="removeField(index)" icon="mdi-close" variant="flat" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="auto">
      <v-btn @click="addField" text="Add field" prepend-icon="mdi-plus" />
    </v-col>
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

function addField() {
  settings.value.fields.push({ key: "", value: "" })
}

function removeField(index: number) {
  settings.value.fields.splice(index, 1)
}
</script>
