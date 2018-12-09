'use strict';

(function () {
  window.tools = {
    //  Функция возращает случайное целое число между min и max - включительно
    getRandomInteger: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    //  Функция возращает случайной длины массив от исходного массива
    getRandomLengthArray: function (array) {
      return array.slice(0, this.getRandomInteger(1, array.length));
    },

    //  Функция возращает случайный элемент массива
    getRendomItemOfArray: function (array) {
      return array[this.getRandomInteger(0, array.length)];
    },

    //  Функция перемешивает элементы массива
    jumbleElemetsOfArray: function (array) {
      var cloneArray = array.slice();
      var j;
      var temp;
      for (var i = 0; i < cloneArray.length; i++) {
        j = Math.floor(Math.random() * (i + 1));
        temp = cloneArray[j];
        cloneArray[j] = cloneArray[i];
        cloneArray[i] = temp;
      }
      return cloneArray;
    },
    // Функция вставляет верное написание слова из массива
    getCorrectWord: function (items, words) {
      if (items % 100 > 4 && items % 100 < 21) {
        return words[0];
      } else if (items % 10 === 1) {
        return words[1];
      } else if (items % 10 > 1 && items % 10 < 5) {
        return words[2];
      }
      return words[0];
    }
  };
})();
