import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskCompletionForm from 'components/TaskCompletionForm/TaskCompletionFormContainer';
import { createWidgetEvent } from 'custom-elements/customEventsUtils';

const CUSTOM_EVENT_PREFIX = 'task.details';
const ON_SUBMIT_FORM = `${CUSTOM_EVENT_PREFIX}.onSubmitForm`;
const ON_ERROR = `${CUSTOM_EVENT_PREFIX}.onError`;

class TaskCompletionFormElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.onSubmitForm = createWidgetEvent(ON_SUBMIT_FORM);
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
      TaskCompletionForm,
      {
        onError: this.onError,
        onSubmitForm: this.onSubmitForm,
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

customElements.define('task-completion-form', TaskCompletionFormElement);

export default TaskCompletionFormElement;
