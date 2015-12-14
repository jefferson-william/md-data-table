angular.module('md.data.table').factory('$mdTable', mdTableService);

function mdTableService() {
  'use strict';

  var cache = {};

  function Repeat(ngRepeat) {
    this._tokens = ngRepeat.split(/\s+/);
    this._iterator = 0;

    this.item = this.current();
    while(this.hasNext() && this.getNext() !== 'in') {
      this.item += this.current();
    }

    this.items = this.getNext();
    while(this.hasNext() && ['|', 'track'].indexOf(this.getNext()) === -1) {
      this.items += this.current();
    }
  }

  Repeat.prototype.current = function () {
    return this._tokens[this._iterator];
  };

  Repeat.prototype.getNext = function() {
    return this._tokens[++this._iterator];
  };

  Repeat.prototype.getValue = function() {
    return this._tokens.join(' ');
  };

  Repeat.prototype.hasNext = function () {
    return this._iterator < this._tokens.length - 1;
  };

  /**
   * Get the value of an atribute given its normalized name.
   *
   * @param {jqLite} element - A jqLite element.
   * @param {string} attr - The normalized name of the attribute.
   * @returns {string} - The value of the attribute.
   */
  function getAttr(element, attr) {
    var attrs = element.prop('attributes');

    for(var i = 0; i < attrs.length; i++) {
      if(normalize(attrs.item(i).name) === attr) {
        return attrs.item(i).value;
      }
    }

    return '';
  }

  /**
   * Normalizes an attribute's name.
   *
   * @param {string} attr - The original name of the attribute.
   * @returns {string} - The normalized name of the attribute.
   */
  function normalize(attr) {
    var tokens = attr.replace(/^((?:x|data)[\:\-_])/i, '').split(/[\:\-_]/);
    var normal = tokens.shift();

    tokens.forEach(function (token) {
      normal += token.charAt(0).toUpperCase() + token.slice(1);
    });

    return normal;
  }

  function parse(ngRepeat) {
    if(!cache.hasOwnProperty(ngRepeat)) {
      return (cache[ngRepeat] = new Repeat(ngRepeat));
    }

    return cache[ngRepeat];
  }

  function deselectRow(item, tableCtrl) {
    var map = tableCtrl.selectedMap;
    var itemIndex = map[item.id];
    tableCtrl.selectedItems.splice(itemIndex, 1);
    delete map[item.id];

    //fix indexes after the one removed
    for (var i = itemIndex, len = tableCtrl.selectedItems.length; i < len; ++i) {
      map[tableCtrl.selectedItems[i].id] = i;
    }
  }

  function selectRow(item, tableCtrl) {
    tableCtrl.selectedMap[item.id] = tableCtrl.selectedItems.length;
    tableCtrl.selectedItems.push(item);
  }

  return {
    getAttr: getAttr,
    normalize: normalize,
    parse: parse,
    deselectRow: deselectRow,
    selectRow: selectRow
  };

}
