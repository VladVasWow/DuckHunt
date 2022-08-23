class Dog {
    dogWork;
    dogArea;
    dogSniffArea;
    imageNumber = 0;

    sniffSound;
    barkDucksSound;

    constructor() {
            
        this.dogWork = false
        this.dogArea = document.querySelector(".dog-single");
        this.dogSniffArea = document.querySelector(".dog-sniff");
        this.sniffSound = document.querySelector("#sniff");
        this.barkDucksSound = document.querySelector("#barkDucks");
        

    }

    setBackgroundImage() {
        this.imageNumber = getNextImageNumber(this.imageNumber, 4); 
        this.dogSniffArea.style.background = "url(./assets/images/dog/sniff/"+this.imageNumber+".png) center center/cover no-repeat";
    }

    // забег собаки перед стартом уровня
    goSearch(){
        this.dogSniffArea.style.display =  "block";
        this.dogSniffArea.style.left = 0;
        this.dogSniffArea.style.top = "-25px";
        let step = "seatch"; 
        playSound(this.sniffSound, true);
        let dogIntervalId = setInterval(() => {
            if (gameManager.isPaused) {
                return;
            }
            switch (step) {
                case "seatch":
                    this.dogSniffArea.style.left = this.dogSniffArea.offsetLeft + 20 + "px";
                    this.setBackgroundImage();
                    if (this.dogSniffArea.offsetLeft > (gameManager.gameArea.clientWidth / 2 - 100)) {
                        step = "jump-up";     
                    }
                    
                    break;

                case "jump-up":    
                    stopSound(this.sniffSound);
                    playSound(this.barkDucksSound);
                    this.dogSniffArea.style.background = "url(./assets/images/dog/jump/0.png) center center/cover no-repeat";
                    this.dogSniffArea.style.top = this.dogSniffArea.offsetTop - 50 + "px";
                    if (this.dogSniffArea.offsetTop < -170) {
                        step = "jump-down";
                    }

                    break;

                case "jump-down":    
                    this.dogSniffArea.style.background = "url(./assets/images/dog/jump/1.png) center center/cover no-repeat";
                    this.dogSniffArea.style.top = this.dogSniffArea.offsetTop + 50 + "px";
                    if (this.dogSniffArea.offsetTop < -120) {
                        step = "end";
                    }

                    break;
    
            
                default:
                    this.dogSniffArea.style.display =  "none";
                    clearInterval(dogIntervalId);
                    gameManager.startLevel();
                    break;
            }
        }, 100);



    }

    takeDucksBody(offsetLeft) {
        this.dogArea.className = '';
        if (this.dogWork) {
            this.dogArea.classList.add('dog-double'); 
            return;
        }
        this.dogWork = true;

        this.dogArea.classList.add('dog-single'); 
        this.dogArea.style.left = offsetLeft + "px";
        this.dogArea.style.top = gameManager.gameArea.clientHeight + "px";
        this.dogArea.style.display =  "block";
        let moveTop = true;
        let dogIntervalId = setInterval(() => {
            if (gameManager.isPaused) {
                return;
            }
 
            if (moveTop) {
                this.dogArea.style.top = this.dogArea.offsetTop - 10 + "px"  
                if  (this.dogArea.offsetTop < gameManager.gameArea.clientHeight - 200) {
                    moveTop = false;
                }
            }

            if (!moveTop)  {
                this.dogArea.style.top = this.dogArea.offsetTop + 10 + "px"  
                if  (this.dogArea.offsetTop > gameManager.gameArea.clientHeight) {
                    this.dogArea.style.display =  "none";
                    this.dogWork = false;
                    clearInterval(dogIntervalId);
                }
            }
            
        }, 15);

    }
}