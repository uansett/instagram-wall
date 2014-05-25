// Instantiate an empty object.
var Instagram = {};

// Small object for holding important configuration data.
Instagram.Config = {
  clientID: '57aa2db0c5a74bdbbe0b4876b0764ea2',
  apiHost: 'https://api.instagram.com'
};


// ************************
// ** Main Application Code
// ************************
(function(){
  var photoTemplate, resource;

  function init(){
    photoTemplate = _.template($('#photo-template').html());
  }

  function toTemplate(photo){
    photo = {
      count: photo.likes.count,
      avatar: photo.user.profile_picture,
      photo: photo.images.low_resolution.url,
      url: photo.link
    };

    return photoTemplate(photo);
  }

  function toScreen(photos){
    var photos_html = '';


    $.each(photos.data, function(i, photo){
        shouldPost = true;
        $.each(Instagram.Config.bans, function(j, bannedUrl){
            if(photo.link == bannedUrl)
                shouldPost = false;
        });
        if(shouldPost)
            photos_html += toTemplate(photo);
    });

    $('div#photos-wrap').append(photos_html);
  }

  function generateResource(tag){
    var config = Instagram.Config, url;
    tag = String(tag).trim().split(" ")[0];

    url = config.apiHost + "/v1/tags/" + tag + "/media/recent?callback=?&client_id=" + config.clientID;

    return url;
  }

  function query(tag){
    resource = generateResource(tag);
    $('#photos-wrap *').remove();
    fetchPhotos();
  }

  function fetchPhotos(max_id){
    $.getJSON(resource, toScreen);
  }


  function showPhoto(p){
    $(p).fadeIn();
  }

  // Public API
  Instagram.App = {
    query: query,
    showPhoto: showPhoto,
    init: init
  };
}());

$(function(){
    console.log("starting");
    $.getJSON('./config/parameters.json', function(data){
        Instagram.Config.bans = data.bans;
        Instagram.Config.hashtag = data.hashtag;
        Instagram.App.init();
        Instagram.App.query(Instagram.Config.hashtag);  
    }).error(function(data) {console.log(data.responseText)});
});

