/**
 * jquery.simpletip 1.3.1. A simple tooltip plugin
 * 
 * Copyright (c) 2009 Craig Thompson
 * http://craigsworks.com
 *
 * Licensed under GPLv3
 * http://www.opensource.org/licenses/gpl-3.0.html
 *
 * Launch  : February 2009
 * Version : 1.3.1
 * Released: February 5, 2009 - 11:04am
 */
(function($){

   function Simpletip(elem, conf)
   {
      var self = this;
      elem = jQuery(elem);
      
      var tooltip = jQuery(document.createElement('div'))
                     .addClass(conf.baseClass)
                     .addClass( (conf.fixed) ? conf.fixedClass : '' )
                     .addClass( (conf.persistent) ? conf.persistentClass : '' )
                     .html(conf.content)
                     .appendTo(elem);
      
      if(!conf.hidden) tooltip.show();
      else tooltip.hide();
      
      if(!conf.persistent)
      {
		if(conf.hover) {
			elem.hover(
				function(event){ self.show(event) },
				function(){ self.hide() }
			);
		}

		if(!conf.fixed) {
			elem.mousemove( function(event){ 
				if(tooltip.css('display') !== 'none') self.updatePos(event); 
			});
		};
      }
      else
      {
         elem.click(function(event)
         {
            if(event.target === elem.get(0))
            {
               if(tooltip.css('display') !== 'none')
                  self.hide();
               else
                  self.show();
            };
         });
         
         jQuery(window).mousedown(function(event)
         { 
            if(tooltip.css('display') !== 'none')
            {
               var check = (conf.focus) ? jQuery(event.target).parents('.tooltip').andSelf().filter(function(){ return this === tooltip.get(0) }).length : 0;
               if(check === 0) self.hide();
            };
         });
      };
      
      
      jQuery.extend(self,
      {
         getVersion: function()
         {
            return [1, 2, 0];
         },
         
         getParent: function()
         {
            return elem;
         },
         
         getTooltip: function()
         {
            return tooltip;
         },
         
         getPos: function()
         {
            return tooltip.offset();
         },
         
         setPos: function(posX, posY)
         {
            var elemPos = elem.offset();
            
            if(typeof posX == 'string') posX = parseInt(posX) + elemPos.left;
            if(typeof posY == 'string') posY = parseInt(posY) + elemPos.top;
            
            tooltip.css({ left: posX, top: posY });
            
            return self;
         },
         
         show: function(event)
         {
			if(conf.hideElements){
				jQuery(conf.hideElements).hide();
			}
            conf.onBeforeShow.call(self);
            
            self.updatePos( (conf.fixed) ? null : event );
            
            switch(conf.showEffect)
            {
               case 'fade': 
                  tooltip.fadeIn(conf.showTime); break;
               case 'slide': 
                  tooltip.slideDown(conf.showTime, self.updatePos); break;
               case 'custom':
                  conf.showCustom.call(tooltip, conf.showTime); break;
               default:
               case 'none':
                  tooltip.show(); break;
            };
            
            tooltip.addClass(conf.activeClass);
            
            conf.onShow.call(self);
            
            return self;
         },
         
         hide: function(elementsToHide)
         {
            conf.onBeforeHide.call(self);
            
            switch(conf.hideEffect)
            {
               case 'fade': 
                  tooltip.fadeOut(conf.hideTime); break;
               case 'slide': 
                  tooltip.slideUp(conf.hideTime); break;
               case 'custom':
                  conf.hideCustom.call(tooltip, conf.hideTime); break;
               default:
               case 'none':
                  tooltip.hide(); break;
            };
            
            tooltip.removeClass(conf.activeClass);
            
            conf.onHide.call(self);
			if(conf.hideElements) {
				jQuery(conf.hideElements).hide();
			}
            return self;
         },
         
         update: function(content)
         {
            tooltip.html(content);
            conf.content = content;
            
            return self;
         },
         
         load: function(uri, data)
         {
            conf.beforeContentLoad.call(self);
            
            tooltip.load(uri, data, function(){ conf.onContentLoad.call(self); });
            
            return self;
         },
         
         boundryCheck: function(posX, posY)
         {
            var newX = posX + tooltip.outerWidth();
            var newY = posY + tooltip.outerHeight();
            
            var windowWidth = jQuery(window).width() + jQuery(window).scrollLeft();
            var windowHeight = jQuery(window).height() + jQuery(window).scrollTop();
            
            return [(newX >= windowWidth), (newY >= windowHeight)];
         },
         
         updatePos: function(event)
         {
            var tooltipWidth = tooltip.outerWidth();
            var tooltipHeight = tooltip.outerHeight();
			var margins;
            
            if(!event && conf.fixed)
            {
               if(conf.position.constructor == Array)
               {
                  posX = parseInt(conf.position[0]);
                  posY = parseInt(conf.position[1]);
               }
               else if(jQuery(conf.position).attr('nodeType') === 1)
               {
                  var offset = jQuery(conf.position).offset();
                  posX = offset.left;
                  posY = offset.top;
               }
               else
               {
                  var elemPos = elem.offset();
                  var elemWidth = elem.outerWidth();
                  var elemHeight = elem.outerHeight();
                  
                  switch(conf.position)
                  {
                     case 'top':
                        var posX = elemPos.left - (tooltipWidth / 2) + (elemWidth / 2);
                        var posY = elemPos.top - tooltipHeight;
                        break;
                        
                     case 'bottom':
                        var posX = elemPos.left - (tooltipWidth / 2) + (elemWidth / 2);
                        var posY = elemPos.top + elemHeight;
                        break;
                     
                     case 'left':
                        var posX = elemPos.left - tooltipWidth;
                        var posY = elemPos.top - (tooltipHeight / 2) + (elemHeight / 2);
                        break;
                        
                     case 'right':
                        var posX = elemPos.left + elemWidth;
                        var posY = elemPos.top - (tooltipHeight / 2) + (elemHeight / 2);
                        break;
                     
                     default:
                     case 'default':
                        var posX = (elemWidth / 2) + elemPos.left + 20;
                        var posY = elemPos.top;
                        break;
                  };
               };
            }
            else
            {
               var posX = event.pageX;
               var posY = event.pageY;
            };
            
            if(typeof conf.position != 'object')
            {
               posX = posX + conf.offset[0];
               posY = posY + conf.offset[1];
               if(conf.boundryCheck)
               {
                  var overflow = self.boundryCheck(posX, posY);
                                    
                  if(overflow[0]) posX = posX - (tooltipWidth / 2) - (2 * conf.offset[0]);
                  if(overflow[1]) posY = posY - (tooltipHeight / 2) - (2 * conf.offset[1]);
               }
            }
            else
            {
               if(typeof conf.position[0] == "string") posX = String(posX);
               if(typeof conf.position[1] == "string") posY = String(posY);
            };
			
			var offsets = conf.offsets;
			posX += offsets.x;
			posY += offsets.y;

			margins = this.countAllMargins();
			posY -= margins.y; // отступы сверху, для всяких плашечек
			
			var bodyWidth = jQuery("body").width();
			var bodyHeight = jQuery("body").height();
			if(conf.offsetElement.length) {
				bodyWidth = jQuery('.scrollBlock', conf.offsetElement).outerWidth(); // нужна ширина контейнера в котором лежит документ
			}

			if(conf.offsetElement.length) {
				var parentOffset = jQuery('.scrollBlock', conf.offsetElement).offset();
				var offsetElementScrollTop = conf.offsetElement.scrollTop();
				posX -= parentOffset.left; // учитывает отступ слева из-за центрирования
				posY += offsetElementScrollTop; // учитывает скроллинг
				if(posX+tooltipWidth+10 > bodyWidth) {
					posX -= (tooltipWidth);
					posX += conf.invertedOffsets.x;
				}
				console.log(posY+tooltipHeight+margins.y + 100, bodyHeight + offsetElementScrollTop);
				if(posY + tooltipHeight + margins.y + 100 > bodyHeight + offsetElementScrollTop) {
					posY -= (tooltipHeight);
					posY += conf.invertedOffsets.y;
				}
			}

            self.setPos(posX, posY);
            
            return self;
         },
		 countAllMargins: function() {
			var paddingLeft = 0;
			var paddingTop = 0;
			var elem = tooltip.parent();
			var i = 0;
			var stopElement = jQuery(".tabBody");
			// if(conf.offsetElement.length) {
				// jQuery('.scrollBlock', conf.offsetElement); // учитывает отступ слева из-за центрирования
			// }
			while(!(elem.is("body") || elem[0] == stopElement[0])) {
				if(elem.length == 0) {
					return {
						x : paddingLeft,
						y : paddingTop
					};
				}
				paddingLeft += parseInt(elem.css('padding-left'));
				paddingTop += parseInt(elem.css('padding-top'));
				i++;
				// console.log(i+" "+elem.attr('class'),elem.css('padding-top'));
				elem = elem.parent();
			}
			return {
				x : paddingLeft,
				y : paddingTop
			};
		 },
      });
   };
   
   jQuery.fn.simpletip = function(conf, callback)
   { 
      // Check if a simpletip is already present
      var api = jQuery(this).eq(typeof conf == 'number' ? conf : 0).data("simpletip");
      if(api) return api;
      
      // Default configuration
      var defaultConf = {
         // Basics
         content: 'A simple tooltip',
         persistent: false,
         focus: false,
         hidden: true,
		 hover: false,
		 hideElements:"",
         
         // Positioning
         position: 'default',
         offset: [0, 0],
         boundryCheck: true,
         fixed: false,
		 offsets:{
			x:0,
			y:0
		 },
		 invertedOffsets:{
			x:0,
			y:0
		 },
		 //offsetElement
		 offsetElement:jQuery(),
         
         // Effects
         showEffect: 'fade',
         showTime: 150,
         showCustom: null,
         hideEffect: 'fade',
         hideTime: 150,
         hideCustom: null,
         
         // Selectors and classes
         baseClass: 'tooltip',
         activeClass: 'active',
         fixedClass: 'fixed',
         persistentClass: 'persistent',
         focusClass: 'focus',
         
         // Callbacks
         onBeforeShow: function(){},
         onShow: function(){},
         onBeforeHide: function(){},
         onHide: function(){},
         beforeContentLoad: function(){},
         onContentLoad: function(){}
      };
      jQuery.extend(defaultConf, conf);
      
      this.each(function()
      {
         var el = new Simpletip(jQuery(this), defaultConf);
         jQuery(this).data("simpletip", el);
		 if(callback) {
			callback();
		 }
      });
      
      return this; 
   };
})();