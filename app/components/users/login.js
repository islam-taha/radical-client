angular.module('offsite.users')
  .controller('usersLogin', [ '$scope', '$rootScope', '$state', '$mdDialog', '$mdMedia', '$api', function ($scope, $rootScope, $state, $mdDialog, $mdMedia, $api, $http) {
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

function DialogController($scope, $mdDialog, $state, $api, $http) {

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
    "International Academy for Engineering & Media Science",
    "Institute of Aviation",
    "Misr International University",
    "Misr University for Science & Technology - MUST",
    "Modern Academy",
    "Modern Science & Arts - MSA",
    "New Cairo Institute",
    "New Cairo",
    "Nile University",
    "Sadat Academy",
    "UFE - French University in Egypt",
    "Azhar University",
    "Others"
  ];

  $scope.truncateString = function() {
    var trueName = $scope.chooseYourUniversity;
    if (trueName.length > 15)
      return '...';
  }

  $scope.programs = [
    "volunteer abroad",
    "intern abroad"
  ];
  $scope.selected_programmes = []
  var selected = $scope.program === $scope.programs[0] ? 1 : 2;
  $scope.selected_programmes.push(selected)
  
  $scope.chooseYourUniversity = "University";
  $scope.program = "program";
  $scope.load = 0;

  $scope.send = function(){
    console.log("ana waslt");
    //entry.699592646=first&entry.1746082076=last&entry.142759006=email&entry.416123512=phone&entry.840760348=program
    var baseURLGCDP = 'https://docs.google.com/forms/d/1EeFsq3Tew6n0v0MkpAgWUhbZQKlgLeHDYyyJa3yJ-RA/formResponse?entry.1208915329='+
    $scope.user.firstname + '&entry.1413411617=' + $scope.user.lastname + '&entry.748780560=' + $scope.user.email + '&entry.636233967='
    + $scope.user.phone  + '&entry.2079142700=' + $scope.chooseYourUniversity;
    var baseURLGIP = 'https://docs.google.com/forms/d/1wwFoTxcELHno4PnWGQle8f_SXWOZSNAHtZlqKzVBzGg/formResponse?entry.127612284='+
    $scope.user.firstname + '&entry.903668794=' + $scope.user.lastname + '&entry.1511336819=' + $scope.user.email + '&entry.766577093='
    + $scope.user.phone + '&entry.229448422=' + $scope.chooseYourUniversity;
    if($scope.program===$scope.programs[0]){
      //submitPro = "GCDP";
      var submitRef = '&submit=Submit';
      var submitURL = (baseURLGCDP+ submitRef);
      console.log(submitURL);
      var i = document.createElement('iframe');
      i.style.display = 'none';
      i.src = submitURL;
      document.body.appendChild(i);
    }else{
      //submitPro = "GIP";
      var submitRef = '&submit=Submit';
      var submitURL = (baseURLGIP+ submitRef);
      console.log(submitURL);
      var i = document.createElement('iframe');
      i.style.display = 'none';
      i.src = submitURL;
      document.body.appendChild(i);
    }
    
  };
  $scope.register = function() {
		$scope.selected_programmes = []
		var selected = $scope.program === $scope.programs[0] ? 1 : 2;
		$scope.selected_programmes.push(selected)
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
          "person[manager_ids][]": $scope.selected_programmes[0] === 1 ? [35544, 35544] : [16689, 16689]
        };
        $scope.load = 1;
        console.log($scope.university);
        $api.authAiesec.create(JSON.stringify(userParams), function(data) {
          $scope.load = 0;
          if (data.is_migrated) {
            $scope.user.email = "EMAIL ALREADY TAKEN"
          } else {
            $scope.send();
            alert("Hello! You have registered successfully ! \nNow you will be redirected to EXPA, just sign in !");
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
