const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {

  constructor(field) {
    this._field = field;
    this._xplayer = 0;
    this._yplayer = 0;
    this.gameOver = false;
    this.outBounds = false;
    this.hatFound = false;

    const generate = prompt('Do you want to generate a field? y/n: ');

    if (generate === 'y') {
      const wide = prompt('Wide, please:');
      const high = prompt('Heigth, please:');
      const perc = prompt('Percentage, please:');

      this._field = this.generateField(wide, high, perc);

      console.log('Controls:\ne: up\nx: down\ns: left\nd: right');

      this.playing(this._field);
    } else {
      this._field = [['*', '░', 'O'], ['░', 'O', '░'], ['░', '^', '░']];
      console.log('Controls:\ne: up\nx: down\ns: left\nd: right');
      this.playing(this._field);
    }
  }

  print() {
    for (let i=0; i < this._field.length; i++) {
      console.log(this._field[i].join(''));
    }
  }

  generateField(height, width, percentage) {
    let newField = [];
    let fieldElements = [];
    const numberOfHoles = (height * width) * (percentage/100);
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (i === 0 && j === 0) {
          fieldElements.push(pathCharacter); 
        } else {
          fieldElements.push(fieldCharacter);
        }
      }
      newField.push(fieldElements);
      fieldElements = [];
    }

    let holes = [];
    while (holes.length < numberOfHoles) {
      let randomWidth = Math.floor(Math.random()*width)
      let randomHeigth = Math.floor(Math.random()*height);
      if (randomWidth !== 0 || randomHeigth !==  0) {
        if (newField[randomWidth][randomHeigth] !== hole) {
          newField[randomWidth][randomHeigth] = hole;
          holes.push([randomWidth,randomHeigth]);
        }
      }
    }
    let oneHat = false;
    
    while(oneHat === false) {
      let x = Math.floor(Math.random()*width);
      let y = Math.floor(Math.random()*height);
      if (x !== 0  && y !== 0){
        if (newField[x][y] !== hole) {
          newField[x][y] = hat;
          oneHat = true;
        }
      }
    }
    return newField;
  }

  askingUser() {
    const whereTo = prompt('Which way?');

    if (whereTo === 'd') {
      this._xplayer +=1 ;
    } else if (whereTo === 's') {
      this._xplayer -=1 ;
    } else if (whereTo === 'e') {
      this._yplayer -=1 ;
    } else if (whereTo === 'x') {
      this._yplayer +=1 ;
    } else {
      console.log('Invalid command, try again!!');
      this.askingUser();
    }
    if (
      this._yplayer < 0 ||
      this._yplayer > this._field.length-1 ||
      this._xplayer > this._field[0].length-1
    ) {
      this.outBounds = true; 
    } else {
      if (this._field[this._yplayer][this._xplayer] === 'O') {
        this.gameOver = true; 
      } else if (this._field[this._yplayer][this._xplayer] === '^') {
        this.hatFound = true; 
      }
      this._field[this._yplayer][this._xplayer] = '*';
    }
  }

  playing() {
    this.print(this._field);
    this.askingUser();
    while (
      this._xplayer >= 0 &&
      this._yplayer >= 0 &&
      this._yplayer < this._field.length &&
      this._xplayer < this._field[0].length &&
      this.gameOver === false &&
      this.hatFound === false
    ) {
      this.print();
      this.askingUser();
    }
    if (this.hatFound === true) {
      console.log('Congrats!! You found the hat');
    } else  if (this.outBounds === true) {
      console.log("Game over!!! You're out of bounds!!");
    } else if (this.gameOver === true) {
      console.log('You landed in a hole!!');
    } else {
       console.log("Game over!!! You're out of bounds!!");
    }
  }
}

const newField = new Field();