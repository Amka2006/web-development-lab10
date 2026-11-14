// js/photoForm.js
// Лаб 10 – Нэмэлт даалгавар: «Шинэ зураг нэмэх» form (нэр, газар, огноо).
// Лаб 9-ийн validators.js-ийн validateName, ok, fail-ийг дахин ашиглана.
(function () {
  const form = document.getElementById('photoForm');
  if (!form) return;

  const status = document.getElementById('photoStatus');
  const todayISO = () => new Date().toLocaleDateString('sv-SE'); // 'YYYY-MM-DD' (орон нутгийн цагаар)

  // Лаб 9-ийн validateName-ийг дахин ашиглана
  const validateTitle = validateName;
  const validatePlace = (value) =>
    value.trim() === '' ? fail('Газрын нэрээ оруулна уу.') : validateName(value);

  // Шинэ validator: огноо
  const validateDate = (value) => {
    if (value === '') return fail('Огноогоо сонгоно уу.');
    if (Number.isNaN(Date.parse(value))) return fail('Огноо буруу байна.');
    if (value > todayISO()) return fail('Ирээдүйн огноо сонгож болохгүй.');
    return ok();
  };

  const fields = [
    { input: form.querySelector('#photo-title'), validate: validateTitle, touched: false },
    { input: form.querySelector('#photo-place'), validate: validatePlace, touched: false },
    { input: form.querySelector('#photo-date'),  validate: validateDate,  touched: false }
  ];
  fields[2].input.max = todayISO(); // календарь ирээдүйн өдрийг сонгуулахгүй

  function checkField(field) {
    const result = field.validate(field.input.value);
    document.getElementById(field.input.id + '-error').textContent = result.message;
    field.input.classList.toggle('form__input--invalid', !result.valid);
    field.input.classList.toggle('form__input--valid', result.valid);
    field.input.setAttribute('aria-invalid', String(!result.valid));
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

  fields.forEach((field) => {
    field.input.addEventListener('blur', () => { field.touched = true; checkField(field); });
    field.input.addEventListener('input', () => { if (field.touched) checkField(field); });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;
    fields.forEach((field) => {
      field.touched = true;
      if (!checkField(field) && !firstInvalid) firstInvalid = field.input;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      setStatus('Улаанаар тэмдэглэсэн талбаруудыг засна уу.', 'error');
      return;
    }

    const added = window.albumApp.addPhoto({            // Album.add-тай холбогдож байна
      title: fields[0].input.value.trim(),
      place: fields[1].input.value.trim(),
      date: fields[2].input.value
    });
    setStatus(`«${added.title}» зураг цомогт нэмэгдлээ (№${added.id}).`, 'success');
    form.reset();
    fields.forEach(clearField);
  });
})();