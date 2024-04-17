<template>
  <v-btn @click="toggleTheme" icon="mdi-theme-light-dark" />
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useTheme } from "vuetify"
const theme = useTheme()

onMounted(() => {
  if (localStorage.getItem("theme"))
    theme.global.name.value = localStorage.getItem("theme") as string
})

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark"
  localStorage.setItem("theme", theme.global.name.value)
}
</script>
