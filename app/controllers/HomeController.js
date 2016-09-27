var app = angular.module('app', [ 'ngRoute', 'uiGmapgoogle-maps', 'ui.knob', 'highcharts-ng']);

app.controller('Home', ['$rootScope', '$scope', function($rootScope, $scope){

	$scope.map = { center: { latitude: -8.0666045, longitude: -34.9370523 }, zoom: 16, id:'1' };
	$scope.options = {icon:'imagens1/markers.png'};

  	$scope.valueNivel = 23;
  	$scope.NivelOptions = {
  	  unit: "m",
	  displayPrevious: true,
	  barCap: 25,
	  trackWidth: 30,
	  barWidth: 20,
	  trackColor: '#063e93',
	  barColor: '#fbee1e',
	  textColor: '#063e93',
	  subText: {
	    enabled: true,
	    text: '',
	    color: 'gray',
	    font: 'auto'
  	  },
  	  readOnly: true
	};

	$scope.valueChuva =23 ;
  	$scope.chuvaOptions = {
	  displayPrevious: true,
	  trackWidth: 25,
	  barWidth: 20,
	  trackColor: '#063e93',
	  barColor: '#fbee1e',
	  textColor: '#063e93',
	  subText: {
	    enabled: true,
	    text: 'L/min',
	    color: 'gray',
	    font: 'auto'
  	  },
  	  scale: {
    	enabled: true,
	    type: 'lines',
	    color: 'gray',
	    width: 2,
	    quantity: 20,
	    height: 10
  	  },
  	  readOnly: true
	};

	function coletardados_ecd(){
      $http({
        method: 'GET',
        url:" https://cors-anywhere.herokuapp.com/http://dados.recife.pe.gov.br/storage/f/2013-10-03T14%3A31%3A56.090Z/tabs-reg-sul-pontos-cood-geo-lat-long-json.geojson",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function successCallback(response) {
        var dados = response.data;
        var tam = dados.length;
        for (var j = 0; tam > j; j++) {
          var obj = {
              longitude : dados.features[j].properties.Longitude,
			  latitude : dados.features[j].properties.Latitude,
              //icon: 'imagens/markers-sensor.png',
              //id:j,
              //show: false
          }
          $scope.dadoportal.push(obj);
        }
        //console.log(obj);
        //coletardatasensores($scope.dadoportal);
      },
      function errorCallback(response) {
        //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
      });
    }
}]);

app.controller('estacao', ['$rootScope', '$scope', function($rootScope, $scope){


   $scope.enviar = function(){
          var date = new Date();
          console.log("http://10.0.20.191:9000/save/"+$scope.idecd+"/"+$scope.lat+"/"+$scope.lon+"/ELA"+"/"+date);
          $http({
            method: 'GET',
            url:"http://10.0.20.191:9000/save/"+$scope.idecd+"/"+$scope.lat+"/"+$scope.lon+"/ELA"+"/"+date,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function successCallback(response) {
            console.log(response)
            alert("Enviada com sucesso!")
            window.location="#/index"
                    
          }, 
          function errorCallback(response) {
            //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
          });
        }
}]);

 app.directive('hcChart', function () {
	return {
	    restrict: 'E',
	    template: '<div></div>',
	    scope: {
	        options: '='
	    },
	    link: function (scope, element) {
	        Highcharts.chart(element[0], scope.options);
	    }
	};
});

app.directive('hcPieChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: scope.title
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    data: scope.data
                }]
            });
        }
    };
});

app.controller('historico', ['$rootScope', '$scope', function($rootScope, $scope){

	$scope.chartOptions = {
        title: {
            text: 'Temperature data'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    };

    // Sample data for pie chart
    $scope.pieData = [{
            name: "Microsoft Internet Explorer",
            y: 56.33
        }, {
            name: "Chrome",
            y: 24.03,
            sliced: true,
            selected: true
        }, {
            name: "Firefox",
            y: 10.38
        }, {
            name: "Safari",
            y: 4.77
        }, {
            name: "Opera",
            y: 0.91
        }, {
            name: "Proprietary or Undetectable",
            y: 0.2
    }];

}]);
 
app.config(['$routeProvider', '$httpProvider','uiGmapGoogleMapApiProvider','uiGmapGoogleMapApiProvider',function ($routeProvider, $httpProvider,GoogleMapApiProviders,uiGmapGoogleMapApiProvider) {
    GoogleMapApiProviders.configure({
            china: true
        });
    uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyD5NlE-j9QZrnSd7f-sUw9KR_i5GUabRzY',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
	
	 $routeProvider
		   .when('/', {
		      templateUrl : 'app/views/home.html',
		      controller     : 'Home',
		   })
		   .when('/solicitacao', {
		      templateUrl : 'app/views/solicitacao.html',
		      controller     : 'Home',
		   })
			.when('/historicodata', {
		      templateUrl : 'app/views/historicodata.html',
		      controller     : 'historico',
		   })
		   .when('/estacao', {
		      templateUrl : 'app/views/estacao.html',
		      controller     : 'estacao',
		   })
		   .otherwise ({ redirectTo: '/' });

	    // verificando se o usuário esta logado no sistema 
	  }
    
]);
