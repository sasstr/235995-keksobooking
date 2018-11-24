'use strict';
var NUMBER_OF_IMAGES = 8;
var NUMBER_OF_ADS = 8;
var RUBLE_CURRENCY = '\u20BD';
var MAX_ROOMS = 5;
var MIN_ROOMS = 1;
var MAX_GUESTS = 5;
var MIN_GUESTS = 1;
var MAX_X_LOCATION = 1199;
var MIN_X_LOCATION = 0;
var MAX_Y_LOCATION = 630;
var MIN_Y_LOCATION = 130;
var MIN_X_ADDRESS = 0;
var MAX_X_ADDRESS = 1200;
var MIN_Y_ADDRESS = 0;
var MAX_Y_ADDRESS = 600;
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик','Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES_OF_DWELLING = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TIMES_OF_REGISTRATION = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');

// Функция возращает случайный элемент из массива
/* var getRandomElementOfArray = function (array) {
  var randomElement = array[Math.floor(Math.random() * array.length)];
  return randomElement;
}; */

//  Функция возращает случайное целое число между min и max - включительно
var getRandomInteger = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

//  Функция возращает случайный элемент массива
var getRendomItemOfArray = function (array) {
  return array[getRandomInteger(0, array.length - 1)];
};

//  Функция вырезает случайный элемент массива
var cutRandomElementOfArray = function (array) {
  return array.splice(getRandomInteger(0, array.length - 1), 1).join();
};

//  Функция перемешивает элементы массива
var jumbleElemetsOfArray = function (array) {
  var j;
  var temp;
  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array.slice();
};

//  Функция возращает случайной длины массив от исходного массива
var getRandomLengthArray = function (array) {
  return array.slice(Math.floor(getRandomInteger(1, array.length)));
};

//  Функция создает массив с адресами картинок 8 шт.
var createArrayAddressesImages = function (numberOfImages) {
  var arrayAddressesImages = [];
  for (var i = numberOfImages; i > 0; i--) {
    arrayAddressesImages.push('img/avatars/user0' + i + '.png');
  }
  return arrayAddressesImages;
};

//  Функция создает объект с данными соседних жилищ
var createAds = function (numberOfAds) {
  var similiarAds = [];
  var arrayOfAddressesImages = createArrayAddressesImages(NUMBER_OF_IMAGES);
  var TYPES_OF_DWELLING_ARRAY = [TYPES_OF_DWELLING.palace, TYPES_OF_DWELLING.flat, TYPES_OF_DWELLING.house, TYPES_OF_DWELLING.bungalo];
  for (var i = 0; i < numberOfAds; i++) {
    var location = { // TODO Доделать случайные значения в нужном диапозоне
      'x': getRandomInteger(MIN_X_ADDRESS, MAX_X_ADDRESS),
      'y': getRandomInteger(MIN_Y_ADDRESS, MAX_Y_ADDRESS)
    };
    similiarAds.push({
      'author': {
        'avatar': cutRandomElementOfArray(arrayOfAddressesImages),

        'offer': {
          'title': cutRandomElementOfArray(OFFER_TITLES),
          'address': location.x + ', ' + location.y,
          'price': getRandomInteger(MIN_PRICE, MAX_PRICE),
          'type': getRendomItemOfArray(TYPES_OF_DWELLING_ARRAY),
          'rooms': getRandomInteger(MIN_ROOMS, MAX_ROOMS),
          'guests': getRandomInteger(MIN_GUESTS, MAX_GUESTS),
          'checkin': getRendomItemOfArray(TIMES_OF_REGISTRATION),
          'checkout': getRendomItemOfArray(TIMES_OF_REGISTRATION),
          'features': getRandomLengthArray(jumbleElemetsOfArray(OFFER_FEATURES)),
          'description': '',
          'photos': jumbleElemetsOfArray(OFFER_PHOTOS)
        },

        'location': {//  TODO Проверить верно ли заданы мин и макс для координат
          x: getRandomInteger(MIN_X_LOCATION, MAX_X_LOCATION),
          y: getRandomInteger(MIN_Y_LOCATION, MAX_Y_LOCATION)
        }
      }
    });
  }
  return similiarAds;
};
var similiarAds = createAds(NUMBER_OF_ADS);

