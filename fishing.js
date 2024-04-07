const canvas = document.getElementById('canvas');
const stocks = document.getElementById('stocks');

const ctx2 = stocks.getContext('2d');
const ctx = canvas.getContext('2d');
//import Chart from 'chart.js/auto';


//VARS
var fishes = [];

//For HTML stuff
fishCaught = 0;
profit = 0.5 * fishCaught;
startPrice = Math.random()*60;

class Tool {

    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isDown = false;
        this.toolType = "";
    }

    move(){
        if (this.isDown) {
            this.y += this.speed;
        }
        if (this.y >= canvas.height)
        {
            this.isDown = false;
            this.y = 0;
        }
    }

    getHitboxX() {
        return this.hitboxX;
    }

    getHitboxY() {
        return this.hitboxY;
    }

}

class Hook extends Tool{
    

    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 5, this.y + 20, 10, 20);
    }
    

    type() {
        return "Hook";
    }

}

class Spear extends Tool{


    draw(){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 5, this.y + 20, 10, 20);
    }

    type() {
        return "Spear";
    }

}

class FishEggs {}

class FishStocks {

    //Create node with base price
    nodes = [];

    constructor(numNodes, basePrice) {
        //nodes = [];
        this.old_price = basePrice;
        this.numNodes = numNodes;

        this.generateNodes(basePrice);
    }
    
    generatePrice(oldPrice){
        //let volatility = 10;
        let range = 100;
        let rnd = Math.random(); // generate number, 0 <= x < 1.0
        console.log(rnd);
        
        /*let changePercent = 2;
        if(changePercent < volatility){
            changePercent -= (2 * volatility);
            }
        let changeAmount = oldPrice * changePercent;
        let newPrice = oldPrice + changeAmount;*/

        let newPrice = rnd * range;

    
        return newPrice;
    }

    generateNodes(basePrice) {
        console.log(this.nodes.length);
        if (this.nodes.length == this.numNodes)
            return "fart";
        else
        {
            this.nodes.push(basePrice);
            let newPrice = this.generatePrice(basePrice);
            this.generateNodes(newPrice);
        }
        
    }
    
    draw() {
        this.nodes.push(this.generatePrice(this.nodes[this.nodes.length]));
        this.nodes.shift();
        for (let i = 0; i < this.numNodes - 1; i++)
        {
            ctx2.fillStyle = 'blue';
            ctx2.beginPath();
            ctx2.moveTo(50 * i, this.nodes[i]);
            ctx2.lineTo(50 * (i+1), this.nodes[i+1]);
            ctx2.stroke();
        }
        
    }
}

//Define School
class School {
    constructor(numFishes, color){
    // Update fish position randomly
    for (let i = 0; i < numFishes; i++) {
        let fishX = Math.random() * canvas.width;
        let fishY = (Math.random() * (canvas.height-50) + 50);

        let fishSpeed = Math.random() * 2 + 1; // Random speed between 1 and 3
        fishes.push(new Fish(fishX, fishY, fishSpeed, color));
        }
    }
}

// Define fish
class Fish {
    constructor(x, y, speed, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.caught = false;
        this.color = color;
    }

    draw() {
        if (!this.caught) {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x-30, this.y+12);
            ctx.lineTo(this.x-30, this.y-12);
            ctx.ellipse(this.x, this.y, 25, 15, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    updateFish() {
        //Move Fish
        this.x += this.speed;
        if (this.x > canvas.width + 10) {
            this.x = -10;
            this.y = (Math.random() * (canvas.height - 50)) + 50;
        }


        //Check for fishingRod Collision 
    }
    checkFish(){

        //hitboxX = fishingRod.getSizeX();
        //hitboxY = fishingRod.getSizeY();

        if (fishingRod.isDown) {
            //fishingRod.y += fishingRod.speed;
            if (fishingRod.y >= this.y) {
                if (Math.abs(fishingRod.x - this.x) < 40 && Math.abs(fishingRod.y - this.y) < 40) {
                    //Reset Rod
                    if (fishingRod.type() == "Hook"){
                        fishingRod.y = 0;
                        fishingRod.isDown = false;
                    }
                    //Update fishCaught
                    fishCaught += 1;


                    //Reset fish
                    this.x = -50;
                    this.y = (Math.random() * (canvas.height - 50)) + 50;
                }

            }
        }
    }
}

// Event listener for mouse click
canvas.addEventListener('click', () => {
    if (!fishingRod.isDown) {
        fishingRod.isDown = true;
        fishingRod.y = 0;
    }
});


function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0,0, stocks.width, stocks.height);

    // Draw Water
    ctx.fillStyle = 'rgb(159,212,253)';
    ctx.fillRect(0, 50, canvas.width, canvas.height);

    fishes.forEach(fish => {
        fish.draw();
        fish.updateFish();
        fish.checkFish();
        
    });

   fishStocks.draw();
        
    // Draw fishingRod
        fishingRod.draw();
        fishingRod.move();

   


    requestAnimationFrame(draw);


    //update HTML
    document.getElementById("fishCaught").textContent = fishCaught;
    document.getElementById("profit").textContent = profit;
}


//GAME LOGIC

let fishingRod = new Spear(canvas.width/2,0,5);
fishStocks = new FishStocks(10,60);
blue = new School(5,'red');

//setInterval(fishStocks.draw, 100);

draw();

