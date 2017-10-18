'use strict';

class Sapper {
  constructor(options) {
    this._element = options.element;
    this._size = {
      width: 9,
      height: 9
    }
    this._countMine = 10;
    this._countCells = this._size.width * this._size.height;
    this._checkCount = 0;

    this.start.call(this);
  }

  start() {
    this._drawTable();
    this._setMines();
    this._addListener();
  }
  
  restart() {
    let cells = this._sapperTable.querySelectorAll('td');
    for (let i = 0; i < this._countCells; i++) {
      cells[i].ismine = 
        cells[i].count = 
        cells[i].isCheck = 
        cells[i].userMine = 
        cells[i].userMark = 
        false;
      cells[i].style.backgroundColor = '';
      cells[i].innerHTML = '';
    }
    this._setMines();
  }

  _drawTable() {
    let html = '<table class="sapper"><tbody>';
    let cellNum = 0;

    for (let i = 0; i < this._size.height; i++) {
      html += '<tr>';

      for (let i = 0; i < this._size.width; i++) {
        html += `<td data-number = "${cellNum}"></td>`;
        cellNum++;
      }

      html += '</tr>';
    }

    html += '</tbody></table>';

    this._element.insertAdjacentHTML('afterBegin', html);
    this._sapperTable = this._element.querySelector('table');
  }

  _setMines() {
    this._tdMines = [];

    for (let i = 0; i < this._countMine; i++) {
      let newRandom = Math.floor(Math.random() * this._countCells);
      let randomTd = this._sapperTable.querySelector(`td[data-number="${newRandom}"]`);

      if (randomTd.ismine) {
        i--;
        continue;
      }
      randomTd.ismine = true;
      this._tdMines.push(randomTd);
    }

    this._tdMines.forEach((elem) => {
        this._checkAroundCells(elem, this._counting);
    });
  }

  _checkAroundCells(cell, callback) {
      let number = +cell.dataset.number;
      let prevNum = number - 1;
      let nextNum = number + 1;
      
      if (number % this._size.width !== 0) { 
        this._callFnForCell(prevNum, callback);
        this._callFnForCell(prevNum + this._size.width, callback);
        this._callFnForCell(prevNum - this._size.width, callback);
      }
      
      if (nextNum % this._size.width !== 0) {
        this._callFnForCell(nextNum, callback);
        this._callFnForCell(nextNum + this._size.width, callback);
        this._callFnForCell(nextNum - this._size.width, callback);
      }
      
      this._callFnForCell(number + this._size.width, callback);   
      this._callFnForCell(number - this._size.width, callback);

  }
  
  _callFnForCell(cellNum, callback) {
      if (cellNum < 0 || cellNum >= this._countCells) return;

      let td = this._sapperTable.querySelector(`td[data-number="${cellNum}"]`);
      if (!td) return false;

      callback.call(this, td);
  }

  _counting(td) {
    if (td.ismine) {
      return;
    }
    td.count = (td.count || 0) + 1;
  }
  
  _addListener() {
      this._sapperTable.onclick = (e) => {
      let target = e.target;
      
      while (target !== this._sapperTable) {
        if (target.tagName == 'TD') {
          
          if (target.ismine) {
            target.style.backgroundColor = 'red';
            alert('Игра окончена!');
            this.restart();
            return;
          }
          
          this._checkCell(target);
          
          return;
        }
        
        target = target.parentNode;
      }
    }
    
    this._sapperTable.oncontextmenu = (e) => {
      let target = e.target;
      
      while (target !== this._sapperTable) {
        if (target.tagName == 'TD') {
          e.preventDefault();
          this._setMark(target);
          return;
        }
        
        target = target.parentNode;
      }
    }
  }
  
  _checkCell(td) {
    if (td.isMine || td.isCheck) return;
    
    if (td.count > 0) {
      td.dataset.count = td.count;
      td.classList.add('opened');
      td.innerHTML = `<span>${td.count}</span>`;
      return;
    }
    
    td.classList.add('opened');
    this._addIsCheck(td);
    this._checkStopGame(td);
    
    this._checkAroundCells(td, this._checkCell);    
  }
  
  _addIsCheck(td) {
      td.isCheck = true;
      this._checkCount++;
  }
  
  _removeIsCheck(td) {
      td.isCheck = false;
      this._checkCount--;
  }
  
  _setMark(td) {
    if (td.userMine) {
        
        td.innerHTML = '&#63;';
        td.userMine = false;
        td.userMark = true;
        this._removeIsCheck(td);
        
    } else if (td.userMark) {
        
        td.innerHTML = '';
        td.userMark = true;
        this._removeIsCheck(td);
        this._checkStopGame(td);
        
    } else {
        
        td.innerHTML = '&#128163;';
        td.userMine = true;
        this._addIsCheck(td);
        
    }
    
  }
  
  _checkStopGame(td) {
      if (this.checkCount === this._countCells) {
          
      }
      
      this._tdMines.forEach((elem) => {
          
      });
  }
}
