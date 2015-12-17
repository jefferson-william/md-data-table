angular.module('md.data.table').directive('mdSelectAll', mdSelectAll);

function mdSelectAll($mdTable) {
  'use strict';

  function template(tElement) {
    var checkbox = angular.element('<md-checkbox></md-checkbox>');

    checkbox.attr('aria-label', 'Select All');
    checkbox.attr('ng-click', 'toggleAll()');
    checkbox.attr('ng-class', 'mdClasses');
    checkbox.attr('ng-checked', 'allSelected()');
    checkbox.attr('ng-disabled', '!getCount()');

    tElement.append(checkbox);
  }

  function postLink(scope, element, attrs, tableCtrl) {
    var count = null;
    var amountSelectedNotInPage = null;

    tableCtrl.clearSelectAllCache = function() {
      count = null;
      amountSelectedNotInPage = null;
    };

    var getSelectableItems = function() {
      return scope.items.filter(function(item) {
        return !tableCtrl.isDisabled(item);
      });
    };

    tableCtrl.isReady.body.promise.then(function() {
      scope.mdClasses = tableCtrl.classes;

      scope.getCount = function() {
        if (count !== null) {
          return count;
        }
        var array = scope.items || [];

        return (count = array.reduce(function(sum, item) {
          return tableCtrl.isDisabled(item) ? sum : ++sum;
        }, 0));
      };

      scope.allSelected = function() {
        if (amountSelectedNotInPage !== null) {
          return count === tableCtrl.selectedItems.length - amountSelectedNotInPage;
        }

        var selectedCountInPage = 0;
        var array = scope.items || [];

        for (var i = 0, len = array.length; i < len; ++i) {
          if (tableCtrl.selectedMap[array[i].id] !== undefined) {
            ++selectedCountInPage;
          }
        }
        amountSelectedNotInPage = tableCtrl.selectedItems.length - selectedCountInPage;

        return count === selectedCountInPage;
      };

      scope.toggleAll = function() {
        var items = getSelectableItems(scope.items);
        var map = tableCtrl.selectedMap;

        if (scope.allSelected()) {
          for (var i = items.length-1; i >= 0; --i) {
            if (map[items[i].id] !== undefined) {
              $mdTable.deselectRow(items[i], tableCtrl);
            }
          }
        } else {
          for (var i = 0, len = items.length; i < len; ++i) {
            if (map[items[i].id] === undefined) {
              $mdTable.selectRow(items[i], tableCtrl);
            }
          }
        }
      };
    });
  }

  return {
    link: postLink,
    require: '^^mdDataTable',
    scope: {
      items: '=mdSelectAll'
    },
    template: template
  };
}
