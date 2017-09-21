var app = angular.module('myApp',["ngRoute"]);
  app.config(['$routeProvider','$locationProvider','$provide',function($routeProvider,$locationProvider,$provide) {
	  $locationProvider.html5Mode({enabled: true,requireBase: false});
	 var PAGE_APP_PATH = "app/"
   $routeProvider
		.when('/view', {
			templateUrl: PAGE_APP_PATH+'hello.html',
			controller: 'helloCtrl'
		})
		.when('/view1', {
			templateUrl: PAGE_APP_PATH+'hello1.html',
			controller: 'helloCtrl'
		})
		.when('/view2', {
			templateUrl: PAGE_APP_PATH+'hello2.html',
			controller: 'helloCtrl1'
		})
		 .otherwise({
			redirectTo: '/view'
		});
  }]);
app.controller('adminAppCtrl',function($scope,$location ){
 
}) 
.controller('helloCtrl',["$scope","dataService","$location","$rootScope",function($scope,dataService,$location,$rootScope){ 
	$scope.submit = function(dta){ 
	   dataService.imageScraper(dta).then(function(res){ 
	            console.log(res);
				 if(res.data.length > 0){
						 $location.path('/view1');
					} 
	  }); 
	}  
	dataService.getsaveBeforeS().then(function(res){
		console.log(res);
		if(res.data.responseCode == 200){
		  $scope.beforeSearch = res.data.data;
		 }
	});
	$scope.getImages = function(dt){
		$rootScope.images = dt.url;  
		$location.path('/view2');
	}
}])
.controller('helloCtrl1',["$scope","$routeParams","dataService","$location","$rootScope",function($scope,$routeParams,dataService,$location,$rootScope){ 
                $scope.images = $rootScope.images; 
}])
.service('dataService',function ($http, $q, $window) {
	 this.imageScraper = function (data) {
                var defer = $q.defer(); 
                $http({
                    method: "POST", 
					data : data,
                     url: "http://localhost:8000/imageScraper"
                }).then(function successCallback(response) {
                    defer.resolve(response);
                }, function errorCallback(response) { 
                    defer.resolve(response);
                });
                return defer.promise
     }	
	 this.saveBeforeS = function(data){
		 var defer = $q.defer(); 
                $http({
                    method: "POST", 
					data : data,
                     url: "http://localhost:8000/saveRcnSrch"
                }).then(function successCallback(response) {
                    defer.resolve(response);
                }, function errorCallback(response) { 
                    defer.resolve(response);
                });
                return defer.promise
	 }
	  this.getsaveBeforeS = function(){
		 var defer = $q.defer(); 
                $http({
                    method: "GET",  
                     url: "http://localhost:8000/getsaveRcnSrch"
                }).then(function successCallback(response) {
                    defer.resolve(response);
                }, function errorCallback(response) { 
                    defer.resolve(response);
                });
                return defer.promise
	 }
	 
});