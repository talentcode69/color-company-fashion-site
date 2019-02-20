angular.module('app').factory('colorRequest', function($http, appConfig) {
    var url = appConfig.dashboardServiceUrl + 'api_colors/';

    return {
        getShortNames: function(shortName) {
            return $http.get(url + 'search_shortname', { params: {short_name: shortName}
        }).then(function(res) {
                return res.data;
            });
        },
        getRgb: function(rgb) {
            return $http.get(url + 'search_rgb', { params: rgb }
        ).then(function(res) {
                return res.data;
            });
        }
    }
});
