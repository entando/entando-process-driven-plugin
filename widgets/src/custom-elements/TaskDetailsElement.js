import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskDetails from 'components/TaskDetails/TaskDetailsContainer';
import {
  addCustomEventListener,
  createWidgetEvent,
  TD_ON_PRESS_PREVIOUS,
  TD_ON_PRESS_NEXT,
  TD_ON_ERROR,
  TL_ON_SELECT_TASK,
} from 'custom-elements/customEventsUtils';

const ATTRIBUTES = {
  id: 'id',
  locale: 'locale',
  pageCode: 'page-code',
  frameId: 'frame-id',
  serviceUrl: 'service-url',
};

class TaskDetailsElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.container = null;
    this.unsubscribeFromTaskListEvents = null;
    this.onPressPrevious = createWidgetEvent(TD_ON_PRESS_PREVIOUS);
    this.onPressNext = createWidgetEvent(TD_ON_PRESS_NEXT);
    this.onError = createWidgetEvent(TD_ON_ERROR);

    this.updateTaskId = this.updateTaskId.bind(this);
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

  updateTaskId(e) {
    const { detail } = e;
    this.setAttribute('id', detail.id.split('@')[0]);
  }

  render() {
    const locale = this.getAttribute(ATTRIBUTES.locale) || 'en';
    i18next.changeLanguage(locale);

    const pageCode = this.getAttribute(ATTRIBUTES.pageCode);
    const frameId = this.getAttribute(ATTRIBUTES.frameId);
    const serviceUrl = this.getAttribute(ATTRIBUTES.serviceUrl);
    const taskId = this.getAttribute(ATTRIBUTES.id);

    const reactRoot = React.createElement(
      TaskDetails,
      {
        onError: this.onError,
        onPressPrevious: this.onPressPrevious,
        onPressNext: this.onPressNext,
        pageCode,
        frameId,
        serviceUrl,
        taskId,
      },
      null
    );
    ReactDOM.render(reactRoot, this.container);
  }

  connectedCallback() {
    this.container = document.createElement('div');
    this.appendChild(this.container);

    this.unsubscribeFromTaskListEvents = addCustomEventListener(
      TL_ON_SELECT_TASK,
      this.updateTaskId
    );

    this.render();
  }

  disconnectedCallback() {
    if (this.unsubscribeFromTaskListEvents) {
      this.unsubscribeFromTaskListEvents();
    }
  }
}

customElements.define('task-details', TaskDetailsElement);

export default TaskDetailsElement;
