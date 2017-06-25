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