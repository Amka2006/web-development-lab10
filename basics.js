// js/basics.js
// Лаб 9 – Даалгавар 1: хувьсагч, төрөл, хөрвүүлэлтийн жижиг туршилт.
// Үр дүнг F12 -> Console дээр харна.
(function () {
  // --- let / const / var ---
  const siteName = 'Тал нутаг Аялал'; // const: дахин оноож болохгүй
  let visitors = 0;                    // let: утгыг нь өөрчилж болно
  visitors = visitors + 1;
  console.log(siteName, '— зочин №', visitors);

  // --- Өгөгдлийн төрлүүд: typeof ---
  const values = [
    ['тоо', 42],
    ['бутархай тоо', 3.14],
    ['тэмдэгт мөр', 'сайн уу'],
    ['boolean', true],
    ['null', null],              // typeof null === 'object' (JS-ийн алдартай онцлог)
    ['undefined', undefined],
    ['массив', [1, 2, 3]],       // typeof [] === 'object'
    ['объект', { a: 1 }],
    ['функц', function () {}],
    ['NaN', NaN],                // typeof NaN === 'number'
    ['BigInt', 10n],
    ['Symbol', Symbol('id')]
  ];

  console.group('1. typeof');
  console.table(values.map(([label, value]) => ({
    'нэр': label,
    'утга': String(value),
    'typeof': typeof value
  })));
  console.groupEnd();

  // --- Төрөл хөрвүүлэлт (coercion) ---
  const conversions = [
    ['"5" + 3', '5' + 3],                    // "53": + нь мөр залгана
    ['"5" - 3', '5' - 3],                    // 2: - нь тоо болгоно
    ['"5" * "2"', '5' * '2'],                // 10
    ['true + 1', true + 1],                  // 2
    ['null + 1', null + 1],                  // 1
    ['undefined + 1', undefined + 1],        // NaN
    ['"" == 0', '' == 0],                    // true  (== төрлийг хөрвүүлнэ)
    ['"0" == false', '0' == false],          // true
    ['null == undefined', null == undefined],   // true
    ['null === undefined', null === undefined], // false (=== төрлийг хөрвүүлэхгүй)
    ['Number("abc")', Number('abc')],        // NaN
    ['Number("")', Number('')],              // 0
    ['parseInt("42px")', parseInt('42px')],  // 42
    ['Boolean("0")', Boolean('0')],          // true (хоосон биш мөр)
    ['Boolean("")', Boolean('')]             // false
  ];

  console.group('2. Төрөл хөрвүүлэлт');
  console.table(conversions.map(([expr, result]) => ({
    'илэрхийлэл': expr,
    'үр дүн': result,
    'төрөл': typeof result
  })));
  console.groupEnd();

  // --- 0.1 + 0.2 ---
  // Тоонууд хоёртын бутархайгаар (IEEE 754) хадгалагддаг тул 0.1, 0.2-ыг яг илэрхийлж чадахгүй.
  const sum = 0.1 + 0.2;
  console.group('3. 0.1 + 0.2');
  console.log('0.1 + 0.2 =', sum);                                   // 0.30000000000000004
  console.log('0.1 + 0.2 === 0.3 ?', sum === 0.3);                   // false
  console.log('Number.EPSILON-оор жишвэл:', Math.abs(sum - 0.3) < Number.EPSILON); // true
  console.log('toFixed(2):', sum.toFixed(2), '(' + typeof sum.toFixed(2) + ')');    // "0.30" мөр
  console.log('Бүхэл тоогоор бодвол:', (0.1 * 10 + 0.2 * 10) / 10);  // 0.3
  console.groupEnd();
})();