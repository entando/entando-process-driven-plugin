import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import BadgeChip from 'components/common/BadgeChip';

const ATTRIBUTES = {
  locale: 'locale',
  styles: 'badge-styles',
  label: 'badge-label',
  value: 'badge-value',
  color: 'badge-color',
  bgColor: 'badge-bg-color',
};

class BadgeChipElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.mountPoint = null;
    this.reactRootRef = React.createRef();
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!Object.values(ATTRIBUTES).includes(name)) {
      throw new Error(`Untracked changed attribute: ${name}`);
    }
    if (this.mountPoint && newValue !== oldValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);

    this.render();
  }

  render() {
    const locale = this.getAttribute(ATTRIBUTES.locale) || 'en';
    i18next.changeLanguage(locale);

    const label = this.getAttribute(ATTRIBUTES.label);
    const value = this.getAttribute(ATTRIBUTES.value);
    const color = this.getAttribute(ATTRIBUTES.color);
    const bgColor = this.getAttribute(ATTRIBUTES.bgColor);
    const styles = this.getAttribute(ATTRIBUTES.styles);

    ReactDOM.render(
      React.createElement(
        BadgeChip,
        { ref: this.reactRootRef, label, value, color, bgColor, styles },
        null
      ),
      this.mountPoint
    );
  }
}

customElements.define('badge-chip', BadgeChipElement);

export default BadgeChipElement;