console.log(similiarAds);

map.classList.remove('map--faded');

var adCard = document.querySelector('#card').content.querySelector('.map__card');
var pin = document.querySelector('#pin');
var adPin = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPin = document.querySelector('.map__pins');
var features = adCard.querySelector('.popup__features');

// Функция создает массив пинов похожих объявлений

// Функция создает массив с HTML элементами features готовыми для вставки в разметку
var createFeatureDomElements = function (ad) {
  var popupFeatures = document.createElement('ul');
  popupFeatures.classList.add('popup__features');

  for (var i = 0; i < ad.author.offer.features.length; i++) {
    var popupFeature = document.createElement('li');
    var classFeature = 'popup__feature--' + ad.author.offer.features[i];
    popupFeature.classList.add('popup__feature');
    popupFeatures.appendChild(popupFeature).classList.add(classFeature);
  }
  return popupFeatures;
};
console.log(createFeatureDomElements(similiarAds[0]));

var createPopupPhotos = function (ad) {
  var popupPhotoDiv = document.createElement('div');
  popupPhotoDiv.classList.add('popup__photos');

  for (var i = 0; i < ad.author.offer.photos.length; i++) {
    var popupPhoto = document.createElement('img');
    popupPhoto.classList.add('popup__photo');
    popupPhoto.width = 45;
    popupPhoto.height = 40;
    popupPhoto.alt = 'Фотография жилья';
    popupPhoto.src = ad.author.offer.photos[i];
    popupPhotoDiv.appendChild(popupPhoto);
  }
  return popupPhotoDiv;
};
console.log(createPopupPhotos(similiarAds[0]));

// Функция удаляет всех потомков элемнета дом
var removeChildrenOfParent = function (domElement) {
  while (domElement.firstChild) {
    domElement.removeChild(domElement.firstChild);
  }
};

