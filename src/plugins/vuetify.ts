/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

// Composables
import { createVuetify } from "vuetify"
import * as labs from "vuetify/labs/components"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    // defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: "#c00000",
        },
      },
      dark: {
        colors: {
          primary: "#c00000",
        },
      },
    },
  },
  components: {
    ...labs,
  },
})
