
const modernToggleDirective = () => ({

    restrict: 'E',
    template: '<div class="modern-toggle on animate2s"><div class="animate2s"></div></div>',
    replace: true,
    scope: {
        onToggle: '&',
        title: '@'
    },
    link: (scope, element) => {

        /* INFO */ console.info(element);

        element.attr('title', scope.title);

        element[0].click(() => {
            scope.onToggle(true);

            if (element.hasClass('on')) {
                element.removeClass('on').addClass('off');
            }
            else if (element.hasClass('off')) {
                element.removeClass('off').addClass('on');
            }

        });

    }

});

export default modernToggleDirective;