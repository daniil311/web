/**
 * Created with JetBrains WebStorm.
 * User: boyarshinov
 * Date: 26.06.13
 * Time: 18:36
 * To change this template use File | Settings | File Templates.
 */
var mesh; //array
var meshSize=32; //32px
var headings={up:{x:0,y:1},down:{x:0,y:-1},left:{x:-1,y:0},right:{x:1,y:0}};
var fieldItems={empty:"empty",head:"head",body:"body",food:"food"};
var snake;
var interval;
var score=0;

var headUpImg = new Image();
headUpImg.src="img/head.png";
var headDnImg = new Image();
headDnImg.src="img/head_b.png";
var headLtImg = new Image();
headLtImg.src="img/head_l.png";
var headRtImg = new Image();
headRtImg.src="img/head_r.png";
var bodyImg = new Image();
bodyImg.src="img/body.png";
var foodImg = new Image();
foodImg.src="img/apple.png";

function init()
{
    mesh=[];
    mesh.x=20;
    mesh.y=15;

    for(var i=0;i<mesh.x;i++)
    {   mesh[i]=[];
        for(var j=0;j<mesh.y;j++)
            mesh[i][j]=fieldItems.empty; //empty square;
    }
    snake=[];
    snake.heading = headings.left;
    snake.newHeading = headings.left;
    snake.speed=1;
    snake.speedFactor=0.95;
    snake[0]={x:8,y:5}; //head
    mesh[8][5]= fieldItems.head;
    snake[1]={x:9,y:5}; //tail
    mesh[9][5]= fieldItems.body;

    setEvents();
    draw(document.getElementById("field"));
}

function placeFood()
{
    var i,j;
    do
    {
        i=Math.floor(Math.random()*mesh.x);
        j=Math.floor(Math.random()*mesh.y);
    }
    while (mesh[i][j] != fieldItems.empty);
    mesh[i][j] = fieldItems.food
}


function setEvents()
{
    document.onkeydown=function(event)
    {
        switch (event.key)
        {
            case "ArrowLeft":
                if (snake.heading != headings.right)
                    snake.newHeading = headings.left;
                break;
            case "ArrowUp":
                if (snake.heading != headings.down)
                    snake.newHeading = headings.up;
                break;
            case "ArrowRight":
                if (snake.heading != headings.left)
                    snake.newHeading = headings.right;
                break;
            case "ArrowDown":
                if (snake.heading != headings.up)
                    snake.newHeading = headings.down;
                break;
        }
    }
}

function move()
{
    snake.heading = snake.newHeading;
    var nextX = snake[0].x+snake.heading.x;
    var nextY = snake[0].y+snake.heading.y;

    if (nextX<0) nextX=mesh.x-1;
    if (nextY<0) nextY=mesh.y-1;
    if (nextX==mesh.x) nextX=0;
    if (nextY==mesh.y) nextY=0;

    if (mesh[nextX][nextY] == fieldItems.food)
    {
        score++;
        //food! grow!
        snake[snake.length]={x:-1,y:-1};//new body segment
        //speed up!
        snake.speed*=snake.speedFactor;
        clearInterval(interval);
        interval=setInterval(move,snake.speed*500);
        //new food!
        placeFood();
    }

    if (mesh[nextX][nextY] == fieldItems.body)
    {
        //boo...
        alert("GAME OVER!");
        clearInterval(interval);
        return;
    }

    if (mesh[nextX][nextY] == fieldItems.empty)
    {
       //move tail
        mesh[snake[snake.length-1].x][snake[snake.length-1].y]=fieldItems.empty;
    }
    //move snake
    for(var l=snake.length-1;l>0;l--)
    {
        snake[l].x = snake[l-1].x;
        snake[l].y = snake[l-1].y;
    }
    //move body where head once was
    mesh[snake[0].x][snake[0].y]=fieldItems.body;

    snake[0].x=nextX;
    snake[0].y=nextY;

    //draw head
    mesh[snake[0].x][snake[0].y]=fieldItems.head;
    draw(document.getElementById("field"));
}

function draw(field)
{
    var context = field.getContext("2d");
    for(var i=0;i<mesh.x;i++)
        for(var j=0;j<mesh.y;j++)
        {
            var headImg;
            switch(snake.heading)
            {
                case headings.up:
                    headImg = headUpImg;
                    break;
                case headings.down:
                    headImg = headDnImg;
                    break;
                case headings.left:
                    headImg = headLtImg;
                    break;
                case headings.right:
                    headImg = headRtImg;
                    break;
            }
            switch(mesh[i][j])
            {
                case fieldItems.empty: //empty
                    context.fillStyle = "#FFFFFF";
                    context.fillRect(i*meshSize,field.height - (j+1)*meshSize,meshSize,meshSize);
                    break;
                case fieldItems.body: //snake
                    context.fillStyle = "green";
                    //context.fillRect(i*meshSize+1,field.height - (j+1)*meshSize+1,meshSize-2,meshSize-2);
                    context.drawImage(bodyImg,i*meshSize+1,field.height - (j+1)*meshSize+1);
                    break;
                case fieldItems.head: //food
                    context.fillStyle = "darkgreen";
                    //context.fillRect(i*meshSize+1,field.height - (j+1)*meshSize+1,meshSize-2,meshSize-2);
                    context.drawImage(headImg,i*meshSize+1,field.height - (j+1)*meshSize+1);
                    break;
                case fieldItems.food: //food
                    context.fillStyle = "red";
                    context.drawImage(foodImg,i*meshSize+1,field.height - (j+1)*meshSize+1);
                    //context.fillRect(i*meshSize+1,field.height - (j+1)*meshSize+1,meshSize-2,meshSize-2);
                    break;
            }
            //context.fillRect(i*meshSize+1,field.height - (j+1)*meshSize+1,meshSize-2,meshSize-2);
        }
    document.getElementById("score").innerText = score.toString();
}

function start()
{
    init();
    placeFood();
    interval=setInterval(move,snake.speed*500);
}