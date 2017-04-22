$(function() {
    VK.init(function() {
        var myId = 32931152;

        var photos = [];
        var condition = true;
        for (var offset = 0; condition; offset += 200) {
            VK.api("photos.getAll", {"owner_id": myId, "offset":offset,"extended": 1}, function (data) {
                    for (var i = 0, max = data.response.items.length; i < max; i++) {
                        photos.push({
                            "image": data.response.items[i].photo_130,
                            "date": data.response.items[i].date,
                            "likes": data.response.likes[i].count
                        });
                    }
                    if (true || max < 200) { //todo убрать или
                        condition = false;
                        new Vue ({
                            el: '#app',
                            data: {
                                items: photos
                            }
                        });
                    }
                }
            )}
    }, function() {
        // API initialization failed
        // Can reload page here
    }, '5.63');
});

