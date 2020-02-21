import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import CssBadgeChip from 'components/common/CssBadgeChip';

class CssBadgeChipElement extends HTMLElement {
  constructor(props) {
    super(props);

    this.mountPoint = null;
  }

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);

    const locale = this.getAttribute('locale') || 'en';
    i18next.changeLanguage(locale);

    const label = this.getAttribute('badge-label');
    const value = this.getAttribute('badge-value');

    ReactDOM.render(React.createElement(CssBadgeChip, { label, value }, null), this.mountPoint);
  }
}

customElements.define('css-badge-chip', CssBadgeChipElement);

export default CssBadgeChipElement;
