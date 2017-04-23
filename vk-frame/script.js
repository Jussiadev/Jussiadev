$(function() {
    VK.init(function() {
        //топ - 3 фотографий
        var myId = 32931152,
        ruMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября',
            'ноября', 'декабря'];

        var photos = [];
       // for (var offset = 0; offset < 1000; offset += 200) {
            VK.api("photos.getAll", {"owner_id": myId, "offset":0,"extended": 1}, function (data) {
                    for (var i = 0, max = data.response.items.length; i < max; i++) {
                        var d = new Date(data.response.items[i].date*1000);
                        photos.push({
                            "image": data.response.items[i].photo_130,
                            "date": d.getDate() + ' '+ ruMonth[d.getMonth()] + ' ' + d.getFullYear(),
                            "likes": data.response.items[i].likes.count
                        });
                    }
                    //if (max < 200) {
                photos = photos.sort(function(a, b) {
                    return b.likes - a.likes;
                });
                        new Vue ({
                            el: '#app',
                            data: {
                                photos: {
                                    first: photos[0].image,
                                    second: photos[1].image,
                                    third: photos[2].image
                                }
                            }
                        });
                      //  break;
                    //}
                }
            );
        //}

        //друзья, у которых установлено данное приложение
        var getApp;
        VK.api("friends.getAppUsers", function (data){
           getApp = data.response.join(',');
           console.log(getApp);

            //получаем аватарки друзей
            VK.api("users.get", {"user_ids": getApp,"fields":"photo_100"}, function (data){
                    console.log(data);
                }
            )
        });


    }, function() {
        // API initialization failed
        // Can reload page here
    }, '5.63');
});

