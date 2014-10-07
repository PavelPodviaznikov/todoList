var doneList = [];
var undoneList = [];
var allList = [];
var all_counter;
var undone_counter;
var done_counter;
var ref = new Firebase('https://podviaznikovtodolist.firebaseio.com');
var userEmail="anonymus@email.com";
var userName="anonymus";
var userAutRef;
var undoneAutRef; 
var doneAutRef;
var allAutRef; 
var undoneRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/anonymus/undone"); 
var doneRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/anonymus/done");
var allRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/anonymus/all"); 
var anonymusRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/anonymus");
var isAuthorized = false;

$(document).ready(function() {
    anonymusRef.remove();
   
   $('#github').on('click', function(){
        var auth = new FirebaseSimpleLogin(ref, function(error, user) {
          if (error) {
            console.log('Authentication error: ', error);
          } else if (user) {
            userEmail=user.thirdPartyUserData.email;
            userName=user.thirdPartyUserData.login;
            $('#loginItem').css('display', 'none');
            $('#logoutItem').css('display', 'block');
            $('#github').css('display', 'none');
            $('#loginGithub').append('<p id="userName">'+userName+'</p>');
            anonymusRef.remove();
            doneList = [];
            undoneList = [];
            allList = [];
            $('.all_item').remove();
            $('.undone_item').remove();
            $('.done_item').remove();
            $('#undone_tasks_counter').text(undoneList.length);
            $('#done_tasks_counter').text(doneList.length);
            $('#all_tasks_counter').text(allList.length);
            isAuthorized = true;
            userAutRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/"+userName);
            undoneAutRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/"+userName+"/undone");
            doneAutRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/"+userName+"/done");
            allAutRef = new Firebase("https://podviaznikovtodolist.firebaseio.com/"+userName+"/all");
            //Загрузка с БД сделанных заданий
            doneAutRef.once('value', function(allDoneSnap){
                doneList = [];
                allDoneSnap.forEach(function(doneSnap){
                    var doneText = doneSnap.child('task').val();
                    doneList.push(doneText);
                    $('#done_tasks').append('<div class="done_item">' + doneText + '</div>');
                    $('#done_tasks_counter').text(doneList.length);
                });

            });
            //Загрузка с БД всех заданий
            allAutRef.once('value', function(allSnap){
                allList = [];
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
            //Загрузка с БД несделанных заданий
            undoneAutRef.once('value', function(allUndoneSnap){
                undoneList = [];
                allUndoneSnap.forEach(function(undoneSnap){
                    var undoneText = undoneSnap.child('task').val();
                    undoneList.push(undoneText);
                    $('#undone_tasks').append('<div class="undone_item">' + undoneText + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                    $('#undone_tasks_counter').text(undoneList.length);
                });
            });

          } else {
            console.log("User is logged out.")
          }
        });
        auth.login('github');
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
            undoneList[undone_counter] = $('#inputItem').val();
            if(isAuthorized){
                allAutRef.push({
                    task: allList[all_counter]
                });
                undoneAutRef.push({
                    task: undoneList[undone_counter]
                });
            }
            else{
                allRef.push({
                    task: allList[all_counter]
                });

                undoneRef.push({
                    task: undoneList[undone_counter]
                });
            }
            $('#all_tasks').append('<div class="all_item">' + allList[all_counter] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
            $('#undone_tasks').append('<div class="undone_item">' + undoneList[undone_counter] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
            all_counter=all_counter+1;
            undone_counter=undone_counter+1;
            $('#all_tasks_counter').text(allList.length);
            $('#undone_tasks_counter').text(undoneList.length);
            $('#inputItem').val("");
        } 
    });
    //Добавления задания ентером
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
                undoneList[undone_counter] = $('#inputItem').val();
                if(isAuthorized){
                    allAutRef.push({
                        task: allList[all_counter]
                    });
                    undoneAutRef.push({
                        task: undoneList[undone_counter]
                    });
                }
                else{
                    allRef.push({
                        task: allList[all_counter]
                    });

                    undoneRef.push({
                        task: undoneList[undone_counter]
                    });
                }
                $('#all_tasks').append('<div class="all_item">' + allList[all_counter] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                $('#undone_tasks').append('<div class="undone_item">' + undoneList[undone_counter] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
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
                for(var i=0; i<allList.length; i+=1){
                    for(var j=0; j<doneList.length; j+=1){
                        if(allList[i]===doneList[j]){
                            allList.splice(i,1);
                        }
                    }
                }
                if(isAuthorized){
                    allAutRef.remove();
                    for(var e=0; e<allList.length;e+=1){
                        allAutRef.push({
                            task: allList[e]
                        }); 
                    }
                }
                else{
                    allRef.remove();
                    for(var k=0; k<allList.length;k+=1){
                        allRef.push({
                            task: allList[k]
                        }); 
                    }  
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
                if(isAuthorized){
                    doneAutRef.remove()
                }
                else{
                    doneRef.remove(); 
                }
                
                $('#dialog_container').css('display', 'none');
                $('#my_dialog').css('display', 'none');
            });
            $('#cancel').on('click', function(){
                $('#dialog_container').css('display', 'none');
                $('#my_dialog').css('display', 'none');
            });
        });    
    //Определение сделанных заданий c all_tasks
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
        if(isAuthorized){
            undoneAutRef.remove();
            for(var t=0; t<undoneList.length; t+=1){
                $('#undone_tasks').append('<div class="undone_item">' + undoneList[t] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                undoneAutRef.push({
                    task: undoneList[t]
                });
            }
        }
        else{
            undoneRef.remove();
            for(var k=0; k<undoneList.length; k+=1){
                $('#undone_tasks').append('<div class="undone_item">' + undoneList[k] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
                undoneRef.push({
                    task: undoneList[k]
                });
            } 
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
            if(isAuthorized){
                doneAutRef.push({
                    task: doneList[done_counter]
                });
            }
            else{
                doneRef.push({
                    task: doneList[done_counter]
                });
            }
            
            $('#done_tasks').append('<div class="done_item">' + doneList[done_counter] + '</div>');
            done_counter+=1;
            $('#done_tasks_counter').text(doneList.length);
        }
        
    }); 
    //Определение сделанных заданий c undone_tasks
    $(document).on('click','#undone_tasks .undone_item', function(){
        done_counter=doneList.length;
        var task = $(this).text();
        for(var j=0; j<undoneList.length; j+=1){
            if(undoneList[j]===task){
                undoneList.splice(j,1);
                $('#undone_tasks_counter').text(undoneList.length);  
            }    
        }
        $('.undone_item').remove();
        if(isAuthorized){
            undoneAutRef.remove();
        }
        else{
            undoneRef.remove();
        }
        
        for(var k=0; k<undoneList.length; k+=1){
            $('#undone_tasks').append('<div class="undone_item">' + undoneList[k] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
            if(isAuthorized){
                undoneAutRef.push({
                    task: undoneList[k]
                });
            }
            else{
                undoneRef.push({
                    task: undoneList[k]
               });
            }
            
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
            if(isAuthorized){
                doneAutRef.push({
                    task: doneList[done_counter]
                });
            }
            else{
                doneRef.push({
                    task: doneList[done_counter]
                });
            }
            
            $('#done_tasks').append('<div class="done_item">' + doneList[done_counter] + '</div>');
            done_counter+=1;
            $('#done_tasks_counter').text(doneList.length);
        }

        $('.all_item').remove();
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
             $('#undone_tasks').append('<div class="undone_item">' + undoneList[t] + '<div class="del_all"><img src="img/delete-icon.png"></div></div>');
        }
        for(var b=0; b<doneList.length;b+=1){
             $('#done_tasks').append('<div class="done_item">' + doneList[b] + '</div>');
        }
        if(isAuthorized){
            allAutRef.remove();
            undoneAutRef.remove();
            doneAutRef.remove();
            for(var k=0; k<allList.length;k+=1){
                allAutRef.push({
                    task: allList[k]
                }); 
            }
            for(var m=0; m<undoneList.length;m+=1){
                undoneAutRef.push({
                    task: undoneList[m]
                }); 
            }
            for(var p=0; p<doneList.length;p+=1){
                doneAutRef.push({
                    task: doneList[p]
                }); 
            }
        }
        else{
            allRef.remove();
            undoneRef.remove();
            doneRef.remove();
            for(var q=0; q<allList.length;q+=1){
                allRef.push({
                    task: allList[q]
                }); 
            }
            for(var w=0; w<undoneList.length;w+=1){
                undoneRef.push({
                    task: undoneList[w]
                }); 
            }
            for(var e=0; e<doneList.length;e+=1){
                doneRef.push({
                    task: doneList[e]
                }); 
            }
        }
        

    });
    $('#loginItem').on('click', function(){
        $('#dialog_container').css('display', 'block');
        $('#login_dialog').css('display', 'block');
    });
    $('#loginCancel').on('click', function(){
        $('#dialog_container').css('display', 'none');
        $('#login_dialog').css('display', 'none');
    });
    $('#logoutItem').on('click', function(){
        $('#logoutItem').css('display', 'none');
        $('#loginItem').css('display', 'block');
        ref.unauth();
        doneList = [];
        undoneList = [];
        allList = [];
        $('.all_item').remove();
        $('.undone_item').remove();
        $('.done_item').remove();
        $('#undone_tasks_counter').text(undoneList.length);
        $('#done_tasks_counter').text(doneList.length);
        $('#all_tasks_counter').text(allList.length);
        $('#userName').empty();
        $('#github').css('display', 'inline');
        isAuthorized = false;
    });

});