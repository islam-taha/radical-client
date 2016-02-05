angular.module('offsite.users')
    .controller('usersLogin', ['$scope', '$rootScope', '$auth', '$state', '$translate', '$mdDialog', '$mdMedia', function ($scope, $rootScope, $auth, $state, $translate, $mdDialog, $mdMedia) {
      $rootScope.pageClasses = 'full-background';
      console.log('yla bena')
      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      $scope.showAdvanced = function (ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
              controller: DialogController,
              templateUrl: 'components/users/login.html',
              parent: angular.element(document.body),
              clickOutsideToClose: false,
              fullscreen: false
            })
            .then(function (answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
              $scope.status = 'You cancelled the dialog.';
            });
        $scope.$watch(function () {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      };

      $scope.showAdvanced();
<<<<<<< HEAD


    }]);

function DialogController($scope, $mdDialog, $state, $auth) {
  $scope.cancel = function () {
    $mdDialog.cancel();
    //$state.go('user')
  };

  $scope.googleAuth2 = function () {
    $auth.authenticate('google').then(function (response) {
      console.log(response)
    })
  }

  $scope.facebookAuth = function () {
    $auth.authenticate('facebook');
  }
=======
    }]);

function DialogController($scope, $mdDialog) {
  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
>>>>>>> f40abf2... initial commit
}
