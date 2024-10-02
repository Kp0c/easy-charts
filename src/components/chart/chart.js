import template from './chart.html?raw';
import styles from './chart.css?inline'
import { BaseComponent } from '../base-component.js';
import { showError } from '../../services/alerts.service.js';

export class Chart extends BaseComponent {
  #chart = this.shadowRoot.getElementById('chart');
  #xLabel = this.shadowRoot.getElementById('x-label');
  #yLabel = this.shadowRoot.getElementById('y-label');
  #exportChart = this.shadowRoot.getElementById('export-chart');
  #print = this.shadowRoot.getElementById('print');
  #ctx = this.#chart.getContext('2d');

  #theme = 'light';

  #x = null;
  #y = null;
  #chartType = 'bar';

  /**
   *
   * @type {ChartData}
   */
  #chartData = null;

  constructor() {
    super(template, styles);

    this.#theme = getComputedStyle(document.body).getPropertyValue('color-scheme');

    const observer = new MutationObserver(() => {
      this.#theme = getComputedStyle(document.body).getPropertyValue('color-scheme');
      this.#drawChart();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    this.destroyedSignal.addEventListener('abort', () => {
      observer.disconnect();
    });

    this.#exportChart.addEventListener('click', (event) => {
      const type = event.target.dataset.export;

      switch (type) {
        case 'png': {
          const link = document.createElement('a');
          link.download = 'chart.png';
          link.href = this.#chart.toDataURL('image/png');
          link.click();
          break;
        }
        case 'svg': {
          const dataURL = this.#chart.toDataURL('image/png');
          const backgroundColor = this.#theme === 'light' ? 'white' : 'black';
          const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${ this.#chart.width }" height="${ this.#chart.height }">
            <rect width="100%" height="100%" fill="${backgroundColor}" />
            <image href="${ dataURL }" width="${ this.#chart.width }" height="${ this.#chart.height }" />
        </svg>`;
          const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'chart.svg';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          break;
        }
        default:
          showError('Invalid export type');
      }
    }, {
      signal: this.destroySignal
    });

    this.#print.addEventListener('click', () => {
      window.print();
    }, {
      signal: this.destroySignal
    });
  }

  /**
   *
   * @param {ChartData} chartData
   * @param {'bar' | 'line' | 'pie'} chartType
   */
  setup(chartData, chartType) {
    this.#chartData = chartData;
    this.#chartType = chartType;

    this.#populateControls();

    this.#drawChart();
  }

  #drawChart() {
    // sort data by X key
    this.#chartData.chartData.sort((a, b) => a.data[this.#x] - b.data[this.#x]);

    switch (this.#chartType) {
      case 'bar':
        this.#drawBarChart();
        break;
      case 'line':
        this.#drawLineChart();
        break;
      case 'pie':
        this.#drawPieChart();
        break;
      default:
        showError('Invalid chart type')
    }
  }

  #drawBarChart() {
    const ctx = this.#ctx;
    const chartWidth = this.#chart.width;
    const chartHeight = this.#chart.height;
    const leftPadding = 30;
    const barWidth = (chartWidth - leftPadding) / this.#chartData.chartData.length;
    const topPadding = 20;
    const bottomPadding = 20;

    ctx.clearRect(0, 0, chartWidth, chartHeight);

    // Draw the bars
    const maxDataValue = Math.max(...this.#chartData.chartData.map(d => d.data[this.#y]));
    this.#chartData.chartData.forEach((item, index) => {
      if (item.isValid) {
        const dataValue = item.data[this.#y];
        const barHeight = (dataValue / maxDataValue) * (chartHeight - topPadding - bottomPadding);

        const xPos = leftPadding + index * barWidth;
        const yPos = chartHeight - barHeight - bottomPadding;

        ctx.fillStyle = this.#theme === 'light' ? 'blue' : 'white';
        ctx.fillRect(xPos, yPos, barWidth - 2, barHeight);

        // Draw x-axis labels
        ctx.fillStyle = this.#theme === 'light' ? 'white' : 'black';
        ctx.textAlign = 'center';
        ctx.fillText(item.data[this.#x], xPos + barWidth / 2, chartHeight - 5 - bottomPadding);

        // Draw y-axis values on top of each bar
        ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
        ctx.textAlign = 'center';
        ctx.fillText(dataValue, xPos + barWidth / 2, yPos - 5);
      }
    });

    // draw Y label
    ctx.save();
    ctx.translate(20, topPadding);
    ctx.rotate(-Math.PI / 2);

    console.log(this.#theme);
    ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
    ctx.textAlign = 'right';
    ctx.fillText(this.#y, 0, 0);
    ctx.restore();

    // draw X label
    ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.#x, chartWidth / 2, chartHeight - 5);
  }

  #drawLineChart() {
    const ctx = this.#ctx;
    const chartWidth = this.#chart.width;
    const chartHeight = this.#chart.height;
    const leftPadding = 30;
    const topPadding = 20;
    const bottomPadding = 20;

    ctx.clearRect(0, 0, chartWidth, chartHeight);

    // Prepare data points
    const maxDataValue = Math.max(...this.#chartData.chartData.map(d => d.data[this.#y]));
    const points = this.#chartData.chartData
      .map((item, index) => {
        if (item.isValid) {
          const dataValue = item.data[this.#y];
          const xPos = leftPadding + (index * (chartWidth - leftPadding)) / this.#chartData.chartData.length;
          const yPos = chartHeight - ((dataValue / maxDataValue) * (chartHeight - topPadding - bottomPadding)) - bottomPadding;
          return { x: xPos, y: yPos, value: dataValue }; // Store the data value here
        }
        return null;
      })
      .filter(point => point !== null);

    // Draw lines between points
    ctx.strokeStyle = this.#theme === 'light' ? 'blue' : 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = this.#theme === 'light' ? 'blue' : 'white';
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2); // Draw circle for each data point
      ctx.fill();
    });

    // Draw x-axis labels
    ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
    ctx.textAlign = 'center';
    this.#chartData.chartData.forEach((item, index) => {
      if (item.isValid) {
        const xPos = leftPadding + (index * (chartWidth - leftPadding)) / this.#chartData.chartData.length;
        ctx.fillText(item.data[this.#x], xPos, chartHeight - 5 - bottomPadding);
      }
    });

    // Draw y-axis values on top of each data point
    ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
    ctx.textAlign = 'center';
    points.forEach(point => {
      ctx.fillText(point.value, point.x, point.y - 5); // Use the stored value directly
    });

    // Draw Y label
    ctx.save();
    ctx.translate(20, topPadding);
    ctx.rotate(-Math.PI / 2);

    ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
    ctx.textAlign = 'right';
    ctx.fillText(this.#y, 0, 0);
    ctx.restore();

    // Draw X label
    ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.#x, chartWidth / 2, chartHeight - 5);
  }

  #drawPieChart() {
    const ctx = this.#ctx;
    const chartWidth = this.#chart.width;
    const chartHeight = this.#chart.height;
    const centerX = chartWidth / 2 - 20;
    const centerY = chartHeight / 2;
    const padding = 30; // Increased padding around the pie chart
    const radius = Math.min(chartWidth, chartHeight) / 2 - padding; // Padding from edges
    const topPadding = 20; // Ensure topPadding is defined

    ctx.clearRect(0, 0, chartWidth, chartHeight);

    // Calculate total value for percentage
    const totalValue = this.#chartData.chartData.reduce((sum, item) => {
      return item.isValid ? sum + item.data[this.#y] : sum;
    }, 0);

    let startAngle = 0;
    const legendYStart = 20; // Start Y position for legend

    // Draw each slice and prepare legend
    this.#chartData.chartData.forEach((item, index) => {
      if (item.isValid) {
        const dataValue = item.data[this.#y];
        const sliceAngle = (dataValue / totalValue) * 2 * Math.PI; // Calculate the angle for this slice

        ctx.beginPath();
        ctx.moveTo(centerX, centerY); // Move to the center
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle); // Draw the slice
        ctx.closePath();

        // Fill slice with a color
        ctx.fillStyle = this.#getColor(item); // Assuming you have a method to get colors
        ctx.fill();

        // Draw percentage label closer to the edge of the slice
        const midAngle = startAngle + sliceAngle / 2;
        const labelX = centerX + (radius - 25) * Math.cos(midAngle); // Offset label closer to the edge
        const labelY = centerY + (radius - 20) * Math.sin(midAngle);
        const percentage = ((dataValue / totalValue) * 100).toFixed(2); // Calculate percentage
        ctx.fillStyle = 'white'; // White text for better visibility
        ctx.fillText(`${percentage}%`, labelX, labelY); // Draw the percentage label

        // Draw legend
        ctx.fillStyle = this.#getColor(item); // Use the same color for the legend
        ctx.fillRect(chartWidth - 100, legendYStart + index * 20, 15, 15); // Legend box
        ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
        ctx.fillText(item.data[this.#x], chartWidth - 80, legendYStart + index * 20 + 12);

        startAngle += sliceAngle;
      }
    });

    ctx.save();
    ctx.translate(20, topPadding);
    ctx.rotate(-Math.PI / 2);

    ctx.fillStyle = this.#theme === 'light' ? 'black' : 'white';
    ctx.textAlign = 'right';
    ctx.fillText(this.#y, 0, 0);
    ctx.restore();
  }

// Example method to return a color based on item
  #getColor(item) {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return colors[this.#chartData.chartData.indexOf(item) % colors.length]; // Cycle through colors
  }



  #populateControls() {
    this.#xLabel.innerHTML = '';
    this.#yLabel.innerHTML = '';

    this.#chartData.numericKeys.forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.text = key;

      const optionY = option.cloneNode(true);
      this.#xLabel.appendChild(option);
      this.#yLabel.appendChild(optionY);
    });

    this.#xLabel.value = this.#chartData.numericKeys[0];
    this.#yLabel.value = this.#chartData.numericKeys[1];

    this.#x = this.#chartData.numericKeys[0];
    this.#y = this.#chartData.numericKeys[1];

    this.#xLabel.addEventListener('change', () => {
      this.#x = this.#xLabel.value;
      this.#drawChart();
    });

    this.#yLabel.addEventListener('change', () => {
      this.#y = this.#yLabel.value;
      this.#drawChart();
    });
  }
}

