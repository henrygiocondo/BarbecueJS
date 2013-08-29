Bbq.application({
	name: 'DataBox',
	launch: function(){
		Bbq.get('appLoadingIndicator').detach();
		
		var window = Bbq.create('window', {
			title: 'Window 1',
		 	autoShow: true,
		 	renderTo: jQuery(document.body),
		 	minimizable: true,
		 	maximizable: true,
		 	width: 600,
		 	height: 400,
		 	windowType: 'simpleform',
		 	items: [
		 	        {
		 	        	xtype: 'form',
		 	        	layout: 'inline',
		 	        	items: [
		 	        	        {
		 	        	        	xtype: 'textbox',
		 	        	        	label: 'Codigo',
		 	        	        	placeHolder: 'Codigo',
		 	        	        	width: '25%'
		 	        	        },
		 	        	       {
		 	        	        	xtype: 'textbox',
		 	        	        	label: 'Descricao',
		 	        	        	placeHolder: 'Descricao',
		 	        	        	width: '25%'
		 	        	        },
		 	        	       {
		 	        	        	xtype: 'textbox',
		 	        	        	label: 'Razao Social',
		 	        	        	placeHolder: 'Razao social',
	 	        	        		width: '50%'
		 	        	        },
		 	        	       {
		 	        	        	xtype: 'textbox',
		 	        	        	label: 'Codigo',
		 	        	        	placeHolder: 'Codigo',
		 	        	        	width: '25%'
		 	        	        },
		 	        	       {
		 	        	        	xtype: 'textbox',
		 	        	        	label: 'Descricao',
		 	        	        	placeHolder: 'Descricao',
		 	        	        	width: '25%'
		 	        	        },
		 	        	        {
		 	        	        	xtype: 'textbox',
		 	        	        	label: 'Razao Social',
		 	        	        	placeHolder: 'Razao social',
	 	        	        		width: '50%'
		 	        	        }
 	        	        ]		 	        			 	        
		 	        }
 	        ]
		});	
		
		
	}
});