// tests/lab10.test.js
// Ажиллуулах: node --test tests/lab10.test.js
const test = require('node:test');
const assert = require('node:assert/strict');

const { clamp, average, greet, makeCounter, applyN, compose } = require('../js/utils.js');
const {
  sortByLikes, sortByTitle, filterByTag, filterByPlace,
  searchPhotos, topLiked, uniqueTags, withLike, groupByPlace
} = require('../js/photoTools.js');
const {
  updatePhoto, pick, omit, summary, addTag, removeTag, mergeById, headAndTail
} = require('../js/objectTools.js');
const { Album, FeaturedAlbum } = require('../js/album.js');
const { lastPhoto, totalLikes, sortedByLikes } = require('../js/bugs.js');

// Бүрэн хөлдөөнө: хэн нэг нь өөрчлөх гэвэл шууд алдаа (TypeError) шиднэ
const deepFreeze = (value) => {
  Object.values(value).forEach((v) => typeof v === 'object' && v !== null && deepFreeze(v));
  return Object.freeze(value);
};

const sample = () => [
  { id: 1, title: 'Хөвсгөл нуур', place: 'Хөвсгөл', tags: ['нуур', 'хойд'], likes: 5 },
  { id: 2, title: 'Хонгорын элс', place: 'Өмнөговь', tags: ['говь'], likes: 9 },
  { id: 3, title: 'Баянзаг', place: 'Өмнөговь', tags: ['говь', 'түүх'], likes: 2 }
];

// ---------- 1. utils ----------
test('clamp', () => {
  assert.equal(clamp(15, 0, 10), 10);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(5, 0, 10), 5);
});
test('average', () => {
  assert.equal(average(2, 4, 9), 5);
  assert.equal(average(), 0);
});
test('greet', () => {
  assert.equal(greet(), 'Сайн байна уу, Зочин!');
  assert.equal(greet('Бат'), 'Сайн байна уу, Бат!');
});
test('makeCounter', () => {
  const a = makeCounter();
  const b = makeCounter(10);
  assert.deepEqual([a(), a(), b(), a()], [1, 2, 11, 3]); // тоолуурууд бие даасан
});
test('applyN', () => {
  assert.equal(applyN((x) => x * 2, 3, 1), 8);
  assert.equal(applyN((x) => x + 1, 0, 7), 7);
});
test('compose', () => {
  assert.equal(compose((x) => x + 1, (x) => x * 2)(5), 11);
});

// ---------- 2. photoTools: оролтыг өөрчлөхгүй ----------
test('photoTools: оролтыг хөндөхгүй, шинэ массив буцаана', () => {
  const input = deepFreeze(sample());
  const results = [
    sortByLikes(input), sortByTitle(input), filterByTag(input, 'говь'),
    filterByPlace(input, 'Өмнөговь'), searchPhotos(input, 'нуур'),
    topLiked(input, 2), uniqueTags(input), withLike(input, 1)
  ];
  results.forEach((r) => {
    assert.ok(Array.isArray(r));
    assert.notEqual(r, input);
  });
});
test('photoTools: үр дүн', () => {
  const input = sample();
  assert.deepEqual(sortByLikes(input).map((p) => p.id), [2, 1, 3]);
  assert.deepEqual(sortByTitle(input).map((p) => p.id), [3, 2, 1]);
  assert.deepEqual(filterByTag(input, 'говь').map((p) => p.id), [2, 3]);
  assert.deepEqual(filterByPlace(input, 'Хөвсгөл').map((p) => p.id), [1]);
  assert.deepEqual(searchPhotos(input, 'ЭЛС').map((p) => p.id), [2]);
  assert.deepEqual(topLiked(input, 2).map((p) => p.id), [2, 1]);
  assert.deepEqual(uniqueTags(input), ['нуур', 'хойд', 'говь', 'түүх']);
  assert.equal(withLike(input, 3).find((p) => p.id === 3).likes, 3);
  assert.equal(input[2].likes, 2); // анхных өөрчлөгдөөгүй
});
test('groupByPlace', () => {
  const groups = { ...groupByPlace(sample()) }; // null-prototype объектыг энгийн болгоно
  assert.deepEqual(Object.keys(groups), ['Хөвсгөл', 'Өмнөговь']);
  assert.equal(groups['Өмнөговь'].length, 2);
});

