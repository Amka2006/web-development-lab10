// js/bugs.js
// Лаб 10 – Даалгавар 5: Алдаа олох. Гурван функц тус бүр НЭГ алдаатай байсан.
// Доорх нь ЗАСАЖ дууссан хувилбар. Хуучин (алдаатай) мөрийг // БУРУУ: гэж тайлбарт үлдээв.

// 1) Сүүлийн зургийг буцаана
function lastPhoto(photos) {
  // БУРУУ: return photos[photos.length];   // индекс 0-ээс эхэлдэг тул сүүлийнх нь length - 1
  return photos[photos.length - 1];
}

// 2) Нийт лайкийн тоо
function totalLikes(photos) {
  // БУРУУ: return photos.reduce((sum, p) => sum + p.likes);   // анхны утга (0) байхгүй
  return photos.reduce((sum, p) => sum + p.likes, 0);
}

// 3) Лайкаар эрэмбэлсэн ШИНЭ массив (анхных хэвээр үлдэнэ)
function sortedByLikes(photos) {
  // БУРУУ: return photos.sort((a, b) => b.likes - a.likes);   // sort() нь анхны массивыг өөрчилдөг
  return [...photos].sort((a, b) => b.likes - a.likes);
}

if (typeof module !== 'undefined') {
  module.exports = { lastPhoto, totalLikes, sortedByLikes };
}