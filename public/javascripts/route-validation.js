$(document).ready(function() {
	// validate signup form on keyup and submit
	var validator = $("#route").validate({
		rules: {
			start: {
				required: true,
				minlength: 5,
			},
			end: {
				required: true,
				minlength: 5
			},
		},
		messages: {
			start: {
				required: "You've got to start somewhere!",
				minlength: jQuery.format("Enter at least {0} characters"),
			},
			end: {
				required: "You can't run forever.",
				minlength: jQuery.format("Enter at least {0} characters")
			},
		},
		// the errorPlacement has to take the table layout into account
		// errorPlacement: function(error, element) {
		// 	if ( element.is(":radio") )
		// 		error.appendTo( element.parent().next().next() );
		// 	else if ( element.is(":checkbox") )
		// 		error.appendTo ( element.next() );
		// 	else
		// 		error.appendTo( element.parent().next() );
		// },
		// // specifying a submitHandler prevents the default submit, good for the demo
		// submitHandler: function() {
		// 	alert("submitted!");
		// },
		// // set this class to error-labels to indicate valid fields
		// success: function(label) {
		// 	// set &nbsp; as text for IE
		// 	label.html("&nbsp;").addClass("checked");
		// }
	});
});