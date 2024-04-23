type Settings = {
  path: string
  moveProcessed: boolean
  parser?: string
  target: string
  url: string
  field: string
  table: string
}

export const defaultsettings: Settings = {
  path: "test",
  moveProcessed: false,
  parser: null,
  target: "http",
  url: "http://localhost", // only if using HTTP POST
  field: "test", // only if posting as file
  table: "items",
}
