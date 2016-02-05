'use strict';

angular.module('offsite.users', []).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('users', {
    url: '/users',
    template: '<ui-view/>'
  }).state('users.login', {
    url: '/login',
    templateUrl: 'components/users/login.html',
    controller: 'usersLogin'
  });
}]);

