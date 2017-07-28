
export default function () {
    return {
        template: require('raw-loader!./templates/toggleSetting.html'),
        restrict: 'E',
        replace: true,
        controller: function($scope) {

        }
    }
};