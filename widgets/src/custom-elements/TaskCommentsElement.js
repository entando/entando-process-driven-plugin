import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskCommentsWrapper from 'components/TaskComments/TaskCommentsWrapper';
import { createWidgetEvent } from 'custom-elements/customEventsUtils';

const CUSTOM_EVENT_PREFIX = 'task.comments';
const ON_CLICK_ADD_COMMENT = `${CUSTOM_EVENT_PREFIX}.onClickAddComment`;
const ON_CLICK_REMOVE_COMMENT = `${CUSTOM_EVENT_PREFIX}.onClickRemoveComment`;
const ON_ERROR = `${CUSTOM_EVENT_PREFIX}.onError`;

class TaskCommentsElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.onClickAddComment = createWidgetEvent(ON_CLICK_ADD_COMMENT);
    this.onClickRemoveComment = createWidgetEvent(ON_CLICK_REMOVE_COMMENT);
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
      TaskCommentsWrapper,
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
    ReactDOM.render(reactRoot, mountPoint);
  }
}

customElements.define('task-comments', TaskCommentsElement);

export default TaskCommentsElement;
