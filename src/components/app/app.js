import template from './app.html?raw';
import styles from './app.css?inline'
import { BaseComponent } from '../base-component.js';
import { ChartData } from '../../models/chart-data..js';

export class App extends BaseComponent {
  #dataErrorsComponent = this.shadowRoot.getElementById('data-errors');
  #dataPreviewComponent = this.shadowRoot.getElementById('data-preview');
  #preview = this.shadowRoot.getElementById('preview');

  constructor() {
    super(template, styles);

    const uploadComponent = this.shadowRoot.getElementById('upload');
    uploadComponent.addEventListener('data', (event) => {
      const data = event.detail;

      const chartData = new ChartData(data);

      this.#dataPreviewComponent.setData(chartData);
      this.#dataErrorsComponent.setErrors(chartData.errors);

      this.#preview.hidden = false;
    });
  }
}
