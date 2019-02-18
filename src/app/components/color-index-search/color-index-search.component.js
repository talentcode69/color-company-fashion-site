angular
	.module('app')
	.component('colorIndexSearchComponent', {
		templateUrl: 'app/components/color-index-search/color-index-search.tmpl.html',
		controller: function (dataValidate, appConfig, $window, $location, anchorSmoothScroll, $http, $scope, searchColor) {
			var vm = this;
			vm.paintColorNamesData = [];
			vm.colorAssociationNames = [];

			this.colorSearch = function () {
				if (this.data.color != ' ') {
					$http.get(appConfig.dashboardServiceUrl + 'api_colors/search_shortname', {
						params: {short_name: vm.data.color}
					})
						.then(function (res) {
							vm.colorValidDataShort = res.data.short_name;
							if (res && res.data.short_name.length > 0) {
								var RGB = '',
									colorName = '';
								vm.paintColorNamesData = res.data.short_name.map(function (item) {
									RGB = item.RGB;
									colorName = item.colorName;
									return {colorName: colorName, RGB: RGB};
								});
								vm.colorAssociationNames = res.data.short_namecontains.map(function (item) {
									RGB = item.RGB;
									colorName = item.colorName;
									return {colorName: colorName, RGB: RGB};
								});
								searchColor.set(vm.paintColorNamesData, vm.colorAssociationNames);
								$location.url('/color-index-accordion')
							}
						});
				}
			};
		}
	});
