// js/form.js
// Лаб 9 – Даалгавар 4: validation функцүүдийг form-той холбоно.
(function () {
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const counter = document.getElementById('messageCount');

  // Талбар бүрийг өөрийн validation функцтэй холбоно
  const fields = [
    { input: form.querySelector('#name'),     validate: validateName,     touched: false },
    { input: form.querySelector('#email'),    validate: validateEmail,    touched: false },
    { input: form.querySelector('#password'), validate: validatePassword, touched: false },
    { input: form.querySelector('#message'),  validate: validateMessage,  touched: false }
  ];

  // Үр дүнг талбар дээр харуулна (алдааны текст, улаан/ногоон хүрээ, aria)
  function showResult(input, result) {
    const error = document.getElementById(input.id + '-error');
    error.textContent = result.message;
    input.classList.toggle('form__input--invalid', !result.valid);
    input.classList.toggle('form__input--valid', result.valid);
    input.setAttribute('aria-invalid', String(!result.valid));
  }

  function checkField(field) {
    const result = field.validate(field.input.value);
    showResult(field.input, result);
    return result.valid;
  }

  function clearField(field) {
    field.touched = false;
    document.getElementById(field.input.id + '-error').textContent = '';
    field.input.classList.remove('form__input--invalid', 'form__input--valid');
    field.input.removeAttribute('aria-invalid');
  }

  function setStatus(text, type) {
    status.textContent = text;
    status.className = 'form__status' + (type ? ' form__status--' + type : '');
  }

  // Талбараас гармагц шалгана, дараа нь бичих бүрт дахин шалгана
  fields.forEach((field) => {
    field.input.addEventListener('blur', () => {
      field.touched = true;
      checkField(field);
    });
    field.input.addEventListener('input', () => {
      if (field.touched) checkField(field);
    });
  });

  // Зурвасын тэмдэгтийн тоолуур
  const messageInput = form.querySelector('#message');
  function updateCounter() {
    const length = messageInput.value.length;
    counter.textContent = length + ' / 500';
    counter.classList.toggle('form__counter--over', length > 500);
  }
  messageInput.addEventListener('input', updateCounter);

  // Илгээх
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;
    fields.forEach((field) => {
      field.touched = true;
      const valid = checkField(field);
      if (!valid && !firstInvalid) firstInvalid = field.input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      setStatus('Улаанаар тэмдэглэсэн талбаруудыг засаад дахин илгээнэ үү.', 'error');
      return;
    }

    // Сервер байхгүй тул зөвхөн консолд харуулна (нууц үгийг хэзээ ч бүү хэвлэ!)
    const data = {
      name: fields[0].input.value.trim(),
      email: fields[1].input.value,
      message: fields[3].input.value.trim()
    };
    console.log('Илгээсэн санал хүсэлт:', data);

    setStatus('Баярлалаа, ' + data.name + '! Таны санал хүсэлтийг хүлээн авлаа.', 'success');
    form.reset();
    fields.forEach(clearField);
    updateCounter();
  });
})();