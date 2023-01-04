import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskList from '../components/TaskList/TaskListContainer';

import {
  addCustomEventListener,
  createWidgetEvent,
  GE_ON_SELECT_TASK, getKeycloakInstance, KEYCLOAK_EVENT_TYPE,
  TL_ON_ERROR,
} from './customEventsUtils';

const ATTRIBUTES = {
  id: 'id',
  taskPos: 'task-pos',
  groups: 'groups',
  locale: 'locale',
  pageCode: 'page-code',
  frameId: 'frame-id',
  serviceUrl: 'service-url',
  activeTask: 'active-task',
};

class TaskListElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.container = null;

    this.onSelectTask = createWidgetEvent(GE_ON_SELECT_TASK);
    this.onError = createWidgetEvent(TL_ON_ERROR);

    this.updateTask = this.updateTask.bind(this);
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

  updateTask(e) {
    const { detail } = e;

    // order is important, all attributes' changes call this.render,
    // but only taskId change is listened in taskDetails
    this.setAttribute(ATTRIBUTES.activeTask, detail.id);
  }

  connectedCallback() {
    this.mountPoint = document.createElement('div')
    this.appendChild(this.mountPoint);

    this.unsubscribeFromOnSelectTaskEvent = addCustomEventListener(
        GE_ON_SELECT_TASK,
        this.updateTask
    );

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
    const activeTask = this.getAttribute(ATTRIBUTES.activeTask);

    const reactRoot = React.createElement(
      TaskList,
      {
        onError: this.onError,
        pageCode,
        frameId,
        serviceUrl,
        activeTask,
        onSelectTask: this.onSelectTask,
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

customElements.get('task-list') || customElements.define('task-list', TaskListElement);

export default TaskListElement;
