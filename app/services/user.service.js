'use strict';

angular.module('user', [])
  .factory('$user', ['$q', '$api', '$auth', '$timeout', '$translate', '$rootScope', function ($q, $api, $auth, $timeout, $translate, $rootScope) {
    var userService = {};
    var cached = {};
    userService.userPromiseDoneStateFlag = false;
    userService.userPromise = function () {
      var deferred = $q.defer();
      $api.users.get({id: userService.id}, function (response) {
        assign(response);
        deferred.resolve(response);
        userService.userPromiseDoneStateFlag = true;
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    //userService.language = 'en';
    var assign = function (object) {
      cached = object;
      //if (object.settings != undefined && object.settings.language != undefined) {
      //  userService.language = object.settings.language;
      //}
      // Expose in $rootScope for avatar and various other UI-related logic
      $rootScope.user = object;
      // Set instance variable for controllers and other components
      for (var key in object) {
        userService[key] = object[key];
      }
      //$translate.use(userService.language);
    };

    userService.init = function (object_or_id) {
      console.log(cached);
      if (typeof object_or_id == 'object') {
        // We will use the object given until we fetch an actual one
        assign(object_or_id);
        userService.id = object_or_id.id;
      }
      else {
        userService.id = object_or_id;
      }
      userService.userPromise().then(function () {
        console.log("User Resolved");
      });
      /*    $api.users.get({id: userService.id}, function (response) {
            assign(response);
            console.log(response);
            //$rootScope.$broadcast('language-change', response.settings.language);
            });*/
    };

    userService.isAnonymous = function () {
      if (userService.id != undefined) {
        return false;
      }
      return true;
    };

    userService.update = function (attributes) {
      return $q(function (resolve, reject) {
        $api.users.update({id: userService.id}, {user: attributes}, function (response) {
          assign(response);
          cached = response;
          resolve(true);
        }, function (response) {
          reject(response.errors);
        });
      });
    };

    userService.updateUserDeviceToken = function (device_token) {
      var user = {
        device_id: device_token
      };
      userService.update(user);
    };

    userService.login = function (email, password) {
      return $q(function (resolve, reject) {
        $auth.submitLogin({
          email: email,
          password: password
        }).then(function (response) {
          userService.init(response);
          resolve(true);
          $rootScope.$broadcast('user-logged-in', response);
        }).catch(function (response) {
          if (response != null && response.errors) {
            reject(response.errors[0]);
          }
          else {
            reject('Unknown error');
          }
        });
      })
    };

    userService.logout = function () {
      return $q(function (resolve, reject) {
        $auth.signOut()
          .then(function (response) {
            userService.id = undefined;
            cached = {};
            assign({});
            resolve(response);
          })
          .catch(function (response) {
            reject(response);
          });
      });
    };

    return userService;
  }]);
