$(function() {
    VK.init(function() {
        VK.api("users.get", {"user_ids": "32931152", "fields": "photo_200,city"}, function (data) {
            console.log(data);
            $('#name').text(data.response[0].first_name + ' ' + data.response[0].last_name + ' (' + data.response[0].id + ')');
            $('#city').text(data.response[0].city.title);
            $('#photo').attr("src",data.response[0].photo_200);
        });
    }, function() {
        // API initialization failed
        // Can reload page here
    }, '5.63');
});