// Функция создает объявление
var createAdCard = function (ad) {
  var adDomElement = adCard.cloneNode(true);


  adDomElement.querySelector('.popup__avatar').src = ad.author.avatar;
  adDomElement.querySelector('.popup__title').textContent = ad.author.offer.title;
  adDomElement.querySelector('.popup__text--price').textContent = (ad.author.offer.price + RUBLE_CURRENCY + '/ночь');
  adDomElement.querySelector('.popup__type').textContent = ad.author.offer.type;
  adDomElement.querySelector('.popup__text--capacity').textContent = (ad.author.offer.rooms + ' комнаты для ' + ad.author.offer.guests + ' гостей');
  adDomElement.querySelector('.popup__text--time').textContent = ('Заезд после ' + ad.author.offer.checkin + ', выезд до ' + ad.author.offer.checkout);
  //adDomElement.querySelector('popup__features').innerHTML = createFeatureDomElements(ad);
  //adDomElement.querySelector('popup__description').textContent = ad.author.offer.description;
  //adDomElement.querySelector('popup__photos').innerHTML = createPopupPhotos(ad);

  return adDomElement;
};
console.log(createAdCard(similiarAds[0]));
/*

  console.log(adCard);
  console.log(adPin);
  console.log(features);
  console.log(mapPin);
В файле index.html подключите ваш файл при помощи тега script.  +++++++++

1.  Создайте массив, состоящий из 8 сгенерированных JS объектов,  ++++ -----
которые будут описывать похожие объявления неподалёку.

2.  У блока .map уберите класс .map--faded.   ++++++++++++

3.  На основе данных, созданных в первом пункте,   --------------
создайте DOM-элементы, соответствующие меткам на карте,
и заполните их данными из массива. Итоговую разметку
метки .map__pin можно взять из шаблона .map__card.

4.Отрисуйте сгенерированные DOM-элементы в блок .map__pins.  -------------
Для вставки элементов используйте DocumentFragment.

5.На основе первого по порядку элемента из сгенерированного  ------------
массива и шаблона .map__card создайте DOM-элемент объявления,
заполните его данными из объекта и вставьте полученный
DOM-элемент в блок .map перед блоком.map__filters-container:


Требования к коду

Код должен быть разделён на отдельные функции.
Стоит отдельно объявить:
    функцию генерации случайных данных,
    функцию создания DOM-элемента на основе JS-объекта,
    функцию заполнения блока DOM-элементами на основе массива JS-объектов.
Пункты задания примерно соответствуют функциям, которые вы должны создать.
*/
// массив из строк расположенных в произвольном порядке
/* "location": {«x»:  // случайное число, координата x метки на карте. Значение ограничено раз
мерами блока, в котором перетаскивается метка. map.clientWidth 1200  map.clientHeight 750
map.clientLeft  0 map.clientTop 0 «y»: случайное число, координата y метки на карте от 130 до 630. */
/* console.log(jumbleElemetsOfArray(OFFER_PHOTOS));

"address": строка, адрес предложения, представляет собой запись вида
"{{location.x}}, {{location.y}}", например, "600, 350"  размер картинки Токио? 1199 на 749 !
получается случайное число от 0 до  1200 это x и от 0 до 750 по y
*/
/*
var createPins = function (ads) {
  var pinDomElement = adPin.cloneNode(true);
  removeChildrenOfParent(pin);
  var pinsArray = [];
  for (var i = 0; i < ads.length; i++) {
    pinDomElement.querySelector('.map__pin').src = ads[i].author.avatar;
    pinDomElement.querySelector('.map__pin').style = 'left: 200px' + ads[i].author.location.x + 'px; ' + 'top: ' + ads[i].author.location.y + 'px;';

    pinsArray.push(pinDomElement);
  }
  return pinsArray;
};

console.log(createPins(similiarAds)); */
/*

var jumbleElemetsOfArray = function (array) {
  return array.sort(function (a, b) {
    return Math.random() - 0.5;
  }).join(', ').split(', ');
};
для смешивания элементов в массиве истинные джедаи используют одну из вариаций алгоритма Фишера-Йетса.
Для своей демки я реализовал его так:
var jumbleElemetsOfArray = function (array){
  var j, temp;
  for(var i = array.length - 1; i > 0; i--){
    j = Math.floor(Math.random()*(i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
}
Суть алгоритма, если перевести с JS на русский, следующая:
берём последний элемент и меняем его местами со случайно выбранным элементом
не правее его (в том числе, возможно, и с ним самим).
Затем повторяем ту же операцию для предпоследнего элемента,
потом для предпредпоследнего и так далее. Вуаля! (этим словом с JS на русский переводится «return arr;»).
 */

// var map.clientWidth 1200  map.clientHeight 750  map.clientLeft  0 map.clientTop 0   map.clientX map.clientY

