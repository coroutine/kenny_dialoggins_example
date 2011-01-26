log_to_console = function(content) {
    var log = new Element("DIV");
    log.update(content);
    
    var el = $("console").down(".log_container");
    el.insert(log);
};


Event.observe(window, "load", function(evt1) {
   $$(".target").each(function(target) {
     var dialog_id = target.readAttribute("data-dialog-id");
     
     target.observe("click", function(evt2) {
        KennyDialoggins.Dialog.show(dialog_id);
     });
   });
});