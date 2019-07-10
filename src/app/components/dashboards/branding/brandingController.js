angular.module('app').controller('brandingController', [
	'$scope',
	'brandingDashboardRepository',
	'dashboardOverlayService',
	'searchMenuRepository',
	'$state',
	'exportService',
	'anchorSmoothScroll',
	'$location',
	'categoryValues',
	function (scope,
		brandingDashboardRepository,
		dashboardOverlayService,
		searchMenuRepository,
		$state,
		exportService,
		anchorSmoothScroll,
		$location,
		categoryValues) {

		scope.gotoElement = function (eID) {
			$location.hash('prefooter');
			anchorSmoothScroll.scrollTo(eID);
			$location.hash('');
		};

		scope.menus = {
			color: '',
			brand: '',
			industry: '',
			attribute: ''
		};

		var choices = categoryValues('industry');
		 
		for (item in choices) {
		 	choices[item].index = item;
		}


		scope.industry_items = choices;

		scope.text = '';
		scope.minlength = 1;
		scope.selected = {};
		scope.brand_place_holder = "SEARCH BY BRAND";
		scope.industry_place_holder = "SEARCH BY INDUSTRY";
		scope.attribute_place_holder = "SEARCH BY ATTRIBUTE";
		scope.disabledControls = {
			brand: false,
			industry: false,
			color: false,
			attribute: false,
			country: false
		};

		scope.type = {
			color:'color',
			brand:'brand',
			industry:'industry',
			attribute:'attribute'
		};

		scope.mainParam = null;
		scope.mainParamId = null;
		scope.secondaryParams = {};
		scope.logoId = null;
		scope.industryId = null;

		scope.showDashboard = false;
		scope.title = null;
		scope.iconUrl = null;
		scope.colorHex = '#fff';
		scope.topIndustriesColor = '#ccc';
		scope.activeColorFrequencyColor = 0;

		scope.isLoadingControls = true;

		// Pages info
		scope.colorPageInfo = [{
			width: 2,
			type: 'desc',
			tooltip: '#description',
			data: { text: null }
		}, {
			width: 1,
			type: 'countTo',
			tooltip: '#industries',
			data: { subtitle: 'Industries', count: 0, menuTab: 'industry' }
		}, {
			width: 1,
			type: 'countTo',
			tooltip: '#brands',
			data: { subtitle: 'Brands', count: 0, menuTab: 'brand' }
		}];

		scope.brandPageInfo = [{
			width: 3,
			type: 'desc',
			tooltip: '#description',
			data: { text: null }
		}, {
				width: 1,
				type: 'title',
				classes: 'cell-clickable',
				data: { title: null, subtitle: null }
		}];

		scope.industryPageInfo = [{
			width: 2,
			type: 'desc',
			tooltip: '#description',
			data: { text: null }
		}, {
			width: 1,
			type: 'countTo',
			tooltip: '#brands',
			data: { subtitle: 'Brands', count: 0, menuTab: 'brand' }
		}, {
			width: 1,
			type: 'countTo',
			tooltip: '#colors',
			data: { subtitle: 'Colors', count: 0, menuTab: 'color' }
		}];

		scope.attributePageInfo = [{
			width: 2,
			type: 'desc',
			tooltip: '#description',
			data: { text: null }
		}, {
			width: 1,
			type: 'countTo',
			tooltip: '#colors',
			data: { subtitle: 'Colors', count: 0, menuTab: 'color' }
		}, {
			width: 1,
			type: 'countTo',
			tooltip: '#brands',
			data: { subtitle: 'Brands', count: 0, menuTab: 'brand' }
		}];

		scope.topColorsData = [];
		scope.colorFrequencyData = [];
		scope.logosData = [];
		scope.mapsData = [];

		scope.colorPaletteBucket = 38;

		if (!scope.mainParam) {
			$state.go('branding');
		}


		searchMenuRepository.getControlsDataBranding().then(function (data) {
			scope.controlsData = data;

			for (item in scope.controlsData.attributes) {
				scope.controlsData.attributes[item].index = item;
			}

			for (item in scope.controlsData.companies) {
				scope.controlsData.companies[item].index = item;
			}

			scope.isLoadingControls = false;
		});

		scope.changeColorPaletteBucket = function (value) {
			if (value !== scope.colorPaletteBucket) {
				brandingDashboardRepository[scope.mainParam].getColorPalette(scope.mainParamId, value)
					.then(function (data) {
						scope.colorPaletteData = data;
					});
			}
			scope.colorPaletteBucket = value;
		};

		scope.isColorFrequencyColorPickerVisible = function () {
			return scope.colorFrequencyData.length > 1;
		};

		scope.setColorAsMain = function (color) {
			scope.iconUrl = null;
			scope.secondaryParams = {};
			scope.mainParam = null;
			scope.tempColor = color;
			scope.menus = {
				brand: '',
				industry: '',
				color: '',
				attribute: '',
				country: ''
			};
			scope.menus.color = color.id;
			if (!scope.controlsData.colors.find(function (item) {
				return item.id === scope.tempColor.id
			})) {
				scope.controlsData.colors.unshift(scope.tempColor);
			}
			scope.tempColor = null;
			scope.handleChangeControl('color');
			scope.loadGraphics();
		};

		scope.loadGraphics = function () {
			if (scope.mainParam) {
				scope.showDashboard = true;
				dashboardOverlayService.loadingStart();

				brandingDashboardRepository[scope.mainParam].getPageData(scope.mainParamId).then(function (data) {
					scope.title = data.title;
					exportService.title = data.title;

					if (scope.mainParam === 'brand') {
						scope.iconUrl = data.logo_url;
						scope.logoId = data.logo_id;
						scope.industryId = data.industry_id;
						scope.pageInfo[0].data.text = data.description;
						scope.pageInfo[1].data.title = data.industry;
						scope.pageInfo[1].data.subtitle = data.symbol;
					} else if (scope.mainParam === 'industry') {
						scope.iconUrl = 'assets/img/icons/industries/noun_' + scope.industry + '.svg';
						scope.pageInfo[0].data.text = data.description;
						scope.pageInfo[1].data.count = data.company_count;
						scope.pageInfo[2].data.count = data.color_count;
					} else if (scope.mainParam === 'color') {
						scope.colorHex = data.notation.hex;
						scope.pageInfo[0].data.text = data.description;
						scope.pageInfo[1].data.count = data.industries_count;
						scope.pageInfo[2].data.count = data.companies_count;
					} else if (scope.mainParam === 'attribute') {
						scope.subtitle = data.subtitle;
						scope.topIndustriesColor = data.color.hex;
						scope.pageInfo[0].data.text = data.description;
						scope.pageInfo[1].data.count = data.color_count;
						scope.pageInfo[2].data.count = data.company_count;
					} else if (scope.mainParam === 'country') {
						scope.iconUrl = data.flag_url;
						scope.pageInfo[0].data.title = data.capital;
						scope.pageInfo[0].data.subtitle = 'Population ' + data.population;
						scope.pageInfo[1].data.count = data.industries_count;
						scope.pageInfo[2].data.count = data.brands_count;
						scope.pageInfo[3].data.count = data.colors_count;
					}
				});

				brandingDashboardRepository[scope.mainParam].getTopColors(scope.mainParamId)
					.then(function (data) {
						scope.topColorsData = data;
					});

				if (scope.mainParam !== 'attribute') {
					brandingDashboardRepository[scope.mainParam].getColorFrequency(scope.mainParamId)
						.then(function (data) {
							scope.colorFrequencyData = data;
						});
				}

				brandingDashboardRepository[scope.mainParam].getMaps(scope.mainParamId)
					.then(function (data) {
						scope.mapsData = data;
					});

				if (scope.mainParam === 'industry') {
					brandingDashboardRepository[scope.mainParam].getColorCount(scope.mainParamId)
						.then(function (data) {
							scope.colorCountData = data;
						});

					brandingDashboardRepository[scope.mainParam].getColorPalette(scope.mainParamId, scope.colorPaletteBucket)
						.then(function (data) {
							scope.colorPaletteData = data;
						});
				}

				if (scope.mainParam === 'attribute') {
					brandingDashboardRepository[scope.mainParam].getColorCount(scope.mainParamId)
						.then(function (data) {
							scope.colorCountData = data;
						});

					brandingDashboardRepository[scope.mainParam].getTopIndustries(scope.mainParamId)
						.then(function (data) {
							scope.topIndustriesData = data;
						});

					brandingDashboardRepository[scope.mainParam].getColorCombinations(scope.mainParamId)
						.then(function (data) {
							scope.colorFrequencyData = data;
						});

					brandingDashboardRepository[scope.mainParam].getColorPalette(scope.mainParamId, scope.colorPaletteBucket)
						.then(function (data) {
							scope.colorPaletteData = data;
						});
				}

				if (scope.mainParam === 'color') {
					brandingDashboardRepository[scope.mainParam].getTopIndustries(scope.mainParamId)
						.then(function (data) {
							scope.topIndustriesData = data;
						});
				}

				if (scope.mainParam === 'country') {
					brandingDashboardRepository.country.getFlag(scope.mainParamId)
						.then(function (data) {
							scope.flagColorsData = data;
						});

					brandingDashboardRepository[scope.mainParam].getColorCount(scope.mainParamId)
						.then(function (data) {
							scope.colorCountData = data;
						});

					brandingDashboardRepository[scope.mainParam].getTopIndustries(scope.mainParamId)
						.then(function (data) {
							scope.topIndustriesData = data;
						});

					brandingDashboardRepository[scope.mainParam].getColorPalette(scope.mainParamId, scope.colorPaletteBucket)
						.then(function (data) {
							scope.colorPaletteData = data;
						});
				}

				brandingDashboardRepository[scope.mainParam].getLogos(scope.mainParamId)
					.then(function (data) {
						scope.logosData = data;
					});

			}
		};
		
		scope.handleChangeControl = function (control, id) {
			if (!scope.mainParam) {
				scope.mainParam = control;
				scope.mainParamId = scope.menus[control];
				$state.go(control + 'Branding');
			}

			switch (scope.mainParam) {
				case 'brand':
					scope.pageInfo = scope.brandPageInfo;
					scope.mainParamId = id;

					scope.disabledControls = {
						brand: false,
						industry: true,
						color: true,
						attribute: true,
						country: true
					};
					break;

				case 'industry':
					scope.pageInfo = scope.industryPageInfo;
					scope.mainParamId = id;
					scope.disabledControls = {
						brand: true,
						industry: false,
						color: true,
						attribute: true,
						country: true
					};
					break;

				case 'color':
					scope.pageInfo = scope.colorPageInfo;
					scope.mainParamId = id;
					scope.disabledControls = {
						brand: true,
						industry: true,
						color: false,
						attribute: true,
						country: true
					};
					break;

				case 'attribute':
					scope.pageInfo = scope.attributePageInfo;
					scope.mainParamId = id;
					scope.disabledControls = {
						brand: true,
						industry: true,
						color: true,
						attribute: false,
						country: true
					};
					break;

				case 'country':
					scope.pageInfo = scope.countryPageInfo;
					scope.mainParamId = id;
					scope.disabledControls = {
						brand: true,
						industry: true,
						color: true,
						attribute: true,
						country: false
					};
					break;

				default:
					$state.go('branding');
					scope.disabledControls = {
						brand: false,
						industry: false,
						color: false,
						attribute: false,
						country: false
					};

					// scope.brand = '';
					// scope.industry = '';
					// scope.color = '';
					// scope.attribute = '';
					// scope.country = '';

					scope.mainParam = null;
					scope.iconUrl = null;
					scope.showDashboard = false;

					scope.compareData = [];
					scope.colorsCountData = [];
					scope.colorsCountData = [];
					scope.shadesData = [];
					scope.topFamiliesData = [];
					scope.topBrandsData = [];
					scope.topColorsData = [];
					scope.colorFrequencyData = [];
					scope.topFinishesData = [];
					scope.carColorsData = [];
					scope.colorPaletteData = [];
					break;
			}

			scope.loadGraphics();
		};

		scope.$watch(function () {
			return dashboardOverlayService.showOverlay;
		}, function (newValue) {
			scope.showDashboardOverlay = newValue;
		});
	}
]);
