import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import TaskListConfig from '../components/TaskList/TaskListConfig';
import TaskCommentsConfig from '../components/TaskComments/TaskCommentsConfig';
import TaskCompletionFormConfig from '../components/TaskCompletionForm/TaskCompletionFormConfig';
import TaskDetailsConfig from '../components/TaskDetails/TaskDetailsConfig';
import ProcessFormConfig from '../components/ProcessForm/ProcessFormConfig';
import SummaryCardConfig from '../components/SummaryCard/SummaryCardConfig';
import OvertimeGraphConfig from '../components/OvertimeGraph/OvertimeGraphConfig';
import AttachmentsConfig from '../components/Attachments/AttachmentsConfig';
import ProcessDefinitionConfig from '../components/ProcessDefinition/ProcessDefinitionConfig';
import ProcessListConfig from '../components/ProcessList/ProcessListConfig';

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
  {
    name: 'overtime-graph-config',
    Component: OvertimeGraphConfig,
    className: 'OvertimeGraphConfigElement',
  },
  {
    name: 'task-attachments-config',
    Component: AttachmentsConfig,
    className: 'AttachmentsConfigElement',
  },
  {
    name: 'process-definition-config',
    Component: ProcessDefinitionConfig,
    className: 'ProcessDefinitionConfigElement',
  },
  {
    name: 'process-list-config',
    Component: ProcessListConfig,
    className: 'ProcessListConfigElement',
  },
];

const elements = {};

configNames.forEach(({ name, Component, className }) => {
  elements[className] = class extends HTMLElement {
    constructor() {
      super();
      this.newConfig = {};
      this.container = null;
      this.reactRootRef = React.createRef();
    }

    get config() {
      const config = this.reactRootRef.current ? this.reactRootRef.current.state.config : {};

      Object.keys(config).forEach(key => {
        config[key] = typeof config[key] === 'string' ? config[key] : JSON.stringify(config[key]);
      });
      return config;
    }

    set config(value) {
      this.newConfig = value;
      this.render();
    }

    connectedCallback() {
      this.container = document.createElement('div');
      this.appendChild(this.container);

      this.render();
    }

    render() {
      const locale = this.getAttribute('locale') || 'en';

      i18next.changeLanguage(locale);
      ReactDOM.render(
        <Component
          ref={this.reactRootRef}
          config={Object.keys(this.newConfig) ? this.newConfig : this.config}
        />,
        this.container
      );
    }
  };

  customElements.get(name) || customElements.define(name, elements[className]);
});

export default elements;
