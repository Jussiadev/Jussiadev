$(function() {
    VK.init(function() {
        //топ - 3 фотографий
        var myId = 32931152;

        var photos = [];
       // for (var offset = 0; offset < 1000; offset += 200) {
            VK.api("photos.getAll", {"owner_id": myId, "offset":0,"extended": 1}, function (data) {
                    for (var i = 0, max = data.response.items.length; i < max; i++) {
                        photos.push({
                            "image": data.response.items[i].photo_130,
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
        var users = [];
        VK.api("friends.getAppUsers", function (data){
           getApp = data.response.join(',');
           console.log(getApp);

            //получаем аватарки друзей
            VK.api("users.get", {"user_ids": getApp,"fields":"photo_100"}, function (data){
                for (var i = 0, max = data.response.length; i < max; i++) {
                    users.push({
                        "first_name": data.response[i].first_name,
                        "second_name": data.response[i].last_name,
                        "ava": data.response[i].photo_100
                    });
                }
                }
            )
        });


    }, function() {
        // API initialization failed
        // Can reload page here
    }, '5.63');
});

