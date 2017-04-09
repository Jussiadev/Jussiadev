var map, mapRoute;

ymaps.ready(function() {
    map = new ymaps.Map('map', {
        center: [44.95833800, 34.10996118],
        zoom: 12,
        controls: []
    });
});

function createRoute() {
    // Удаление старого маршрута
    if (mapRoute) {
        map.geoObjects.remove(mapRoute);
    }

    var routeFrom = 'Симферополь ' + document.getElementById('start').value;
    var routeTo = 'Симферополь ' + document.getElementById('finish').value;

    // Создание маршрута
    var router = new ymaps.route([routeFrom, routeTo], {mapStateAutoApply:true}).then(
        function(route) {
            route.getPaths().options.set({
                // В балуне выводим только информацию о времени движения с учетом пробок.
                balloonContentLayout: ymaps.templateLayoutFactory.createClass('{{ properties.humanJamsTime }}'),
                // Можно выставить настройки графики маршруту.
                strokeColor: '00D2FCff',
                opacity: 0.9
            });

            map.geoObjects.add(route);
            calculate(route.getLength());
            mapRoute = route;
        },
        function(error) {
            alert('Невозможно построить маршрут');
        }
    );
}

function calculate(length) {
    var km = length / 1000,
        cost = Math.ceil(75 + 15 * km);
    document.getElementById('rub').innerText = cost + ' руб.';
    document.getElementById('km').innerText = km.toFixed(2) + ' км.';
}




