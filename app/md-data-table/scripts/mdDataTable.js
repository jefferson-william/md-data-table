angular.module('md.data.table').directive('mdDataTable', mdDataTable);

function mdDataTable($mdTable) {
  'use strict';

  function compile(tElement, tAttrs) {
    var head = tElement.find('thead');
    var foot = tElement.find('tfoot');

    // make sure the table has a head element
    if(!head.length) {
      head = tElement.find('tbody').eq(0);

      if(head.children().find('th').length) {
        head.replaceWith('<thead>' + head.html() + '</thead>');
      } else {
        throw new Error('mdDataTable', 'Expecting <thead></thead> element.');
      }

      head = tElement.find('thead');
    }

    var rows = tElement.find('tbody').find('tr');

    head.attr('md-table-head', '');
    rows.attr('md-table-row', '');
    rows.find('td').attr('md-table-cell', '');

    if(foot.length) {
      foot.attr('md-table-foot', '');

      if(tAttrs.mdRowSelect) {
        foot.find('tr').prepend('<td></td>');
      }
    }

    var ngRepeat = $mdTable.getAttr(rows, 'ngRepeat');

    if(tAttrs.mdRowSelect && ngRepeat) {
      rows.attr('md-select-row', '');
    }

    if(tAttrs.mdRowSelect && !ngRepeat) {
      console.warn('Please use ngRepeat to enable row selection.');
    }

    if(head.attr('md-order') && !ngRepeat) {
      console.warn('Column ordering without ngRepeat is not supported.');
    }
  }

  function Controller($attrs, $element, $q, $scope) {
    var self = this;

    self.columns = [];
    self.classes = [];
    self.isReady = {
      body: $q.defer(),
      head: $q.defer()
    };
    self.selectedMap = {};
    self.pageNum = 1;
    self.newPage = 1;

    if($attrs.mdRowSelect) {
      self.columns.push({ isNumeric: false });

      if(!angular.isArray(self.selectedItems)) {
        self.selectedItems = [];
        // log warning for developer
        console.warn('md-row-select="' + $attrs.mdRowSelect + '" : ' +
        $attrs.mdRowSelect + ' is not defined as an array in your controller, ' +
        'i.e. ' + $attrs.mdRowSelect + ' = [], two-way data binding will fail.');
      } else {
        //initialize our map
        for(var i = 0, len = self.selectedItems.length; i < len; ++i) {
          self.selectedMap[self.selectedItems[i].id] = i;
        }
      }
    }

    if($attrs.mdProgress) {
      $scope.$watch('$mdDataTableCtrl.progress', function () {
        var deferred = self.defer();
        $q.when(self.progress)['finally'](deferred.resolve);
      });
    }

    // support theming
    ['md-primary', 'md-hue-1', 'md-hue-2', 'md-hue-3'].forEach(function(mdClass) {
      if($element.hasClass(mdClass)) {
        self.classes.push(mdClass);
      }
    });

    self.defer = function () {
      if(self.deferred) {
        self.deferred.reject('cancel');
      } else if(self.showProgress) {
        self.showProgress();
      }

      self.deferred = $q.defer();
      self.deferred.promise.then(self.resolve);

      return self.deferred;
    };

    self.resolve = function () {
      self.deferred = undefined;
      if (self.clearSelectAllCache) {
        self.clearSelectAllCache();
      }

      if(self.hideProgress) {
        self.hideProgress();
      }
    };

    $scope.$watch(function() {
      return self.selectedItems;
    }, function() {
      if (self.selectedItems) {
        if (self.selectedItems.length === 0) {
          self.clearSelectAllCache();
          self.selectedMap = {};
        } else {
          for(var i = 0, len = self.selectedItems.length; i < len; ++i) {
            self.selectedMap[self.selectedItems[i].id] = i;
          }
        }
      }
    });

    self.isLastChild = function (siblings, child) {
      return Array.prototype.indexOf.call(siblings, child) === siblings.length - 1;
    };

    self.setColumn = function (column) {
      self.columns.push({
        isNumeric: angular.isDefined(column.numeric),
        unit: column.unit
      });
    };
  }

  Controller.$inject = ['$attrs', '$element', '$q', '$scope'];

  return {
    bindToController: {
      progress: '=mdProgress',
      selectedItems: '=mdRowSelect'
    },
    compile: compile,
    controller: Controller,
    controllerAs: '$mdDataTableCtrl',
    restrict: 'A',
    scope: {}
  };
}

mdDataTable.$inject = ['$mdTable'];
