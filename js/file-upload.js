'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = document.querySelector('#avatar');
  var preview = document.querySelector('.ad-form-header__preview');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();

/*

Доработайте форму подачи объявления так, чтобы в неё можно было загружать
вашу аватарку и фотографии объявления.

Аватарка пользователя должна загружаться через поле загрузки файлов
в блоке .ad-form__field и показываться в блоке .ad-form-header__preview.

Фотографии жилья должны загружаться через поле загрузки файлов
в блоке .ad-form__upload и показываться в блоках .ad-form__photo.
По желанию, вы можете сделать так, чтобы фотографии жилья можно
было сортировать с помощью перетаскивания (drag n drop API).
*/
