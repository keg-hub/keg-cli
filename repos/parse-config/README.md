# Parse-Config
* Helper package for parsing / loading config files with `.yml` and `.env` extensions
* Includes simple template system for dynamically setting config values

## Install
* With `yarn` =>  `yarn add @keg-hub/parse-config`
* With `npm` => `npm install @keg-hub/parse-config`

## Usage
* Require the package in your code as needed
```js
  // Import the entire package
  const PConf = require('@keg-hub/parse-config')
  const ymlObj = await PConf.yml.load(...)
  const envObj = await PConf.env.load(...)
  const templateStr = await PConf.template.fill(...)

  // Import just sections from the package
  const { yml, env, template } = require('@keg-hub/parse-config')
  const ymlObj = await yml.load(...)
  const envObj = await env.load(...)
  const templateStr = await template.fill(...)

  // Import just specific methods from the package
  const { loadYml, loadEnv, fillTemplate } = require('@keg-hub/parse-config')
  const ymlObj = await loadYml(...)
  const envObj = await loadEnv(...)
  const templateStr = await fillTemplate(...)
  
  // Load configs based on environment from both .env and .yaml files
  const { loadConfigs } = require('@keg-hub/parse-config')
  const configObj = await loadConfigs(...)

```

## Loading Config Files
* The `loadConfigs` method can be used to automatically load config files
* The config file names are generated from the passed in options
* All found files are loaded, and merged together as a single config object
### Priority
* Priority is based on the **name** and **location** of the loaded file 
  * The `.env`, then `defaults.env` files are always loaded first when `noEnv` === `false`, regardless of their location
  * Files loaded last, override previously loaded config values
  * For `values` files, both `yml` and `yaml` extentions are searched for
  * Because `yaml` is technically the correct extension, it will override the `yml` counterpart 
**File Name**
* Given the following config options
  * `env` === `staging`
  * `ymlName` === `values`
  * `name` === `app`
  * `noEnv` === `false`
  * `noYml` === `false`
  * `ymlPath` === `env`
* Files will be loaded in the following order, 
* First `.yml` files, then `.yaml` files, and finally `.env` files. See below example
  * `.env` then `defaults.env` ==> Always comes first when `noEnv` === `false`
  * `values.yml` then `values.yaml`
  * `staging.yml` then `staging.yaml`
  * `app.yml` then `app.yaml`
  * `values_staging.yml` then `values_staging.yaml`
  * `values_app.yml` then `values_app.yaml`
  * `values_staging_app.yml` then `values_staging_app.yaml`
  * `values.staging.yml` then `values.staging.yaml`
  * `values.app.yml` then `values.app.yaml`
  * `values.staging.app.yml` then `values.staging.app.yaml`
  * `values-staging.yml` then `values-staging.yaml`
  * `values-app.yml` then `values-app.yaml`
  * `values-staging-app.yml` then `values-staging-app.yaml`
  * `.env.staging`
  * `.env.app`
  * `.env_app_staging`
  * `.env.app.staging`
  * `.env.app-staging`
  * `staging.env`
  * `app.env`
  * `app_staging.env`
  * `app.staging.env`
  * `app-staging.env`

**Locations**
* After the file names are generated, they are appended to the generated locations
* Some locations are predefined, but custom locations can also be passed via the `locations` array config option
  * Custom locations are **ALWAYS** checked after the default locations
  * This allows for any files loaded from the custom locations to override the defaults

### loadConfigs - Config Options
```js
  const { loadConfigs } = require('@keg-hub/parse-config')

  const configObj = await loadConfigs({
    // Environment prefix of the config files to be loaded ( i.e. `production.env` )
    env: `local`,
    // App prefix of the config files to be loaded ( i.e. `my-app.production.env` )
    name: ``,
    // Should errors be thrown when a file exists but can't be loaded
    error: true
    // Skip loading .env files
    noEnv: false,
    // Skip loading .yaml files
    noYml: false,
    // The reference name of the values files to be loaded ( i.e. `values.local.yml` )
    ymlName: `values`,
    // Object path to return from loaded yml files
    ymlPath: `env`,
    // Format type the config should be returned as ( object | string )
    format: `object`,
    // Run template replace on the loaded config files
    fill: true,
    // Template data to fill config file with ( Requires the `fill` options value is `true`  )
    data: {...},
    // RegEx patten when running template replace
    pattern: /{{([^}]*)}}/g
    // Extra file path and directories to search for config files
    locations: [...]
    // How found configs should be merged. Must be one of overwrite | join | unique.
    mergeStrategy: `overwrite`
  })
```