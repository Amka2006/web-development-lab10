// js/utils.js
// Лаб 10 – Даалгавар 1: Функц. Бүгд arrow функц хэлбэртэй.

// clamp(n, min, max): n-ийг [min, max] мужид хавчина. clamp(15, 0, 10) -> 10
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// average(...nums): rest параметр. Хоосон бол 0. average(2, 4, 9) -> 5
const average = (...nums) =>
  nums.length === 0 ? 0 : nums.reduce((sum, n) => sum + n, 0) / nums.length;

// greet(name = 'Зочин'): default параметр. greet() -> 'Сайн байна уу, Зочин!'
const greet = (name = 'Зочин') => `Сайн байна уу, ${name}!`;

// makeCounter(start = 0): closure. const next = makeCounter(5); next() -> 6, next() -> 7
const makeCounter = (start = 0) => {
  let count = start; // гаднаас харагдахгүй, зөвхөн буцаасан функц л хардаг
  return () => ++count;
};

// applyN(fn, n, x): fn-ийг x дээр n удаа дараалан хэрэглэнэ. applyN(x => x * 2, 3, 1) -> 8
const applyN = (fn, n, x) => Array.from({ length: n }).reduce((acc) => fn(acc), x);

// compose(f, g): f(g(x)) функцийг буцаана. compose(x => x + 1, x => x * 2)(5) -> 11
const compose = (f, g) => (x) => f(g(x));

if (typeof module !== 'undefined') {
  module.exports = { clamp, average, greet, makeCounter, applyN, compose };
}