angular.module('app').controller('Home', function ($scope, $http) {
    $http.get('/api/deals/current').then(function (deals) {
        $scope.deals = deals.data;
    })
});