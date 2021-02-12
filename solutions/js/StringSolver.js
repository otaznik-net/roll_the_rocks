var fs = require("fs");
var path = require("path");

class StringSolver {
  #stringData;
  #arraySize;
  #arrayData;
  #strIndex = { index: 0 };
  #directions = {
    up: "up",
    down: "down",
    left: "left",
    right: "right",
  };
  constructor(pathToFile) {
    this.#stringData = this.#loadFile(pathToFile);
    this.#arraySize = this.#calcArraySize(this.#stringData.length);
    this.#arrayData = this.#initArray(this.#arraySize);
    console.log(this.#arrayData);
  }


  /**
   * Calculates array size
   * @param {number} stringSize
   */
  #calcArraySize = (stringSize) => {
    return Math.ceil(Math.sqrt(stringSize));
  };

  #fill = (arr, row, column, data) => {
    arr[row][column] = data;
  };

  printString = () => {
    if (this.#stringData.length < 1) {
      throw new Error("String is empty");
    }
    let currRow = this.#wholeDivisionRow(this.#arraySize);
    let currColumn = this.#wholeDivisionColumn(this.#arraySize);

    console.log(`Initial coord: ${currRow} ${currColumn}`);

    this.#fill(
      this.#arrayData,
      currRow--,
      currColumn,
      this.#stringData[this.#strIndex.index]
    );
    updateIndex(1, this.#strIndex);
    this.#fill(
      this.#arrayData,
      currRow,
      currColumn++,
      this.#stringData[this.#strIndex.index]
    );
    updateIndex(1, this.#strIndex);
    this.#fill(
      this.#arrayData,
      currRow,
      currColumn,
      this.#stringData[this.#strIndex.index]
    );
    updateIndex(1, this.#strIndex);
    let direction = this.#getNextDirection("right", this.#directions);
    let base = 2;
    let turn = 0;
    const startObj = { startIndex: 0 };
    let x = currRow;
    let y = currColumn;
    while (this.#strIndex.index < this.#stringData.length) {
      // Get start index based on direction
      const startIndex = getStartIndex(direction, x, y, this.#directions);

      let endIndex = getStartIndex(direction, x, y, this.#directions);
      startObj.startIndex = startIndex;
      endIndex = calcEndIndex(direction, endIndex - 1, base, this.#directions);
      // console.log(`
      //   StartIndex ${startIndex}
      //   EndIndex ${endIndex}
      //   Direction ${direction}
      // `);

      for (
        let i = startObj;
        check(i.startIndex, endIndex, direction, this.#directions);
        getStep(direction, this.#directions, i)
      ) {
        const letter = this.#stringData[this.#strIndex.index];

        // console.log(`
        //    x=${x} y=${y}
        //    i=${i.startIndex}
        //    letter=${letter}`
        // );
        // Figure out how to switch data
        switch (direction) {
          case this.#directions.up:
            this.#fill(this.#arrayData, i.startIndex, y, letter);
            x = i.startIndex;
            break;
          case this.#directions.down:
            this.#fill(this.#arrayData, i.startIndex, y, letter);
            x = i.startIndex;
            break;
          case this.#directions.left:
            this.#fill(this.#arrayData, x, i.startIndex, letter);
            y = i.startIndex;
            break;
          case this.#directions.right:
            this.#fill(this.#arrayData, x, i.startIndex, letter);
            y = i.startIndex;
            break;
          default:
            break;
        }
        const newIndex = updateIndex(1, this.#strIndex);
      }

      direction = this.#getNextDirection(direction, this.#directions);
      if (++turn == 2) {
        turn = 0;
        base++;
      }
    }
    this.#logMatrix(this.#arrayData);

    // nested function helpers
    function check(startIndex, endIndex, direction, directions) {
      switch (direction) {
        case directions.up:
          return startIndex >= endIndex;
        case directions.down:
          return startIndex <= endIndex;
        case directions.left:
          return startIndex >= endIndex;
        case directions.right:
          return startIndex <= endIndex;
        default:
          throw new Error("Wrong direction input", direction);
      }
    }

    function getStartIndex(direction, x, y, directions) {
      switch (direction) {
        case directions.up:
          return x - 1;
        case directions.down:
          return x + 1;
        case directions.left:
          return y - 1;
        case directions.right:
          return y + 1;
        default:
          throw new Error("Wrong direction input", direction);
      }
    }

    function calcEndIndex(direction, index, base, directions) {
      switch (direction) {
        case directions.up:
        case directions.left:
          return index - base + 1 < 0 ? 0 : index + 1 - base + 1;
        case directions.down:
        case directions.right:
          return index + base;
        default:
          throw new Error("Wrong direction input", direction);
      }
    }

    function getStep(direction, directions, index) {
      console.log();
      switch (direction) {
        case directions.up:
        case directions.left:
          index.startIndex--;
          break;
        case directions.right:
        case directions.down:
          index.startIndex++;
          break;
        default:
          console.log(direction);
          throw new Error("Wrong direction input", direction);
      }
    }

    function updateIndex(step, strIndex) {
      strIndex.index += step;
      return strIndex.index;
    }
  };

  #getNextDirection = (lastDirection, directions) => {
    switch (lastDirection) {
      case directions.up:
        return directions.right;
      case directions.down:
        return directions.left;
      case directions.left:
        return directions.up;
      case directions.right:
        return directions.down;
      default:
        throw new Error("Wrong direction input", lastDirection);
    }
  };

  #loadFile = (filename) => {
    let fullPath = path.join(path.dirname(require.main.filename), filename);
    // console.log("Path", fullPath);
    try {
      const strData = fs.readFileSync(fullPath, "utf8");

      return strData;
    } catch (err) {
      console.error(err);
    }
  };

  /*
   * Helper methods
   */
  #wholeDivision = (x, y) => {
    return (x / y) >> 0;
  };
  #wholeDivisionColumn = (arraySize) => {
    return Math.ceil((arraySize-1)/2);
  };
  #wholeDivisionRow = (arraySize) => {
    return Math.floor((arraySize-1)/2);
  };


  #initArray = (size) => {
    const newArray = new Array(size);
    for (let ix = 0; ix < newArray.length; ix++) {
      const semiArray = new Array(size);
      newArray[ix] = semiArray;
    }
    return newArray;
  };

  #logMatrix = (array) => {
    array.forEach((row) => {
      let rowString = row.join("");
      console.log(rowString);
    });
  };

  #logString = () => {
    console.log(JSON.stringify(this.#arrayData, null, "  "));
  };
}


export { StringSolver }


/* 
* Usage
* const solver = new StringSolver("string.txt");
* solver.printString();
*/