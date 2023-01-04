import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import Connections from '../components/Connections/ConnectionsContainer';
import {addCustomEventListener, getKeycloakInstance, KEYCLOAK_EVENT_TYPE} from './customEventsUtils';

class ConnectionsElement extends HTMLElement {
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

    const reactRoot = React.createElement(Connections, { pageCode, frameId, serviceUrl }, null);
    ReactDOM.render(reactRoot, this.mountPoint);
  }
}

customElements.get('pda-connections') || customElements.define('pda-connections', ConnectionsElement);

export default ConnectionsElement;
