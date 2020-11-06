/*-----------------------------------------------------------------
  Notific - jQuery notification plugin
  Author: Webarion
-----------------------------------------------------------------*/
/*-----------------------------------------------------------------
	Notific - jQuery плагин уведомлений
	Автор: Webarion
-----------------------------------------------------------------*/
function CSSLoad(file){
	var link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("href", file);
	document.getElementsByTagName("head")[0].appendChild(link)
}

jQuery(document).ready(function($) {

CSSLoad('notific.css'); //Loading CSS. Загрузка CSS

  Message = {
  	container:'Notific',       // - Message container class. Класс контейнера сообщений
  	notic:    'notic',         // - Message element class. Класс элемента сообщения
  	settings:{				         // - Default message settings. Настройки сообщений по умолчанию
      selector:   'body',
      method:     'modal',
  		type:       'default',   // - 'default'|'success'|'info'|'warning'|'error'|'loader'
  		insert:     'append',    // - 'prepend'|'append'
  		timeIn:     400,	       // - Appearance time in milliseconds 1sec = 1000 milliseconds. Время появления в миллисекундах 1сек = 1000 миллисекунд
  		timeOut:    1000,	       // - The time of disappearance. Время исчезания
  		life:       2000,	       // - Display duration. Продолжительность показа
  		sticky:     false,	     // - Auto-fade. Автоисчезание. Options(Варианты) - false|true
  		icon:       true,	       // - Whether to show the main icon. Показывать ли основную иконку. Options(Варианты) - false|true
  		close:      true,        // - false|'click'|true
  		vertical:   'top',	     // - Vertical arrangement. Вертикальное расположение. Options(Варианты) - 'top'|'center'|'bottom'
  		horizontal: 'right',     // - Horizontal arrangement. Горизонтальное расположение. Options(Варианты) - 'left'|'center'|'right'
  		skin:       '',		       // - Styles in css format. Стили в формате css. Example(Пример): border-radius:5px;
  		style:      '',
      return:     'id',
      'border-radius':true
  	},

  	add:function(text,options){
      options = this.options(options);
    	var content = this.layout(text, options);  
      var method = (options.method == 'modal') ? 'wbModal' : options.method;

    	var notifiClass = this.container+' '+method+' v'+options.vertical+' h'+options.horizontal;
    	var jQueryClass = '.'+notifiClass.replace(/\s/g,'.');

    	if (!$(jQueryClass).length){
    		$(options.selector).append( $('<div>',{class:notifiClass}) );
    	}

    	if(options.insert=='prepend'){
        $(jQueryClass).prepend(content);
    	}else{
    		$(jQueryClass).append(content);
    	}

      this.hide(content,{sticky:options.sticky,timeOut:options.timeOut,life:options.life});

    	return options.return=='object' ? content : content.attr('id');
    },

  layout:function(text, options){
    options = this.options(options);
    var mt = String(Date.now());
    var id = mt.slice(mt.length-9,mt.length)
    var close = ((options.close||options.type == 'loader')&&options.close!='click')?(options.close)?' close-on':'':' close-event';
    var content = $('<div>',{
      id:id,
      class:
        this.notic+' ni-'+options.type+(options.icon ? ' ico' : '')+close+' '+options.skin,
      html: text,
      append: options.close && options.close!='click' ? $('<div>',{class:'close-ico close-event'}) : $([]),
    }).fadeIn(options.timeIn);
    return content;  
  },

  hide:function(element,options){
      var params = {sticky:this.settings.sticky,timeOut:this.settings.timeOut,life:this.settings.life};
      options = this.options(options,params);
      element = this.elem(element);

      var that = this;

      if (!options.sticky){
        setTimeout(function(){
          that.close(element,options.timeOut);   
        }, options.life);
      };

      if(!element.is('.ni-loader')){
        $('.close-event').on('click',function(){
          var el = $(this).closest('.'+that.container+' .'+that.notic);
          that.close(el,options.timeOut);
        });
      }

  },

  close:function(element,timeOut=400) {
    element = this.elem(element);
  	var that = element.closest('.'+this.container);
    element.animate({'opacity':0},timeOut,function(){
      element.slideUp(300,function(){
        element.remove();
        if(that.html()==''){
          that.remove();
        }
      });
    });
  },

  replace:function(text,element,options){
    options = this.options(options);
    element = this.elem(element);
    var content = this.layout(text, options);   
    //Заменяем содержимое элемента
    element.replaceWith(content);
    this.hide(content,options);
  },

  init:function(options){
  	this.settings = $.extend(this.settings, options);
    var style = this.settings.style;
    if(this.settings.style !== 'undefined'){
    	$('style:contains("'+style+'")').remove();
    	$("head").append($('<style type="text/css">'+style+'</style>'));
    }

  	return this;
  },

  options:function(options,params=this.settings){
    options = (typeof options=='object')?$.extend(false,params,options):params;
    if(options.type == 'loader'){
      options.close  = false;
      options.sticky = true;
    }
    return options;
  },

  elem:function(element){
    return typeof element == 'object' ? element : $('#'+element);
  }
  };

});