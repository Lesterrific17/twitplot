
export default ($timeout) => ({
    restrict: 'E',
    template:
      `<div class="modern-toggle animate2s" ng-class="[state ? 'on' : 'off']">
        <div class="animate2s"></div>
      </div>`,
    replace: true,
    scope: true,
    require: 'ngModel',
    link: (scope, element, attr, ngModel) => {
      ngModel.$render = () => {
        scope.state = ngModel.$modelValue;
      };
      let toggle = $(element);
      toggle.click(() => {
        $timeout(() => {
          scope.state = !scope.state;
          ngModel.$setViewValue(scope.state);
        })
      });
    }
});
