'use strict';

angular.module('api', ['ngResource', 'satellizer'])
    .config(['$authProvider', function ($authProvider) {

      window.backendUrl = 'http://localhost:3000/api'
      // TODO: construct the url in a cleaner way
      $authProvider.httpInterceptor = function () {
        return true;
      };
      $authProvider.withCredentials = true;
      $authProvider.tokenRoot = null;
      $authProvider.cordova = false;
      $authProvider.baseUrl = window.backendUrl;
      $authProvider.loginUrl = '/auth/sign_in';
      $authProvider.signupUrl = '/auth/sign_up';
      $authProvider.tokenName = 'token';
      $authProvider.tokenPrefix = 'satellizer';
      $authProvider.authHeader = 'Authorization';
      $authProvider.authToken = 'Bearer';
      $authProvider.storageType = 'localStorage';

      $authProvider.facebook({
        name: 'facebook',
        url: '/auth/facebook',
        authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
        redirectUri: window.location.origin + '/',
        requiredUrlParams: ['display', 'scope'],
        scope: ['email'],
        scopeDelimiter: ',',
        display: 'popup',
        type: '2.0',
        popupOptions: {width: 580, height: 400}
      });

      $authProvider.google({
        url: '/auth/google_oauth2',
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
        redirectUri: window.location.origin,
        requiredUrlParams: ['scope'],
        optionalUrlParams: ['display'],
        scope: ['profile', 'email'],
        scopePrefix: 'openid',
        scopeDelimiter: ' ',
        display: 'popup',
        type: '2.0',
        popupOptions: {width: 452, height: 633}
      });
    }])
    .factory('Resource', ['$resource', function ($resource) {
      return function (url, params, methods) {
        var defaults = {
          update: {method: 'put', isArray: false},
          create: {method: 'post'}
        };

        methods = angular.extend(defaults, methods);

        var resource = $resource(url, params, methods);

        resource.prototype.$save = function () {
          if (this.id) {
            return this.$update();
          }
          else {
            return this.$create();
          }
        };

        return resource;
      };
    }])
    .factory('$api', ['Resource', '$auth', function ($resource, $auth) {
      var apiService = {};

      apiService.apiUrl = window.backendUrl;

      apiService.endpoint = function (path) {
        return $auth.apiUrl() + '/' + path;
      };

      apiService.users = $resource(apiService.endpoint('users/:id'), {id: "@id"}, {
        can: {
          isArray: false,
          method: 'GET',
          url: apiService.endpoint('/users/can/'),
          params: {verb: "@verb", object_id: "@object_id", object_type: "@object_type"}
        }
      });

      return apiService;
    }]);
