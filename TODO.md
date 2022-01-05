# TODOs

**Taps**
  * Create a default init template for a tap - `create-react-tap`

**Install**
* Keg cli should be installed through `yarn global` || `npm global`
  * Should run `/scripts/setup/setup-<platform>`
    * Based on platform after install
    * Currently only supports bash
    * Need to add for windows `.bat` || Rewrite in `node`
  * Should run `scripts/setup/cliSetup.js`
    * Sets up cli on the local machine

### Issues
* `from` option is not overwriting KEG_IMAGE_FROM 
* docker compose restart task, not restarting
* Temp files not being removed
  * Injected docker-compose.yml config files are not being properly removed when the service is killed
* Pushed latest master image, did not pull down the most recent version
  * Have to delete the local version, and re-download the latest image from provider