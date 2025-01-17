import template from './app.html?raw';
import styles from './app.css?inline'
import { BaseComponent } from '../base-component.js';
import { ChartData } from '../../models/chart-data..js';

export class App extends BaseComponent {
  #dataErrorsComponent = this.shadowRoot.getElementById('data-errors');
  #dataPreviewComponent = this.shadowRoot.getElementById('data-preview');
  #preview = this.shadowRoot.getElementById('preview');
  #generate = this.shadowRoot.getElementById('generate');
  #generateChart = this.shadowRoot.getElementById('generate-chart');
  #chartContainer = this.shadowRoot.getElementById('chart-container');
  #fixData = this.shadowRoot.getElementById('fix-data');
  #chart = this.shadowRoot.getElementById('chart');

  /**
   *
   * @type {ChartData}
   */
  #chartData = null;

  constructor() {
    super(template, styles);

    const uploadComponent = this.shadowRoot.getElementById('upload');
    uploadComponent.addEventListener('data', (event) => {
      this.#chartContainer.hidden = true;
      this.#generate.hidden = true;
      this.#fixData.hidden = true;

      const data = event.detail;

      this.#chartData = new ChartData(data);

      this.#setData();
    }, {
      signal: this.destroyedSignal
    });

    this.#generateChart.addEventListener('click', (event) => {
      const chart = event.target.dataset.chart;

      this.#chartContainer.hidden = false
      this.#chart.setup(this.#chartData, chart);
    }, {
      signal: this.destroyedSignal
    });

    this.#fixData.addEventListener('click', () => {
      this.#chartData.fixData();

      this.#setData();
    });
  }

  #setData() {
    this.#dataPreviewComponent.setData(this.#chartData);
    this.#dataErrorsComponent.setErrors(this.#chartData.errors);

    this.#preview.hidden = false;

    if (this.#chartData.errors.length) {
      this.#fixData.hidden = false;
    } else {
      this.#generate.hidden = false;
    }
  }
}
