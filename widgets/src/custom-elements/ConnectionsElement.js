import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import Connections from 'components/Connections/ConnectionsContainer';

class ConnectionsElement extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    const locale = this.getAttribute('locale') || 'en';
    i18next.changeLanguage(locale);

    const pageCode = this.getAttribute('page-code');
    const frameId = this.getAttribute('frame-id');
    const serviceUrl = this.getAttribute('service-url');

    const reactRoot = React.createElement(Connections, { pageCode, frameId, serviceUrl }, null);
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.define('connections', ConnectionsElement);

export default ConnectionsElement;
