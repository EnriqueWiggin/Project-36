//Create variables here
var dog,happyDog,dog2;
var database
var foodS
var foodStock
var lastFed;
var gameState;
var bedroomImg;
var gardenImg;
var washroomImg;
var sadDog
function preload()
{
  happyDog = loadImage("happyDog.png");
  sadDog = loadImage("Dog.png");
  bedroomImg = loadImage("Bed Room.png");
  washroomImg = loadImage("Wash Room.png");
  gardenImg = loadImage("Garden.png");
}

function setup() {
  database=firebase.database();
  createCanvas(500, 500);

  foodObj = new Food();
readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
});
  dog = createSprite(250,250);
  dog.addImage(sadDog);
  dog.scale=0.15;
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
}


function draw() { 
  background(46,139,87);
  
   currentTime=second(); 
   if(currentTime===(lastFed+1)){
     update("Playing")
     foodObj.garden();
     }else if(currentTime==(lastFed+2)){
      update("Sleeping");
        foodObj.bedroom();
     }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
        foodObj.washroom();
     }else{
      update("Hungry")
      foodObj.display();
     }

     if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
     feed.show();
     addFood.show();
     dog.addImage(sadDog);
    }
   drawSprites();
  

}

function readStock(data) {
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
dog.addImage(happyDog);
foodObj.updateFoodStock(foodObj.getFoodStock()-1)
database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour(),
  gameState:"Hungry"
})

}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })

}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
