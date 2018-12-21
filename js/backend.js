'use strict';

(function () {
  var TIMEOUT = 10000;
  var TEXT_RESPONSE_STATUS = 'Статус ответа: ';

  // Пречисление кодов статусас сервера
  var ServerStatusCode = {
    'SUCCESS': 200,
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'NOT_FOUND': 404,
    'REQUEST_TIMEOUT': 408,
    'INTERNAL_SERVER_ERROR': 500,
    'GATEWAY_TIMEOUT': 504
  };

  // Функция получения информайции с сервера
  var createXmlHttpRequest = function (loadHandler, errorHandler) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;
    // Функция слушатель что вернет сервер ошибку или успешную загрузку
    var xhrLoadHandler = function () {
      switch (xhr.status) {
        case ServerStatusCode.SUCCESS:
          loadHandler(xhr.response);
          break;
        case ServerStatusCode.BAD_REQUEST:
          errorHandler(TEXT_RESPONSE_STATUS + xhr.status + ' В запросе ошибка.');
          break;
        case ServerStatusCode.UNAUTHORIZED:
          errorHandler(TEXT_RESPONSE_STATUS + xhr.status + ' Доступ запрещён. У вас недостаточно прав.');
          break;
        case ServerStatusCode.NOT_FOUND:
          errorHandler(TEXT_RESPONSE_STATUS + xhr.status + ' Данные по запросу не найдены.');
          break;
        case ServerStatusCode.SERVER_ERROR:
          errorHandler(TEXT_RESPONSE_STATUS + xhr.status + ' Внутренняя ошибка сервера');
          break;
        case ServerStatusCode.GATEWAY_TIMEOUT:
          errorHandler(TEXT_RESPONSE_STATUS + xhr.status + ' Сервис временно недоступен');
          break;
        default:
          errorHandler(TEXT_RESPONSE_STATUS + xhr.status + ' ' + xhr.statusText);
      }
    };

    xhr.addEventListener('load', xhrLoadHandler);
    xhr.addEventListener('error', function () {
      errorHandler();
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };

  // Функция получения информайции с сервера
  var receiveData = function (loadHandler, errorHandler, urlDownloadData) {
    var xhr = createXmlHttpRequest(loadHandler, errorHandler, urlDownloadData);
    xhr.open('GET', urlDownloadData);
    xhr.send();
  };
  // Функция отправки информайции на сервер
  var sendData = function (data, loadHandler, errorHandler, urlSendData) {
    var xhr = createXmlHttpRequest(loadHandler, errorHandler, urlSendData);
    xhr.open('POST', urlSendData);
    xhr.send(data);
  };

  window.backend = {
    load: receiveData,
    save: sendData
  };
})();
