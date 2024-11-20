<template>
  <v-app>
    <v-app-bar extended>
      <v-app-bar-title> Auto-upload </v-app-bar-title>

      <v-spacer />
      <ThemeToggle />
      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tab value="settings">Settings</v-tab>
          <v-tab value="history">History</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-window v-model="tab">
        <v-window-item value="settings" eager>
          <SettingsWindow />
        </v-window-item>

        <v-window-item value="history" eager>
          <HistoryWindow />
        </v-window-item>
      </v-window>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import ThemeToggle from "./components/ThemeToggle.vue"
import SettingsWindow from "./components/SettingsWindow.vue"
import HistoryWindow from "./components/HistoryWindow.vue"
import { ref } from "vue"

const tab = ref(null)
</script>
