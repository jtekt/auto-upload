export type S3Settings = {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
};

export type PostgresSettings = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  table: string;
  ssl: boolean | "require" | "allow" | "prefer" | "verify-full";
};

type Field = {
  key: string;
  value: string;
};

export type HttpSettings = {
  url: string;
  field: string;
  fields: Field[];
  headers: Field[];
};

export type Settings = {
  path: string;

  moveProcessed: boolean;
  parser?: string;
  target: string;
  url: string;
  field: string;
  table: string;

  http: HttpSettings;
  postgres: PostgresSettings;
  s3: S3Settings;

  mode: "off" | "watch" | "cron";
  cron?: string;
};

export const defaultsettings: Settings = {
  path: "test",
  moveProcessed: false,
  parser: null,
  target: "s3",

  http: {
    url: "http://localhost",
    field: "csv",
    fields: [],
    headers: [],
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

  s3: {
    endPoint: "localhost",
    port: 9000,
    useSSL: true,
    accessKey: "",
    secretKey: "",
    bucket: "my-bucket",
  },

  mode: "off",
  cron: "0 0 * * *",

  // Legacy
  url: "http://localhost", // only if using HTTP POST
  field: "test", // only if posting as file
  table: "items",
};
