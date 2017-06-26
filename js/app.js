
// ---------
  // Did someone say submit?
  // ------

  $("#formSubmit").click(function(e) {
    e.preventDefault();

    var name  = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var msg   = document.getElementById("msg").value;

    $.ajax({
      method: "POST",
      url: "mail.php",
      data: { name : name, email : email, msg : msg },
      success: function(data, status) {
        $(".form").hide();
        $(".sent").show();
      }
    });
});
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
    var bg = $("#map");

    function resizeBackground() {
        bg.height($(window).height() + 60);
    }

    $(window).resize(resizeBackground);
    resizeBackground();
  }
// ------
// Wey, a modal!
//----

var termsBtn = document.getElementById("termsBtn");
var termsModal = document.getElementById('termsModal');
var closeTerms = document.getElementsByClassName("closeTerms")[0];
termsBtn.onclick = function() {
    termsModal.style.display = "block";
}
closeTerms.onclick = function() {
    termsModal.style.display = "none";
}

var privacyModal = document.getElementById('privacyModal');
var privacyBtn = document.getElementById("privacyBtn");
var closePrivacy = document.getElementsByClassName("closePrivacy")[0];

privacyBtn.onclick = function() {
    privacyModal.style.display = "block";
}
closePrivacy.onclick = function() {
    privacyModal.style.display = "none";
}

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == termsModal || event.target == privacyModal) {
        termsModal.style.display = "none";
        privacyModal.style.display = "none";
    }
}

