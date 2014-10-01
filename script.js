var doneList = [];
var undoneList = [];
var allList = [];
var all_counter;
var undone_counter;
var done_counter;
var fb = new Firebase("https://podviaznikovtodolist.firebaseio.com/");
var undoneRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/undone");
var doneRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/done");
var allRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/all");
var some;


$(document).ready(function() {
    $('#container').draggable({
        revert: true
  });
    doneRef.once('value', function(allDoneSnap){
        allDoneSnap.forEach(function(doneSnap){
            var doneText = doneSnap.child('task').val();
            doneList.push(doneText);
            $('#done_tasks').append('<div class="done_item">' + doneText + '</div>');
            $('#done_tasks_counter').text(doneList.length);
        });
    });
    allRef.once('value', function(allSnap){
        allSnap.forEach(function(snapshot){
            var allText = snapshot.child('task').val();
            allList.push(allText);
            var some = false;
            for(var i=0; i<allList.length; i+=1){
                for(var j=0; j<doneList.length; j+=1){
                    if(allList[i]===doneList[j]){
                        some = true;
                        break;
                    }
                    else{
                        some = false;
                    }
                }
            }
            if(some){
                $('#all_tasks').append('<div class="all_item striker">'+allText+'<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                some=false;
            }
            else{
                $('#all_tasks').append('<div class="all_item">'+allText+'<div class="del_all"><img src="img/delete-icon.png"></div></div>');
            }
            $('#all_tasks_counter').text(allList.length);
        });
    });
    undoneRef.once('value', function(allUndoneSnap){
        allUndoneSnap.forEach(function(undoneSnap){
            var undoneText = undoneSnap.child('task').val();
            undoneList.push(undoneText);
            $('#undone_tasks').append('<div class="undone_item">' + undoneText + '</div>');
            $('#undone_tasks_counter').text(undoneList.length);
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
        else if($('#undons').attr('class')==="active"||$('#alls').attr('class')==="active"){
            $('#delete_button').css("display", "none");
        }
        e.preventDefault();
    });
    
    //Добавление задания
    $('#button').click(function(){
        all_counter = allList.length;
        undone_counter = undoneList.length;
        var isInList = false;
        for(var i in allList){
            if(allList[i]===$('#inputItem').val()){
                isInList = true;
            }
        }
        if($('#inputItem').val()===""){
             alert("Oops, try again!");
        }
        else if(isInList){
            alert("Oops, there is such task!");
        }
        else{
            allList[all_counter] = $('#inputItem').val();
            allRef.push({
                task: allList[all_counter]
            });
            $('#all_tasks').append('<div class="all_item">' + allList[all_counter] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
            //////////////////////////////////////
            undoneList[undone_counter] = $('#inputItem').val();
            undoneRef.push({
                task: undoneList[undone_counter]
            });
            $('#undone_tasks').append('<div class="undone_item">' + undoneList[undone_counter] + '</div>');
            all_counter=all_counter+1;
            undone_counter=undone_counter+1;
            $('#all_tasks_counter').text(allList.length);
            $('#undone_tasks_counter').text(undoneList.length);
            $('#inputItem').val("");
        } 
    });
    //Добавления зажания ентером
    $(document).keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
            all_counter = allList.length;
            undone_counter = undoneList.length;
            var isInList = false;
            for(var i in allList){
                if(allList[i]===$('#inputItem').val()){
                    isInList = true;
                }
            }
            if($('#inputItem').val()===""){
                 alert("Oops, try again!");
            }
            else if(isInList){
                alert("Oops, there is such task!");
            }
            else{
                allList[all_counter] = $('#inputItem').val();
                allRef.push({
                    task: allList[all_counter]
                });
                $('#all_tasks').append('<div class="all_item">' + allList[all_counter] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                //////////////////////////////////////
                undoneList[undone_counter] = $('#inputItem').val();
                undoneRef.push({
                    task: undoneList[undone_counter]
                });
                $('#undone_tasks').append('<div class="undone_item">' + undoneList[undone_counter] + '</div>');
                all_counter=all_counter+1;
                undone_counter=undone_counter+1;
                $('#all_tasks_counter').text(allList.length);
                $('#undone_tasks_counter').text(undoneList.length);
                $('#inputItem').val("");
            } 
        }
    });
    //Удаление сделанных заданий
    $('#delete_button').on('click', function(){
            $('#dialog_container').css('display', 'block');
            $('#my_dialog').css('display', 'block');
            $('#delete').on('click', function(){
                for(var i in allList){
                    for(var j in doneList){
                        if(allList[i]===doneList[j]){
                            allList.splice(i,1);
                        }
                    }
                }
                allRef.remove();
                for(var k=0; k<allList.length;k+=1){
                    allRef.push({
                        task: allList[k]
                    }); 
                }
                $('#all_tasks').empty('.all_item');
                for(var b=0; b<allList.length;b+=1){
                     $('#all_tasks').append('<div class="all_item">' + allList[b] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                }
                $('#all_tasks_counter').text(allList.length);
                $('#done_tasks').empty('.done_item');
                doneList = [];
                done_counter = 0;
                $('#done_tasks_counter').text(doneList.length);
                fb.child("done").remove(); 
                $('#dialog_container').css('display', 'none');
                $('#my_dialog').css('display', 'none');
            });
            $('#cancel').on('click', function(){
                $('#dialog_container').css('display', 'none');
                $('#my_dialog').css('display', 'none');
            });
        });    
    //Определение сделанных заданий
    $(document).on('click','#all_tasks .all_item', function(){
        done_counter=doneList.length;
        var task = $(this).text();
        for(var i=0; i<allList.length; i+=1){
            if(allList[i]===task){
                $(this).replaceWith('<div class="all_item striker">' + allList[i] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                $('#all_tasks_counter').text(allList.length);  
            }    
        }
        for(var j=0; j<undoneList.length; j+=1){
            if(undoneList[j]===task){
                undoneList.splice(j,1);
                $('#undone_tasks_counter').text(undoneList.length);  
            }    
        }
        $('.undone_item').remove();
        undoneRef.remove();
        for(var k=0; k<undoneList.length; k+=1){
            $('#undone_tasks').append('<div class="undone_item">' + undoneList[k] + '</div>');
            undoneRef.push({
                task: undoneList[k]
            });
        }
        var isInList = false;
        for(var m in doneList){
            if(doneList[m]===task){
                isInList=true;
            }
        }
        if(isInList){
            return;
        }
        else{
            doneList.push(task);
            doneRef.push({
                task: doneList[done_counter]
            });
            $('#done_tasks').append('<div class="done_item">' + doneList[done_counter] + '</div>');
            done_counter+=1;
            $('#done_tasks_counter').text(doneList.length);
        }
        
    }); 

    /*$(document).on('click','.striker', function(){
        
    });*/
    //Удаление несделанных дел
    $(document).on('click', '.del_all', function(e){
        e.stopPropagation();
        for(var i=0; i<allList.length; i+=1){
            if($(this).parent().text()===allList[i]){
                allList.splice(i,1);
                all_counter=allList.length;
                break;  
            }
        }
        for(var j=0; j<undoneList.length; j+=1){
            if($(this).parent().text()===undoneList[j]){
                undoneList.splice(j,1);
                undone_counter=undoneList.length;
                break;  
            }
        }
        for(var a=0; a<doneList.length; a+=1){
            if($(this).parent().text()===doneList[a]){
                doneList.splice(a,1);
                done_counter=doneList.length;
                break;  
            }
        }
        $('#all_tasks_counter').text(allList.length);
        $('#undone_tasks_counter').text(undoneList.length);
        $('#done_tasks_counter').text(doneList.length);
        $('.all_item').remove();
        $('.undone_item').remove();
        $('.done_item').remove();
        var smth = false;
        for(var s=0; s<allList.length;s+=1){
            var allVar = allList[s];
             for(var u=0; u<doneList.length; u+=1){
                if(allList[s]===doneList[u]){
                    smth = true;
                    break;
                }
                else{
                    smth = false;
                }
             } 
             if(smth){
                $('#all_tasks').append('<div class="all_item striker">' + allVar + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                smth=false;
             } 
             else{
                $('#all_tasks').append('<div class="all_item">' + allVar + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
             }
        }
        for(var t=0; t<undoneList.length;t+=1){
             $('#undone_tasks').append('<div class="undone_item">' + undoneList[t] + '</div>');
        }
        for(var b=0; b<doneList.length;b+=1){
             $('#done_tasks').append('<div class="done_item">' + doneList[b] + '</div>');
        }
        allRef.remove();
        undoneRef.remove();
        doneRef.remove();
        for(var k=0; k<allList.length;k+=1){
            allRef.push({
                task: allList[k]
            }); 
        }
        for(var m=0; m<undoneList.length;m+=1){
            undoneRef.push({
                task: undoneList[m]
            }); 
        }
        for(var p=0; p<doneList.length;p+=1){
            doneRef.push({
                task: doneList[p]
            }); 
        }

    });

});