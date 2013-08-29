var Bbq = Class.create({ 
  initialize: function(config) { 	  
	  jQuery.extend(true, this, config);	  
  },
  define: function(className, data){  	  
	  
		var c = className;
		var me = this;
	  
		if (c.indexOf(".") > -1)
			c = className.substring(className.lastIndexOf(".") + 1);
	  	
		jQuery.extend(true, data, {className: className, isClass: true, constructorName: c});
		 		
		this[c] = function(options) {
			
			var BbqClass = Class.create({	
					initialize: function(options) { 						
												
						jQuery.extend(true, this, data);
						jQuery.extend(true, this, options);
												
						var parent = this;
						
						if (this._init != null && typeof this._init === 'function')
							this._init();	
						
						if (this.items != null){
							for (var i in this.items){
								if (typeof this.items[i] === 'object'){
									
									var item = this.items[i];
									jQuery.extend(true, this.items[i], {renderTo: parent.body});									
									this.items[i] = me.create(item.xtype,this.items[i]);
								}
									
							}
						}
						
						if (this._afterRender != null && typeof this._afterRender === 'function')
							this._afterRender();	
						
														
					}	
			});
			
			return new BbqClass(options);
				  
		}
				
		jQuery.extend(true, this[c], data);	  
		
  },
  create: function(type, options){
	  
		var typeName = null;
	  
		if (typeof this[type] === 'function' && (this[type].isClass != null && this[type].isClass == false)){
			typeName = type;
		}
		else {  
			for(var key in this)
			{
				if (this[key] != null && this[key].isClass != null && this[key].isClass){
					if (this[key].className == type || this[key].xtype == type){
						typeName = this[key].constructorName;
					}
				}
			}
		}
	  
		if (typeName == null)
			throw 'Class not found';	
	  
		return this[typeName](options);
  },
  attachOnLoad: function(fnc){	  
		if ( typeof window.addEventListener != "undefined" )
			window.addEventListener( "load", fnc, false );
		else if ( typeof window.attachEvent != "undefined" ) {
			window.attachEvent( "onload", fnc );
		}
		else {
			if ( window.onload != null ) {
				var oldOnload = window.onload;
				window.onload = function ( e ) {
					oldOnload( e );
					window[fnc]();
				};
			}
			else 
	     	window.onload = fnc;
		}
  },
  get: function(id){
		return jQuery('#' + id);
  },
});

var Bbq = new Bbq({
	className: 'Bbq',   
	app: null, 
	application: function(config){
	  
		this.app = this.create('application', config);
		
		if (this.app.launch != null){
			  Bbq.attachOnLoad(this.app.launch);
		}
	}
}); 

Bbq.define('Bbq.app.Application',{
	xtype: 'application',
	name: null,
	launch: null
});

