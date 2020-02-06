import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskListConfig from 'components/TaskList/TaskListConfig';
import TaskCommentsConfig from 'components/TaskComments/TaskCommentsConfig';
import TaskCompletionFormConfig from 'components/TaskCompletionForm/TaskCompletionFormConfig';
import TaskDetailsConfig from 'components/TaskDetails/TaskDetailsConfig';
import ProcessFormConfig from 'components/ProcessForm/ProcessFormConfig';
import SummaryCardConfig from 'components/SummaryCard/SummaryCardConfig';

const configNames = [
  {
    name: 'task-list-config',
    Component: TaskListConfig,
    className: 'TaskListConfigElement',
  },
  {
    name: 'task-comments-config',
    Component: TaskCommentsConfig,
    className: 'TaskCommentsConfigElement',
  },
  {
    name: 'task-completion-form-config',
    Component: TaskCompletionFormConfig,
    className: 'TaskCompletionFormConfigElement',
  },
  {
    name: 'task-details-config',
    Component: TaskDetailsConfig,
    className: 'TaskDetailsConfigElement',
  },
  {
    name: 'process-form-config',
    Component: ProcessFormConfig,
    className: 'ProcessFormConfigElement',
  },
  {
    name: 'summary-card-config',
    Component: SummaryCardConfig,
    className: 'SummaryCardConfigElement',
  },
];

const elements = {};

configNames.forEach(({ name, Component, className }) => {
  elements[className] = class extends HTMLElement {
    connectedCallback() {
      const mountPoint = document.createElement('div');
      this.appendChild(mountPoint);

      const locale = this.getAttribute('locale') || 'en';
      i18next.changeLanguage(locale);

      const pageCode = this.getAttribute('page-code');
      const frameId = this.getAttribute('frame-id');
      const widgetCode = this.getAttribute('widget-code');

      const reactRoot = React.createElement(Component, { pageCode, frameId, widgetCode });
      ReactDOM.render(reactRoot, mountPoint);
    }
  };

  customElements.define(name, elements[className]);
});

export default elements;
