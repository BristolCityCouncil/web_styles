// Leave this in Itermediate for now!
(function HideShowAttributes(undefined){
	window.Blockers = {
		'show' : [],
		'hide' : [],
		add : function(type, ids){
			if(ids && ids.indexOf(' ') != -1){
				ids = ids.split(' ');
				var self = this;
				$.each(ids, function(k, v){
					if(!self[type][v]) self[type][v] = 0;
					self.add(type, v);
					self[type][v]++;
				});
				return;
			}
			if(!this[type][ids]) this[type][ids] = 0;
			this[type][ids]++;
		},
		remove: function(type, ids){
			if(ids && ids.indexOf(' ') != -1){
				ids = ids.split(' ');
				var self = this;
				$.each(ids, function(k, v){
					self.remove(type, v);
					if(self[type][v]) self[type][v]--;
				});
				return;
			}
			if(this[type][ids]) this[type][ids]--;
		},
		check: function(type, id){
			Blockers[type][id] = (Blockers[type][id])? Blockers[type][id] : 0 ;
			if(Blockers[type][id] > 0){
				return false;
			}
			return true;
		},
		actionLog : [],
		flush: function(){
			if(!!window.devenv){
				console.log(this.actionLog.join("\n"));
				this.actionLog = [];
			}
		},
	};
	// Read checkbox on load
	function chs(id, attri, action, x){
		if(attri == action){
			Blockers.actionLog.push(id+' --- '+action);
			if(action == "show"){
				$('#'+id).attr('style', 'display:block;');
			}else{
				$('#'+id).attr('style', 'display:none;');
			}
		}else{
			if(Blockers.check(attri, id)){
				Blockers.actionLog.push(id+' --- '+action);
				if(action == "show"){
					$('#'+id).attr('style', 'display:block;');
				}else{
					$('#'+id).attr('style', 'display:none;');
				}
			}else{
				Blockers.actionLog.push('BLOCKED --- '+id+' --- '+action);
			}
		}
	}
	
	function attrtoggle($el, attri, action){
		var ids = $el.attr('data-'+attri),
			dor = ($el.attr('data-'+attri+'-or')) ? $el.attr('data-'+attri+'-or') : false ;
		if(attri == action){
			// CHECK
			if(!dor){
				Blockers.add(attri, $el.attr('data-'+attri));
			}
		}else{
			// UNCHECK
			if(!dor){
				Blockers.remove(attri, $el.attr('data-'+attri));
			}
			// Check against blockers
		}
		if(ids && ids.indexOf(' ') != -1){
			ids = ids.split(' ');
			ids.reverse(); // This might be the key to many of the issues.
			for(x=0; x < ids.length; x++){
				chs(ids[x], attri, action, x);
			}
		}else{
			chs(ids, attri, action);
		}
		Blockers.flush();
	}

	// Start up
	$('input[data-hide]').not(':checked').each(function(){
		attrtoggle($(this), 'hide', 'show');
	});
	$('input[data-show]').not(':checked').each(function(){
		attrtoggle($(this), 'show', 'hide');
	});
	$('input[data-hide]').filter(':checked').each(function(){
		attrtoggle($(this), 'hide', 'hide');
	});
	$('input[data-show]').filter(':checked').each(function(){
		attrtoggle($(this), 'show', 'show');
	});

	$('input[data-show]').on('hsa_check', function(){
		attrtoggle($(this), 'show', 'show');
	}).on('hsa_uncheck', function(){
		attrtoggle($(this), 'show', 'hide');
	});
	$('input[data-hide]').on('hsa_check', function(){
		attrtoggle($(this), 'hide', 'hide');
	}).on('hsa_uncheck', function(){
		attrtoggle($(this), 'hide', 'show');
	});

	
})();