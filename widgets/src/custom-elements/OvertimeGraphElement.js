import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import { createWidgetEvent } from 'custom-elements/customEventsUtils';
import OvertimeGraph from 'components/OvertimeGraph/OvertimeGraphContainer';

const CUSTOM_EVENT_PREFIX = 'overtimegraph';
const ON_ERROR = `${CUSTOM_EVENT_PREFIX}.onError`;

class OvertimeGraphElement extends HTMLElement {
  constructor(props) {
    super(props);
    this.onError = createWidgetEvent(ON_ERROR);
  }

  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    const locale = this.getAttribute('locale') || 'en';
    i18next.changeLanguage(locale);

    const pageCode = this.getAttribute('page-code');
    const frameId = this.getAttribute('frame-id');
    const serviceUrl = this.getAttribute('service-url');

    const reactRoot = React.createElement(
      OvertimeGraph,
      {
        onError: this.onError,
        pageCode,
        frameId,
        serviceUrl,
      },
      null
    );
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.define('overtime-graph', OvertimeGraphElement);

export default OvertimeGraphElement;
