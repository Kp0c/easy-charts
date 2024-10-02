export class FilesHelper {
  /**
   * Checks if the string is JSON
   *
   * @param {string} str
   * @returns {boolean}
   */
  static isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Checks if the string is CSV
   *
   * @param {string} str
   * @returns {boolean}
   */
  static isCsv(str) {
    const delimiter = ',';

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

  /**
   * Parse CSV string to objects array
   * @param {string} string csv string
   * @returns {object[]}
   */
  static parseCsv(string) {
    const lines = string.split(/\r\n|\n|\r/);

    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) {
        continue;
      }

      const obj = {};
      const currentLine = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        let value = currentLine[j];

        if (!isNaN(value) && value.trim() !== '') {
          value = Number(value);
        }

        obj[headers[j]] = value;
      }

      result.push(obj);
    }

    return result;
  }
}
