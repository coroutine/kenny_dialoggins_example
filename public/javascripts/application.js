log_to_console = function(content) {
    $("<div></div").html(content).appendTo("#console .log_container"); // *cw*
};


$(document).ready(function() { // *cw*
	$(".target").each(function() { // *cw*
		var dialog_id = $(this).attr("data-dialog-id"); // *cw*

		$(this).click(function() { // *cw*
			KennyDialoggins.Dialog.show(dialog_id);
		});	
	});
});


KennyDialoggins.SUPPORT_IE6_BULLSHIT = false;