body{
    cursor: default;
}
#container{
    background-color: #4a98d3;
    height: 500px;
    width: 400px;
    margin: 20 auto;
    border-radius: 25px;
    padding: 5px;
    text-align: center;
}

.tabs {
    height: 330px;
    width: 395px;
    margin: 0 auto;
}
h2 {
    font-family:arial;
}

form {
    display: inline-block;
}
#inputItem{
    height: 35px;
    border-radius: 5px;
    border: 1px solid black;
    padding-left: 5px;
    background:#a7cce5;
}
#inputItem:focus {
    background: white;
    border: 1px solid #000000;
}

#button{
    display: inline-block;
    height:25px;
    width:95px;
    background-color:#FFA200;
    font-family:arial;
    font-weight:bold;
    color:#ffffff;
    border-radius: 5px;
    text-align:center;
    margin-top:2px;
    padding-top: 5px;
    cursor: pointer;
}
#button:hover{
    background-color: #FFCC73;
    color: #E567B1;
}
#delete_button{
    height: 19px;
    width: 95px;
    background-color: #cc0000;
    font-family: arial;
    font-weight: bold;
    color: #ffffff;
    border-radius: 5px;
    text-align: center;
    padding: 5px;
    margin-left: 20px;
    cursor: pointer;
    display: none;
}
#delete_button:hover{
    background-color: #FF4540;
    color: #FFCC73;
}

#bottom_buttons{
    text-align: left;
}
 
    /*----- Tab Links -----*/
    /* Clearfix */
    .tab-links:after {
        display:block;
        clear:both;
        content:'';
    }
    .tab-links{
        margin: 0 auto;
    }
 
    .tab-links li {
        float:left;
        list-style:none;
    }
 
        .tab-links a {
            padding:9px 15px;
            display:inline-block;
            border-radius:3px 3px 0px 0px;
            background:#7FB5DA;
            font-size:16px;
            font-weight:600;
            color:#4c4c4c;
            transition:all linear 0.15s;
            text-decoration: none;
        }
 
        .tab-links a:hover {
            background:#a7cce5;
            text-decoration:none;
        }
 
    li.active a, li.active a:hover {
        background:#fff;
        color:#4c4c4c;
    }
 
    /*----- Content of Tabs -----*/
    .tab-content {
        padding:15px;
        border-radius:3px;
        box-shadow:-1px 1px 1px rgba(0,0,0,0.15);
        background:#fff;
        height: 260px;
        overflow: auto;
    }
 
        .tab {
            display:none;
            text-align: left;
        }
 
        .tab.active {
            display:block;
        }
.undone_item{
    position: relative;
    padding: 10px;

}
#undone_tasks{
    position: relative;
}
.done_item{
        position: relative;
    padding: 10px;
}
.check_item{
    display: inline-block;
}
.check_item{
    cursor: pointer;
}
.del_undone{
    display: none;
}
img{
    display: none;
    height: 10px;
    margin: 5 auto;
}
.undone_item:hover .del_undone{
    position: absolute;
    right: 0;
    height: 20px;
    width: 20px;
    display: inline-block;
    text-align: center;
    background-color:#FFAE73;
    border-radius: 20px;
    cursor: pointer;
}
.undone_item:hover img{
    display: inherit;
    height: 10px;
    margin: 5 auto;
}
