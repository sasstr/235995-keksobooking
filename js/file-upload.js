'use strict';

(function () {
  window.fileUpload = function (/* fileChooser, previewNode, previewNodeChild, cb */) {

    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

    var fileChooserAvatar = document.querySelector('#avatar');
    var preview = document.querySelector('.ad-form-header__preview');
    var previewImage = document.querySelector('.ad-form-header__preview img');

    fileChooserAvatar.addEventListener('change', function () {
      var file = fileChooserAvatar.files[0];
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      var createImgElement = function () {
        var avatarImage = document.createElement('img');
        avatarImage.src = reader.result;
        avatarImage.alt = 'Аватар пользователя';
        avatarImage.style = 'max-width: 40px; max-height: 44px;';
        preview.replaceChild(avatarImage, previewImage);
        previewImage = avatarImage;
      };

      if (matches) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', createImgElement);
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
