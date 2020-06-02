import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import 'i18n';

// insert the custom elements to the scope
import 'custom-elements/GenericConfigElement';
import 'custom-elements/TaskListElement';
import 'custom-elements/TaskDetailsElement';
import 'custom-elements/TaskCompletionFormElement';
import 'custom-elements/TaskCommentsElement';
import 'custom-elements/SummaryCardElement';
import 'custom-elements/ProcessFormElement';
import 'custom-elements/ProcessDefinitionElement';
import 'custom-elements/UserAuthElement';
import 'custom-elements/OvertimeGraphElement';
import 'custom-elements/ConnectionsElement';
import 'custom-elements/AttachmentsElement';
import 'custom-elements/ProcessListElement';

// We only want to show the App demo in DEV mode.
if (process.env.REACT_APP_LOCAL === 'true') {
  // eslint-disable-next-line
  const App = require('App/App').default;
  i18next.changeLanguage('en');
  ReactDOM.render(<App />, document.getElementById('root'));
}
