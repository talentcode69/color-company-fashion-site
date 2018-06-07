angular
.module('app')
.component('coursesDetailsComponent', {
  templateUrl: 'app/components/courses-details/courses-details.tmpl.html',
  controller: function ($http, appConfig, $stateParams, $location, anchorSmoothScroll, $state, localStorageService) {
    var vm = this;

    vm.init = function () {
      $http.get(appConfig.dashboardServiceUrl + 'courses/' + $stateParams.id + '.json')
      .then(function (res) {
        vm.pageData = res.data.data.data;
        vm.pageData.date = moment(vm.pageData.published_year+'-'+vm.pageData.published_month+'-'+vm.pageData.published_day).format('dddd, MMMM D, YYYY');
        vm.pageData.image_url =  res.data.data.images && res.data.data.images[0] && res.data.data.images[0].image_url;
        vm.pageData.file = res.data.data.files && res.data.data.files[0];
        vm.pageData.analitic =  _.chunk(angular.copy(res.data.data.analytics).slice(0, 3), 3);
        vm.pageData.analitics = angular.copy(res.data.data.analytics);
      });
    };
    vm.more = function () {
      vm.pageData.analitic = _.chunk(angular.copy(vm.pageData.analitics), 3);
    };

    vm.gotoElement = function (eID) {
      $location.hash('prefooter');
      anchorSmoothScroll.scrollTo(eID);
      $location.hash('');
    };

    vm.aggProduct = function () {
      // localStorageService.remove('products');
      var id = vm.pageData.id;
      var products = localStorageService.get('products');
      products.courses[id] = products.courses[id] ? products.courses[id] + 1 : 1;
      localStorageService.set('products', products);
      localStorageService.set('whichPage', {link: 'courses', name: 'Color Courses'});
      $state.go('cart-page');
    };
  }
});
