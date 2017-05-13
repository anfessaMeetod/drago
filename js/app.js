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



$("#deleteCar").click(function(e) {
	e.preventDefault();
	deleteCar().then(reloadTable);
});

function tableData (data) {
	var rows = "";

	for (i = 0; i < data.length; i++) {

		var buttontext = '<span class="glyphicon glyphicon-option-horizontal"></span>';

		rows += '<tr>';
		rows += '<td><span class="reg">' + data[i].reg + '</span><br>' + data[i].model + '</td>';
		rows += '<td>' + data[i].pop + '</td>';
		rows += '<td>' + data[i].dest + '</td>';
		rows += '<td class="hidden-xs">' + data[i].img + data[i].status; 
		if (data[i].rawStatus == 2) { rows += ' <strong>' + data[i].tDate + '</strong>'; }
		if (data[i].rawStatus == 4) { rows += '<br>' + data[i].archived_at; }
		rows += '</td>';
		rows += '<td class="hidden-xs">' + data[i].user + '<br><span style="font-size: 12px;">';
		if ( data[i].created_at != undefined) {  rows += data[i].created_at }
			else {  rows += 'Bokningsdatum saknas'};
		rows += '</span></td>';
		rows += '<td class="text-center"> <a class="btn btn-sm open-details" id="' + data[i].id + '">' + buttontext + '</a></td>';
		rows += '</tr>'; 

	}
	return rows;
}

function loadTableData() {
	return $.ajax({
		url: "data/tableData.php",
		success: function(data, status) {
			console.dir(data);
			console.log('Antal rader:' + data.length);

			// Add data to table
			document.getElementById('tBody').innerHTML = tableData(data);	
			        
		},
		error:function(exception){
			console.log('Fel Exeption:' + exception);
		}
	});
}

function deleteCar () {

	var ID = document.getElementById("car_ID").value;

	return $.ajax({
		url: "act/deleteCar.php",
		data: { ID : ID },
		success: function(data, status) {
				// For debugging.
				console.log("ID som togs bort : " + data + "\nStatus: " + status);
				
				// Close the modal
				$('.sidebar').removeClass('visible');
				
				// Destroyes the dataTable
				var table = $('#example').DataTable();
				table.destroy();

			},
			error:function(exception){
				console.dir('Exeption:'+exception);
			}
		});
}

function reloadTable() {
	$(".wait").addClass('visible');
	$("tBody").fadeOut();

	return $.ajax({
		url: "data/tableData.php",
		success: function(data, status) {
			console.log('Transport uppdaterat' + 'Nya rader:' + data.length);

			// Replace the table data
			document.getElementById('tBody').innerHTML = tableData(data);

			// reintialize datatables
			initTable();

			// Remove the loader
			$(".wait").removeClass('visible');

			// Get then table back
			$("tBody").fadeIn();

			// Print a success message
			document.getElementById('alert-holder').innerHTML = '<div class="alert alert-success" role="alert">Bil borttagen</div>';
			window.setTimeout(function() {	// And close it automatic
				$(".alert").alert('close'); 
			}, 5000);
		},
		error:function(exception){
			console.dir('Exeption:'+ data);
		}
	});
}

function initTable () {


	// We add the details sidebar script

	$(".open-details").click(function(e){
				e.preventDefault();

				var id = $(this).attr('id');

				$('.sidebar').addClass('visible');

				$.ajax({
					url: "data/data.php",
					data: { ID : id } ,
					success: function(data, status){

						console.log("Bilens reg: " + data.id + "\nStatus: " + status);

						$('.details #reg').text(data.reg);
						$('.details #modell').text(data.model);
						$('.details #user').text(data.user);
						$('.details #message').text(data.note);
						$('.details #status').text(data.status);
						$('.details #email').text(data.copy_emails);
						$('.details #cancel').html(data.cancelable);
						$('.details #damage').text(data.damage);
						$('.details #creted_at').text(data.damage);
				            //$('.details #car_ID').value(data[4]);
				        document.getElementById('car_ID').value = data.id;

				        // Fyller på lite värden i avbokningsmodal
				        
				        $('#cancel_modal #car_ID').val(data.id);
				        $('#cancel_modal #reg').text(data.reg);
				    },
				    error:function(exception){
				       console.log('Exeption:'+exception);
				    }
				});
			});



	// Then we init the table

	$('#example').DataTable({
		responsive: true,
		"order": [[ 3, "asc" ]],
		language: {
			searchPlaceholder: "Ex. regnr",
			search: "Sök:",
			lengthMenu:     "Visa _MENU_ rader",
			info:           "Visar _START_ till _END_ av totalt _TOTAL_ rader",
			infoEmpty:      "Visar 0 till 0 av totalt 0 rader",
			infoFiltered:   "(Filtrerat från _MAX_  rader)",
			"paginate": {
				"first":      "Första",
				"last":       "Sista",
				"next":       "Nästa",
				"previous":   "Föregående"
			},
			"zeroRecords":    "Inga rader funna",
		},
		  stateSave: true,
		  destroy: true,
	});

	// We add some classes to control the table UI
	$('#example_filter').addClass('filter');
	$('#example_length').addClass('toShow');



}



