angular.module('md.data.table').directive('mdTableRow', mdTableRow);

function mdTableRow($mdTable, $timeout) {
  'use strict';

  function postLink(scope, element, attrs, tableCtrl) {

    if(angular.isDefined(attrs.mdSelectRow)) {
      scope.mdClasses = tableCtrl.classes;

      scope.selectedMap = tableCtrl.selectedMap;

      scope.isDisabled = function() {
        return scope.$eval(attrs.mdDisableSelect);
      };

      scope.isSelected = function (item) {
        return tableCtrl.selectedMap[item.id] !== undefined;
      };

      scope.toggleRow = function (item, event) {
        event.stopPropagation();

        if(scope.isDisabled()) {
          return;
        }

        if (tableCtrl.selectedMap[item.id] !== undefined) {
          $mdTable.deselectRow(item, tableCtrl);
        } else {
          $mdTable.selectRow(item, tableCtrl);
        }
      };
    }

    if(attrs.ngRepeat) {
      if(scope.$last) {
        tableCtrl.isReady.body.resolve($mdTable.parse(attrs.ngRepeat));
      }
    } else if(tableCtrl.isLastChild(element.parent().children(), element[0])) {
      tableCtrl.isReady.body.resolve();
    }

    tableCtrl.isReady.head.promise.then(function () {
      tableCtrl.columns.forEach(function (column, index) {
        if(column.isNumeric) {
          var cell = element.children().eq(index);

          cell.addClass('numeric');

          if(angular.isDefined(cell.attr('show-unit'))) {
            $timeout(function () {
              cell.text(cell.text() + tableCtrl.columns[index].unit);
            });
          }
        }
      });
    });
  }

  return {
    link: postLink,
    require: '^^mdDataTable'
  };
}

mdTableRow.$inject = ['$mdTable', '$timeout'];
