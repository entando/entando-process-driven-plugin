# The widgets of Entando Process Driven Plugin

[![Build Status](https://jenkins.entandocloud.com/buildStatus/icon?job=pda-widgets-master)](https://jenkins.entandocloud.com/job/pda-widgets-master/)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3333](http://localhost:3333) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint`

Runs Eslint to the root folder and fix all the issues that can be handled automatically.

## Linter

This project is extending the [Airbnb Style Guide](https://github.com/airbnb/javascript) eslint rules, and applying custom rules (see package.json) to improve code quality.

## Folder structure

- ./src
  - ./assets `--> place to store assets like images, fonts, custom icons, etc.`
  - ./api `--> api calls, grouped by feature: the structure should mimic the api call itself`
  - ./components
    - ./\_\_tests\_\_ `sample test folder`
      - App.test.js `--> this way test files are closer to other ones, but in a separate folder in order to keep the folder structure cleaner`
    - ./common `--> folder containing common components`
      - CommonComponent.js
    - ./App `--> example of component that could have container`
      - App.css
      - App.js `--> keep the same name as component folder so we can find it easily when doing a file search`
      - AppContainer.js `--> container for the App component, adds state`
  - ./state `--> application state (e.g. redux), if any`
    - ./sample-feature `--> grouping by feature`
      - sample-feature.actions.js
      - sample-feature.reducer.js
      - sample-feature.selectors.js
      - sample-feature.types.js
    - store.js `--> configure redux store`
  - index.js `--> entry point`

## Running locally

This project will be needing these instances:

1. **PDA instance** located at the root of this project. (See https://github.com/entando/entando-process-driven-plugin).
2. **An Entando App instance** - we recommend to use [entando-de-app](https://github.com/entando/entando-de-app) for instance with Keycloak-ready authentication or, otherwise, [entando-pam-app](https://github.com/entando/entando-pam-app) for Entando built-in authentication.
3. **An Entando App Builder instance** *(optional)* - for setting up page models, widget instance within Entando app environment (optional because you can use Entando App's admin console).
4. **Keycloak Docker instance** *(optional)* - should you decide to integrate your app with Keycloak (not recommended for widget component development phase).

Basically, the current widgets consume APIs from two different sources, the PDA instance and Entando app instance.

To set up for un-mocked local run:

1. Create a widget in Entando admin console or App Builder with the following info:

```
{
    "code": "pda_widgets_task_details",
    "titles": {
        "en": "PDA Widgets - Task Details",
        "it": "PDA Widgets - Task Details IT"
    },
    "group": "administrators",
    "customUi": "<div></div>",
    "config": {}
}
```

2. Create a page using App builder control panel (remember the page code, it will be needed) or using POSTMAN (note that authorization token is needed) - POST request to `http://localhost:8090/entando-pam-app/api/pages` (where `http://localhost:8090/entando-pam-app` is your APP BUILDER host) with a page details in body (example below). Go to app builder and publish the page. Example of the body (`code` is the pageCode that will be needed later):

```
{
    "code": "phase_1_widgets",
    "displayedInMenu": true,
    "pageModel": "PAM-widgets",
    "charset": "utf-8",
    "contentType": "text/html",
    "parentCode": "homepage",
    "titles": {
        "en": "Phase 1 widgets EN",
        "it": "Phase 1 widgets IT"
    },

    "ownerGroup": "administrators"
}
```

3. Configure the page and drag&drop the newly created widget (previous steps) to any slot you like. Each slot has a frameId (starting from zero).

4. Now you should have page code, widget code and, frameId in which the widget was placed. For sanity check you can send a request using POSTMAN: GET `http://localhost:8090/entando-pam-app/api/pages/{{pageCode}}/widgets/` (where `http://localhost:8090/entando-pam-app` is your APP BUILDER host and `{{pageCode}}` is the code of the page you have created). This should list an array of widgets in that page (the frameId is the zero-based position of your widget on the array).

5. Update `/widgets/src/mocks/app-builder/widgets.js` with pageCodes, frameIds, and widgetCodes that you have just created.

### API

1. Run `mvn clean install`
2. Start API in dev mode by running `mvn clean spring-boot:run -DPORT=8081 -Dspring-boot.run.profiles=dev`

### Front-end

1. Go to `/widgets` folder
2. Run `npm install`

#### With mocked data

1. Open `/widgets/src/.env` file
2. Set `REACT_APP_MOCKED_API=true`
3. Start server with `npm start`

#### With real data

You will need to have one instance of Entando app running, we recommend to use `entando-de-app` or `entando-pam-app`. For this, we'll try `entando-pam-app`:

1. Clone repository [entando-pam-app](https://github.com/entando/entando-pam-app)
2. Run it on port 8090 with `mvn clean package jetty:run -DskipDocker -Pjetty-local -Pderby -Djetty.reload=manual -Djetty.port=8090 -Dspring.profiles.active=swagger`

To run the Widget FE project:

1. Go back to your `entando-process-driven-plugin/widgets` folder
2. Make sure your `/widgets/.env` file has the right path for your PDA API (`REACT_APP_DOMAIN`) and the App-builder admin API (`REACT_APP_APP_BUILDER_DOMAIN`) and the `REACT_APP_MOCKED_API` is set to false
3. Run `npm start` and your application will be available on `http://localhost:3333/`

### General notes

- The PDA API is only currently accepting requests from http://localhost:3333. However, you can change this (the CORS origins domain) in [\<PDA project\>/src/main/resources/application.properties](https://github.com/entando/entando-process-driven-plugin/blob/master/src/main/resources/application.properties) in variable `pda.allowed-origins-dev`. This has been set to `http://localhost:3333` since this "storyboard" project uses the said domain.
- You can mock individually any API request on `makeRequest` by passing a `forceMock: true` prop to it. That way you can mock the required data from Entando admin console API that consumes a big amount of memory and work lighter only with PDA API.
