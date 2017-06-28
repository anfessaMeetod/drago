// ---------
  // Did someone say submit?
  // ------

  $("#formSubmit").click(function(e) {
    e.preventDefault();

    var name  = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var msg   = document.getElementById("msg").value;

    if (email.length == 0) {
      $('.validation').html('Hey, you need to enter your email!')
    }
    else {

      $.ajax({
        method: "POST",
        url: "mail.php",
        data: { name : name, email : email, msg : msg },
        success: function(data, status) {
          $(".form").hide();
          $(".sent").show();
        }
      });
    } 
});