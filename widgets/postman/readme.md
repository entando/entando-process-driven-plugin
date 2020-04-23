# POSTMAN setup for frontend development

This folder contains POSTMAN collection and environment variables for easy frontend development environment startup.

## Bootstraping

To quickly set up your widget configuration, please start Entando Core and Entando PDA servers and import the collection and environment variables into your Postman application. The default URLs for those are (updated if needed):

```
PDA_URL: "http://localhost:8081"
CORE_URL: "http://localhost:8090/entando-pam-app"
```

When that is done, press "Runner" at the top navigation bar which will open Collection Runner

![Where to find the Runner button](bootstrap-runner.png 'Runner button')

In the Collection Runner's folder selection, select the BOOTSTRAPING folder:

![Selecting BOOTSTRAPING folder](bootstrap-folder.png 'Selected folder')

Select the PDA+CORE environment:

![Selecting correct environment](bootstrap-env.png 'Selected environment')

On the right side there will the a list of all the needed requests in correct order with first one being SET VARIABLES (the rest of them might differ from the image depending on version):

![Selecting correct environment](bootstrap-requests.png 'Selected environment')

With all the requests selected press RUN on left side panel and it will create widgets, page templates, pages, it will add the widgets to the pages and publish the pages.

> NOTE: You can run all the requests individually as well.

## Requests

### CORE

Entando Core requests are under 'CORE - widgets (auto token fetch)' folder. Folder has pre-request script that fetches a token so user does not have to worry about local Entando Core authentication.

Inside Entando Core widget setup there are several "entities": widgets, pages, page templates, etc. With requests in the CORE folder you can create a widget, create page template (/pageModels), pages as well as add the widgets to the pages and publish those pages.

### Connections

There are two connections ready to be created - `kieStaging` and `lab` with requests inside `connections` folder. And using requests in `test & set` folder, user can test the created connection and set the `KIE_CONNECTION` variable, which is used in other requests. It's a fast way to switch between connections during development!

### Tasks

The rest of the collection focuses on different aspects of task APIs. Some of them have `example` folder which might not work depending on the image you are working on. But they are a great way to see how the API request's URL should look like.

Some requests set some variables that are used in other requests - this is done to speed up actions that are performed frequently.
