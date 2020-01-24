export const createWidgetEvent = eventType => {
  return payload => {
    const widgetEvent = new CustomEvent(eventType, { payload });
    window.dispatchEvent(widgetEvent);
  };
};

export const addCustomEventListener = (eventType, eventHandler) => {
  window.addEventListener(eventType, eventHandler);
  return () => {
    window.removeEventListener(eventType, eventHandler);
  };
};
