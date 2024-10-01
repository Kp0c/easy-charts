import template from './alerts.html?raw';
import styles from './alerts.css?inline'
import { BaseComponent } from '../base-component.js';
import { alerts$ } from '../../services/alerts.service.js';

export class Alerts extends BaseComponent {
  constructor() {
    super(template, styles);

    alerts$.subscribe((alert) => {
      console.error(alert);
      const alertElement = document.createElement('div');
      alertElement.textContent = alert.message;
      alertElement.classList.add('alert', `alert-${alert.type}`);
      this.shadowRoot.getElementById('alerts').appendChild(alertElement);

      const timeoutId = setTimeout(() => {
        alertElement.parentNode.removeChild(alertElement);
      }, 5000);

      this.destroyedSignal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
    }, {
      signal: this.destroyedSignal
    });

  }

}

