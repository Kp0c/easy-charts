import template from './data-preview.html?raw';
import styles from './data-preview.css?inline'
import { BaseComponent } from '../base-component.js';

export class DataPreview extends BaseComponent {
  #previewButton = this.shadowRoot.getElementById('preview');
  #dialog = this.shadowRoot.getElementById('dialog');
  #closePreview = this.shadowRoot.getElementById('close-preview');
  #content = this.shadowRoot.getElementById('content');
  #dataErrors = this.shadowRoot.getElementById('data-errors');

  constructor() {
    super(template, styles);

    this.#previewButton.addEventListener('click', () => {
      this.#dialog.showModal();
    }, {
      signal: this.destroyedSignal
    });

    this.#closePreview.addEventListener('click', () => {
      this.#dialog.close();
    }, {
      signal: this.destroyedSignal
    });

    this.#dialog.addEventListener('cancel', () => {
      this.#dialog.close();
    }, {
      signal: this.destroyedSignal
    });

    // close on backdrop click
    this.#dialog.addEventListener('click', (event) => {
      if (event.target === this.#dialog) {
        this.#dialog.close();
      }
    }, {
      signal: this.destroyedSignal
    });
  }

  /**
   *
   * @param {ChartData} data
   */
  setData(data) {
    this.#dataErrors.setErrors(data.errors);
    this.#setupTable(data);

    this.#previewButton.hidden = false;
  }

  /**
   *
   * @param {ChartData} data
   */
  #setupTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    const tr = document.createElement('tr');
    thead.appendChild(tr);

    const th = document.createElement('th');
    th.textContent = 'index';
    tr.appendChild(th);
    for (const key of Object.keys(data.chartData[0].data)) {
      const th = document.createElement('th');
      th.textContent = key;
      tr.appendChild(th);
    }

    for (let i = 0; i < data.chartData.length; i++) {
      const row = data.chartData[i];
      const tr = document.createElement('tr');
      tbody.appendChild(tr);

      if (!row.isValid) {
        tr.classList.add('invalid');
      }

      const td = document.createElement('td');
      td.textContent = i;
      tr.appendChild(td);
      for (const value of Object.values(row.data)) {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      }
    }

    this.#content.innerHTML = '';
    this.#content.appendChild(table);
  }
}

