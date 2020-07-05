import Chart from 'chart.js';
// document.body.style.filter = 'invert(1)';
import {getDataListAndTitleFromTable, isValidYAxis, getBody} from '../util.js';

const modalContentHtml = `<div class="chardityModal" id="chardityModal">
  <div class="chardityModalContent">
    <h6 class="chardityTitle">
      Select appropriate columns to plot
    </h6>
    <form id="chardityForm">
      <div role="presentation" class="chardityInputsContainer">
        <label for="xAxis">X axis</label>
        <input id="xAxis" type="text" />
        <p id="chardityXAxisTitle" class="chardityXAxisTitle"></p>
        <label for="yAxis"> Y axis </label>
        <input id="yAxis" type="text" />
        <p id="chardityYAxisTitle" class="chardityYAxisTitle"></p>
      </div>
      <p id="chardityError" class="chardityError">Please give valid indexes. Its probably the field you selected is not plottable</p>
      <div role="presentation" class="chardityButtonsContainer">
        <button class="chardityCancelButton" id="chardityCancelButton">Cancel</button>
        <input class="charditySubmitButton" type="submit"></input>
      </div>
    </form>
  </div>
</div>`;

// manages the state of button, modal and chat
function VisualizeComponent(tableElement) {
  this.tableElement = tableElement;
  this.showModal = false;
  this.xAxisValue = '';
  this.yAxisValue = '';
  // this.xAxisInput = null;
  // this.yAxisInput = null;
  const tableRect = tableElement.getClientRects();
  // eslint-disable-next-line prefer-destructuring
  this.tableRect = tableRect[0];
  this.tableWidth = tableRect[0].width;
  this.tableHeight = (this.tableWidth * 11) / 16;
  this.modal = this.initModal();
  this.canvasContext = this.initializeCanvas();
  this.intializeButton();
  this.listenToMutation();
}

VisualizeComponent.prototype.intializeButton = function intializeButton() {
  const button = document.createElement('button');
  button.innerHTML = 'Visualize';
  button.classList.add('visualizeButton');
  button.style.position = 'absolute';
  button.style.top = `${this.tableRect.top}px`;
  button.style.left = `${this.tableRect.right + 30}px`;
  button.style.zIndex = 1000;
  getBody().appendChild(button);
  button.addEventListener('click', () => {
    this.showModalFn();
  });
  return button;
};

VisualizeComponent.prototype.getTableHeight = function getTableHeight() {
  const tableRect = this.tableElement.getClientRects();
  // const tableRect = tableRect[0];
  const tableWidth = tableRect[0].width;
  const tableHeight = (this.tableWidth * 11) / 16;
  return tableHeight;
};

VisualizeComponent.prototype.initializeCanvas = function initializeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  canvas.width = this.tableWidth;
  canvas.height = this.tableHeight;
  if (this.tableElement.parentNode) {
    this.tableElement.parentNode.insertBefore(
      canvas,
      this.tableElement.nextSibling
    );
  }
  return canvas;
};

VisualizeComponent.prototype.listenToMutation = function listenToMutation() {
  // listen to mutations of table position
  const mutationObserver = new MutationObserver((mutationRecort) => {});
  mutationObserver.observe(this.tableElement, {
    attributes: true,
  });
};

VisualizeComponent.prototype.initModal = function initModal() {
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = modalContentHtml;
  document.body.appendChild(modalDiv);

  const modal = document.getElementById('chardityModal');
  const xAxisInput = document.getElementById('xAxis');
  const yAxisInput = document.getElementById('yAxis');
  const chardityForm = document.getElementById('chardityForm');
  const formError = document.getElementById('chardityError');
  const cancelButton = document.getElementById('chardityCancelButton');
  const chardityXAxisTitle = document.getElementById('chardityXAxisTitle');
  const chardityYAxisTitle = document.getElementById('chardityYAxisTitle');

  const handleYInputChange = (event) => {
    const {data, title} = getDataListAndTitleFromTable(
      this.tableElement,
      event.target.value
    );

    if (title) {
      chardityYAxisTitle.innerHTML = title;
    } else {
      chardityYAxisTitle.innerHTML = 'invalid column index';
    }
  };

  const handleXInputChange = (event) => {
    const {data, title} = getDataListAndTitleFromTable(
      this.tableElement,
      event.target.value
    );

    if (title) {
      chardityXAxisTitle.innerHTML = title;
    } else {
      chardityXAxisTitle.innerHTML = 'invalid column index';
    }
  };

  const validateForm = (valueX, valueY) => {
    const {data} = getDataListAndTitleFromTable(this.tableElement, valueY);
    const {data: dataX} = getDataListAndTitleFromTable(
      this.tableElement,
      valueX
    );

    if (!data || !dataX) {
      return false;
    }

    if (!isValidYAxis(data)) {
      return false;
    }
    return true;
  };

  const showModal = () => {
    modal.style.display = 'block';
  };

  const hideModal = () => {
    modal.style.display = 'none';
  };

  const showError = () => {
    formError.style.display = 'block';
  };

  const hideError = () => {
    formError.style.display = 'none';
  };

  xAxisInput.addEventListener('change', handleXInputChange);
  yAxisInput.addEventListener('change', handleYInputChange);

  chardityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const valueY = yAxisInput.value;
    const valueX = xAxisInput.value;
    if (validateForm(valueX, valueY)) {
      hideError();
      this.yAxisValue = valueY;
      this.xAxisValue = valueX;
      this.render();
    } else {
      showError();
    }
  });

  cancelButton.addEventListener('click', () => {
    this.hideModalFn();
  });
  // this.xAxisInput/.addEventListener('');

  // const modalContent = document.createElement('div');
  // modalContent.classList.add('chardityModalContent');
  modal.showModal = showModal;
  modal.hideModal = hideModal;
  return modal;
};

VisualizeComponent.prototype.showModalFn = function showModal() {
  this.modal.showModal();
};

VisualizeComponent.prototype.hideModalFn = function hideModal() {
  this.modal.hideModal();
};

VisualizeComponent.prototype.renderGraph = function renderGraph() {
  const {data: yAxisPoints, title: titleY} = getDataListAndTitleFromTable(
    this.tableElement,
    this.yAxisValue
  );
  const {data: xAxisLabels, title: titleX} = getDataListAndTitleFromTable(
    this.tableElement,
    this.xAxisValue
  );

  const myLineChart = new Chart(this.canvasContext, {
    type: 'line',
    data: {
      labels: xAxisLabels,
      datasets: [
        {
          label: `${titleY} vs ${titleX}`,
          backgroundColor: '#74ebd5',
          borderColor: '#74ebd5',
          data: yAxisPoints,
          fill: false,
        },
      ],
      options: {
        showLines: true,
        scales: {
          x: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Month',
            },
          },
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value',
            },
          },
        },
      },
    },
  });
  this.canvasContext.style.display = 'block';
};

VisualizeComponent.prototype.render = function render() {
  // console.log('render called', this.x);
  if (this.showModal) {
    // show modal
    this.showModalFn();
  } else {
    // hide modal
    this.hideModalFn();
  }
  if (this.xAxisValue && this.yAxisValue) {
    this.renderGraph();
  }
  // if x and y axis are available, render the chart
};

export default VisualizeComponent;
