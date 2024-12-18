import { loadFonts } from "./webfontloader"
import vuetify from "./vuetify"

// Types
import type { App } from "vue"

export function registerPlugins(app: App) {
  loadFonts()
  app.use(vuetify)
}
