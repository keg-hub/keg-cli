# Services
* Services are dynamically injected methods that execute a specific score of work
* They are stored in the cliStore, and can be accessed via a call to `cliStore.service.get('service')`
  * This allows them to be dynamically loaded, and decoupled from everything else
* The Keg-CLI no longer needs hard-coded services for tasks as they can now be loaded dynamically

## Tap Task Flow
* `searchForTask` method is called
* Looks for a linked tap
* If found, calls the **tapTaskService**
  * Pre-loads the tapContext data
  * This sets a tapContext to the cliContext cache
* Searches for a tap task
* returns the taskData with the found task

### tapTaskService
* Calls **locationsService** to build the locations for the tap
  * If no locations found, it returns the taskData
  * If locations are found then Calls the docker **envContextService**
    * Loads the envs for the taps docker context
* Stores the loaded locations and envs in a tapContext to the cliStore
  * Includes the tapRoot and tap name
* Returns the taskData object with the tap and context params updated to the tap name

### locationsService
* Part of `services-lib`
* Finds all the file paths to the a linked taps files on the host system
* Includes values, env, Dockerfile, docker-compose.yml files
  * More files will be included in the future
* Converts the paths to `KEG_*` prefixed envs

### envContextService
* Part of `docker-lib`
* Loads the docker context envs for a tap
* Stores the envs in a context in the cliStore