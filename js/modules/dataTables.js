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


