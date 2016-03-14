angular.module('offsite.users')
  .controller('usersLogin', ['$scope', '$rootScope', '$state', '$mdDialog', '$mdMedia', '$api', function ($scope, $rootScope, $state, $mdDialog, $mdMedia, $api) {
    $rootScope.pageClasses = 'full-background';
    console.log('yla bena')
    $scope.univ = [1,2,3,4];
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAdvanced = function (ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'components/users/login.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        fullscreen: false,
        escapeToClose: false
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

  }]);

function DialogController($scope, $mdDialog, $state, $api) {

  var originatorEv;
  
  $scope.openMenu = function($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };
  
  $scope.university = function(index) {
    $scope.chooseYourUniversity = $scope.universities[index];
  };

  $scope.chooseProgram  = function(index) {
    $scope.program = $scope.programs[index];
  }

  $scope.universities = [
    "6th of October",
    "AAST in Alexandria",
    "AAST in Cairo",
    "Ahram Canadian University",
    "Ain Shams University",
    "Akhbar El Yom",
    "American University in Cairo",
    "AOU - Arab Open University",
    "British University in Cairo",
    "Cairo University",
    "Canadian International College",
    "ERU - Egyptian Russian University",
    "German University in Cairo",
    "Heliopolis University",
    "HTI - Higher Technology Institution",
    "International Academy for Engineering &amp; Media Science",
    "Institute of Aviation",
    "Misr International University",
    "Misr University for Science &amp; Technology - MUST",
    "Modern Academy",
    "Modern Science &amp; Arts - MSA",
    "New Cairo Institute",
    "New Cairo",
    "Nile University",
    "Sadat Academy",
    "UFE - French University in Egypt"
  ];

  $scope.programs = [
    "volunteer abroad",
    "intern abroad"
  ];

  $scope.selected_programmes = []
  var selected = $scope.program === $scope.programs[0] ? 1 : 2;
  $scope.selected_programmes.push(selected)
  
  $scope.chooseYourUniversity = "choose your university";
  $scope.program = "program";
  $scope.load = 0;

  $scope.register = function() {
    if ($scope.user.phone.length == 11 && $scope.user.phone.match('[0-9]')) {
      if ($scope.user.password === $scope.user.password_confirmation) {
        var userParams = {
          "person[email]": $scope.user.email,
          "person[first_name]": $scope.user.firstname,
          "person[last_name]": $scope.user.lastname,
          "person[password]": $scope.user.password,
          "person[profile][selected_programmes][]": $scope.selected_programmes,
          "person[contact_info][phone]": $scope.user.phone,
          "person[home_lc_id]": 1064,
          "person[home_mc_id]": 1609,
          "person[manager_ids][]": [$scope.selected_programmes[0] === 1 ? 35544 : 16689]
        };
        $scope.load = 1;
        $api.authAiesec.create(JSON.stringify(userParams), function(data) {
          $scope.load = 0;
          if (data.is_migrated) {
            $scope.user.email = "EMAIL ALREADY TAKEN"
          } else {
            window.location = "https://opportunities.aiesec.org"
          }
        }, function() {
          $scope.load = 0;
        });
      } else {
        $scope.user.password_confirmation = "";
      }
    } else {
      $scope.user.phone = "";
    }
  };

  $scope.isLockedOpen = function() {
    return true;
  }
}
