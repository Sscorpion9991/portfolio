function  Message(){	
	
	this.documentNotFound = 'Документ не найден';
	this.noMore100 = 'Вы можете выделить не более %0 документов';
	this.docNotFoundMessNoDocInBase = 'Запрашиваемый документ отсутствует в базе';
	///this.docNotFoundMess2 = 'Для решения проблемы, пожалуйста, обратитесь к своему представителю.';
	this.docNotFoundMessOveruse = 'Доступ к документу ограничен';
	this.listDocumentDefTitle = 'Список документов';
	this.dateErrorFormat = 'Неверный формат даты';
	this.deleteSelectedBookmarks = 'Удалить выделенные элементы?';
	this.brokenData = 'Ошибка данных';
	this.longOperation = 'Идет выполнение операции...';
	this.waitMessage = 'Пожалуйста, подождите...';
	this.notEditMainFolder = 'Нельзя редактировать наименование главной папки';
	this.saveNotice = "Сохранение формы через данную операцию может быть некорректным.\n"
					+ "Для корректного сохранения нажмите на значок MS Word и/или MS Excel,\n"
					+ "размещенный перед текстом формы, и сохраните форму в выбранном приложении.\n"
					+ "Вы хотите отменить выполнение операции?";
	this.printNotice = "Печать формы через данную операцию может быть некорректной.\n"
					 + "Для корректной печати нажмите на значок MS Word и/или MS Excel, размещенный перед текстом формы,\n"
					 + "и распечатайте форму из выбранного приложения.\n"
					 + "Вы хотите отменить выполнение операции?";
	this.wordNotice = "Выгрузка формы в Word через данную операцию может быть некорректной.\n"
					+ "Для корректной выгрузки нажмите на значок MS Word и/или MS Excel,\n"
					+ "размещенный перед текстом формы.\n"
					+ "Вы хотите отменить выполнение операции?";
	this.get = function(key,attr){
		if (attr && attr.length){
			var str = this[key];
			for(var i=0; i<attr.length; i++){
				str = str.replace('%'+i,attr[i]);	
			}
			return str;
		}
		return this[key];	
	}
	
	
}
