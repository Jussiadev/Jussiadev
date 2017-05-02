var app = new Vue ({
    el: "#app",
    data: {
        photos: {
            first: false,
            second: false,
            third: false
        },
        friends: []
    }
});

$(function() {
    VK.init(function() {
        //топ - 3 фотографий
        var myId = 32931152;

        loadPhoto(myId);
        appUsers();


    }, function() {}, '5.63');

    $('#invite_friends').click( function() {
        VK.callMethod("showInviteBox");
    })
});

function loadPhoto(id) {
    var photos = [];
    // for (var offset = 0; offset < 1000; offset += 200) {
    VK.api("photos.getAll", {"owner_id": id, "offset":0,"extended": 1}, function (data) {
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
            app.photos.first = photos[0].image;
            app.photos.second = photos[1].image;
            app.photos.third = photos[2].image;
            //  break;
            //}
        }
    );
    //}
}

function getFriends(user_ids) {
    //получаем аватарки друзей
    VK.api("users.get", {"user_ids": user_ids,"fields":"photo_100"}, function (data){
            var users = [];
            for (var i = 0, max = data.response.length; i < max; i++) {
                users.push({
                    "name": data.response[i].first_name + ' ' + data.response[i].last_name,
                    "ava": data.response[i].photo_100
                });
            }
            app.friends = users;
        }
    )
}

function appUsers() {
    //друзья, у которых установлено данное приложение
    VK.api("friends.getAppUsers", function (data){
        var user_ids = data.response.join(',');
        getFriends(user_ids);
    });
}