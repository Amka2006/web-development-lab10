// js/album.js
// Лаб 10 – Даалгавар 4: class Album (+ нэмэлт даалгавар: FeaturedAlbum).

class Album {
  #photos = []; // private: class-ын гаднаас огт хүрч болохгүй

  constructor(photos = []) {
    photos.forEach((photo) => this.#insert(photo));
  }

  // add() болон constructor хоёуланд хэрэглэгдэх дотоод арга
  #insert(photo) {
    const copy = structuredClone(photo); // гаднын объектыг хуваалцахгүй, хуулбарлан авна
    const maxId = this.#photos.reduce((max, p) => Math.max(max, p.id), 0);
    const item = {
      ...copy,
      id: copy.id ?? maxId + 1,   // id байхгүй бол хамгийн их id + 1
      likes: copy.likes ?? 0,     // likes байхгүй бол 0
      tags: copy.tags ?? []       // tags байхгүй бол хоосон массив
    };
    if (this.#photos.some((p) => p.id === item.id)) {
      throw new Error(`id ${item.id} аль хэдийн байна`);
    }
    this.#photos.push(item);
    return structuredClone(item);
  }

  get size() {
    return this.#photos.length;
  }

  // ГҮН хуулбар буцаана: гаднаас массив ч, доторх зураг ч өөрчилж чадахгүй
  get photos() {
    return structuredClone(this.#photos);
  }

  find(id) {
    const photo = this.#photos.find((p) => p.id === id);
    return photo && structuredClone(photo); // олдохгүй бол undefined
  }

  add(photo) {
    return this.#insert(photo); // нэмсэн зургийг (id-тай нь) буцаана
  }

  remove(id) {
    const index = this.#photos.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.#photos.splice(index, 1);
    return true;
  }

  like(id) {
    const photo = this.#photos.find((p) => p.id === id);
    if (!photo) return undefined;
    photo.likes += 1;
    return photo.likes; // шинэ лайкийн тоо
  }

  // JSON.stringify(album) автоматаар энийг дуудна
  toJSON() {
    return { photos: this.photos };
  }

  // Album.from('{"photos":[...]}') эсвэл Album.from({photos: [...]}) эсвэл Album.from([...])
  static from(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    const list = Array.isArray(data) ? data : data?.photos ?? [];
    return new this(list); // this = Album эсвэл FeaturedAlbum (удамшуулсан class дээр ч зөв ажиллана)
  }
}

// ===== Нэмэлт даалгавар: FeaturedAlbum =====
// Хамгийн олон лайктай 3 зургийг автоматаар «онцлох» болгоно.
class FeaturedAlbum extends Album {
  static LIMIT = 3;
  #featuredIds = [];

  constructor(photos = []) {
    super(photos); // эхлээд эцэг class-ын constructor
    this.#refresh();
  }

  #refresh() {
    this.#featuredIds = this.photos
      .filter((p) => p.likes > 0)
      .toSorted((a, b) => b.likes - a.likes)
      .slice(0, FeaturedAlbum.LIMIT)
      .map((p) => p.id);
  }

  get featured() {
    return this.#featuredIds.map((id) => this.find(id));
  }

  isFeatured(id) {
    return this.#featuredIds.includes(id);
  }

  // Өөрчлөлт болгоны дараа жагсаалтыг шинэчилнэ. super.xxx нь Album-ын анхны арга
  add(photo) {
    const added = super.add(photo);
    this.#refresh();
    return added;
  }

  remove(id) {
    const removed = super.remove(id);
    this.#refresh();
    return removed;
  }

  like(id) {
    const likes = super.like(id);
    this.#refresh();
    return likes;
  }
}

if (typeof module !== 'undefined') {
  module.exports = { Album, FeaturedAlbum };
}