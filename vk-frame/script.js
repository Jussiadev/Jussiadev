$(function() {
    VK.init(function() {
        var myId = 32931152,
        ruMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября',
            'ноября', 'декабря'];

        var photos = [];
       // for (var offset = 0; offset < 1000; offset += 200) {
            VK.api("photos.getAll", {"owner_id": myId, "offset":0,"extended": 1}, function (data) { console.log(data);
                    for (var i = 0, max = data.response.items.length; i < max; i++) {
                        var d = new Date(data.response.items[i].date*1000);
                        photos.push({
                            "image": data.response.items[i].photo_130,
                            "date": d.getDate() + ' '+ ruMonth[d.getMonth()] + ' ' + d.getFullYear(),
                            "likes": data.response.items[i].likes.count
                        });
                    }
                    //if (max < 200) {
                photos = photos.sort(function(a,b) {
                    if (a.likes < b.likes)
                        return -1;
                    if (a.likes > b.likes)
                        return 1;
                    return 0;
                });
                        new Vue ({
                            el: '#app',
                            data: {
                                items: photos
                            }
                        });
                      //  break;
                    //}
                }
            )
        //}
    }, function() {
        // API initialization failed
        // Can reload page here
    }, '5.63');
});

