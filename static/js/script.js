$(document).ready(function() {
    $('#fullpage').fullpage({
        navigation: true,
        anchors: ['firstPage', 'secondPage', 'thirdPage', 'thirdPage', 'thirdPage', 'thirdPage', 'thirdPage', 'thirdPage', 'fourthPage'],
        navigationPosition: 'right',
        navigationTooltips: ['Главная', 'Обо мне'],
        fitToSection: false,
        fixedElements: '.header',
        slidesNavigation: true,
        afterLoad: function(anchor) {
            $('.nav').removeClass('letter');
            var $activeLink = $('a[href="#'+anchor+'"]');
            if ($activeLink) {
                $activeLink.addClass('letter');
            }
        }
    });

    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
        }
    );
});