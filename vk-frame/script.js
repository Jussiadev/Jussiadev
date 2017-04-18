$(function() {
    VK.init(function() {
        VK.api("users.get", {"user_ids": "32931152", "fields": "photo_200,city"}, function (data) {
            $('#name').text(data.response.first_name + ' ' + data.response.last_name + ' (' + data.response.id + ')');
            $('#city').text(data.response.city.title);
            $('#photo').attr("src",data.response.photo_200);
        });
    }, function() {
        // API initialization failed
        // Can reload page here
    }, '5.63');
});



