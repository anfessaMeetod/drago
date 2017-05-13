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
