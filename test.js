/*constructor - метод для создания и инициализации объектов, созданных с использованием class. Классы — это "специальные функции". Это один из способов определения класса:*/

class AudioController {
    constructor() {
        this.bgMusic = new Audio('https://cdn.glitch.me/352dcfef-c818-4965-9d3c-44fa559f55d5%2FBrenda%20Lee%20RockinAround.wav?v=1639379821031');
        /*фоновая музыка; this ссылается на объект, «владеющий» кодом, выполняемым в текущий момент.*/
        this.flipSound = new Audio('https://cdn.glitch.me/352dcfef-c818-4965-9d3c-44fa559f55d5%2Fpage-flip.wav?v=1639379828610');
        this.matchSound = new Audio('https://cdn.glitch.me/352dcfef-c818-4965-9d3c-44fa559f55d5%2Fmatch.wav?v=1639379828965');
        this.victorySound = new Audio('https://cdn.glitch.me/352dcfef-c818-4965-9d3c-44fa559f55d5%2Fgame-win.wav?v=1639379824238');
        this.gameOverSound = new Audio('https://cdn.glitch.me/352dcfef-c818-4965-9d3c-44fa559f55d5%2FgameOver.wav?v=1639379812570');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
      /*this.bgMusic.muted = true; временно*/
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}

/*new myCardGame(60, cardsArray)*/

class myCardGame {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
   /* здесь прописываем свойства, которые мы хотим установить, когда игра запущена опять*/
    startGame() {
        this.cardToCheck = null; 
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.machedCards = [];/*все карты в массиве*/
        this.busy = true;
        /*между рестартом игры, победой - должна быть пауза, чтобы игра перезагрузилась*/ 
        
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            }else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
        this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);
        
        this.cardToCheck = null;
    }
     cardMatch(card1, card2) {
         this.machedCards.push(card1);
         this.machedCards.push(card2);
         card1.classList.add('matched');
         card2.classList.add('matched');
         this.audioController.match();
         if(this.machedCards.length === this.cardsArray.length)
            this.victory();
     }
     cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
     }


    /*ВАЖНО!!! независимо, совпала карта или нет, возвращаем значение к 0*/ 
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    /*пользователь видит, как время уменьшается*/

    startCountDown(){
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }

    gameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
        this.hideCards();
    }
    

   

    /*for Обычно используется, чтобы инициализировать счётчик. Если выражение ложно, выполнение переходит к первому выражению, следующему за for.*/
    /*style.order потому что мы использовали css grid и нам нужно перемешать порядок grid*/ 
    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

  /*прописываем нежелательные действия пользоватяля после начала игры*/
    canFlipCard(card) {
        return !this.busy && !this.machedCards.includes(card) && card !== this.cardToCheck; /*логические значения*/
    }
}
/*победа или игра завершена*/
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text')); ///преобразование HTMLCollection в массив
    let cards = Array.from(document.getElementsByClassName('card')); ///преобразование HTMLCollection в массив
    let game = new myCardGame(100, cards);
        overlays.forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.classList.remove('visible'); /*скрываем класс */
                 game.startGame(); 

            });
        });
        cards.forEach(card => {
            card.addEventListener('click', () => {
                game.flipCard(card); /*доступ к карточкам*/
            });
        });
}



//Ожидание загрузки страницы 
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}