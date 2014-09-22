var doneList = [];
var undoneList = [];
var clickCounter;
var done_counter = 0;

$(document).ready(function() {
    $('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = $(this).attr('href');
        $('.tabs ' + currentAttrValue).siblings().slideUp(400);
        $('.tabs ' + currentAttrValue).delay(400).slideDown(400);
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });
    $('#button').data('counter', 0).click(function(){
        clickCounter = $(this).data('counter');
        if($('#inputItem').val()===""){
             alert("Oops, try again!");
        }
        else{
            undoneList[clickCounter] = $('#inputItem').val();
            $('#undone_tasks').append('<div class="item">' + undoneList[clickCounter] + '<hr class="inner_hr"></div>');
            $(this).data('counter', clickCounter+1);
            $('#undone_tasks_counter').text(undoneList.length);
            console.log($('#inputItem').val());
        } 
    });
    $('#delete_button').on('click', function(){
        $('#done_tasks').empty('.item');
        doneList = [];
        $('#done_tasks_counter').text(doneList.length);
    });
    $(document).on('click','.item', function(){
        var task = $(this).text();
        for(var i=0; i<undoneList.length; i+=1){
            if(undoneList[i]===task){
                doneList.push(undoneList[i]);
                undoneList.splice(i,1);
                $(this).remove();
                $('#undone_tasks_counter').text(undoneList.length);
                $('#button').data('counter', clickCounter-1);
                $('#done_tasks').append('<div class="item">' + doneList[done_counter] + '<hr class="inner_hr"></div>');
                done_counter+=1;
            }
        }
        
        $('#done_tasks_counter').text(doneList.length);
    }); 
    /*$('#counter_button').on('click', function(){
        $('#done_tasks_counter').text(doneList.length);
        $('#undone_tasks_counter').text(undoneList.length);
    });*/
});