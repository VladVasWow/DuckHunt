class GameManager {
    //elements
    gameArea;
    dogArea;
    diedDucksCntArea;
    leftDucksCntArea;
    messageArea;
    muteBtn;
    bulletsArea;
    scoresArea;
    fullScreenBtn;
    pauseBtn;

    ducks;
    dog;
    bulletsCount =0;
    level = 1;
    scoreCount = 0;

    isPaused; // true|false
    isMute; // true|false
    isFullScreen; // true|false

    // sounds
    gunSound;
    quackingSound;

    constructor() {
        this.isPaused = false;
        this.isMute = false;
        this.isFullScreen = false;
        this.dogWork = false

        this.gameArea = document.querySelector(".game-area");
        this.bulletsArea = document.querySelector(".bullets-container");
        this.scoresArea = document.querySelector(".scores");
        this.dogArea = document.querySelector(".dog-single");
        this.diedDucksCntArea = document.querySelector(".died-ducks-cnt-container");
        this.leftDucksCntArea = document.querySelector(".left-ducks-cnt-container");
        this.messageArea = document.querySelector(".message-bar");

        this.pauseBtn = document.querySelector("#pause_btn");
        this.muteBtn = document.querySelector("#mute_btn");
        this.fullScreenBtn = document.querySelector("#fullscreen_btn");

        this.ducks = [];
        this.dog = new Dog;
        this.gunSound = document.querySelector("#gunSound");
        this.quackingSound = document.querySelector("#quacking");
        this.setScoreCount();

        //обработчики событий
        this.pauseBtn.addEventListener("click",(e) => {this.isPaused = !this.isPaused})
        this.muteBtn.addEventListener("click",(e) => {
            document.querySelectorAll("audio").forEach(elem =>  elem.muted = !elem.muted)
            this.isMute = !this.isMute});
        this.fullScreenBtn.addEventListener("click",(e) => {
            this.isFullScreen = !this.isFullScreen;
            if (this.isFullScreen) {
                document.documentElement.requestFullscreen();
            }
            else {
                document.webkitExitFullscreen();
                };
            }
        )
        // обработчие события на click
        this.gameArea.addEventListener("click",(e) =>  this.onClickGameArea(e), true);
        this.shoeMessage(() =>  this.dog.goSearch(), "Level " + this.level , "Let's go?");
    }

    onClickGameArea(e) {
        
        if (this.isPaused || this.bulletsCount == 0) {
            return;
        }

        playSound(this.gunSound);

        if (e.target.classList.contains("duck")) { // проверка на утку
            let duckId = e.target.dataset.id;
            if (this.ducks[duckId].status == "live") { 
                this.ducks[duckId].goShot();
                this.setScoreCount(this.ducks[duckId].scoreCount);
            }    
        }


        if (!this.minusBullet()) {
            this.bulletsIsOver();
        }
    }

    shoeMessage(f, info, suggestion = ""){
        this.messageArea.querySelector(".info-msg").textContent = info;
        this.messageArea.querySelector(".info-suggestion").textContent = suggestion;
        this.messageArea.style.display = "block";
        this.messageArea.addEventListener("click", () => {f(); 
                                                    this.messageArea.style.display = "none";
                                                    },{once : true})

    }

    clearGameArea() {
        this.ducks = []; // очистка

        let elements = this.gameArea.querySelectorAll(".duck");
        elements.forEach((element) => this.gameArea.removeChild(element) );

        while (this.bulletsArea.firstChild) {
            this.bulletsArea.removeChild(this.bulletsArea.firstChild); 
        }
        while (this.diedDucksCntArea.firstChild) {
            this.diedDucksCntArea.removeChild(this.diedDucksCntArea.firstChild); 
        }
        while (this.leftDucksCntArea.firstChild) {
            this.leftDucksCntArea.removeChild(this.leftDucksCntArea.firstChild); 
        }
    }
    
    startLevel() {
        this.clearGameArea();
        playSound(this.quackingSound, true);
 
        // создаем массив уток и пули
        this.bulletsCount = (this.level) * 3;
        for (let id = 0; id < (this.level) * 3; id++) {
            this.ducks.push(new Duck(id, this.gameArea)); // ducks
 
            let bullet = document.createElement("div"); // bullet
            bullet.classList.add("bullet");
            this.bulletsArea.appendChild(bullet);
        } 
    }
    
    levelComplete() {
        this.level++;
        this.shoeMessage(() =>  this.dog.goSearch(), "Level " + this.level , "Let's go?");
    }

    gameOver() {
        this.level = 1;
        this.shoeMessage(() =>  this.dog.goSearch(), "Game is over!" , "Let's try again?");
    }

    bulletsIsOver() {
        let leftCount = 0;
        this.ducks.filter((duck) => duck.status == "live") // пули закончились, все живие спасены
                  .forEach((duck) => {
                    duck.goSave();
                    this.addLeftDuckIcon();
                    leftCount++;
                });
        if (leftCount == 0) {
            this.levelComplete();

        }   
        else {
            this.gameOver();
        }
    }

    addLeftDuckIcon() {
        let leftDuckIcon = document.createElement("div");
        leftDuckIcon.classList.add("left-duck-icon");
        this.leftDucksCntArea.appendChild(leftDuckIcon);

    }

    addDiedDuckIcon() {
        let diedDuckIcon = document.createElement("div");
        diedDuckIcon.classList.add("died-duck-icon");
        this.diedDucksCntArea.appendChild(diedDuckIcon);
    }

    setScoreCount(addCount = 0) {
        this.addDiedDuckIcon();
        this.scoreCount = this.scoreCount + addCount;
        this.scoresArea.textContent = this.scoreCount;
    }

    minusBullet() {
        this.bulletsCount = this.bulletsCount - 1;
        this.bulletsArea.removeChild(this.bulletsArea.firstChild); 
        if (this.bulletsCount == 0) {
            return false
        }
        return true;
    }

    takeDucksBody(offsetLeft) {
        this.dog.takeDucksBody(offsetLeft);
    }


}    