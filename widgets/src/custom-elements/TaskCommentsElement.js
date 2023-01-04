import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskComments from '../components/TaskComments/TaskCommentsContainer';
import {
  createWidgetEvent,
  addCustomEventListener,
  GE_ON_SELECT_TASK, getKeycloakInstance, KEYCLOAK_EVENT_TYPE,
} from './customEventsUtils';

const CUSTOM_EVENT_PREFIX = 'task.comments';
const ON_CLICK_ADD_COMMENT = `${CUSTOM_EVENT_PREFIX}.onClickAddComment`;
const ON_CLICK_REMOVE_COMMENT = `${CUSTOM_EVENT_PREFIX}.onClickRemoveComment`;
const ON_ERROR = `${CUSTOM_EVENT_PREFIX}.onError`;

const ATTRIBUTES = {
  id: 'id',
  locale: 'locale',
  pageCode: 'page-code',
  frameId: 'frame-id',
  serviceUrl: 'service-url',
};

class TaskCommentsElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.mountPoint = null;
    this.onClickAddComment = createWidgetEvent(ON_CLICK_ADD_COMMENT);
    this.onClickRemoveComment = createWidgetEvent(ON_CLICK_REMOVE_COMMENT);
    this.onError = createWidgetEvent(ON_ERROR);

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

  connectedCallback() {
    this.mountPoint = document.createElement('div')
    this.appendChild(this.mountPoint);

    this.unsubscribeFromOnSelectTask = addCustomEventListener(GE_ON_SELECT_TASK, this.updateTaskId);

    this.keycloak = {...getKeycloakInstance(), initialized: true}
    this.unsubscribeFromKeycloakEvent = addCustomEventListener(KEYCLOAK_EVENT_TYPE, (e) => {
      if(e.detail.eventType==="onReady"){
        this.keycloak = {...getKeycloakInstance(), initialized: true}
        this.render()
      }
    })
  }

  render() {
    const locale = this.getAttribute(ATTRIBUTES.locale) || 'en';
    i18next.changeLanguage(locale);

    const pageCode = this.getAttribute(ATTRIBUTES.pageCode);
    const frameId = this.getAttribute(ATTRIBUTES.frameId);
    const serviceUrl = this.getAttribute(ATTRIBUTES.serviceUrl);
    const taskId = this.getAttribute(ATTRIBUTES.id);

    const reactRoot = React.createElement(
      TaskComments,
      {
        onError: this.onError,
        onClickAddComment: this.onClickAddComment,
        onClickRemoveComment: this.onClickRemoveComment,
        pageCode,
        frameId,
        serviceUrl,
        taskId,
      },
      null
    );
    ReactDOM.render(reactRoot, this.mountPoint);
  }

  disconnectedCallback() {
    if (this.unsubscribeFromOnSelectTask) {
      this.unsubscribeFromOnSelectTask();
    }
  }
}

customElements.get('task-comments') || customElements.define('task-comments', TaskCommentsElement);

export default TaskCommentsElement;
