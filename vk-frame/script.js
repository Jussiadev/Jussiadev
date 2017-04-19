$(function() {
    VK.init(function() {
        var myId = 32931152;
        VK.api("users.get", {"user_ids": myId, "fields": "photo_100,city"}, function (data) {
            $('#name').text(data.response[0].first_name + ' ' + data.response[0].last_name + ' (' + data.response[0].id + ')');
            $('#city').text(data.response[0].city.title);
            $('#photo').attr("src",data.response[0].photo_100);
        });

        VK.api("friends.get", {"user_id": myId, "order": "name", "fields": "photo_100, photo_id"}, function (data) {
            var users = data.response.items;
            for (var i = 0; i < users.length; i++) {
                VK.api("likes.getList",{"type": "photo","item_id": users[i].photo_id, "filter": "likes"}, function (data) {
                    users[i]['likes'] = data.response.count;
                });
            }
            new Vue ({
               el: '#app',
               data: {
                  items: data.response.items
               }
            });
        });
    }, function() {
        // API initialization failed
        // Can reload page here
    }, '5.63');
});



