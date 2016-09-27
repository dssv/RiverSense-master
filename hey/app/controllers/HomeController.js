var app = angular.module('EI', ['ngRoute', 'uiGmapgoogle-maps', 'ui.knob']);

app.controller('Home', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http){

	$scope.map = { center: { latitude: -8.114891, longitude: -34.938214 }, zoom: 14, id:'1' };
	$scope.options = {icon:'imagens/marker.png'};
	$scope.dadoportal = [];
	$scope.dadosensor =[];

	$scope.msgChuva = "";
  

	$scope.valueSolo = 23;
  	$scope.soloOptions = {
  	  unit: "%",
	  displayPrevious: true,
	  barCap: 25,
	  trackWidth: 30,
	  barWidth: 20,
	  trackColor: '#063e93',
	  barColor: '#fbee1e',
	  textColor: '#063e93',
	  subText: {
	    enabled: true,
	    text: 'Teor de água',
	    color: 'gray',
	    font: 'auto'
  	  },
  	  readOnly: true
	};

	$scope.valueChuva = 0;
  	$scope.chuvaOptions = {
	  displayPrevious: true,
	  trackWidth: 25,
	  barWidth: 20,
	  trackColor: '#063e93',
	  barColor: '#fbee1e',
	  textColor: '#063e93',
	  subText: {
	    enabled: true,
	    text: 'mm',
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
  	  readOnly: true,
  	  min: 0,
  	  max: 100,
  	  dynamicOptions: true,
  	  displayPrevious: true
	};

	coletardadosportal();

	function coletardadosportal(){
      $http({
        method: 'GET',
        url:" https://cors-anywhere.herokuapp.com/http://dados.recife.pe.gov.br/storage/f/2013-10-03T14%3A31%3A56.090Z/tabs-reg-sul-pontos-cood-geo-lat-long-json.geojson",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function successCallback(response) {
        var dados = response.data;
        var tam = dados.features.length;
        for (var j = 0; tam > j; j++) {
          var obj = {
              longitude : dados.features[j].properties.Longitude,
			        latitude : dados.features[j].properties.Latitude,
              icon: 'imagens/markers-sensor.png',
              id:j,
              show: false
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
	
	function coletardatasensores(dadoportal){
      $http({
        method: 'GET',
        url:"http://172.19.5.253/embarquelab/downloads/EL_sensores_json.php",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function successCallback(response) {
        var dados = response.data;
        var tam = dados.Sensor.length;
        for (var j = 0; tam > j; j++) {
          var obj = {
              "valor" : dados.Sensor[j].Valor
          }
          $scope.dadosensor.push(obj);
        }
        //processa(dadosensor,dadoportal);

      },
      function errorCallback(response) {
        //$.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
      });
    }


	setInterval(function(){
		$http({
		  method: 'GET',
		  url: 'http://172.19.5.253/embarquelab/downloads/EL_sensores_json.php'
		}).then(function successCallback(response) {
        var val = (((3.14*0.00075625) * ((parseFloat(response.data.Sensor[1].Valor)) / 100)) * 1000) / (3.14*0.00075625);
        if(val>100){
          $scope.valueChuva = 100;
        } else if (val < 100){
          $scope.valueChuva = val;
        }
    		$scope.valueChuva = val;
    		console.log($scope.valueChuva);
  		}, function errorCallback(response) {
    		console.log(response);
  		});
	}, 5000);

	$scope.mensagem = window.sessionStorage.getItem('mensagem');
	$scope.token = window.sessionStorage.getItem('token');

}]);

app.config(['$routeProvider', '$httpProvider','uiGmapGoogleMapApiProvider','uiGmapGoogleMapApiProvider' ,function ($routeProvider, $httpProvider,GoogleMapApiProviders,uiGmapGoogleMapApiProvider) {
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
		      controller     : 'Home'
		   })
		   .when('/solicitacao', {
		      templateUrl : 'app/views/solicitacao.html',
		      controller     : 'Home'
		   })
			 .when('/mensagem', {
				 templateUrl : 'app/views/mensagem.html',
				 controller     : 'Home'
			 })
		   .otherwise ({ redirectTo: '/' });

	    // ferificando se o usuário esta logado no sistema 
	  }
    
]);
