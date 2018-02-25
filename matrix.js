// @flow

'use strict';

/* :: import { type Field } from './field'; */

// eslint-disable-next-line no-unused-vars
class Matrix /* :: <T: Field<*>> */ {
  /* ::
  _rows: number;
  _columns: number;
  _elements: T[];
  */

  constructor(
    rows /* : number */,
    columns /* : number */,
    elements /* : T[] | (number, number) => T */
  ) {
    if (typeof elements !== 'function' && elements.length !== rows * columns) {
      throw new Error('Element/row/column count mismatch');
    }
    this._rows = rows;
    this._columns = columns;
    if (typeof elements === 'function') {
      this._elements = [];
      for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < columns; j += 1) {
          this._elements.push(elements(i, j));
        }
      }
    } else {
      this._elements = elements.slice();
    }
    if (this._elements.length === 0) {
      throw new Error('Empty matrix');
    }
  }

  zeroElement() /* : T */ {
    return this._elements[0].zero();
  }

  oneElement() /* : T */ {
    return this._elements[0].one();
  }

  rows() /* : number */ {
    return this._rows;
  }

  columns() /* : number */ {
    return this._columns;
  }

  toLaTeXString() /* : string */ {
    const rowStrs = [];
    for (let i = 0; i < this._rows; i += 1) {
      const row = this._elements.slice(
        i * this._columns,
        (i + 1) * this._columns
      );
      const rowStr = row.map(x => x.toString()).join(' & ');
      rowStrs.push(rowStr);
    }
    const elementStr = rowStrs.join(' \\\\\n');
    return `\\begin{pmatrix}
${elementStr}
\\end{pmatrix}`;
  }

  equals(n /* : Matrix<T> */) /* : boolean */ {
    if (this._rows !== n._rows) {
      return false;
    }

    if (this._columns !== n._columns) {
      return false;
    }

    if (this._elements.length !== n._elements.length) {
      throw new Error(
        'Matrices with matching dimensions but mismatched element count'
      );
    }

    for (let i = 0; i < this._elements.length; i += 1) {
      if (!this._elements[i].equals(n._elements[i])) {
        return false;
      }
    }

    return true;
  }

  at(i /* : number */, j /* : number */) /* : T */ {
    if (i < 0 || i >= this._rows) {
      throw new RangeError('Row index out of bounds');
    }
    if (j < 0 || j >= this._columns) {
      throw new RangeError('Column index out of bounds');
    }
    return this._elements[i * this._columns + j];
  }

  times(n /* : Matrix<T> */) /* : Matrix<T> */ {
    if (this._columns !== n._rows) {
      throw new Error('Mismatched dimensions');
    }
    const columns = this._columns;
    return new Matrix(this._rows, n._columns, (
      i /* : number */,
      j /* : number */
    ) /* : T */ => {
      let t = this.zeroElement();
      for (let k = 0; k < columns; k += 1) {
        t = t.plus(this.at(i, k).times(n.at(k, j)));
      }
      return t;
    });
  }

  _swapRows(i /* : number */, j /* : number */) {
    if (i === j) {
      return;
    }

    for (let k = 0; k < this._columns; k += 1) {
      const a1 = i * this._columns + k;
      const a2 = j * this._columns + k;
      const t = this._elements[a1];
      this._elements[a1] = this._elements[a2];
      this._elements[a2] = t;
    }
  }

  _clone() /* : Matrix<T> */ {
    return new Matrix(this._rows, this._columns, this._elements);
  }

  swapRows(i /* : number */, j /* : number */) /* : Matrix<T> */ {
    const ret = this._clone();
    ret._swapRows(i, j);
    return ret;
  }
}

/* ::
export { Matrix };
*/
