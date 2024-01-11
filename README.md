# ember-cli-deploy-adonis

This plugin is an ember-cli-deploy plugin that copies your application assets and index.html to your directory of choice.

Intended to be used with [AdonisJS](https://adonisjs.com/) but can be used where copying your project files to a directory is required.

## Installation

```
pnpm add -D ember-cli-deploy-adonis
```

## Usage

Add an adonis section to your deploy config ENV:

```javascript
// config/deploy.js
const ENV = {
  build: {},
  adonis: {
    destDir: "../server/public/web/",
    indexFileLocation: "../server/resources/views/ember-web-index.edge",
    filePattern: [
      "**/*.{js,css,png,gif,ico,jpg,webp,mp3,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,wasm,json}",
      "!**/ember-electron/*",
    ],
  },
};
```

In `ember-cli-build.js` update your fingerprinting options to include the `prepend` option:

```javascript
function isProduction() {
  return EmberApp.env() === "production";
}

function getPublicAssetsUrl() {
  if (isProduction()) {
    if (process.env.ADONIS_BUILD) return "/web/";
    return "https://cdn.ekto.tv/ekto-web/";
  }

  return "/";
}

const app = new EmberApp(defaults, {
  fingerprint: {
    prepend: getPublicAssetsUrl(),
  },
  // ... other options
});
```

If you're using embroider set your `publicAssetsUrl`

```javascript
// ... other options
packagerOptions: {
  publicAssetURL: getPublicAssetsUrl(),
  // ... other options
},
// ... other options
```

## AdonisJS

Add a wildcard route to your adonis application

```javascript
Route.get("*", "EmberWebController.index");
```

Create a controller to serve your index file

```javascript
// app/Controllers/Http/EmberWebController.js
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class EmberWebController {
  public async index({ view }: HttpContextContract) {
    return view.render('ember-web-index');
  }
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
