var doneList = [];
var undoneList = [];
var clickCounter;
var done_counter = 0;

$(document).ready(function() {
    $('#container').draggable({
        revert: true
  });
    //Работа табок
    $('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = $(this).attr('href');
        $('.tabs ' + currentAttrValue).siblings().slideUp(400);
        $('.tabs ' + currentAttrValue).delay(400).slideDown(400);
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        if($('#dons').attr('class')==="active"){
            $('#delete_button').css("display", "inline-block");
        }
        else if($('#undons').attr('class')==="active"){
            $('#delete_button').css("display", "none");
        }
        e.preventDefault();
    });
    
    //Добавление задания
    $('#button').click(function(){
        clickCounter = undoneList.length;
        if($('#inputItem').val()===""){
             alert("Oops, try again!");
        }
        else{
            undoneList[clickCounter] = $('#inputItem').val();
            $('#undone_tasks').append('<div class="undone_item">' + undoneList[clickCounter] + '<div class="del_undone"><img src="img/delete-icon.png"></div></div>');
            clickCounter=clickCounter+1;
            $('#undone_tasks_counter').text(undoneList.length);
        } 
    });
    //Удаление сделанных заданий
    $('#delete_button').on('click', function(){
        $('#done_tasks').empty('.done_item');
        doneList = [];
        done_counter = 0;
        $('#done_tasks_counter').text(doneList.length);
    });
    //Определение сделанных заданий
    $(document).on('click','#undone_tasks .undone_item', function(){
        var task = $(this).text();
        for(var i=0; i<undoneList.length; i+=1){
            if(undoneList[i]===task){
                $(this).replaceWith('<div class="undone_item"><strike>' + undoneList[i] + '</strike><div class="del_undone"><img src="img/delete-icon.png"></div></div>');
                $('#undone_tasks_counter').text(undoneList.length);  
            }    
        }
        doneList.push(task);
        $('#done_tasks').append('<div class="done_item">' + doneList[done_counter] + '</div>');
        done_counter+=1;
        $('#done_tasks_counter').text(doneList.length);
    }); 
    $(document).on('click', '.del_undone', function(e){
        e.stopPropagation();
        for(var i=0; i<undoneList.length; i+=1){
            if($(this).parent().text()===undoneList[i]){
                undoneList.splice(i,1);
                clickCounter=undoneList.length; 
                break;  
            }
        }

        $('#undone_tasks_counter').text(undoneList.length);
        $(this).parent().remove();
    });
});