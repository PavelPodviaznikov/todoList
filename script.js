var doneList = [];
var undoneList = [];
var clickCounter;
var done_counter;
var fb = new Firebase("https://podviaznikovtodolist.firebaseio.com/");
var undoneRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/undone");
var doneRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/done");


$(document).ready(function() {
    $('#container').draggable({
        revert: true
  });
    undoneRef.once('value', function(allUndoneSnap){
        allUndoneSnap.forEach(function(undoneSnap){
            var undoneText = undoneSnap.child('task').val();
            undoneList.push(undoneText);
            $('#undone_tasks').append('<div class="undone_item">' + undoneText + '<div class="del_undone"><img src="img/delete-icon.png"></div></div>');
            $('#undone_tasks_counter').text(undoneList.length);
        });
    });
    doneRef.once('value', function(allDoneSnap){
        allDoneSnap.forEach(function(doneSnap){
            var doneText = doneSnap.child('task').val();
            doneList.push(doneText);
            $('#done_tasks').append('<div class="done_item">' + doneText + '</div>');
            $('#done_tasks_counter').text(doneList.length);
        });
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
            undoneRef.push({
                task: undoneList[clickCounter]
            });
            $('#undone_tasks').append('<div class="undone_item">' + undoneList[clickCounter] + '<div class="del_undone"><img src="img/delete-icon.png"></div></div>');
            clickCounter=clickCounter+1;
            $('#undone_tasks_counter').text(undoneList.length);
            $('#inputItem').val("");

        } 
    });
    //Добавления зажания ентером
    $(document).keypress(function(e) {
    if(e.which == 13) {
        e.preventDefault();
        clickCounter = undoneList.length;
        if($('#inputItem').val()===""){
             alert("Oops, try again!");
        }
        else{
            undoneList[clickCounter] = $('#inputItem').val();
            undoneRef.push({
                task: undoneList[clickCounter]
            });
            $('#undone_tasks').append('<div class="undone_item">' + undoneList[clickCounter] + '<div class="del_undone"><img src="img/delete-icon.png"></div></div>');
            clickCounter=clickCounter+1;
            $('#undone_tasks_counter').text(undoneList.length);
            $('#inputItem').val("");
        } 
    }
});
    //Удаление сделанных заданий
    $('#delete_button').on('click', function(){
        $('#done_tasks').empty('.done_item');
        doneList = [];
        done_counter = 0;
        $('#done_tasks_counter').text(doneList.length);
        fb.child("done").remove();
    });
    //Определение сделанных заданий
    $(document).on('click','#undone_tasks .undone_item', function(){
        done_counter=doneList.length;
        var task = $(this).text();
        for(var i=0; i<undoneList.length; i+=1){
            if(undoneList[i]===task){
                $(this).replaceWith('<div class="undone_item"><strike>' + undoneList[i] + '</strike><div class="del_undone"><img src="img/delete-icon.png"></div></div>');
                $('#undone_tasks_counter').text(undoneList.length);  
            }    
        }
        doneList.push(task);
        doneRef.push({
            task: doneList[done_counter]
        });
        $('#done_tasks').append('<div class="done_item">' + doneList[done_counter] + '</div>');
        done_counter+=1;
        $('#done_tasks_counter').text(doneList.length);
    }); 
    //Удаление несделанных дел
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
        undoneRef.remove();
        for(var j=0; j<undoneList.length;j+=1){
            undoneRef.push({
                task: undoneList[j]
            }); 
        }
    });
});