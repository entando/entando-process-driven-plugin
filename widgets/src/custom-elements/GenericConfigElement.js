import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';

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
    constructor() {
      super();
      this.reactRootRef = React.createRef();
      this.mountPoint = null;
    }

    get config() {
      const { config } = this.reactRootRef.current && this.reactRootRef.current.state;
      if (config) {
        const normalizedConfig = {};
        Object.keys(config).forEach(key => {
          normalizedConfig[key] =
            typeof config[key] === 'string' ? config[key] : JSON.stringify(config[key]);
        });
        return normalizedConfig;
      }
      return {};
    }

    set config(value) {
      return this.reactRootRef.current.setState({ config: value });
    }

    connectedCallback() {
      this.mountPoint = document.createElement('div');

      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(this.mountPoint);

      const locale = this.getAttribute('locale') || 'en';
      i18next.changeLanguage(locale);

      this.render();

      retargetEvents(shadowRoot);
    }

    render() {
      ReactDOM.render(<Component ref={this.reactRootRef} config={this.config} />, this.mountPoint);
    }
  };

  customElements.define(name, elements[className]);
});

export default elements;
