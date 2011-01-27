/**
 * Kenny Dialoggins creates pretty dialogs using prototype and 
 * scriptaculous. These functions work with ActionView 
 * helpers to provide dialog components that can be programmed 
 * using the same syntax as rendering partials.
 *
 * 
 * Brought to you by the good folks at Coroutine.  Hire us!
 * http://coroutine.com
 */
var KennyDialoggins = {};


/**
 * This property governs whether or not KD bothers creating and
 * managing a blocking iframe to accommodate ie6.
 * 
 * Defaults to false, but override if you must.
 */
KennyDialoggins.SUPPORT_IE6_BULLSHIT = false;   



/**
 * This function puts you on the highway to the danger
 * zone by defining the KD dialog class.
 */
KennyDialoggins.Dialog = function(content, options) {
    options             = options || {};
    
    this._element       = null;
    this._frame         = null;
    this._hideListener  = this._generateHideListener();
    this._isShowing     = false;
    
    this._id            = options["id"];
    this._class         = options["class"]      || "";
    this._beforeShow    = options["beforeShow"] || function() {};
    this._afterShow     = options["afterShow"]  || function() {};
    this._beforeHide    = options["beforeHide"] || function() {};
    this._afterHide     = options["afterHide"]  || function() {};
    
    this._makeDialog();
    this.setContent(content);
    
    if (KennyDialoggins.SUPPORT_IE6_BULLSHIT) {
        this._makeFrame();
    }
};



// ----------------------------------------------------------------------------
// Class methods
// ----------------------------------------------------------------------------

/**
 * This hash maps the dialog id to the dialog object itself. It allows the Rails 
 * code a way to specify the js object it wishes to invoke.
 */ 
KennyDialoggins.Dialog.instances = {};


/**
 * This hash is a convenience that allows us to write slightly denser code when 
 * calculating the dialog's position.
 */
KennyDialoggins.Dialog._POSITION_FN_MAP = { // *cw*
    left:   "getWidth",
    top:    "getHeight"
};


/**
 * This method destroys the dialog with the corresponding id.
 *
 * @param {String} id   The id value of the dialog element (also the key 
 *                      in the instances hash.)
 */
KennyDialoggins.Dialog.destroy = function(id) {
    var dialog = this.instances[id];
    if (dialog) {
        dialog.finalize();
    }
    this.instances[id] = null;
};


/**
 * This method hides the dialog with the corresponding id.
 *
 * @param {String} id   The id value of the dialog element (also the key 
 *                      in the instances hash.)
 *
 * @return {Object} an instance of KennyDialoggins.Dialog
 *
 */
KennyDialoggins.Dialog.hide = function(id) {
    var dialog = this.instances[id];
    if (dialog) {
        dialog.hide();
    }
    return dialog;
};


/**
 * This method returns a boolean indiciating whether or not the 
 * dialog with the corresponding id is showing.
 *
 * @param {String} id   The id value of the dialog element (also the key 
 *                      in the instances hash.)
 *
 * @return {Boolean}    Whether or not the dialog with the corresponding 
 *                      id is showing.
 *
 */
KennyDialoggins.Dialog.isShowing = function(id) {
    var dialog = this.instances[id];
    if (!dialog) {
        throw "No dialog cound be found for the supplied id.";
    }
    return dialog.isShowing();
};


/**
 * This method shows the dialog with the corresponding id.
 *
 * @param {String} id   The id value of the dialog element (also the key 
 *                      in the instances hash.)
 *
 * @return {Object} an instance of KennyDialoggins.Dialog
 *
 */
KennyDialoggins.Dialog.show = function(id) {
    var dialog = this.instances[id];
    if (dialog) {
        dialog.show();
    }
    return dialog;
};




/**
 * This function creates the function that handles click events when the dialog is 
 * shown.  The handler ignores clicks targeted from within the dialog; any click 
 * targeted outside the dialog causes the dialog to hide itself and cancel the 
 * observer.
 */
KennyDialoggins.Dialog.prototype._generateHideListener = function() {
	var self = this;
    return function(evt) {
		
		var origin = $(evt.target).closest(".kenny_dialoggins_dialog");		// *cw*
        if (self._element.attr('id') !== origin.attr('id')) {				// *cw*
            self.hide();
        }
		
    }
};


