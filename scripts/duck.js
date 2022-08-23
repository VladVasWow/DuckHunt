class Duck {
    gameArea; 
    duckArea;
    color;
    direction = "";
    status; // live, shot, falling, dead, save, saved 
    speed;
    imageNumber; // 0,1,2
    timerID;
    scoreCount = 100;

    constructor(id, gameArea, speed = 5, interval = 50) {
        this.id = id;
        this.gameArea = gameArea;
        this.status = "live";
        this.speed = speed + gameManager.level * 3;
        this.imageNumber = getRandomIntInclusive(0,2);
        this.setRandomColor();
        this.setRandomDirection(true);
        this.createArea();
        gameArea.appendChild(this.duckArea);
        this.timerID = setInterval(() => this.goFly(), interval);

    }
    createArea() {
        this.duckArea = document.createElement("div");
        this.duckArea.dataset.id = this.id;
        this.duckArea.classList.add("duck");
        console.dir(getComputedStyle(this.gameArea).width);
        this.duckArea.style.left = getRandomIntInclusive(0, parseInt(getComputedStyle(this.gameArea).width) - 150) + "px";
        this.duckArea.style.top = (parseInt(getComputedStyle(this.gameArea).height)) + "px";
        this.setBackgroundImage();
    }

    setBackgroundImage() {
        this.imageNumber = getNextImageNumber(this.imageNumber); 
        this.duckArea.style.background = "url(./assets/images/duck/"+this.color+"/"+this.direction.replace("down", "top")+"/"+this.imageNumber+".png) center center no-repeat";
        this.duckArea.style.backgroundSize = "cover";
    }

    setRandomColor() {
        switch (getRandomIntInclusive(0,1)) {
            case 0:
                this.color = "black";
                break;
        
            default: 
                this.color = "red";
                break;
        }
    }
    setRandomDirection(isStart = false, alertDirection = "down") { // стартовых 2 варианта
        let maxDirection = undefined;
        if (isStart) {
            maxDirection = 1
        }
        else {
            maxDirection = 5 
        }
        let oldDirection = this.direction; // меняем пока старое направление или невозможное направление
        while (oldDirection === this.direction || this.direction.indexOf(alertDirection) != -1) {
            switch (getRandomIntInclusive(0,maxDirection)) {
                case 0:
                    this.direction = "top-left";
                    break;
                case 1:
                    this.direction = "top-right";
                    break;
                case 2:
                    this.direction = "left";
                    break;
                case 3:
                    this.direction = "right";
                    break;
                case 4:
                    this.direction = "down-left";
                    break;
                case 5:
                    this.direction = "down-right";
                    break;
                default: 
                    this.direction = "top-right";
                    break;
            }
        }
    }

    goSave() {
        this.status = "save";
        this.setRandomDirection(true); // меняем направление на top-left или top-right

    }

    goSaved() {
        this.status = "saved";
        clearInterval(this.timerID);
        this.duckArea.style.display = "none";

    }

    goFly() {
        if (gameManager.isPaused) {
            return;
        }

        this.setBackgroundImage();

        if (this.duckArea.offsetTop < -150 && this.status == "save") {
            this.goSaved();
        }

        if (this.duckArea.offsetTop < 10 && this.status != "save")  {
            this.setRandomDirection(false, "top");
        }
        if (this.duckArea.offsetTop > parseInt(getComputedStyle(this.gameArea).height)+10) {
            this.setRandomDirection(false, "down");
        }
        if (this.duckArea.offsetLeft < 0) {
            this.setRandomDirection(false, "left");
        }
        if (this.duckArea.offsetLeft > parseInt(getComputedStyle(this.gameArea).width)-150) {
            this.setRandomDirection(false, "right");
        }

        switch (this.direction) {
            case "left":
                this.duckArea.style.left = this.duckArea.offsetLeft - this.speed + "px";
                break;
            case "right":
                this.duckArea.style.left = this.duckArea.offsetLeft + this.speed + "px";
                break;
            case "top-left":
                this.duckArea.style.top = this.duckArea.offsetTop - this.speed + "px";
                if (this.status != "save") { // спасенные летят только вверх
                    this.duckArea.style.left = this.duckArea.offsetLeft - this.speed + "px";
                }    
                break;
            case "top-right":
                this.duckArea.style.top = this.duckArea.offsetTop - this.speed + "px";
                if (this.status != "save") { // спасенные летят только вверх
                    this.duckArea.style.left = this.duckArea.offsetLeft + this.speed + "px";
                }    
                break;
            case "down-left":
                this.duckArea.style.top = this.duckArea.offsetTop + this.speed + "px";
                this.duckArea.style.left = this.duckArea.offsetLeft - this.speed + "px";

                break;
            case "down-right":
                this.duckArea.style.top = this.duckArea.offsetTop + this.speed + "px";
                this.duckArea.style.left = this.duckArea.offsetLeft + this.speed + "px";
                break;    
        
            default:
                break;
        }
       
    }
    goShot() {
        clearInterval(this.timerID);
        this.status = "shot";
        this.duckArea.style.background = "url(./assets/images/duck/"+this.color+"/shot/0.png) center center no-repeat";
        this.duckArea.style.backgroundSize = "cover";
        this.timerID = setInterval(() => {
            if (gameManager.isPaused) {
                return;
            }
            this.goFalling();
        }, 400);
    }

    goFalling() {
        clearInterval(this.timerID)
        this.status = "falling";
        this.timerID = setInterval(() => {
                if (gameManager.isPaused) {
                    return;
                }
    
                this.imageNumber = getNextImageNumber(this.imageNumber);
                this.duckArea.style.background = "url(./assets/images/duck/"+this.color+"/dead/"+ this.imageNumber +".png) center center no-repeat";
                this.duckArea.style.backgroundSize = "cover";

                this.duckArea.style.top = this.duckArea.offsetTop + this.speed*2 + "px";

                if (this.duckArea.offsetTop > parseInt(getComputedStyle(this.gameArea).height)+10) {
                    clearInterval(this.timerID);
                    this.status = "dead";
                    gameManager.takeDucksBody(this.duckArea.offsetLeft);
                    this.duckArea.style.display = "none";
                }
        }, 30);


    }

}