var dog,sadDog,happyDog, database;
var foodS,foodStock;
var feedDog;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed,lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedTheDog=createButton("Feed The Dog");
  feedTheDog.position(800,150);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  lastFed=database.ref('FeedTime');
  lastFed.on("value",function(data)
  {
    lastFed=data.val();
  })
 
  //write code to display text lastFed time here
  fill("black");
  textSize(20);
  if(lastFed>=12)
  {
    text("Last Fed:"+(lastFed-12)+"pm",600,120);
  }
  else if(lastFed===0)
  {
    text("Last Fed:12am",600,120);
  }
  else
  {
    text("Last Fed:"+lastFed+"am",600,120);
  }

  feedDog();
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  feedTheDog.mousePressed(
    function()
    {
      foodObj.deductFood();
      database.ref('/').update(
        {
          Food : foodObj.foodStock,
          FeedTime:hour()
        }
      )
    }
  )

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
