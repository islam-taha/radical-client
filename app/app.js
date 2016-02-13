'use strict';

// Declare app level module which depends on views, and components
angular.module('offsite', [
  'ui.utils',
  'ui.router',
  'pascalprecht.translate',
  'LocalStorageModule',
  'ngMaterial',
  'offsite.users',
  'ngMdIcons',
  'satellizer',
  'api',
  'user'
], function ($httpProvider) {
  FastClick.attach(document.body);
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

angular.module('offsite').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'localStorageServiceProvider', '$authProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, localStorageServiceProvider, $authProvider) {
  //This is our home page
  $urlRouterProvider.otherwise('users/home');
  $authProvider.facebook({
    clientId: '1740985482790132'
  });

  $authProvider.google({
    clientId: '1045775647188-guap0gbt3ohej890p66a6tnkp672qoo8.apps.googleusercontent.com'
  });
}]).run(['$http', '$location', '$rootScope', '$state', '$translate', '$auth', '$timeout', '$mdSidenav', function ($http, $location, $rootScope, $state, $translate, $auth, $timeout, $mdSidenav) {

  $rootScope.toggleLeft = function () {
    $mdSidenav('left').toggle()
  }

  $rootScope.close = function () {
    $mdSidenav('left').close()
  };

  ////$auth.validateUser().then(function (user) {
  //
  //}).catch(function () {
  //  $state.go('users.login')
  //});
}])
