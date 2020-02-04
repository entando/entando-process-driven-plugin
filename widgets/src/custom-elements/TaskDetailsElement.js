import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskDetails from 'components/TaskDetails/TaskDetailsContainer';
import { createWidgetEvent } from 'custom-elements/customEventsUtils';

const CUSTOM_EVENT_PREFIX = 'task.details';
const ON_PRESS_PREVIOUS = `${CUSTOM_EVENT_PREFIX}.onPressPrevious`;
const ON_PRESS_NEXT = `${CUSTOM_EVENT_PREFIX}.onPressNext`;
const ON_ERROR = `${CUSTOM_EVENT_PREFIX}.onError`;

class TaskDetailsElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.onPressPrevious = createWidgetEvent(ON_PRESS_PREVIOUS);
    this.onPressNext = createWidgetEvent(ON_PRESS_NEXT);
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
    const taskId = this.getAttribute('task-id');

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
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.define('task-details', TaskDetailsElement);

export default TaskDetailsElement;
