// js/photoTools.js
// Лаб 10 – Даалгавар 2: Массивын аргууд.
// for, while ХЭРЭГЛЭХГҮЙ. Функц бүр оролтын массивыг өөрчлөхгүй, ШИНЭ массив буцаана.
// Зураг (photo) = { id, title, place, tags: [], likes, date? }

// 1) Лайкаар буурахаар эрэмбэлнэ (toSorted нь анхны массивыг хөндөхгүй)
const sortByLikes = (photos) => photos.toSorted((a, b) => b.likes - a.likes);

// 2) Нэрээр цагаан толгойн дарааллаар эрэмбэлнэ
const sortByTitle = (photos) => photos.toSorted((a, b) => a.title.localeCompare(b.title, 'mn'));

// 3) Таг агуулсан зургууд
const filterByTag = (photos, tag) => photos.filter((p) => p.tags.includes(tag));

// 4) Нэг газрын зургууд
const filterByPlace = (photos, place) => photos.filter((p) => p.place === place);

// 5) Нэр, газар, тагаар хайна. Зөвхөн зай бол бүгдийг буцаана
const searchPhotos = (photos, query) => {
  const q = query.trim().toLowerCase();
  if (q === '') return [...photos];
  return photos.filter((p) => [p.title, p.place, ...p.tags].join(' ').toLowerCase().includes(q));
};

// 6) Хамгийн олон лайктай n зураг
const topLiked = (photos, n = 3) => sortByLikes(photos).slice(0, n);

// 7) Бүх давхардаагүй тагууд
const uniqueTags = (photos) => [...new Set(photos.flatMap((p) => p.tags))];

// 8) Нэг зургийн лайкийг +1 болгосон ШИНЭ массив (анхны зураг хөндөгдөхгүй)
const withLike = (photos, id) =>
  photos.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));

// ===== Нэмэлт: groupByPlace (Object.groupBy) =====
// Object.groupBy: Chrome 117+, Firefox 119+, Safari 17.4+. Хуучин хөтчид зориулсан нөөц хувилбартай.
const groupByPlace = (photos) =>
  typeof Object.groupBy === 'function'
    ? Object.groupBy(photos, (p) => p.place)
    : photos.reduce((groups, p) => ({ ...groups, [p.place]: [...(groups[p.place] ?? []), p] }), {});

if (typeof module !== 'undefined') {
  module.exports = {
    sortByLikes, sortByTitle, filterByTag, filterByPlace,
    searchPhotos, topLiked, uniqueTags, withLike, groupByPlace
  };
}