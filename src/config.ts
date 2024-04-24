export type PostgresSettings = {
  host: string
  port: number
  username: string
  password: string
  database: string
  table: string
  ssl: boolean | "require" | "allow" | "prefer" | "verify-full"
}

export type Field = {
  key: string
  value: string
}

export type HttpSettings = {
  url: string
  field: string
  fields: []
}

export type Settings = {
  path: string
  moveProcessed: boolean
  parser?: string
  target: string
  url: string
  field: string
  table: string

  http: HttpSettings
  postgres: PostgresSettings
}

export const defaultsettings: Settings = {
  path: "test",
  moveProcessed: false,
  parser: null,
  target: "http",

  // Legacy
  url: "http://localhost", // only if using HTTP POST
  field: "test", // only if posting as file
  table: "items",

  http: {
    url: "http://localhost",
    field: "csv",
    fields: [],
  },

  postgres: {
    host: "localhost",
    port: 5432,
    username: "username",
    password: "password",
    database: "myDb",
    table: "myTable",
    ssl: false,
  },
}
