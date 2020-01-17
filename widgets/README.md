# The widgets of Entando Process Driven Plugin

## Running locally

The widgets consumes APIs from two different sources, the PDA and APP-BUILDER. The APP-BUILDER API's doesn't allows cross domain requests, so we won't be able to ping it without run through the CORS policy with a [browser plugin](http://tiny.cc/0ysoiz).

To set up for un-mocked local run:

1. Create a widget using POSTMAN (note that authorization token is needed) - POST request to `http://localhost:8090/entando-pam-app/api/widgets` (where `http://localhost:8090/entando-pam-app` is your APP BUILDER host) with a widget details in body. E.g.:

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

1. Create a page using App builder control panel (remember the page code, it will be needed) or using POSTMAN (note that authorization token is needed) - POST request to `http://localhost:8090/entando-pam-app/api/pages` (where `http://localhost:8090/entando-pam-app` is your APP BUILDER host) with a page details in body (example below). Go to app builder and publish the page. Example of the body (`code` is the pageCode that will be needed later):

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

1. Configure the page and drag&drop the newly created widget (previous steps) to any slot you like. Each slot has a frameId (starting from zero).

1. Now you should have page code, widget code and, frameId in which the widget was placed. For sanity check you can snd a request using POSTMAN: GET `http://localhost:8090/entando-pam-app/api/pages/{{pageCode}}/widgets/` (where `http://localhost:8090/entando-pam-app` is your APP BUILDER host and `{{pageCode}}` is the code of the page you have created). This should list an array of widgets in that page (the frameId is the zero-based position of your widget on the array).

1. Update `/widgets/src/mocks/app-builder/widgets.js` with pageCodes, frameIds, and widgetCodes that you have just created.

1. Don't forget to start the services and turn on the browser CORS extension. You should be ready to go!

### API

1. Run `mvn clean install`
1. Start API in dev mode by running `mvn clean spring-boot:run -DPORT=8081 -Dspring-boot.run.profiles=dev`

### Front-end

1. Go to `/widgets` folder
1. Run `npm install`

#### With mocked data

1. Open `/widgets/src/.env` file
1. Set `REACT_APP_MOCKED_API=true`
1. Set `REACT_APP_MOCKED_COMPONENT` to appropriate widget for configuration loading. Refer to
   `mocks/app-builder/pages.js` for correct constant value (`TASK_LIST`, `TASK_DETAILS`, `COMPLETION_FORM`).
1. Start server with `npm start`

#### With real data

You will need to have one instance of Entando running, we are using `entando-pam-app`:

1. Clone repository [entando-pam-app](https://github.com/entando/entando-pam-app)
1. Run it on port 8090 with `mvn clean package jetty:run -DskipDocker -Pjetty-local -Pderby -Djetty.reload=manual -Djetty.port=8090 -Dspring.profiles.active=swagger`

To run the Widget FE project:

1. Go back to your `entando-process-driven-plugin/widgets` folder
1. Make sure your `/widgets/.env` file has the right path for your PDA API (`REACT_APP_DOMAIN`) and the App-builder admin API (`REACT_APP_APP_BUILDER_DOMAIN`) and the `REACT_APP_MOCKED_API` is set to false
1. Run `npm start` and your application will be available on `http://localhost:3333/`

### General notes

- The PDA API is only accepting requests from http://localhost:3333, so you can't change the port of this application if you want to run it with real data.
- The APP-BUILDER API doesn't allow cross-domain requests from any port right now, so the only way to ping it is using the above quoted plugin available on Chrome and Firefox.
- You can mock individually any API request on `makeRequest` by passing a `forceMock: true` prop to it. That way you can mock the required data from APP-BUILDER API that consumes a big amount of memory and work lighter only with PDA API.
