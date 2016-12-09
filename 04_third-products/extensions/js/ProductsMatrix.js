function ProductMatrix(){
	
	this.init = function(){
		var self = this;
		$("table.ProductsMatrix tr").click(function(){
			self.toggleProduct(this);
		});
	}
	
	this.toggleProduct = function(element){
		$('ul.ProductsList', element).slideToggle(300);
		$(element).toggleClass('opened');
	}
	
	this.init();
}

var productMatrix = new ProductMatrix();
