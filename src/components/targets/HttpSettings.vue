<template>
  <v-card variant="outlined">
    <v-card-title> HTTP settings </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field v-model="settings.url" label="URL" />
        </v-col>
        <v-col v-if="!props.parser">
          <v-text-field v-model="settings.field" label="Field name" />
        </v-col>
      </v-row>

      <v-tabs v-model="tab">
        <v-tab value="fields">Fields</v-tab>
        <v-tab value="headers">Headers</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="fields" eager>
          <v-card flat>
            <v-card-text>
              <v-row align="center">
                <v-col cols="auto">
                  <h3>Fields</h3>
                </v-col>

                <v-spacer></v-spacer>
                <v-col cols="auto">
                  <v-btn
                    @click="addField"
                    text="Add field"
                    prepend-icon="mdi-plus"
                  />
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
                  <v-btn
                    @click="removeField(index)"
                    icon="mdi-close"
                    variant="flat"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>

        <v-window-item value="headers" eager>
          <v-card flat>
            <v-card-text>
              <v-row align="center">
                <v-col cols="auto">
                  <h3>Headers</h3>
                </v-col>

                <v-spacer></v-spacer>
                <v-col cols="auto">
                  <v-btn
                    @click="addHeader"
                    text="Add field"
                    prepend-icon="mdi-plus"
                  />
                </v-col>
              </v-row>

              <v-row v-for="(header, index) in settings.headers" :key="index">
                <v-col>
                  <v-text-field v-model="header.key" label="Key" />
                </v-col>
                <v-col>
                  <v-text-field v-model="header.value" label="Value" />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    @click="removeHeader(index)"
                    icon="mdi-close"
                    variant="flat"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>

      <!-- TODO: headers -->
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { type HttpSettings } from "../../settings";

const props = defineProps<{
  modelValue: HttpSettings;
  parser?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const settings = ref(JSON.parse(JSON.stringify(props.modelValue)));

const tab = ref(null);

watch(
  settings,
  () => {
    emit("update:modelValue", settings.value);
  },
  { deep: true }
);

function addField() {
  settings.value.fields.push({ key: "", value: "" });
}

function removeField(index: number) {
  settings.value.fields.splice(index, 1);
}

function addHeader() {
  settings.value.headers.push({ key: "", value: "" });
}

function removeHeader(index: number) {
  settings.value.headers.splice(index, 1);
}
</script>
