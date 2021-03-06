const packages = [
  {
    "nameWithOwner": "keg-hub/foobar",
    "repository": {
      "name": "foobar"
    },
    "versions": {
      "nodes": [
        {
          "id": "MDE0OlBhY2thZ2VWZXJzaW9uMjA1NjU3OQ==",
          "version": "1.0.1"
        },
        {
          "id": "MDE0OlBhY2thZ2VWZXJzaW9uMjA1NjI5MQ==",
          "version": "bazbizz"
        }
      ]
    }
  },
  {
    "nameWithOwner": "keg-hub/tap",
    "repository": {
      "name": "tap-events-force"
    },
    "versions": {
      "nodes": [
        {
          "id": "MDE0OlBhY2thZ2VWZXJzaW9uMjA1NjU3OQ==",
          "version": "0.0.1"
        },
        {
          "id": "MDE0OlBhY2thZ2VWZXJzaW9uMjA1NjI5MQ==",
          "version": "docker-base-layer"
        }
      ]
    }
  },
  {
    "nameWithOwner": "keg-hub/keg-base",
    "repository": {
      "name": "keg-core"
    },
    "versions": {
      "nodes": [
        {
          "id": "MDE0OlBhY2thZ2VWZXJzaW9uMjA1NjY0Mw==",
          "version": "0.0.1"
        },
        {
          "id": "MDE0OlBhY2thZ2VWZXJzaW9uMjA1NjYzNg==",
          "version": "docker-base-layer"
        }
      ]
    }
  }
]

const getAllPackagesMock = () => {
  return [
    undefined,
    { data: { data: { user: { registryPackagesForQuery: { nodes: packages } } } } }
  ]
}


module.exports = {
  getAllPackagesMock
}