export const createWidgetEvent = eventType => {
  return payload => {
    const widgetEvent = new CustomEvent(eventType, { detail: payload });
    window.dispatchEvent(widgetEvent);
  };
};

export const addCustomEventListener = (eventType, eventHandler) => {
  window.addEventListener(eventType, eventHandler);
  return () => {
    window.removeEventListener(eventType, eventHandler);
  };
};

export const subscribeToWidgetEvents = (widgetEvents, eventHandler) => {
  return widgetEvents.map(eventType => {
    return addCustomEventListener(eventType, eventHandler);
  });
};

export const getKeycloakInstance = () =>
    (window && window.entando && window.entando.keycloak && {...window.entando.keycloak, initialized: true}) || {
      initialized: false,
    }

const TASK_DETAILS_PREFIX = 'task.details';
export const TD_ON_PRESS_PREVIOUS = `${TASK_DETAILS_PREFIX}.onPressPrevious`;
export const TD_ON_PRESS_NEXT = `${TASK_DETAILS_PREFIX}.onPressNext`;
export const TD_ON_ERROR = `${TASK_DETAILS_PREFIX}.onError`;

const TASK_LIST_PREFIX = 'task.list';
export const TL_ON_ERROR = `${TASK_LIST_PREFIX}.onError`;

const TASK_FORM_PREFIX = 'task.form';
export const TF_ON_SUBMIT_FORM = `${TASK_FORM_PREFIX}.onSubmitForm`;
export const TF_ON_ERROR = `${TASK_FORM_PREFIX}.onError`;

const GENERIC_EVENTS_PREFIX = 'widgets';
export const GE_ON_SELECT_TASK = `${GENERIC_EVENTS_PREFIX}.onSelectTask`;

const PROCESS_LIST_PREFIX = 'process.list';
export const PL_ON_ERROR = `${PROCESS_LIST_PREFIX}.onError`;

export const KEYCLOAK_EVENT_TYPE = 'keycloak';
