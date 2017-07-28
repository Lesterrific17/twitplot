import toggleSetting from '../templates/toggleSetting.html';

export default () => ({
    restrict: 'E',
    templateUrl: toggleSetting,
    replace: true,
    scope: true,
    require: 'ngModel',
    link: (scope, element, attr, ngModel) => {
      ngModel.$render = () => {
        scope.setting = ngModel.$modelValue;
      }
      scope.$watch('setting.state', () => {
        ngModel.$setViewValue(ngModel.$modelValue);
      })
    }
});