/**
 * This function indicates whether or not the dialog is currently 
 * being shown.
 *
 * @return {Boolean}    Whether or not the dialog is being shown.
 */
KennyDialoggins.Dialog.prototype._isShowing = function() {
    return this._isShowing;
},

/**
 * This function constructs the dialog element and hides it by default.
 *
 * The class name is set outside the element constructor to accommodate
 * a discrepancy in how prototype handles this particular attribute. The
 * attribute is set as className in IE8--rather than class--which means the 
 * styles are not applied and the element's positioning gets royally
 * screwed up.
 */
KennyDialoggins.Dialog.prototype._makeDialog = function() {
    if (!this._element) {
        this._element = $('<div id="' + this._id + '"></div'); // *cw*
        this._element.addClass("kenny_dialoggins_dialog");     // *cw*
        if (this._class) {
            this._element.addClass(this._class);			   // *cw*
        }
        this._element.hide();
        this._element.appendTo(document.body); 				   // *cw*
    }
},


/**
 * This function constructs the iframe element and hides it by default.
 *
 * The class name is set outside the element constructor to accommodate
 * a discrepancy in how prototype handles this particular attribute. The
 * attribute is set as className in IE8--rather than class--which means the 
 * styles are not applied and the element's positioning gets royally
 * screwed up.
 */
KennyDialoggins.Dialog.prototype._makeFrame = function() {
    if (!this._frame) {
        this._frame = new Element("IFRAME");
        this._frame.addClassName("kenny_dialoggins_dialog_frame");
        if (this._class) {
            this._element.addClassName(this._class);
        }
        this._frame.setAttribute("src", "about:blank");
        this._frame.hide();
        document.body.appendChild(this._frame);
    }
},


/**
 * This function allows the dialog object to be destroyed without
 * creating memory leaks.
 */
KennyDialoggins.Dialog.prototype.finalize = function() {
    this.hide();

    this._element.remove();
    this._element = null;

    if (this._frame) {
        this._frame.remove();
        this._frame = null;
    }

    this._hideListener = null;
},


/**
 * This function hides the dialog. It uses a scriptaculous effect to fade out 
 * and disconnects the click observer to prevent memory leaks.
 */
KennyDialoggins.Dialog.prototype.hide = function() {
	this._beforeHide; 										   // *cw*
	this._element.fadeOut(200)								   // *cw*
	this._isShowing = false;	        					   // *cw*
   	this._afterHide;  			    						   // *cw*
	$(document).unbind('click');      					 	   // *cw* 

    if (this._frame) {  									   // *cw*
		this._frame.fadeOut(200)  ;                            // *cw*
    }
},


/**
 * This function sets the content of the dialog element.
 *
 * @param {Object} content  The html content for the dialog.
 */
KennyDialoggins.Dialog.prototype.setContent = function(content) {
    this._element.html(content);
},


/**
 * This function sets the position of the dialog element.
 */
KennyDialoggins.Dialog.prototype.setPosition = function() {
    this._element.css('top', Math.ceil((($(window).height()/2) + $(window).scrollTop()   - (this._element.outerHeight()/2)) * 2/3) + "px" ); // *cw*

    this._element.css('left', Math.ceil(($(window).width()/2) + $(window).scrollLeft() - (this._element.outerWidth()/2))  + "px" );			 // *cw*
},


/**
 * This function displays the dialog. It uses a scriptaculous effect to fade in,
 * centers the dialog in the viewport (and adjusts the blocking iframe, if in use), 
 * and connects a click observer to hide the dialog whenever mouse focus leaves 
 * the dialog.
 */
KennyDialoggins.Dialog.prototype.show = function() {

    this.setPosition();
    
    if (this._frame) {
        this._frame.style.top       = this._element.style.top;
        this._frame.style.left      = this._element.style.left;
        this._frame.style.width     = this._element.outerWidth() + "px";   // *cw*
        this._frame.style.height    = this._element.outerHeight() + "px";  // *cw*
        
		this._frame.fadeIn(200);						      // *cw*
    }
    
	this._beforeShow; 										  // *cw*
	var main_this = this;									  // *cw*
	this._element.fadeIn(200,function() { 				  	  // *cw*
		this._isShowing = true;                  			  // *cw*
	    this._afterShow;   	                                  // *cw*
		$(document).click(main_this._hideListener);	          // *cw*
	});					           						      // *cw*
  
  
	
}
