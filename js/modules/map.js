// ---------
// Moving map on big screens
// -----

  var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  if (width > 1000) {
    var velocity = 0.1;

    function update(){ 
      var pos = $(window).scrollTop(); 
      $('#map').each(function() { 
        var $element = $(this);
    // subtract some from the height b/c of the padding
        var height = $element.height();
        $(this).css('backgroundPosition', '0px ' + Math.round((height - pos) * velocity) +  'px'); 
      }); 
    };

    var dos = $(window).scrollTop(); 
    var map = $('#map');
    var he = map.height();
    map.css('backgroundPosition', '0px ' + Math.round((he - dos) * velocity) +  'px'); 
    map.css({"margin-top": '-' + Math.round((he - dos) * velocity) +  'px'});

    $(window).bind('scroll', update);
  }
  else {

    // A little fix for cover backgroun on small devices
    var bg = $("#map");

    function resizeBackground() {
        bg.height($(window).height() + 100);
    }

    $(window).resize(resizeBackground);
    resizeBackground();
  }