// ---------- 3. objectTools ----------
test('objectTools: оролтыг хөндөхгүй', () => {
  const photo = deepFreeze({ id: 1, title: 'A', place: 'B', tags: ['x'], likes: 1 });
  updatePhoto(photo, { likes: 2 });
  pick(photo, 'id', 'title');
  omit(photo, 'tags');
  addTag(photo, 'y');
  removeTag(photo, 'x');
  mergeById([photo], [photo]);
  headAndTail([photo]);
});
test('objectTools: үр дүн', () => {
  const photo = { id: 1, title: 'A', place: 'B', tags: ['x'], likes: 1 };
  assert.deepEqual(updatePhoto(photo, { likes: 2 }), { ...photo, likes: 2 });
  assert.deepEqual(pick(photo, 'id', 'title', 'nope'), { id: 1, title: 'A' });
  assert.deepEqual(omit(photo, 'tags', 'likes'), { id: 1, title: 'A', place: 'B' });
  assert.equal(summary({ title: 'A' }), 'A (газар тодорхойгүй) — ♥ 0');
  assert.deepEqual(addTag(photo, 'y').tags, ['x', 'y']);
  assert.deepEqual(addTag(photo, 'x').tags, ['x']);
  assert.deepEqual(removeTag(photo, 'x').tags, []);
  assert.deepEqual(
    mergeById([{ id: 1, v: 'a' }, { id: 2, v: 'b' }], [{ id: 2, v: 'B' }, { id: 3, v: 'c' }]),
    [{ id: 1, v: 'a' }, { id: 2, v: 'B' }, { id: 3, v: 'c' }]
  );
  assert.deepEqual(headAndTail([1, 2, 3]), { first: 1, rest: [2, 3] });
});

// ---------- 4. Album ----------
test('Album: size, find, add (id, likes, tags)', () => {
  const album = new Album(sample());
  assert.equal(album.size, 3);
  assert.equal(album.find(2).title, 'Хонгорын элс');
  assert.equal(album.find(99), undefined);
  const added = album.add({ title: 'Шинэ', place: 'Төв' });
  assert.deepEqual(added, { title: 'Шинэ', place: 'Төв', id: 4, likes: 0, tags: [] });
  assert.equal(album.size, 4);
});
test('Album: гаднаас өөрчлөх боломжгүй', () => {
  const album = new Album(sample());
  album.photos.push({ id: 100 });          // хуулбар дээр ажиллалаа
  album.photos[0].title = 'ХАГАСАН';
  album.find(1).likes = 999;
  assert.equal(album.size, 3);
  assert.equal(album.photos[0].title, 'Хөвсгөл нуур');
  assert.equal(album.find(1).likes, 5);
  assert.equal(Object.keys(album).length, 0);       // #photos гаднаас харагдахгүй
  assert.equal(album.size, 3);
  const source = sample();
  const another = new Album(source);
  source[0].title = 'ӨӨРЧЛӨВ';                      // оролтын объектыг өөрчилсөн ч Album-д нөлөөгүй
  assert.equal(another.find(1).title, 'Хөвсгөл нуур');
});
test('Album: like, remove', () => {
  const album = new Album(sample());
  assert.equal(album.like(1), 6);
  assert.equal(album.like(99), undefined);
  assert.equal(album.remove(1), true);
  assert.equal(album.remove(1), false);
  assert.equal(album.size, 2);
});
test('Album: toJSON ба from', () => {
  const album = new Album(sample());
  const text = JSON.stringify(album);
  assert.deepEqual(JSON.parse(text), { photos: sample() });
  assert.deepEqual(Album.from(text).photos, album.photos);
  assert.deepEqual(Album.from({ photos: sample() }).photos, album.photos);
  assert.deepEqual(Album.from(sample()).photos, album.photos);
});
test('Album: давхардсан id-д алдаа шиднэ', () => {
  const album = new Album(sample());
  assert.throws(() => album.add({ id: 1, title: 'X', place: 'Y' }), /давхардсан|байна/);
});

