
export default ($timeout) => ({

    restrict: 'A',
    link: (scope, element, attribute, ngModel) => {
        $(element).bind('DOMMouseScroll mousewheel wheel', (e) => {
            $timeout(() => {
                if(e.originalEvent.deltaY < 0)
                    scope.scrollWheelValue++;
                else if(e.originalEvent.deltaY > 0)
                    scope.scrollWheelValue--;
            })
        });
    }

});
