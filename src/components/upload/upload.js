import template from './upload.html?raw';
import styles from './upload.css?inline'
import { BaseComponent } from '../base-component.js';
import { read, utils } from 'xlsx';
import { showError } from '../../services/alerts.service.js';
import { FilesHelper } from '../../helpers/files.helper.js';

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

      if (FilesHelper.isJson(manualData)) {
        this.#submitData(JSON.parse(manualData));
      } else if (FilesHelper.isCsv(manualData)) {
        this.#submitData(FilesHelper.parseCsv(manualData));
      } else {
        showError('Unable to parse manual data');
      }

    }, {
      signal: this.destroyedSignal
    });

    // TODO: delete
    this.shadowRoot.getElementById('manual-data').value = `[
    {
        "Year": 2018,
        "Diplomatic Missions": 90,
        "International Agreements": 120,
        "Foreign Visits by Officials": 60,
        "Foreign Delegations to Ukraine": 50,
        "Trade Agreements Signed": 15
    },
    {
        "Year": 2019,
        "Diplomatic Missions": 95,
        "International Agreements": 125,
        "Foreign Visits by Officials": 75,
        "Foreign Delegations to Ukraine": 65,
        "Trade Agreements Signed": 20
    },
    {
        "Year": 2020,
        "Diplomatic Missions": 98,
        "International Agreements": 130,
        "Foreign Visits by Officials": 55,
        "Foreign Delegations to Ukraine": 45,
        "Trade Agreements Signed": 22
    },
    {
        "Year": 2021,
        "Diplomatic Missions": 100,
        "International Agreements": 140,
        "Foreign Visits by Officials": 40,
        "Foreign Delegations to Ukraine": 30,
        "Trade Agreements Signed": 25
    },
    {
        "Year": 2022,
        "Diplomatic Missions": 105,
        "International Agreements": 145,
        "Foreign Visits by Officials": 35,
        "Foreign Delegations to Ukraine": 20,
        "Trade Agreements Signed": 30
    }
]`;
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

      if (FilesHelper.isJson(data)) {
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

      if (FilesHelper.isCsv(data)) {
        this.#submitData(FilesHelper.parseCsv(data));
      } else {
        showError('Unable to parse CSV');
      }
    };

    reader.readAsText(file);
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
    this.dispatchEvent(new CustomEvent('data', {
      detail: data
    }));
  }
}

