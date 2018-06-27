angular
  .module('app')
  .component('myPurchaseComponent', {
    templateUrl: 'app/components/my-purchase/my-purchase.tmpl.html',
    controller: function ($state, $http, appConfig, $scope, authService, localStorageService) {
      var vm = this;
      vm.data = [];

      function init() {
        if (vm.user && vm.user.id) {
          $http.get(appConfig.dashboardServiceUrl + '/members/bought_items.json', {params: {id: vm.user.id}})
            .then(function (res) {
              for (var key in res.data) {
                res.data[key].forEach(function (item) {
                  item.purchaseDate = moment(item.purchase_date).format('DD, MM, YYYY');
                  if (key === 'teaching_materials') {
                    item.type = 'teaching-materials';
                  } else {
                    item.type = key;
                  }
                  vm.data.push(item);
                });
              }
              vm.data.sort(vm.sortByDate);
            });
        }
      }

      vm.sortByDate = function(a, b) {
        if (Date.parse(a.purchase_date) < Date.parse(b.purchase_date)) return 1;
        if (Date.parse(a.purchase_date) > Date.parse(b.purchase_date)) return -1;
      };



      $scope.$watch(function () {
        return authService.currentUser;
      }, function (newVal) {
        vm.user = localStorageService.get('currentUser');
        init();
      });
    }
  });
