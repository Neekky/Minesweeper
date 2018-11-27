//点击开始游戏 -》动态生成100个小格--》 100div

//leftClick 没有雷  -》 显示数字（周围8格中，雷的数量） 扩散（当前周围八个格没有雷）
// 有雷，游戏直接结束

//rightClick 没有标记并且没有数字--》进行标记  有标记 -》 取消标记  判断标记是否正确，10个都正确标记，提示过关。
//已经出现数字 --》 无效果

var stratBtn = document.getElementById("btn");
var box = document.getElementById("box");
var flagBox = document.getElementById("flagBox");
var alertBox = document.getElementById("alertBox");
var alertImg = document.getElementById("alertImg");
var closeBtn = document.getElementById("close");
var score = document.getElementById("score");
var minesNum;
var mineOver;
var block;
var mineMap = [];
var startGameBool = true;

//初始雷盘
bindEvent();
function bindEvent(){
    stratBtn.onclick = function(){
        if(startGameBool){
            box.style.display = "block";
            flagBox.style.display = "block";
            init();
            startGameBool = false;
            }
        }
    
    box.oncontextmenu = function(){
        return false;
    }
    box.onmousedown = function(e){ 
        var event = e.target;
        if(e.which == 1){
            leftClick(event);
        } else if (e.which == 3){
            rightClick(event);    
        }
    }
    closeBtn.onclick = function(){
        alertBox.style.display = "none";
        flagBox.style.display = "none";
        box.style.display = "none";
        box.innerHTML = "";
        startGameBool = true;
    }
}

function init(){
    minesNum = 10;
    mineOver = 10;
    score.innerHTML = mineOver;

    for(var i = 0;i < 10;i ++){
        for(var j = 0;j < 10;j ++){
            var con = document.createElement("div");
            //在元素中添加一个或多个类名。如果指定的类名已存在，则不会添加 
            con.classList.add("block");
            //添加指定的属性，并为其赋指定的值。如果这个指定的属性已存在，则仅设置/更改值。
            con.setAttribute("id",i + "-" + j);
            box.appendChild(con);
            mineMap.push({mine:0});
        }
    }
    block = document.getElementsByClassName("block");
    //生成地雷
    while(minesNum){
        var mineIndex = Math.floor((Math.random()*100));
        if(mineMap[mineIndex].mine === 0){
            mineMap[mineIndex].mine = 1;
            block[mineIndex].classList.add("mine");
            minesNum --;
        }
    }   
}

//左击事件
function leftClick(dom){
    if(dom.classList.contains("flag")){
        return;
    }
    var mine = document.getElementsByClassName("mine");
    if(dom && dom.classList.contains("mine")){
        console.log("GameOver");
        //游戏失败，所有的雷都显示出来
        for(var i = 0;i < mine.length;i ++){
            mine[i].classList.add("show");
        }
        setTimeout(function(){
            alertBox.style.display = "block";
            alertImg.style.backgroundImage = "url('img/over.jpg')";
        },800)
    }else{
        var n = 0;
        var posArr = dom && dom.getAttribute("id").split("-");
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add("num");
        /*
        * 如果不进行+posArr[0]的隐式转换，
        * 那么在循环里i <= posX + 1里，判断为小于字符串的东西。
        * 会导致后面出现难以预料和理解的结果。
        *
        * */
        for(var i = posX - 1;i <= posX + 1;i ++){
            for(var j = posY - 1;j <= posY + 1;j ++){
                var arroundMine = document.getElementById(i + "-" + j);
                if (arroundMine && arroundMine.classList.contains("mine")){
                    n++;
                }    
            }
        }
        dom && (dom.innerHTML = n);

        if(n == 0){
            for(var i = posX - 1;i <= posX + 1;i ++){
                for(var j = posY - 1;j <= posY + 1;j ++){
                    var nearBox = document.getElementById(i + "-" + j);
                    if(nearBox && nearBox.length != 0){
                        if(!nearBox.classList.contains("check")){
                            nearBox.classList.add("check");
                            //这里的nearBox是一个类数组，函数会逐条将类数组元素作为实参执行一次。
                            leftClick(nearBox);
                        }
                    }
                }
            }
        }
    }
}


function rightClick(dom){
    if(dom.classList.contains("num")){
        return;
    }
    /* toggle(class, true|false)
    * 在元素中切换类名。
    * 第一个参数为要在元素中移除的类名，并返回 false。 
    * 如果该类名不存在则会在元素中添加类名，并返回 true。 
    * */

    dom.classList.toggle("flag");
    if(dom.classList.contains("mine") && dom.classList.contains("flag")){
        mineOver --;
    }
    if(dom.classList.contains("mine") && !dom.classList.contains("flag")){
        mineOver ++;
    }
    
    score.innerHTML = mineOver;
    if(mineOver == 0){
        alertBox.style.display = "block";
        alertImg.style.backgroundImage = "url('img/success.png')";
    }
}