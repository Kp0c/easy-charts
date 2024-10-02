/**
 * Chart Data Item
 * @typedef {Object} ChartDataItem
 * @property {object} [data]
 * @property {boolean} [isValid]
 */
import { showError } from '../services/alerts.service.js';

export class ChartData {
  /**
   * Keys that contain the number
   * @type {string[]}
   */
  numericKeys = [];

  /**
   * Keys that contain the string
   * @type {string[]}
   */
  stringKeys = [];

  /**
   * Errors
   * @type {string[]}
   */
  errors = [];

  /**
   * Chart data
   * @type {ChartDataItem[]}
   */
  chartData = [];

  /**
   *
   * @param {object[]} data raw key-value pairs
   */
  constructor(data) {
    this.#convertRawDataToChartData(data);
  }

  fixData() {
    this.errors = [];
    this.chartData = this.chartData.filter(item => item.isValid);
  }

  /**
   * Converts raw data to chart data
   * @param {object[]} data raw key-value pairs
   */
  #convertRawDataToChartData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      showError('Invalid data: Data should be a non-empty array');
    }

    const keys = Object.keys(data[0]);

    // gather all the keys of the first object as an example
    for (const key of keys) {
      if (typeof data[0][key] === 'number') {
        this.numericKeys.push(key);
      } else if (typeof data[0][key] === 'string') {
        this.stringKeys.push(key);
      }
    }

    this.chartData = [];

    for (let i = 0; i < data.length; i++) {
      const item = { data: data[i], isValid: true };

      for (const key of keys) {
        if (data[i].hasOwnProperty(key) && typeof data[i][key] !== typeof data[0][key]) {
          this.errors.push(`Data type mismatch for key '${key}' at index ${i}. Expected ${typeof data[0][key]}, got ${typeof data[i][key]} "${data[i][key]}"`);
          item.isValid = false;
        }
      }

      this.chartData.push(item);
    }
  }
}