$(document).ajaxStart(function(){
	$(".wait").show();
});
$(document).ajaxComplete(function(){
	$(".wait").hide();
});
$("#queueButton").click(function(e) {
	e.preventDefault();
	checkIfExists().then(addToQueue);
});

$("#bokaButton").click(function(e) {
	e.preventDefault();
	checkIfExists().then(submitForm);
});

var exists = false;
var emptyFields = false;

function validateFields (exists) {

	var reg = document.getElementById("reg").value;
	var model = document.getElementById("model").value;
	var pop = document.getElementById("pop").value;
	var dest = document.getElementById("dest").value;
	
	console.log(reg + "\n" + model + "\n" + pop + "\n" + dest);
	 
		if (reg == "") {
			$('#reg').addClass('invalid');
			$('#reg').closest('.input-field').find('.validation').html('<div style="font-size: 13px; color: red; padding-bottom: 20px;">Reg.nr. måste anges.</div>');
		}
		if (model == "") {
			$('#model').addClass('invalid');
			$('#model').closest('.input-field').find('.validation').html('<div style="font-size: 13px; color: red; padding-bottom: 20px;">Vänligen ange modell</div>');
		}
		else {
			$('#model').closest('.input-field').find('.validation').html('');
			$('#reg').closest('.input-field').find('.validation').html('')
		}
	}

function checkIfExists () {
	
	var reg = document.getElementById("reg").value;
	var model = document.getElementById("model").value;
	var pop = document.getElementById("pop").value;
	var dest = document.getElementById("dest").value;

	if (reg == "" || model == "") {
		emptyFields = true;
	}
	else {
		emptyFields = false;
	}

	console.log(reg + " " + model + "\n" + pop + " " + dest);

		return  $.ajax({
			url: "act/check.php",
			data: { reg : reg },
			success: function(data, status) {

				console.log("I kö: " + data.queue + "\nFör transport:" + data.transport + "\nStatus: " + status);

				if (data.queue != 0) {
					exists = true;
					$('#reg').addClass('invalid');
					$('#reg').closest('.input-field').find('.validation').html('<div style="font-size: 13px; color: red; padding-bottom: 20px;">Bilen är redan i bokningslistan</div>');
				}
				else if (data.transport != 0) {
					exists = true;
					$('#reg').addClass('invalid');
					$('#reg').closest('.input-field').find('.validation').html('<div style="font-size: 13px; color: red; padding-bottom: 20px;">Bilen är redan bokad för transport</div>');
				}
				else {
					exists = false;
					$('#reg').closest('.input-field').find('.validation').html('');
				}
			}
		});
}



function addToQueue(data) {
	var reg = document.getElementById("reg").value;
	var model = document.getElementById("model").value;

	console.log('Bilens finns: ' + exists);
	console.log('Tomma fäl: ' + emptyFields);

	validateFields(exists);

	if (exists == false && emptyFields == false) {

	$.get("act/addQueue.php", { reg : reg, model : model } , function(data, status){

		console.log("Data: " + data + "\nStatus: " + status);

		         var count = data.length;

				// Print the data
				function toPrint (data, count) {
					var rows = "";

					for (i = 0; i < data.length; i++) {
						rows += "<form action='act/delete_queue.php' method='post'>";
						rows += "<input type='hidden' name='reg' value='" + data[i].reg + "'>";
						rows += "<input type='hidden' name='user' value='" + data[i].user + "'>";
						rows += "<div class='col m4 c-white'>" + data[i].reg + "</div>";
						rows += "<div class='col m6 c-white capitalize'>" + data[i].model + "</div>";
						rows += "<div class='col m2'><button type='submit' class='deleteQueue'>x</button></div>";
						rows += "</form>";

					}

					if (count == 1) {
						var msg = "<div class='col m12 total'><p class='c-white'>Totalt 1 bil tillagd</p></div>";
					}
					else {
						var msg = "<div class='col m12 total'><p class='c-white'>Totalt " + count + " bilar tillagda</p></div>";
					}

					return rows + msg;
				}
				document.getElementById("addCar").reset();
				document.getElementById('carList').innerHTML = toPrint(data, count);

			});
	}
}

function submitForm(data) {

	console.log('tomma fält: ' + emptyFields);
	console.log('Dublett: ' + exists);

	validateFields(exists);
	
	if (emptyFields == false && exists == false) {
		$("#addRequest").submit();
		console.log('Submit');
	}
}

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


$(".button-collapse").click(function() {
		getNumbers();
	});

function getNumbers() {
	$.ajax({
		url: "data/numbers.php",
		success: function(data, status) {
			$('#slide-out .new').text(data.questions);
			$('#slide-out .bookings').text(data.bookings);
			$('#slide-out .loaded').text(data.loaded);
		},
		error:function(exception){
			console.log('Fel Exeption:' + exception);
		}
	});
}

