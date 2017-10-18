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
    this._step = 0;

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
      cells[i].ismine = false;
      cells[i].count = 0;
      cells[i].style.backgroundColor = '';
      cells[i].innerHTML = '';
      cells[i].isCheck = false;
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

    this._setCountAroundMines();
  }

  _setCountAroundMines() {
    this._tdMines.forEach((elem) => {

      let number = +elem.dataset.number;
      
      if (number % this._size.width !== 0) {
        this._counting(number - 1);
        this._counting(number + this._size.width - 1);
        this._counting(number - this._size.width - 1);
      }
      
      if ((number + 1) % this._size.width !== 0) {
        this._counting(number + 1);
        this._counting(number + this._size.width + 1);
        this._counting(number - this._size.width + 1);
      }

      
      this._counting(number + this._size.width);
      this._counting(number - this._size.width);

    });
  }

  _counting(number) {
    if (number < 0 ||
      number >= this._size.width * this._size.height) {
      return;
    }

    let td = this._sapperTable.querySelector(`td[data-number="${number}"]`);

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
            alert('Вы проиграли!');
            this.restart();
            return;
          }
          
          this._checkCell(target, {
            prev: true,
            next: true,
            up: true,
            down: true
          });
          
          return;
        }
        
        target = target.parentNode;
      }
    }
    
    this._sapperTable.oncontextmenu = (e) => {
      let target = e.target;
      
      while (target !== this._sapperTable) {
        if (target.tagName == 'TD') {
          target
          return;
        }
        
        target = target.parentNode;
      }
    }
  }
  
  _checkCell(td, checkTypes = {}) {
    if (td.count > 0) {
      td.dataset.count = td.count;
      td.classList.add('opened');
      td.innerHTML = `<span>${td.count}</span>`;
      return;
    }
    
    td.classList.add('opened');
    
    if (checkTypes.next) {
      this._checkNext.call(this, td);
    }
    if (checkTypes.prev) {
      this._checkPrev.call(this, td);
    }
    if (checkTypes.up) {
      this._checkUp.call(this, td);
    }
    if (checkTypes.down) {
      this._checkDown.call(this, td);
    }
    
    td.isCheck = true;
  }
  
  _checkNext(td) {
    let nextNum = +td.dataset.number + 1;
    if (  td.isCheck ||
          nextNum % this._size.width === 0 ||
          nextNum >= this._countCells ) return;
    
    let next = this._sapperTable.querySelector(`td[data-number="${nextNum}"]`);
    
    this._checkCell(next, {
      next: true,
      up: true,
      down: true
    });
  }
  
  _checkPrev(td) {
    let prevNum = +td.dataset.number - 1;
    if ( td.isCheck ||
          (prevNum + 1) % this._size.width === 0 ||
          prevNum < 0 ) return;
    
    let prev = this._sapperTable.querySelector(`td[data-number="${prevNum}"]`);
    
    this._checkCell(prev, {
      prev: true,
      up: true,
      down: true
    });
  }
  
  _checkUp(td) {
    let prevNum = +td.dataset.number - this._size.width;
    
    if (td.isCheck || prevNum < 0) return;
        
    let prev = this._sapperTable.querySelector(`td[data-number="${prevNum}"]`);
    
    this._checkCell(prev, {
      up: true
    });
  }
  
  _checkDown(td) {
    let nextNum = +td.dataset.number + this._size.width;
    
    if (td.isCheck || nextNum >= this._countCells) return;
        
    let next = this._sapperTable.querySelector(`td[data-number="${nextNum}"]`);
    
    this._checkCell(next, {
      down: true
    });
  }
}
