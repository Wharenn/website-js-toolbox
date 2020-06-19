# Website JS Toolbox

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

Set of javascript tools and behaviors to use atop classical back applications.

## Installation

```bash
npm install website-js-toolbox
```
```bash
yarn add cookie-consent-tools
```

## Usage

```javascript
// Import as a Module
import * as WebsiteJsToolbox from "website-js-toolbox";

const { 
    Logger,
    FlashMessages
} = WebsiteJsToolbox;


Logger.info('Hell yes, we are logging an info message!');
FlashMessages.success('This is a success');
```

Some components like FlashMessages requires the library css to be imported into your stylesheets:

```css
@import '../../node_modules/website-js-toolbox/dist/website-js-toolbox.min.css';
```

See the application and code located in `docs/demo` directory to have more information about how to use the components.

## Executing the Demo App

This library comes with a full demo of all components. 

Install `local-web-server` if you do not have it yet:
```bash
npm install -g local-web-server
```

Then, the demo can be initialized with:
```bash
npm run demo:install
npm run demo:start
```

The demo should be available at <http://127.0.0.1:8000/public/index.html>.

## Development 

Developping tools is pretty straighforward thanks to the demo.

1. Start watchers for the library:

```bash
npm run dev
````

2. Start watchers for the demo:
```bash
npm run demo:install
```

3. Start the demo:
```bash
npm run demo:start
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](./LICENSE.md)

## Project status

This project is a side project I created to handle user cookie consent on multiple websites I own. After looking to the existing projects on GitHub, I did not find one which was light, easy to use and detached from companies who where making GDPR compliance their business.

It is honestly the first open-source project I started on my own, and it was the opportunity for me to discover and implement all tools and processes which guarantee quality and support on this kind of project. 

Feel free to contribute and share ideas!
