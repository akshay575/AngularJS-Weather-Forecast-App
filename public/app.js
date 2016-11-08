var weatherApp = angular.module('weatherApp', ['ngRoute', 'ui.bootstrap']);

weatherApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'components/home.html',
      controller: 'mainController'
    })

    .when('/about', {
      templateUrl: 'components/about.html'
    })
}])

weatherApp.controller('mainController', ['$scope', '$http', 'weatherService', function($scope, $http, weatherService) {

  $scope.city; // User entered search query
  $scope.data = []; // Sorted forecast data
  $scope.days = []; // Stores the forecast days for tabs

  $scope.search = function() {
    weatherService.getWeather($scope.city)
      .success(function(result) {

        // Iterate the list array in result
        result.list.forEach(function(item, index) {

          // Temp obj to save the desired data from list array
          var obj = {
            date: new Date(item.dt_txt).toUTCString(),
            min_temp: item.main.temp_min,
            max_temp: item.main.temp_max,
            humidity: item.main.humidity
          };
          $scope.data.push(obj);

          $scope.flag = true; // Flag variable to store unique values in days array
          // Iterate the days array to store only unique forecast days
          $scope.days.forEach(function(day) {
            // If day already exists in days array, set flag to false to avoid duplicates
            if (day === new Date(item.dt_txt).toUTCString().substring(0, 11)) {
              $scope.flag = false;
            }
          });

          // If flag is unchanged, insert the new value
          if ($scope.flag) {
            $scope.days.push(new Date(item.dt_txt).toUTCString().substring(0, 11));
          }

        })
      })
      .error(function(data, status) {
        console.log(data);
      });
  }

}]);

weatherApp.service('weatherService', ['$http', function($http){
  // Returns a promise
  this.getWeather = function(city){
    return $http.get('http://api.openweathermap.org/data/2.5/forecast?appid=8073806a0586530b5a4adf67e8467a05&units=metric&q=' + city);
  }
}])
