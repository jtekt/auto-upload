import YAML from "yaml"
import fs from "fs"

const configPath = "./config/config.yml"

export const loadConfig = () => {
  const file = fs.readFileSync(configPath, "utf8")
  return YAML.parse(file)
}

export const writeConfig = (config: any) => {
  const yml = YAML.stringify(config)
  fs.writeFileSync(configPath, yml)
}
