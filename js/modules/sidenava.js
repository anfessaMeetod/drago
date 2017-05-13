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

