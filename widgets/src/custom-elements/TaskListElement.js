import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskList from 'components/TaskList/TaskListContainer';

class TaskListElement extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    const locale = this.getAttribute('locale') || 'en';
    i18next.changeLanguage(locale);

    const customEventPrefix = 'task.list.';

    const onError = error => {
      const customEvent = new CustomEvent(`${customEventPrefix}error`, {
        detail: {
          error,
        },
      });
      this.dispatchEvent(customEvent);
    };

    const pageCode = this.getAttribute('page-code');
    const frameId = this.getAttribute('frame-id');
    const serviceUrl = this.getAttribute('service-url');

    const reactRoot = React.createElement(
      TaskList,
      { onError, pageCode, frameId, serviceUrl },
      null
    );
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.define('task-list', TaskListElement);
