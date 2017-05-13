$("#loginBTN").click(function(e) {
	e.preventDefault();
	chechAuthFields();
});

// Microcopy
var noUserName = 'Ops! Du behöver fylla i ditt anställningsnr.';
var noPassWord = 'Hoj! Fyll i ditt lösenord också!';


function chechAuthFields () {

	var success = true;

	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	 
	if (username == "") {
		$('#username').addClass('invalid');
		$('#username').closest('.input-field').find('.validation').html(noUserName);

		success = false;
	}
	else {
		$('#username').closest('.input-field').find('.validation').html('');
	}
	if (password == "") {
		$('#password').addClass('invalid');
		$('#password').closest('.input-field').find('.validation').html(noPassWord);

		success = false;
	}
	else {
		$('#password').closest('.input-field').find('.validation').html('');
	}

	if (success == false) {
		console.log('Det finns fel!')
	}
	else {
		console.log('Det finns inga fal, sub mittar');
		$("#loginForm").submit();
	}
}


