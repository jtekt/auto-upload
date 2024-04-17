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
        <v-window-item value="settings" eager>
          <SettingsWindow />
        </v-window-item>

        <v-window-item value="history" eager>
          <HistoryWIndow />
        </v-window-item>
      </v-window>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import ThemeToggle from "./components/ThemeToggle.vue"
import SettingsWindow from "./components/SettingsWindow.vue"
import HistoryWIndow from "./components/HistoryWIndow.vue"
import { ref } from "vue"

const tab = ref(null)
</script>
