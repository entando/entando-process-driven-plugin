import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import ProcessForm from '../components/ProcessForm/ProcessFormContainer';
import {addCustomEventListener, createWidgetEvent, getKeycloakInstance, KEYCLOAK_EVENT_TYPE} from './customEventsUtils';

const CUSTOM_EVENT_PREFIX = 'processform';
const ON_SUBMIT_FORM = `${CUSTOM_EVENT_PREFIX}.onSubmitForm`;
const ON_ERROR = `${CUSTOM_EVENT_PREFIX}.onError`;

class ProcessFormElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.onSubmitForm = createWidgetEvent(ON_SUBMIT_FORM);
    this.onError = createWidgetEvent(ON_ERROR);
  }
    connectedCallback() {
        this.mountPoint = document.createElement('div')
        this.appendChild(this.mountPoint);
        this.keycloak = {...getKeycloakInstance(), initialized: true}
        this.unsubscribeFromKeycloakEvent = addCustomEventListener(KEYCLOAK_EVENT_TYPE, (e) => {
            if(e.detail.eventType==="onReady"){
                this.keycloak = {...getKeycloakInstance(), initialized: true}
                this.render()
            }
        })
    }

  render() {
    const locale = this.getAttribute('locale') || 'en';
    i18next.changeLanguage(locale);

    const pageCode = this.getAttribute('page-code');
    const frameId = this.getAttribute('frame-id');
    const serviceUrl = this.getAttribute('service-url');

    const reactRoot = React.createElement(
      ProcessForm,
      {
        onError: this.onError,
        onSubmitForm: this.onSubmitForm,
        pageCode,
        frameId,
        serviceUrl,
      },
      null
    );
    ReactDOM.render(reactRoot, this.mountPoint);
  }
}

customElements.get('process-form') || customElements.define('process-form', ProcessFormElement);

export default ProcessFormElement;
