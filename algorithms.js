   

// 1) 1-ээс n хүртэлх бүх тооны нийлбэр: sumTo(10) -> 55
function sumTo(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// 2) Факториал: factorial(5) -> 120
function factorial(n) {
  if (n < 0 || n % 1 !== 0) return NaN; // сөрөг, бутархай тоонд факториал байхгүй
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// 3) Анхны тоо эсэх: isPrime(97) -> true
function isPrime(n) {
  if (n < 2 || n % 1 !== 0) return false;
  for (let i = 2; i * i <= n; i++) { // √n хүртэл шалгахад хангалттай
    if (n % i === 0) return false;
  }
  return true;
}

// 4) FizzBuzz: fizzBuzz(5) -> [1, 2, 'Fizz', 4, 'Buzz']
function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    let item;
    if (i % 15 === 0) item = 'FizzBuzz';
    else if (i % 3 === 0) item = 'Fizz';
    else if (i % 5 === 0) item = 'Buzz';
    else item = i;
    result[result.length] = item; // push() ашиглахгүйн тулд
  }
  return result;
}

// 5) Эгшиг тоолох (латин + монгол): countVowels('Монгол улс') -> 3
const VOWELS = 'aeiouAEIOUаэиоуөүеёюяыАЭИОУӨҮЕЁЮЯЫ';

function isVowel(ch) {
  for (let i = 0; i < VOWELS.length; i++) {
    if (VOWELS[i] === ch) return true;
  }
  return false;
}

function countVowels(text) {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (isVowel(text[i])) count++;
  }
  return count;
}

// 6) Палиндром (том, жижиг үсэг ба зайг тооцохгүй): isPalindrome('Anna') -> true
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ';
const LOWER = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмноөпрстуүфхцчшщъыьэюя';

function toLowerChar(ch) { // toLowerCase() ашиглахгүйн тулд өөрөө бичив
  for (let i = 0; i < UPPER.length; i++) {
    if (UPPER[i] === ch) return LOWER[i];
  }
  return ch;
}

function isPalindrome(text) {
  let left = 0;
  let right = text.length - 1;
  while (left < right) {
    if (text[left] === ' ') { left++; continue; }
    if (text[right] === ' ') { right--; continue; }
    if (toLowerChar(text[left]) !== toLowerChar(text[right])) return false;
    left++;
    right--;
  }
  return true;
}

// 7) Массивын хамгийн их утга (Math.max ашиглахгүй): maxOf([3, 9, 2]) -> 9
function maxOf(numbers) {
  if (numbers.length === 0) return undefined; // хоосон массивт утга байхгүй
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) max = numbers[i];
  }
  return max;
}

// 8) Цифрүүдийн нийлбэр: digitSum(1234) -> 10
function digitSum(n) {
  if (n % 1 !== 0) return NaN;
  if (n < 0) n = -n;
  let sum = 0;
  while (n > 0) {
    const digit = n % 10;      // сүүлийн цифр
    sum += digit;
    n = (n - digit) / 10;      // сүүлийн цифрийг хасна (Math.floor ашиглахгүй)
  }
  return sum;
}

// ===== Шалгалт: нээгээд F12 -> Console дээр хүснэгт харагдана =====
function sameArray(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function runAlgorithmTests() {
  const rows = [];

  function check(name, actual, expected) {
    const ok = typeof expected === 'object' ? sameArray(actual, expected) : Object.is(actual, expected);
    rows[rows.length] = { 'тест': name, 'гарсан': String(actual), 'хүлээсэн': String(expected), 'үр дүн': ok ? 'OK' : 'АЛДАА' };
  }

  check('sumTo(10)', sumTo(10), 55);
  check('sumTo(0)', sumTo(0), 0);
  check('factorial(5)', factorial(5), 120);
  check('factorial(0)', factorial(0), 1);
  check('factorial(-1)', factorial(-1), NaN);
  check('isPrime(2)', isPrime(2), true);
  check('isPrime(1)', isPrime(1), false);
  check('isPrime(97)', isPrime(97), true);
  check('isPrime(91)', isPrime(91), false);
  check('fizzBuzz(5)', fizzBuzz(5), [1, 2, 'Fizz', 4, 'Buzz']);
  check('fizzBuzz(15)[14]', fizzBuzz(15)[14], 'FizzBuzz');
  check("countVowels('Hello World')", countVowels('Hello World'), 3);
  check("countVowels('Монгол улс')", countVowels('Монгол улс'), 3);
  check("isPalindrome('level')", isPalindrome('level'), true);
  check("isPalindrome('Anna')", isPalindrome('Anna'), true);
  check("isPalindrome('А роза упала на лапу Азора')", isPalindrome('А роза упала на лапу Азора'), true);
  check("isPalindrome('hello')", isPalindrome('hello'), false);
  check('maxOf([3, -1, 9, 4])', maxOf([3, -1, 9, 4]), 9);
  check('maxOf([-5, -2, -9])', maxOf([-5, -2, -9]), -2);
  check('maxOf([])', maxOf([]), undefined);
  check('digitSum(1234)', digitSum(1234), 10);
  check('digitSum(-905)', digitSum(-905), 14);

  console.group('Лаб 9 – algorithms.js шалгалт');
  console.table(rows);
  console.groupEnd();
}

runAlgorithmTests();