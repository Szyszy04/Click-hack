new Vue({
  el: '#app',
  data() {
    return {
      timeLeft: null,
      animationDuration: null,
      elements: [],
      answersParts: [],
      correctAnswers: null,
      wrongAnswers: null,
      incorrectAnswers: null,
      isVisible: false,
      interval: null,
      uniqueCorrectAnswers: new Set(),
    };
  },
  methods: {
    toggleActive(index) {
      const clickedElement = this.elements[index];
      const elements = document.querySelectorAll('.element');
    
      if (this.answersParts.includes(clickedElement)) {
      elements.forEach((element, i) => {
        if (element.textContent.trim() === clickedElement) {
          element.classList.add('active');
        }
      });
        const answerPartIndex = this.answersParts.findIndex(part => part === clickedElement);
        if (answerPartIndex !== -1) {
          const answerParts = document.querySelectorAll('.answersPart');
          answerParts[answerPartIndex].classList.add('active');
    
          this.uniqueCorrectAnswers.add(clickedElement);
        }
        if (this.uniqueCorrectAnswers.size === this.correctAnswers) {
          setTimeout(() => {
            document.querySelector('.textWin').classList.remove('disable');
            this.endGame();
          }, 100);
        }
      } else {
        this.wrongAnswers++
        if(this.wrongAnswers >= this.incorrectAnswers){
          document.querySelector('.textLoss').classList.remove('disable');
          this.endGame()
        }
      }
    },
    generateRandomChar() {
      const pool = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const index = Math.floor(Math.random() * pool.length);
      return pool.splice(index, 1)[0];
    },
    generateRandomChars(count) {
      let result = '';
      for (let i = 0; i < count; i++) {
        result += this.generateRandomChar();
      }
      return result;
    },
    startTimer() {
      this.animationDuration = this.timeLeft;
    
      for (let i = 0; i < 36; i++) {
        const randomChar = this.generateRandomChars(2);
        this.elements.push(randomChar);
      }

      for (let i = 0; i < this.correctAnswers; i++) {
        let randomIndex;
        let randomElement;
        do {
          randomIndex = Math.floor(Math.random() * this.elements.length);
          randomElement = this.elements[randomIndex];
        } while (this.answersParts.includes(randomElement));
        
        this.answersParts.push(randomElement);
      }
      
      document.querySelector('#app').classList.remove('disable');
      document.querySelector('.textWin').classList.add('disable');
      document.querySelector('.textLoss').classList.add('disable');
      document.querySelector('.textBefore').classList.remove('disable');
      
      setTimeout(() => {
        document.querySelector('.textBefore').classList.add('disable');
        document.querySelector('.text').classList.add('disable');
        document.querySelector('.progres').classList.add('disable');
        document.querySelector('.bottomProgres').classList.add('game');

        const elementsToEnable = document.querySelectorAll('.main, .progressBar');
        elementsToEnable.forEach(element => {
          element.classList.remove('disable');
        });

        this.shuffleInterval = setInterval(() => {
          this.shuffleElements();
        }, this.interval);
      
        this.timerInterval = setInterval(() => {
          this.timeLeft--;

          if (this.timeLeft === 0) {
            clearInterval(this.timerInterval);
            clearInterval(this.shuffleInterval);

            document.querySelector('.textLoss').classList.remove('disable');
            this.endGame()
          }
        }, 1000);
      }, 2000);
    },
    endGame() {
      document.querySelector('.text').classList.remove('disable');
      document.querySelector('.progres').classList.remove('disable');
      document.querySelector('.bottomProgres').classList.remove('game');

      const elementsToEnable = document.querySelectorAll('.main, .progressBar');
      elementsToEnable.forEach(element => {
        element.classList.add('disable');
      });

      setTimeout(() => {
          document.querySelector('#app').classList.add('disable');

          this.elements = []
          this.answersParts = []
          this.uniqueCorrectAnswers = new Set()
          this.wrongAnswers = null
      }, 2000);
    },
    shuffleElements() {
      const elements = document.querySelectorAll('.element');
      const center = document.querySelector('.center');
      const shuffledElements = Array.from(elements).sort(() => Math.random() - 0.5);
    
      while (center.firstChild) {
        center.removeChild(center.firstChild);
      }
    
      shuffledElements.forEach(element => {
        center.appendChild(element);
      });
    },
  },
  mounted() {
    this.isVisible = true;

    this.timeLeft = 60;
    this.correctAnswers = 6;
    this.interval = 3 * 1000;
    this.incorrectAnswers = 1 + 1;

    if (this.isVisible) {
      setTimeout(() => {
          this.startTimer()
      }, 10);
  }
  },
});
