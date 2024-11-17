# Auto-upload

Auto-upload is an Electron application that watches a user-specified folder for new files and uploads them to a given URL via a HTTP POST requests.

Its UI is built using Vue and the Vuetify component library.

## Development

### Working with corporate proxy

Using npx cross-env as per the following example:

```bash
npx cross-env ELECTRON_GET_USE_PROXY=true GLOBAL_AGENT_HTTPS_PROXY=<proxy_url> npm i
```
