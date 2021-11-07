class LayoutGridPlugin {
  constructor() {
    this.isDragging = false;

    this.grid = {
      DOM: document.getElementById('layout-grid-frame'),
      nbCols: 12,
      nbRows: 12,
      colsStartsX: [],
      colsEndsX: [],
      rowsStartsY: [],
      rowsEndsY: [],
    };

    this.mouse = {
      origin: {
        x: null,
        y: null
      },
      current: {
        x: null,
        y: null
      },
      delta: {
        x: null,
        y: null
      }
    };

    this.itemDragged = {
      DOM: null,
      origin: {
        x: null,
        y: null
      },
      columnStart: null,
      columnSpan: null,
      rowStart: null,
      rowSpan: null
    };
  }

  init() {

  }

  getAllLimits() {
    let _this = this;

    this.grid.colsStartsX = [];
    this.grid.colsEndsX = [];
    this.grid.rowsStartsY = [];
    this.grid.rowsEndsY = [];

    // Get all cols lines

    let colsWidths = this.getStyleProperty(this.grid.DOM, 'grid-template-columns');
    let columnGap = parseInt(this.getStyleProperty(this.grid.DOM, 'column-gap'));

    this.grid.colsStartsX.push(0);
    this.grid.colsEndsX.push(0);

    let colIndex = 1;

    colsWidths.split(' ').forEach(function(colWidth) {
      colWidth = parseInt(colWidth);
      _this.grid.colsStartsX.push((colWidth + columnGap) * colIndex);
      _this.grid.colsEndsX.push((colWidth * colIndex) + (columnGap * (colIndex - 1)));
      colIndex++;
    })

    this.grid.colsStartsX.splice(-1, 1);
    this.grid.colsEndsX.shift();

    /* --- */

    // Get all rows lines

    let rowsHeights = this.getStyleProperty(this.grid.DOM, 'grid-template-rows');
    let rowGap = parseInt(this.getStyleProperty(this.grid.DOM, 'row-gap'));

    this.grid.rowsStartsY.push(0);
    this.grid.rowsEndsY.push(0);

    let rowIndex = 1;

    rowsHeights.split(' ').forEach(function(rowHeight) {
      rowHeight = parseInt(rowHeight);
      _this.grid.rowsStartsY.push((rowHeight + rowGap) * rowIndex);
      _this.grid.rowsEndsY.push((rowHeight * rowIndex) + (rowGap * (rowIndex - 1)));
      rowIndex++;
    })

    this.grid.rowsStartsY.splice(-1, 1);
    this.grid.rowsEndsY.shift();
  }

  triggerMouseDown(item, e) {
    this.setMouseOrigin(e);
    this.updateMouse(e);

    this.setDragOn();
    this.setItemDragged(item);
  }

  triggerMouseMove(e) {
    var _this = this;

    if (this.isDragging) {
      this.updateMouse(e);

      let dragPositionX = this.itemDragged.origin.x - this.mouse.delta.x;
      let dragPositionY = this.itemDragged.origin.y - this.mouse.delta.y;

      // check x position
      this.grid.colsStartsX.forEach(function(colStartX, i) {
        if (i <= _this.grid.nbCols - _this.itemDragged.columnSpan) {
          if (dragPositionX >= colStartX - 2
           && dragPositionX < _this.grid.colsStartsX[i+1] - 2) { // tolerance: 2 pixels
            _this.itemDragged.columnStart = i + 1;
            _this.itemDragged.DOM.style.gridColumnStart = _this.itemDragged.columnStart;
          }
        }
      });

      // check y position
      this.grid.rowsStartsY.forEach(function(rowStartY, i) {
        if (dragPositionY >= rowStartY - 2
         && dragPositionY < _this.grid.rowsStartsY[i+1] - 2) { // tolerance: 2 pixels
          _this.itemDragged.rowStart = i + 1;
          _this.itemDragged.DOM.style.gridRowStart = _this.itemDragged.rowStart;
        }
      });

      this.itemDragged.columnStart = parseInt(this.getStyleProperty(this.itemDragged.DOM, 'grid-column-start'));
      this.itemDragged.columnSpan = parseInt(this.getStyleProperty(this.itemDragged.DOM, 'grid-column-end').replace('span ',''));
      this.itemDragged.rowStart = parseInt(this.getStyleProperty(this.itemDragged.DOM, 'grid-row-start'));
      this.itemDragged.rowSpan = parseInt(this.getStyleProperty(this.itemDragged.DOM, 'grid-row-end').replace('span ',''));
    }
  }

  triggerMouseUp(e) {
    if (this.isDragging) {
      this.resetMouse();
      this.setDragOff();
    }
  }

  setDragOn() {
    this.isDragging = true;
  }

  setDragOff() {
    this.resetMouse();
    this.unsetItemDragged();
    this.isDragging = false;
  }

  setItemDragged(item) {
    this.itemDragged.DOM = item;
    this.itemDragged.origin.x = this.itemDragged.DOM.getBoundingClientRect().left - this.grid.DOM.getBoundingClientRect().left;
    this.itemDragged.origin.y = this.itemDragged.DOM.getBoundingClientRect().top - this.grid.DOM.getBoundingClientRect().top;
  }

  unsetItemDragged() {
    this.itemDragged.DOM = null;
  }

  updateMouse(e) {
    this.mouse.current.x = e.pageX;
    this.mouse.current.y = e.pageY;

    this.mouse.delta.x = this.mouse.origin.x - this.mouse.current.x;
    this.mouse.delta.y = this.mouse.origin.y - this.mouse.current.y;
  }

  setMouseOrigin(e) {
    this.mouse.origin.x = e.pageX;
    this.mouse.origin.y = e.pageY;
  }

  resetMouse() {
    this.mouse.origin.x = null;
    this.mouse.origin.y = null;
    this.mouse.current.x = null;
    this.mouse.current.y = null;
    this.mouse.delta.x = null;
    this.mouse.delta.y = null;
  }

  getStyleProperty(dom, property) {
    return window.getComputedStyle(dom, null).getPropertyValue(property);
  }
}
