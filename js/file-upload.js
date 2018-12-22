'use strict';

(function () {
  window.fileUpload = function () {

    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

    var fileChooser = document.querySelector('#avatar');
    var preview = document.querySelector('.ad-form-header__preview');

    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();
      console.log(fileName);
      var matches = FILE_TYPES.some(function (it) {
        console.log(it);
        return fileName.endsWith(it);

      });
      console.log(matches);
      if (matches) {
        console.log('matches');
        console.log(file);
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          reader.readAsDataURL(file);
          var avatarImage = document.createElement('img');
          avatarImage.src = reader.result;
          avatarImage.alt = 'Аватар пользователя';
          avatarImage.style = 'max-width: 40px; max-height: 44px;';
          console.log(avatarImage);
          preview.replaceChild(avatarImage);
        });
      }
    });
  };
  window.fileUpload();
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