// ---------- Нэмэлт: FeaturedAlbum ----------
test('FeaturedAlbum: лайк хамгийн олон 3 зураг автоматаар онцлогдоно', () => {
  const album = new FeaturedAlbum([
    { id: 1, title: 'A', place: 'P', likes: 1 },
    { id: 2, title: 'B', place: 'P', likes: 9 },
    { id: 3, title: 'C', place: 'P', likes: 5 },
    { id: 4, title: 'D', place: 'P', likes: 7 }
  ]);
  assert.deepEqual(album.featured.map((p) => p.id), [2, 4, 3]);
  assert.equal(album.isFeatured(1), false);
  album.like(1); album.like(1); album.like(1); album.like(1); album.like(1); // 1: 6 лайк
  assert.deepEqual(album.featured.map((p) => p.id), [2, 4, 1]);
  assert.equal(FeaturedAlbum.from(JSON.stringify(album)) instanceof FeaturedAlbum, true);
  album.remove(2);
  assert.deepEqual(album.featured.map((p) => p.id), [4, 1, 3]);
});

// ---------- 5. bugs ----------
test('bugs: lastPhoto', () => {
  assert.equal(lastPhoto(sample()).id, 3);
});
test('bugs: totalLikes', () => {
  assert.equal(totalLikes(sample()), 16);
  assert.equal(totalLikes([]), 0);
});
test('bugs: sortedByLikes оролтыг өөрчлөхгүй', () => {
  const input = sample();
  assert.deepEqual(sortedByLikes(input).map((p) => p.id), [2, 1, 3]);
  assert.deepEqual(input.map((p) => p.id), [1, 2, 3]);
});

// ---------- ӨӨРИЙН 5 ШИНЭ ТЕСТ ----------
test('[ӨӨРИЙН ТЕСТ 1] хоосон массивт бүх функц алдаагүй ажиллана', () => {
  assert.deepEqual(sortByLikes([]), []);
  assert.deepEqual(sortByTitle([]), []);
  assert.deepEqual(filterByTag([], 'x'), []);
  assert.deepEqual(filterByPlace([], 'x'), []);
  assert.deepEqual(searchPhotos([], 'x'), []);
  assert.deepEqual(topLiked([], 3), []);
  assert.deepEqual(uniqueTags([]), []);
  assert.deepEqual(withLike([], 1), []);
  assert.deepEqual({ ...groupByPlace([]) }, {});
  assert.equal(new FeaturedAlbum([]).featured.length, 0);
  assert.equal(new Album().size, 0);
});
test('[ӨӨРИЙН ТЕСТ 2] нэг зургийг олон дахин like дарахад тоо нэмэгдсээр байна', () => {
  const album = new FeaturedAlbum(sample());
  assert.equal(album.like(3), 3);
  assert.equal(album.like(3), 4);
  assert.equal(album.like(3), 5);
  assert.equal(album.find(3).likes, 5);
  assert.equal(album.find(1).likes, 5); // бусад зураг хөндөгдөөгүй
});
test('[ӨӨРИЙН ТЕСТ 3] зөвхөн зай бүхий хайлт бүх зургийг (шинэ массиваар) буцаана', () => {
  const input = sample();
  const result = searchPhotos(input, '   ');
  assert.equal(result.length, 3);
  assert.notEqual(result, input);
});
test('[ӨӨРИЙН ТЕСТ 4] id нь устгасны дараа ч хамгийн их id + 1 байна', () => {
  const album = new Album(sample());   // id: 1, 2, 3
  album.remove(2);                     // id: 1, 3
  assert.equal(album.add({ title: 'X', place: 'Y' }).id, 4);
  album.remove(4);                     // id: 1, 3
  assert.equal(album.add({ title: 'Z', place: 'Y' }).id, 4);
});
test('[ӨӨРИЙН ТЕСТ 5] тусгай тэмдэгт, том/жижиг үсэгтэй хайлт зөв ажиллана', () => {
  const input = [{ id: 1, title: 'Баян-Өлгий', place: 'Баян-Өлгий', tags: ['Казах'], likes: 0 }];
  assert.equal(searchPhotos(input, 'баян-өлгий').length, 1);
  assert.equal(searchPhotos(input, 'КАЗАХ').length, 1);
  assert.equal(searchPhotos(input, 'говь').length, 0);
});