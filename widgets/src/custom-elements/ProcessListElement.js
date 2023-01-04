import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import ProcessList from '../components/ProcessList/ProcessListContainer';

import {
  addCustomEventListener,
  createWidgetEvent,
  getKeycloakInstance,
  KEYCLOAK_EVENT_TYPE,
  PL_ON_ERROR
} from './customEventsUtils';

const ATTRIBUTES = {
  id: 'id',
  locale: 'locale',
  pageCode: 'page-code',
  frameId: 'frame-id',
  serviceUrl: 'service-url',
  title: 'title',
};

class ProcessListElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.container = null;

    this.onError = createWidgetEvent(PL_ON_ERROR);
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!Object.values(ATTRIBUTES).includes(name)) {
      throw new Error(`Untracked changed attribute: ${name}`);
    }
    if (this.container && newValue !== oldValue) {
      this.render();
    }
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

    const pageCode = this.getAttribute(ATTRIBUTES.pageCode);
    const frameId = this.getAttribute(ATTRIBUTES.frameId);
    const serviceUrl = this.getAttribute(ATTRIBUTES.serviceUrl);
    const title = this.getAttribute(ATTRIBUTES.title);

    const reactRoot = React.createElement(
      ProcessList,
      {
        onError: this.onError,
        pageCode,
        frameId,
        serviceUrl,
        title,
      },
      null
    );
    ReactDOM.render(reactRoot, this.mountPoint);
  }

  disconnectedCallback() {
    if (this.unsubscribeFromOnSelectTaskEvent) {
      this.unsubscribeFromOnSelectTaskEvent();
    }
  }
}

customElements.get('process-list') || customElements.define('process-list', ProcessListElement);

export default ProcessListElement;
