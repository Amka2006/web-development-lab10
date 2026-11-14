// js/validators.js
// Лаб 9 – Даалгавар 3: form-ын 4 validation функц.
// Функц бүр { valid: true/false, message: '...' } объект буцаана.

function ok() {
  return { valid: true, message: '' };
}

function fail(message) {
  return { valid: false, message: message };
}

// 1) Нэр: хоёр захын зайг хасна, хоосон биш, 2–50 тэмдэгт, тоо агуулахгүй
function validateName(value) {
  const name = value.trim();
  if (name === '') return fail('Нэрээ оруулна уу.');
  if (name.length < 2 || name.length > 50) return fail('Нэр 2–50 тэмдэгт байх ёстой.');
  if (/\d/.test(name)) return fail('Нэрэнд тоо оруулж болохгүй.');
  return ok();
}

// 2) И-мэйл: хоосон биш, «нэр@домэйн.өргөтгөл» хэлбэр (regex), зай агуулахгүй
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

function validateEmail(value) {
  if (value.trim() === '') return fail('И-мэйл хаягаа оруулна уу.');
  if (/\s/.test(value)) return fail('И-мэйл хаяг зай агуулж болохгүй.');
  if (!EMAIL_PATTERN.test(value)) return fail('И-мэйлийг «нэр@домэйн.өргөтгөл» хэлбэрээр оруулна уу.');
  return ok();
}

// 3) Нууц үг: дор хаяж 8 тэмдэгт, хоосон зайгүй, үсэг (кирилл эсвэл латин) ба тоо агуулна
function validatePassword(value) {
  if (value === '') return fail('Нууц үгээ оруулна уу.');
  if (/\s/.test(value)) return fail('Нууц үг хоосон зай агуулж болохгүй.');
  if (value.length < 8) return fail('Нууц үг дор хаяж 8 тэмдэгт байх ёстой.');
  // \u0400-\u04FF нь кирилл үсгийн бүх мужид (Ө, Ү орно)
  if (!/[A-Za-z\u0400-\u04FF]/.test(value)) return fail('Нууц үг дор хаяж нэг үсэг (кирилл эсвэл латин) агуулна.');
  if (!/\d/.test(value)) return fail('Нууц үг дор хаяж нэг тоо агуулна.');
  return ok();
}

// 4) Зурвас: хоёр захын зайг хасна, 10–500 тэмдэгт
function validateMessage(value) {
  const text = value.trim();
  if (text === '') return fail('Зурвасаа бичнэ үү.');
  if (text.length < 10) return fail('Зурвас дор хаяж 10 тэмдэгт байх ёстой.');
  if (text.length > 500) return fail('Зурвас 500 тэмдэгтээс хэтрэхгүй байх ёстой.');
  return ok();
}