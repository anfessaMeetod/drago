$(".register-now").click(function(e) {
	e.preventDefault();
	$(".login-box").addClass('move');
	$(".register-form").addClass('grow');
	//$(".appear").fadeIn(800);
});

$("#registerBTN").click(function(e) {
	e.preventDefault();
	runRegister();
});

// Microcopy
var wrongEmail = 'Hey! Det behöver vara en epost från Liljas.';
var wrongNr = 'Hoj! Fyll i ditt lösenord också!';

function runRegister () {

	var success = true;
	var empty = 'Detta fält får inte vara tomt!';

	var fields = ['reg_username', 'reg_password', 'first', 'last', 'email', 'phone'];
	var values = [];

	for (i = 0; i < fields.length; i++) {

		values.push(document.getElementById(fields[i]).value)
		
		if (values[i] == "") {
			$('#' + fields[i]).addClass('invalid');
			$('#' + fields[i]).closest('.input-field').find('.validation').html(empty);

			success = false;
		}
		else {
			$('#' + fields[i]).closest('.input-field').find('.validation').html('');
		}
	} 

	// We like to control that the user works at Liljas.
	var email = values[4];
	var emailCorrect = email.includes("@liljasbil.se");

	if (email != "" && emailCorrect == false ) {
		$('#' + fields[4]).addClass('invalid');
		$('#' + fields[4]).closest('.input-field').find('.validation').html(wrongEmail);
	}

	console.log('Liljasemail: ' + emailCorrect);

	if (success == false) {
		console.log('Det finns fel!')
	}
	else {
		console.log('Det finns inga fel.');
		//$("#registerForm").submit();
	}
}