/*


  Создайте файл js/map.js в вашем личном проекте. Это файл, в котором
вы будете вести работу с похожими объявлениями на карте.
  Имена файлов, функций и пр. в заданиях имеют рекомендательный характер.
  При выполнении задания необязательно создавать файлы, названия которых
указаны в названии.
  Вы можете самостоятельно формировать любую структуру
проекта по своему усмотрению, главное, чтобы проект выполнял ТЗ
и соответствовал критериям.
  В файле index.html подключите ваш файл при помощи тега script.

                      Задача

У блока .map уберите класс .map--faded.
Это временное решение, этот класс переключает карту из неактивного
состояния в активное. В последующих заданиях, в соответствии с ТЗ
вы будете переключать режимы страницы: неактивный, в котором карта
и форма заблокированы и активный режим, в котором производится ввод
данных и просмотр похожих объявлений. Сейчас, для тестирования
функции генерации похожих объявлений мы временно сымитируем
активный режим, а в последующих разделах запрограммируем его
полностью.

27.На основе данных, созданных в первом пункте, создайте DOM-элементы,
соответствующие меткам на карте, и заполните их данными из массива.
Итоговую разметку метки .map__pin можно взять из шаблона .map__card.
o У метки должны быть следующие данные:
o Координаты:
style='left: {{location.x}}px; top: {{location.y}}px;'
o src='{{author.avatar}}'
o alt='{{заголовок объявления}}'

Обратите внимание
Координаты X и Y, которые вы вставите в разметку, это не координаты
левого верхнего угла блока метки, а координаты, на которые указывает
метка своим острым концом. Чтобы найти эту координату нужно учесть
размеры элемента с меткой.

28.Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки
элементов используйте DocumentFragment.

29.На основе первого по порядку элемента из сгенерированного массива
и шаблона .map__card создайте DOM-элемент объявления, заполните его
данными из объекта и вставьте полученный DOM-элемент
в блок .map перед блоком.map__filters-container:
o Выведите заголовок объявления offer.title в заголовок .popup__title.
o Выведите адрес offer.address в блок .popup__text--address.
o Выведите цену offer.price в блок .popup__text--price строкой
вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
o В блок .popup__type выведите тип
жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дво
рец для palace.
o Выведите количество гостей
и комнат offer.rooms и offer.guests в блок .popup__text--capacityстрокой
вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например,
2 комнаты для 3 гостей.

o Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text-
-time строкой вида Заезд после {{offer.checkin}}, выезд до
{{offer.checkout}}. Например, заезд после 14:00, выезд до 12:00.

o В список .popup__features выведите все доступные удобства в объявлении.

o В блок .popup__description выведите описание объекта
недвижимости offer.description.

o В блок .popup__photos выведите все фотографии из списка offer.photos.
Каждая из строк массива photos должна записываться
как src соответствующего изображения.
Замените src у аватарки пользователя — изображения, которое записано
в .popup__avatar — на значения поля author.avatar отрисовываемого
объекта.

В файле map.js:
1. Создайте массив, состоящий из 8 сгенерированных JS объектов, которые
будут описывать похожие объявления неподалёку. Структура объектов
должна быть следующей:
 {
 'author': {
    'avatar': строка, адрес изображения вида
    img/avatars/user{{xx}}.png, где {{xx}}

    это число от 1 до 8 с ведущим нулём.

    Например, 01, 02 и т. д.

    Адреса изображений не повторяются
 },

 'offer': {
    'title': строка, заголовок предложения, одно из фиксированных значений
            'Большая уютная квартира',
            'Маленькая неуютная квартира',
            'Огромный прекрасный дворец',
            'Маленький ужасный дворец',
            'Красивый гостевой домик',
            'Некрасивый негостеприимный домик',
            'Уютное бунгало далеко от моря',
            'Неуютное бунгало по колено в воде'

          Значения не должны повторяться.

    'address': строка, адрес предложения, представляет собой запись вида
            '{{location.x}},
            {{location.y}}',

          например, '600, 350'

    'price': число, случайная цена
            от 1000 до 1000000

    'type': строка с одним из четырёх фиксированных значений:
            palace,
            flat,
            house,
            bungalo

    'rooms': число, случайное количество комнат
            от 1 до 5

    'guests': число, случайное количество гостей, которое можно разместить

    'checkin': строка с одним из трёх фиксированных значений:
            12:00,
            13:00,
            14:00

    'checkout': строка с одним из трёх фиксированных значений:
            12:00,
            13:00,
            14:00

    'features': массив строк случайной длины из ниже предложенных:
            'wifi',
            'dishwasher',
            'parking',
            'washer',
            'elevator',
            'conditioner',
            'description': пустая строка

    'photos': массив из строк
            'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
            'http://o0.github.io/assets/images/tokyo/hotel2.jpg'
            'http://o0.github.io/assets/images/tokyo/hotel3.jpg'

          расположенных в произвольном порядке
 },

 'location': {
    «x»: случайное число, координата x метки на карте. Значение ограничено раз
    мерами блока, в котором перетаскивается метка.
    «y»: случайное число, координата y метки на карте от 130 до 630.
 }
var similiarAds = [];
*/
