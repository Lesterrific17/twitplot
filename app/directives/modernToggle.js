
const modernToggleDirective = () => ({

    restrict: 'E',
    template: '<div class="modern-toggle animate2s"><div class="animate2s"></div></div>',
    replace: true,
    scope: {
        onToggle: '&',
        title: '@',
        state: '='
    },
    link: (scope, element, attr) => {

        $(element).addClass(attr.state);
        scope.state = attr.state;

        $(element).click(() => {
            var toggleState = attr.state;
            if(toggleState === 'off'){
                $(element).removeClass('off').addClass('on');
                attr.state = 'on';
            }
            else if(toggleState === 'on'){
                $(element).removeClass('on').addClass('off');
                attr.state = 'off';
            }
        });
    }

});

export default modernToggleDirective;