Bbq.define('Bbq.Window',{
	xtype: 'window',		
	body: null,
	self: null,
	content: null,
	header: null,
	renderTo: null,
	autoShow: false,
	title: 'New Window',
	width: 'auto',
	height: 'auto',
	centered: true,
	position: {x: 200, y: 200},
	minWidth: 200,
	maxWidth: null,
	minHeight: 200,
	maxHeight: null,
	modal: false,
	modalSingle: true,	
	modalEl: null,
	html: null,
	bodyScrollable: null,
	resizable: true,
	draggable: true,
	hideMode: 'destroy',
	closeable: true,
	minimizable: false,
	maximizable: false,
	closing: null,
	close: null,
	maximize: null,
	minimize: null,
	afterRender: null,
	move: null,
	resize: null,
	windowType: 'window', //Possible values are simpleform, form, process, report, window
	dataToolbar: null,
	grid: null,
	show: function(){
		if (modal == false)
			this.self.show();
		else			
			this.modalEl.modal('show');
			
	},
	hide: function(){
		if (modal == false)
			this.self.show();
		else			
			this.modalEl.modal('hide');
	},
	center: function() {
		
        var top = (this.renderTo.height() - this.self.outerHeight()) / 2;
        var left = (this.renderTo.width() - this.self.outerWidth()) / 2;
        this.self.css({position:'absolute', margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
   		
	},
	adjustBody: function () {
		
		var headerHeight = this.header.outerHeight();		
		
		var toolbarHeight = (this.dataToolbar == null ? 0 : this.dataToolbar.body.outerHeight());
		
		var gridHeight = (this.grid == null ? 0 : this.grid.body.outerHeight());
		
		var borderWidth = parseInt(this.body.css("borderLeftWidth"), 10) + parseInt(this.body.css("borderRightWidth"), 10);
		var borderHeight = parseInt(this.body.css("borderTopWidth"), 10) + parseInt(this.body.css("borderBottomWidth"), 10);
		var paddingWidth = this.body.outerWidth() - this.body.width();
		var paddingHeight = this.body.outerHeight() - this.body.height();
		var bodyMarginWidth = this.body.outerWidth(true) - this.body.outerWidth();
		var bodyMarginHeight = this.body.outerHeight(true) - this.body.outerHeight();
		
		var sombraFix = 0;
		
		var bodyWidthFix = borderWidth + paddingWidth + bodyMarginWidth;
		var bodyHeightFix = headerHeight + gridHeight + toolbarHeight + borderHeight + paddingHeight + bodyMarginHeight + sombraFix;
		
		this.body.width(this.content.width() - bodyWidthFix);
		this.body.height(this.content.height() - bodyHeightFix);
		
		//this.scrollable();
		
	},
	render: function(){
		
		var wnd = jQuery(document.createElement("div"));
		wnd.addClass('modal-dialog').addClass('bbq-window');
		
		var wndContent = jQuery(document.createElement('div'));
		wndContent.addClass('modal-content');
		
		/* Window header */
		var wndHeader = jQuery(document.createElement('div'));
		wndHeader.addClass('modal-header');
		
		var headerTitle = jQuery(document.createElement('h4'));
		headerTitle.addClass('modal-title').html(this.title);
						
		/* Window body */
		var wndBody = jQuery(document.createElement('div'));
		wndBody.addClass('modal-body');
		
		/* Window datatoolbar */
		var wndDatatoolbar = jQuery(document.createElement('div'));
		
		/* Window grid */
		var wndGrid = jQuery(document.createElement('div'));
				
		wnd.append(wndContent);		
		
		if (this.html != null)
			wndBody.append(this.html);		
		
		if (this.windowType == 'simpleform' || this.windowType == 'form')
		{
			if (this.dataToolbar == null)
				this.dataToolbar = {};
			
			jQuery.extend(true, this.dataToolbar, {renderTo: wndDatatoolbar});
			
			
			this.grid = Bbq.create('datatoolbar',  {renderTo: wndGrid});
		}
		
		if (this.dataToolbar != null){			
			this.dataToolbar = Bbq.create('datatoolbar', this.dataToolbar);
		}
		
		
		wndContent.append(wndHeader);
		wndContent.append(wndDatatoolbar);
		wndContent.append(wndBody);
		wndContent.append(wndGrid);	
		
		wndContent.width(this.width == 'auto' && this.modal == false ? this.minWidth : this.width);
		wndContent.height(this.height == 'auto' && this.modal == false ? this.minHeight : this.height);
		
		this.self = wnd;
		this.body = wndBody;
		this.header = wndHeader;
		this.content = wndContent;
		
		var me = this;
		
		if (this.modal){
			
			
			var modal = jQuery(document.createElement('div'));
			modal.addClass('modal').addClass('fade').attr('tabindex','-1').attr('role','dialog').attr('aria-hidden','true');
			
			modal.append(wnd);	
			
			this.modalEl = modal;
							
			modal.on('show.bs.modal', function (e) {
				modal.css('visibility','hidden');				
			})
			
			if (this.closeable){
				var headerClose = jQuery(document.createElement('button'));
				headerClose.attr('type','button').attr('aria-hidden','true').addClass('close').html('&times');
				headerClose.on('click', function(e){
					me._closing(e);
				});				
				wndHeader.append(headerClose);				
			}		
			
			wndHeader.append(headerTitle);
			
			
			modal.on('shown.bs.modal', function (e) {	
				me.adjustBody();
				me.center();
				modal.hide();			
				modal.css('visibility','visible');
				modal.removeClass('fade');
				modal.removeClass('in');
				modal.fadeIn();				
			});
			
			modal.on('hide.bs.modal', function (e) {
							
				e.preventDefault();	
				
				modal.fadeOut();						
				var modalBack = jQuery(e.target).prev().fadeOut(function() {					
					if (me.modalSingle == true)
					{
						modalBack.detach();
						modal.detach();
					}
				});
				
				
			});
			
			modal.modal({
				  keyboard: false,
				  backdrop: 'static'
			})			
			
		}
		else{
		
			if (this.closeable){
				var headerClose = jQuery(document.createElement('button'));
				headerClose.attr('type','button').attr('aria-hidden','true').addClass('close').html('&times');
				headerClose.on('click', function(e){
					me._closing(e);
				});				
				wndHeader.append(headerClose);				
			}
			
			
			if (this.maximizable){
				var headerMaximize = jQuery(document.createElement('button'));
				headerMaximize.attr('type','button').attr('aria-hidden','true').addClass('maximize').html('&#9633');
				headerMaximize.on('click', function(e){
					if (typeof me.maximize === 'function')
						me.maximize(me, e);
				});				
				wndHeader.append(headerMaximize);	
			}
			
			
			if (this.minimizable){
				var headerMinimize = jQuery(document.createElement('button'));
				headerMinimize.attr('type','button').attr('aria-hidden','true').addClass('minimize').html('&#8722');
				headerMinimize.on('click', function(e){
					if (typeof me.minimize === 'function')
						me.minimize(me, e);			
				});
				wndHeader.append(headerMinimize);	
			}
		
			wndHeader.append(headerTitle);
			
			if (this.draggable){
				wnd.draggable({ 
					handle: wndHeader, 
					cursor: "move", 
					stack: ".bbq-window",
					stop: function(e, ui) {
						if (typeof me.move === 'function')
							me.move(me, ui.position);		
					}
				});
			}
			
			if (this.resizable){
				wndContent.resizable({ 
						helper: "bbq-window-resizable-helper",
						minWidth: this.minWidth,
						maxWidth: this.maxWidth,
						minHeight: this.minHeight,
						maxHeight: this.maxHeight,
						autoHide: true,
						stop: function( event, ui ) {							
							me.adjustBody();
							
							if (typeof me.resize === 'function')
								me.resize(me, ui.size);		
						}
				});
				
				
			}
			
			this.renderTo.append(wnd);
			
		}
		
		this.adjustBody();	
		
		if (typeof this.afterRender === 'function')
			this.afterRender(this);
		
		if (this.modal == false){
			
			if (this.centered){
				this.center();
			}
			else {
				this.self.css({position:'absolute', margin:0, top: this.position.y +'px', left: this.position.x +'px'});
			}
			
			if (this.autoShow == false)
				wnd.hide();
			else
				wnd.show();
		}
	},	
	_init: function() {		  
		  this.render();		  
	},
	_closing: function(e){		
		if (typeof this.closing === 'function')
	        this.closing(this, e);
	        
		if (e.isDefaultPrevented() == false){
			this._close(e);
		}		
	},
	_close: function(e){		
		
		if (typeof this.close === 'function')
	        this.close(this, e);
		
		if (e.isDefaultPrevented() == false){
			if (this.modal){
				this.modalEl.modal('hide');
			}
			else {
				if (this.hideMode == 'destroy')
					this.self.detach();
				else
					this.self.hide();
			}
		}
	}	
}
);

Bbq.define('Bbq.components.Button', {
	xtype: 'button',	
	renderTo: null,
	body: null,
	icon: '',
	text: '',
	ui: 'default',
	cls: '',
	size: '',
	enabled: true,
	render: function(){		
		
		/*
		 * 
		 * <button type="button" class="btn btn-default navbar-btn "><span class="glyphicon glyphicon-step-backward"></span></button>
		 */
		
		var button = jQuery(document.createElement("button"));		
		button.addClass('btn').addClass('btn-' + this.ui);
		button.attr('type', 'button');
		
		if (this.icon != null && this.icon != ''){
			var iconSpan = jQuery(document.createElement("span"));
			iconSpan.addClass('glyphicon').addClass('glyphicon-' + this.icon);
		}
		
		if (this.cls != null && this.cls != ''){
			button.addClass(this.cls);
		}
		
		if (this.size != null && this.size != ''){
			var toSize = '';
			switch (this.size){
				case 'small':
					toSize = 'btn-sm';
					break;
				case 'large':
					toSize = 'btn-lg';
					break;
				case 'extra-small':
					toSize = 'btn-xs';
					break;
				default:
					toSize = '';
					break;
			}
			
			if (toSize != '')
				button.addClass(toSize);
		}
		
		if (this.enabled != null && this.enabled == false)
			button.attr('disabled','disabled');
		
		button.append(iconSpan).append(this.text);
			
		this.body = button;
		
		if (this.renderTo != null)		
			this.renderTo.append(button);	
		
	},
	_init: function(){
		this.render();
	}	
});

Bbq.define('Bbq.panel.ButtonGroup', {
	xtype: 'buttongroup',	
	renderTo: null,
	body: null,
	items: [],
	size: '', 
	render: function(){				
			
		var div = jQuery(document.createElement("div"));		
		div.addClass('btn-group');
				
		if (this.size != null && this.size != ''){
			var toSize = '';
			switch (this.size){
				case 'small':
					toSize = 'btn-group-sm';
					break;
				case 'large':
					toSize = 'btn-group-lg';
					break;
				case 'extra-small':
					toSize = 'btn-group-xs';
					break;
				default:
					toSize = '';
					break;
			}
			
			if (toSize != '')
				div.addClass(toSize);
		}
					
		this.body = div;
		
		if (this.renderTo != null)		
			this.renderTo.append(div);		
		
	},
	_init: function(){
		this.render();
	}	
});


Bbq.define('Bbq.panel.DataToolbar', {
	xtype: 'datatoolbar',	
	renderTo: null,
	body: null,	
    canNavigate: true,
    canAdd: true,
    canSave: true,
    canRemove: true,
    canClear: true,
    canAudit: true,
    canHelp: true,
    statusVisible: true,
    buttons: {
    	first: null,
    	prev: null,
    	counter: null,
    	next: null,
    	last: null,
    	add: null,
    	save: null,
    	remove: null,
    	clear: null,
    	audit: null,
    	help: null,
    	status: null,
    },
    docked: 'top',
	render: function(){		
		
		var nav = jQuery(document.createElement("nav"));		
		nav.addClass('navbar').addClass('navbar-default');
		
		if (this.docked != ''){
			if (this.docked == 'top')
				nav.addClass('top');
			else if (this.docked == 'bottom')
				nav.addClass('bottom');
		}
		
		nav.addClass('bbq-datatoolbar');
		nav.attr('role', 'navigation');
		
		var ulLeft = jQuery(document.createElement("ul"));
		ulLeft.addClass('nav').addClass('navbar-nav').addClass('navbar-left');
		
		var ulRight = jQuery(document.createElement("ul"));
		ulRight.addClass('nav').addClass('navbar-nav').addClass('navbar-right');
		
		
		var toolbar = jQuery(document.createElement("div"));
		toolbar.addClass('btn-toolbar');
		
		if (this.canNavigate){
			var navGroup = Bbq.create('buttongroup', {size: 'extra-small'}).body;		
			this.buttons.first = Bbq.create('button', {cls: 'navbar-btn', icon: 'step-backward'}).body;
			this.buttons.prev = Bbq.create('button', {cls: 'navbar-btn', icon: 'chevron-left'}).body;
			this.buttons.counter = Bbq.create('button', {cls: 'navbar-btn', enabled: false, text: '0 de 0'}).body;
			this.buttons.next = Bbq.create('button', {cls: 'navbar-btn', icon: 'chevron-right'}).body;
			this.buttons.last = Bbq.create('button', {cls: 'navbar-btn', icon: 'step-forward'}).body;		
			navGroup.append(this.buttons.first);
			navGroup.append(this.buttons.prev);
			navGroup.append(this.buttons.counter);
			navGroup.append(this.buttons.next);
			navGroup.append(this.buttons.last);
			
			toolbar.append(navGroup);
		}
		
	
		var crudGroup = Bbq.create('buttongroup', {size: 'extra-small'}).body;		
		
		if (this.canAdd){
			this.buttons.add = Bbq.create('button', {cls: 'navbar-btn', icon: 'plus'}).body;
			crudGroup.append(this.buttons.add);
		}
		
		if (this.canSave){
			this.buttons.save = Bbq.create('button', {cls: 'navbar-btn', icon: 'floppy-disk'}).body;
			crudGroup.append(this.buttons.save);
		}
		
		if (this.canRemove){
			this.buttons.remove = Bbq.create('button', {cls: 'navbar-btn', icon: 'trash'}).body;
			crudGroup.append(this.buttons.remove);
		}
		
		if (this.canAdd || this.canSave || this.canRemove)
			toolbar.append(crudGroup);
		
		var clearGroup = Bbq.create('buttongroup', {size: 'extra-small'}).body;		
		if (this.canClear){
			this.buttons.clear = Bbq.create('button', {cls: 'navbar-btn', icon: 'remove-circle'}).body;
			clearGroup.append(this.buttons.clear);
		}
		
		if (this.canClear)
			toolbar.append(clearGroup);
		
		
		var statusGroup = Bbq.create('buttongroup', {size: 'extra-small'}).body;		
		this.buttons.status = Bbq.create('button', {cls: 'navbar-btn', enabled: false, text: 'Iniciando'}).body;
		statusGroup.append(this.buttons.status);
		toolbar.append(statusGroup);

		var otherGroup = Bbq.create('buttongroup', {size: 'extra-small'}).body;	
		if (this.canAudit){
			this.buttons.audit = Bbq.create('button', {cls: 'navbar-btn', icon: 'list-alt'}).body;
			otherGroup.append(this.buttons.audit);
		}
		
		if (this.canHelp){
			this.buttons.help = Bbq.create('button', {cls: 'navbar-btn', icon: 'info-sign'}).body;
			otherGroup.append(this.buttons.help);
		}
		
		if (this.canAudit || this.canHelp)
			ulRight.append(otherGroup);
		
		ulLeft.append(toolbar);
		
		nav.append(ulLeft);
		nav.append(ulRight);
		
		this.body = nav;
		
		if (this.renderTo != null)
			this.renderTo.append(nav);
		
	},
	_init: function(){
		this.render();
	}	
});


Bbq.define('Bbq.panel.Form', {
	xtype: 'form',	
	layout: 'inline', //Possibilidades: inline, horizontal
	renderTo: null,
	body: null,	
	_afterRender: function () {
		
		var me = this;
		
		if (this.items != null){
			for (var i in this.items){
				if (typeof this.items[i] === 'object'){
					if (this.items[i].xtype == 'textbox'){													
						$(this.items[i].input[0]).on('blur', function (e,o) {
							me.fieldValidating(o);						
						});
					}
					
				}
					
			}
		}
	},
	render: function(){		
		
		if (this.layout == 'horizontal')
			throw "Nao implementado";
				
		var form = jQuery(document.createElement("form"));		
		form.addClass(this.layout == 'inline' ? 'form-inline' : 'form-horizontal');
		form.addClass('bbq-form');
		form.attr('role', 'form');
			
		this.body = form;

		var me = this;
		
		//jQuery(this).bind('fieldValidating', function (e, o) {
		//	this.fieldValidating(e,o);
		//});
		
		if (this.renderTo != null)
			this.renderTo.append(form);
		
	},
	_init: function(){
		this.render();
	},
	fieldValidating: function (textbox){
		console.log(textbox);
		//textbox.body.addClass('has-error');		
	}	
});


Bbq.define('Bbq.field.Textbox', {
	xtype: 'textbox',	
	renderTo: null,
	body: null,
	label: '',
	placeHolder: '',
	width: 'auto',
	size: 'small',
	id: null,
	input: null,
	render: function(){		
		
		/*
		 * 
		 * <form class="form-inline" role="form">
			  <div class="form-group">
			    <label class="sr-only" for="exampleInputEmail2">Email address</label>
			    <input type="email" class="form-control" id="exampleInputEmail2" placeholder="Enter email">
			  </div>
			  <div class="form-group">
			    <label class="sr-only" for="exampleInputPassword2">Password</label>
			    <input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password">
			  </div>
			  <div class="checkbox">
			    <label>
			      <input type="checkbox"> Remember me
			    </label>
			  </div>
			  <button type="submit" class="btn btn-default">Sign in</button>
			</form>
		 */
		
		var group = jQuery(document.createElement("div"));		
		group.addClass('form-group');
		
		if (this.width != 'auto'){
			if (typeof this.width === 'number')
				group.width(this.width);
			else
				group.css('width', this.width);
		}
			
		
		var label = jQuery(document.createElement("label"));		
		label.attr('for', this.id);
		label.html(this.label);
		 
		var input = jQuery(document.createElement("input"));	
		input.addClass('form-control');
		
		if (this.size != 'normal')
			input.addClass('input-' + (this.size == 'small' ? 'sm' : 'lg'));
		
		input.attr('id', this.id);
		input.attr('placeholder', this.placeHolder);
		
	
		
		group.append(label);
		group.append(input);
		
		this.input = input;
		this.body = group;
		
		if (this.renderTo != null)
			this.renderTo.append(group);		
		
		
	},
	_init: function(){
		this.render();
	}
	
});



