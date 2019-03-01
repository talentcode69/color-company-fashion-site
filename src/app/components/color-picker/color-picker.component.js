angular
	.module('app')
	.component('colorPickerComponent', {
		templateUrl: 'app/components/color-picker/color-picker.tmpl.html',
		controller: function ($location, $scope, $http, appConfig, anchorSmoothScroll, searchColor, modalService, colorRequest) {
			var vm = this;

			vm.gotoElement = function (eID) {
				$location.hash('prefooter');
				anchorSmoothScroll.scrollTo(eID);
				$location.hash('');
			};
			vm.numOfpaintColorNames = 0;
			vm.numOfcolorAssociationNames = 0;
			vm.colorAssociationNameWord = '';

			const rgbToHex = (r,g,b) => {
				return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
			}

			// const hexToRgb = hex =>
			// 	hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
			// 		,(m, r, g, b) => '#' + r + r + g + g + b + b)
			// 		.substring(1).match(/.{2}/g)
			// 		.map(x => parseInt(x, 16));

			this.searchByRGB = function () {
				var RGB = {red: $scope.colorRGB_R, green: $scope.colorRGB_G, blue: $scope.colorRGB_B};

				var hexColor = rgbToHex($scope.colorRGB_R, $scope.colorRGB_G, $scope.colorRGB_B);
				var colorNTC = ntc.name(hexColor);

				if (colorNTC[1].slice(0,13) !== "Invalid Color") {
					colorRequest.getShortNames(colorNTC[1])
						.then(function(data) {
							console.log('data', data);
							// console.log('hexToRgb(colorNTC[0])', hexToRgb(colorNTC[0]));
								vm.paintColorNamesData = [{colorName: colorNTC[1] , RGB: RGB.red + ',' + RGB.green + ',' + RGB.blue}];
								vm.colorAssociationNames = data.short_namecontains;
								searchColor.set(vm.paintColorNamesData, vm.colorAssociationNames);
								$location.url('/color-index-accordion')
						});
				} else {
				modalService.showModal(5);
			}
			};
		}
	});
