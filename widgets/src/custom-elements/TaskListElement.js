import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskList from 'components/TaskList/TaskListContainer';

import { createWidgetEvent, TL_ON_SELECT_TASK } from 'custom-elements/customEventsUtils';

class TaskListElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.onSelectTask = createWidgetEvent(TL_ON_SELECT_TASK);
    this.onError = createWidgetEvent(TL_ON_SELECT_TASK);
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
      TaskList,
      { onError: this.onError, pageCode, frameId, serviceUrl, onSelectTask: this.onSelectTask },
      null
    );
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.define('task-list', TaskListElement);

export default TaskListElement;
