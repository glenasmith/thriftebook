angular.module('app', ['satellizer', 'ui.bootstrap', 'ui.router', 'toastr', 'ngAnimate'])
    .config(function ($authProvider, $stateProvider, toastrConfig) {

        $authProvider.twitter({
            url: '/api/user/login'
        });

        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'home.html',
            controller: 'Home'
        }).state('yourOtherState', {
            url: '/deal?id',
            templateUrl: 'deal.html',
            controller: 'Deal'
        })

        toastrConfig.positionClass = 'toast-bottom-right'

    });