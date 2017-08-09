
export default $timeout => ({

    restrict: 'A',
    link: (scope, element) => {
        $(element).bind('DOMMouseScroll mousewheel wheel', e => {
            $timeout(() => {
                if (e.originalEvent.deltaY < 0) scope.scrollWheelValue += 1;
                else if (e.originalEvent.deltaY > 0) scope.scrollWheelValue -= 1;
            })
        });
    }

});
