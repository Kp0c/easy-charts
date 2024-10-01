import template from './upload.html?raw';
import styles from './upload.css?inline'
import { BaseComponent } from '../base-component.js';
import { read, utils } from 'xlsx';
import { showError } from '../../services/alerts.service.js';

export class Upload extends BaseComponent {
  constructor() {
    super(template, styles);

    const dragDropArea = this.shadowRoot.getElementById('drag-drop-area');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dragDropArea.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
      }, {
        signal: this.destroyedSignal
      });
    });

    dragDropArea.addEventListener('drop', (event) => {
      if (event.dataTransfer.files.length > 1) {
        showError('Please select only one file');
        event.stopPropagation();
        return;
      }

      const file = event.dataTransfer.files[0];
      this.#handleFile(file);

      // set the first file to file input to sync them
      const fileInput = this.shadowRoot.getElementById('file-upload');
      fileInput.files = event.dataTransfer.files;
    }, {
      signal: this.destroyedSignal
    });

    const fileInput = this.shadowRoot.getElementById('file-upload');
    fileInput.addEventListener('change', (event) => {
      if (event.dataTransfer.files.length > 1) {
        showError('Please select only one file');
        event.stopPropagation();
        return;
      }

      const file = event.target.files[0];
      this.#handleFile(file);
    }, {
      signal: this.destroyedSignal
    });

    const submitButton = this.shadowRoot.getElementById('submit');
    submitButton.addEventListener('click', () => {
      const manualData = this.shadowRoot.getElementById('manual-data').value;

      if (this.#isJson(manualData)) {
        this.#submitData(JSON.parse(manualData));
      } else if (this.#isCsv(manualData)) {
        this.#submitData(manualData);
      } else {
        showError('Unable to parse manual data');
      }

    }, {
      signal: this.destroyedSignal
    });
  }

  #handleFile(file) {
    const type = file.type;

    switch (type) {
      case 'application/json':
        this.#handleJson(file);
        break;
      case 'text/csv':
        this.#handleCsv(file);
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        this.#handleXslx(file);
        break;
      default:
        showError('Unsupported file type');
    }
  }

  #handleJson(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;

      if (this.#isJson(data)) {
        this.#submitData(JSON.parse(data));
      } else {
        showError('Unable to parse JSON');
      }
    };

    reader.readAsText(file);
  }

  #handleCsv(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;

      if (this.#isCsv(data)) {
        this.#submitData(this.#parseCsv(data));
      } else {
        showError('Unable to parse CSV');
      }
    };

    reader.readAsText(file);
  }

  #parseCsv(string) {
    //csv to json
    const lines = string.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    return result;
  }


  #handleXslx(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const objects = utils.sheet_to_json(worksheet);

      this.#submitData(objects);
    };

    reader.readAsArrayBuffer(file);
  }

  #submitData(data) {
    console.log(data);
  }

  #isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  #isCsv(str) {
    const delimiter = ',';

    // Split the text into lines
    const lines = str.split(/\r\n|\n|\r/);

    // If there's only one line, it's unlikely to be CSV
    if (lines.length < 2) {
      return false;
    }

    // Split the first line to get the number of columns
    const firstLineColumns = lines[0].split(delimiter).length;

    // Check each subsequent line to see if it has the same number of columns
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() !== "") {
        const columns = lines[i].split(delimiter).length;
        if (columns !== firstLineColumns) {
          return false; // Inconsistent number of columns
        }
      }
    }

    return true;
  }
}

