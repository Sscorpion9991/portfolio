//script.js

$(function () {


    // DRAGGEBLE
    // http://jqueryui.com/draggable/

    $('.box').draggable();

    $('#box1').draggable({
        scroll: false,
        revert: "invalid"
    });

    $('#box2').draggable({
        axis: "x"
    });

    $('#box3').draggable({
        axis: "y"
    });

    $('#box4').draggable({
        containment: ".container",
        cursor: "move",
        cursorAt: {
            top: 60,
            left: 60
        },
        revert: "invalid"
    });



    // DROPPABLE
    // http://jqueryui.com/droppable/

    $('#droppable').droppable({
        accept: '#box1',
        drop: function () {
            $(this).text("when a box got attitude, drop it like it's hot!")
        }
    });



    // SORTABLE
    // http://jqueryui.com/sortable/

    $('#sortable').sortable({
        connectWith: "#sortableToo",
        placeholder: "placeholderBox"
    });
    $('#sortableToo').sortable({
        connectWith: "#sortable",
        placeholder: "placeholderBox"
    });



    // ACCORDION
    // http://jqueryui.com/accordion/

    $("#accordion").accordion({
        collapsible: true,
        heightStyle: "content"
    });
    
    
    
    // DATEPICKER
    // http://jqueryui.com/datepicker/
    $('.date').datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 2,
        minDate: -1,
        // minDate: "-1D"
        // minDate: "-1W"
        // minDate: "-1M"
        // minDate: "-1Y"
        // minDate: "-1W -3D"
        maxDate: +4,
        dateFormat: "dd-mm-yy"
    });
    
    
    
    // TO DO LIST
    $('#todoList ul').sortable({
        items: "li:not('.listTitle, .addItem')",
        connectWith: "ul",
        dropOnEmpty: true,
        placeholder: "emptySpace"
    });

    $('input').keydown(function(e){
        if(e.keyCode == 13){
            var item = $(this).val();
            
            $(this).parent().parent().append('<li>' + item + '</li>');
            $(this).val('');
        }
    });
    
    $('#trash').droppable({
        drop: function(event, ui) {
            ui.draggable.remove();
        }
    });



});