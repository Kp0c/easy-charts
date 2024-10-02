import { App } from './components/app/app.js';
import { Header } from "./components/header/header.js";
import { Alerts } from './components/alerts/alerts.js';
import { Upload } from './components/upload/upload.js';
import { DataPreview } from './components/data-preview/data-preview.js';
import { DataErrors } from './components/data-errors/data-errors.js';

window.customElements.define('ec-app', App);
window.customElements.define('ec-header', Header);
window.customElements.define('ec-upload', Upload);
window.customElements.define('ec-alerts', Alerts);
window.customElements.define('ec-data-preview', DataPreview);
window.customElements.define('ec-data-errors', DataErrors);
