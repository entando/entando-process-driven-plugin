This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

[![Build Status](https://jenkins.entandocloud.com/buildStatus/icon?job=pda-widgets-master)](https://jenkins.entandocloud.com/job/pda-widgets-master/)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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

The widgets consumes APIs from two different sources, the PDA and APP-BUILDER. The APP-BUILDER API's doesn't allows cross domain requests, so we won't be able to ping it without run through the CORS policy with a [browser plugin](http://tiny.cc/0ysoiz)

### API

1. Run `mvn clean install`
2. Start API in dev mode by running `mvn clean spring-boot:run -DPORT=8082 -Dspring-boot.run.profiles=dev`

### Front-end

1. Go to `/widgets` folder
2. Run `npm install`

#### With mocked data

1. Open `/widgets/src/.env` file
2. Set `REACT_APP_MOCKED_API=true`
3. start server with `npm start`

#### With real data

You will need to have one instance of Entando running, we are using `entando-pam-app`:

1. Clone repository [entando-pam-app](https://github.com/entando/entando-pam-app)
2. Run it on port 8090 with `mvn clean package jetty:run -DskipDocker -Pjetty-local -Pderby -Djetty.reload=manual -Djetty.port=8090 -Dspring.profiles.active=swagger`

To run the Widget FE project:

1. Go back to your `entando-process-driven-plugin/widgets` folder
2. Make sure your `/widgets/.env` file has the right path for your PDA API(`REACT_APP_DOMAIN`) and the App-builder admin API(`REACT_APP_APP_BUILDER_DOMAIN`) and the `REACT_APP_MOCKED_API` is set to false
3. To ping any endpoint on APP-BUILDER API, we need a valid `access_token`, in production it will be fetched automatically, but to run it locally, we need to first generate one manually via this API endpoint: `http://localhost:8090/entando-pam-app/api/oauth/token` passing this default `Basic Auth`
   username: appbuilder
   password: appbuilder_secret
4. Get the `access_token` from the response body and add it to the `/widgets/api/constants.js` file. We should automate this process later.
5. Run `npm start` and ur application will be available on `http://localhost:3333/`

### General notes

- The PDA API is only accepting requests from localhost:3333, so you can't change the port of this application if you want to run it with real data.
- The APP-BUILDER API doesn't allow cross-domain requests from any port right now, so the only way to ping it is using the above quoted plugin available on Chrome and Firefox.
- You can mock individually any API request on `makeRequest` by passing a `forceMock: true` prop to it. That way you can mock the required data from APP-BUILDER API that consumes a big amount of memory and work lighter only with PDA API.
