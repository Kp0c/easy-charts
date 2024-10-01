import template from './app.html?raw';
import styles from './app.css?inline'
import { BaseComponent } from '../base-component.js';

export class App extends BaseComponent {
  constructor() {
    super(template, styles);
  }
}
