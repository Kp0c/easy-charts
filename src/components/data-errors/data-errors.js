import template from './data-errors.html?raw';
import styles from './data-errors.css?inline'
import { BaseComponent } from '../base-component.js';

export class DataErrors extends BaseComponent {
  #alert = this.shadowRoot.getElementById('alert');

  constructor() {
    super(template, styles);
  }

  /**
   *
   * @param {string[]} errors
   */
  setErrors(errors) {
    this.#alert.hidden = true;
    this.#alert.innerHTML = '';

    if (errors.length) {
      this.#alert.hidden = false;
      this.#addError('You have following errors in your data. Please fix them to continue.');

      for (const error of errors) {
        this.#addError(error);
      }
    }
  }

  #addError(error) {
    const p = document.createElement('p');
    p.textContent = error;
    this.#alert.appendChild(p);
  }
}

