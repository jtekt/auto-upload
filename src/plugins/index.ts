import { loadFonts } from "./webfontloader"
import vuetify from "./vuetify"

// Types
import type { App } from "vue"

export function registerPlugins(app: App) {
  loadFonts()
  app.use(vuetify)

  //工程属性表示文言
  // PROBLEM: Not an array
  const attributeProcessArray = { japia: "JAPIA", actualProcess: "実工程" }
  app.config.globalProperties.$attributeArray = attributeProcessArray
  app.provide("$attributeProcessArray", attributeProcessArray)

  //分類属性表示文言
  // PROBLEM: Not an array
  const attributeArray = { idea: "IDEA", internal: "自社" }
  app.config.globalProperties.$attributeArray = attributeArray
  app.provide("$attributeArray", attributeArray)

  //グリーン材料の場合の色設定
  const greenMaterialColor = "green"
  app.config.globalProperties.$greenMaterialColor = greenMaterialColor
  app.provide("$greenMaterialColor", greenMaterialColor)
}
