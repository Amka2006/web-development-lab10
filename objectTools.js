// js/objectTools.js
// Лаб 10 – Даалгавар 3: Объект. Spread, destructuring, rest ашиглана.
// Оролтын объект, массивыг ӨӨРЧЛӨХГҮЙ.

// 1) updatePhoto — spread: объектыг хуулж, зөвхөн өөрчлөлтийг дарж бичнэ
const updatePhoto = (photo, changes) => ({ ...photo, ...changes });

// 2) pick — rest параметр: зөвхөн заасан түлхүүрүүдийг авна
const pick = (obj, ...keys) =>
  Object.fromEntries(keys.filter((key) => key in obj).map((key) => [key, obj[key]]));

// 3) omit — destructuring + rest: заасан түлхүүрүүдийг хасна
const omit = (obj, ...keys) =>
  keys.reduce((acc, key) => {
    const { [key]: _removed, ...rest } = acc; // [key] нь динамик түлхүүр
    return rest;
  }, { ...obj });

// 4) summary — параметр дотроо destructuring + default утга
const summary = ({ title, place = 'газар тодорхойгүй', likes = 0 }) =>
  `${title} (${place}) — ♥ ${likes}`;

// 5) addTag — массивын spread. Давхардуулж нэмэхгүй
const addTag = (photo, tag) =>
  photo.tags.includes(tag) ? { ...photo } : { ...photo, tags: [...photo.tags, tag] };

// 6) removeTag
const removeTag = (photo, tag) => ({ ...photo, tags: photo.tags.filter((t) => t !== tag) });

// 7) mergeById — хоёр жагсаалтыг нэгтгэнэ. Ижил id-тай бол b-ийнх давамгайлна
const mergeById = (a, b) => [...new Map([...a, ...b].map((p) => [p.id, p])).values()];

// 8) headAndTail — массивын destructuring + rest
const headAndTail = ([first, ...rest]) => ({ first, rest });

if (typeof module !== 'undefined') {
  module.exports = { updatePhoto, pick, omit, summary, addTag, removeTag, mergeById, headAndTail };
}