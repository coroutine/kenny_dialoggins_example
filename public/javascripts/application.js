/**
 jQuery example
 */

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


/**
 Prototype example
 */
// log_to_console = function(content) {
//     var log = new Element("DIV");
//     log.update(content);
//     
//     var el = $("console").down(".log_container");
//     el.insert(log);
// };
// 
// 
// Event.observe(window, "load", function(evt1) {
//    $$(".target").each(function(target) {
//      var dialog_id = target.readAttribute("data-dialog-id");
//      
//      target.observe("click", function(evt2) {
//         KennyDialoggins.Dialog.show(dialog_id);
//      });
//    });
// });
