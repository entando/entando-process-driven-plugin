import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import UserAuth from '../components/UserAuth';
import { createWidgetEvent } from './customEventsUtils';

const CUSTOM_EVENT_PREFIX = 'userAuth';
const ON_ERROR = `${CUSTOM_EVENT_PREFIX}.onError`;

class UserAuthElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.onError = createWidgetEvent(ON_ERROR);
  }

  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    const locale = this.getAttribute('locale') || 'en';
    i18next.changeLanguage(locale);

    const props = { onError: this.onError };

    if (this.getAttribute('kc-auth-url')) {
      props.keycloakAuthUrl = this.getAttribute('kc-auth-url');
      props.keycloakRealm = this.getAttribute('kc-realm');
      props.keycloakClientId = this.getAttribute('kc-client-id');
    }

    const reactRoot = React.createElement(UserAuth, props, null);
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.get('user-auth') || customElements.define('user-auth', UserAuthElement);

export default UserAuthElement;
