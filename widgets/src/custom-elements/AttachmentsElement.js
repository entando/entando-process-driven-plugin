import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import Attachments from 'components/Attachments/AttachmentsContainer';
import { addCustomEventListener, GE_ON_SELECT_TASK } from 'custom-elements/customEventsUtils';

const ATTRIBUTES = {
  id: 'id',
  locale: 'locale',
  pageCode: 'page-code',
  frameId: 'frame-id',
  serviceUrl: 'service-url',
};

class AttachmentsElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.mountPoint = null;

    this.updateTaskId = this.updateTaskId.bind(this);
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!Object.values(ATTRIBUTES).includes(name)) {
      throw new Error(`Untracked changed attribute: ${name}`);
    }
    if (this.mountPoint && newValue !== oldValue) {
      this.render();
    }
  }

  updateTaskId(e) {
    const { detail } = e;
    this.setAttribute(ATTRIBUTES.id, detail.id);
  }

  render() {
    const locale = this.getAttribute(ATTRIBUTES.locale) || 'en';
    i18next.changeLanguage(locale);

    const pageCode = this.getAttribute(ATTRIBUTES.pageCode);
    const frameId = this.getAttribute(ATTRIBUTES.frameId);
    const serviceUrl = this.getAttribute(ATTRIBUTES.serviceUrl);
    const taskId = this.getAttribute(ATTRIBUTES.id);

    const reactRoot = React.createElement(
      Attachments,
      {
        pageCode,
        frameId,
        serviceUrl,
        taskId,
      },
      null
    );
    ReactDOM.render(reactRoot, this.mountPoint);
  }

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);

    this.unsubscribeFromOnSelectTask = addCustomEventListener(GE_ON_SELECT_TASK, this.updateTaskId);

    this.render();
  }

  disconnectedCallback() {
    if (this.unsubscribeFromOnSelectTask) {
      this.unsubscribeFromOnSelectTask();
    }
  }
}

customElements.define('task-attachments', AttachmentsElement);

export default AttachmentsElement;
