// js/app.js
// Лаб 10 – Даалгавар 4: цомгийг хуудастай холбоно.
// currentList(), like listener, шүүлтүүрийн listener — энд бичив.
// makeCard, renderCards — хуудсанд зураг гаргадаг бэлэн хэсэг (өөрчлөхгүй).
(function () {
  const STORAGE_KEY = 'talnutag-album';

  // Жишээ өгөгдөл (лайкийн тоонууд зөвхөн жишээ). Зураг гаргахыг хүсвэл src: 'https://...' гэж бөглөнө
  const SEED = [
    { id: 1,  title: 'Хөвсгөл нуур',      place: 'Хөвсгөл',    tags: ['нуур', 'хойд'],        likes: 12, src: '' },
    { id: 2,  title: 'Хонгорын элс',      place: 'Өмнөговь',   tags: ['говь', 'элс'],         likes: 9,  src: '' },
    { id: 3,  title: 'Цагаан сүврага',    place: 'Дундговь',   tags: ['говь', 'хад'],         likes: 4,  src: '' },
    { id: 4,  title: 'Баянзаг',           place: 'Өмнөговь',   tags: ['говь', 'түүх'],        likes: 7,  src: '' },
    { id: 5,  title: 'Орхоны хүрхрээ',    place: 'Өвөрхангай', tags: ['хүрхрээ', 'төв'],      likes: 6,  src: '' },
    { id: 6,  title: 'Эрдэнэ Зуу хийд',   place: 'Өвөрхангай', tags: ['хийд', 'түүх'],        likes: 3,  src: '' },
    { id: 7,  title: 'Тэрхийн цагаан нуур', place: 'Архангай', tags: ['нуур', 'төв'],         likes: 2,  src: '' },
    { id: 8,  title: 'Алтай Таван Богд',  place: 'Баян-Өлгий', tags: ['уул', 'баруун'],       likes: 1,  src: '' },
    { id: 9,  title: 'Увс нуур',          place: 'Увс',        tags: ['нуур', 'баруун'],      likes: 0,  src: '' },
    { id: 10, title: 'Хустайн нуруу',     place: 'Төв',        tags: ['байгаль', 'тахь'],     likes: 0,  src: '' },
    { id: 11, title: 'Бурхан Халдун',     place: 'Хэнтий',     tags: ['уул', 'түүх'],         likes: 0,  src: '' },
    { id: 12, title: 'Тэрэлж',            place: 'Төв',        tags: ['байгаль', 'амралт'],   likes: 0,  src: '' }
  ];

  // ----- Цомгийг localStorage-оос сэргээх / хадгалах (toJSON, Album.from-ийг ашиглана) -----
  function loadAlbum() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return FeaturedAlbum.from(saved);
    } catch (error) {
      console.warn('Хадгалсан цомгийг уншиж чадсангүй, жишээ өгөгдлөөр эхэллээ.', error);
    }
    return new FeaturedAlbum(SEED);
  }

  function saveAlbum() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(album)); // album.toJSON() автоматаар дуудагдана
    } catch (error) {
      /* хувийн цонх гэх мэтэд хадгалах боломжгүй байж болно, чимээгүй өнгөрнө */
    }
  }

  const album = loadAlbum();
  const state = { query: '', place: 'all', sort: 'default' };

  const gridEl = document.getElementById('photoGrid');
  const emptyEl = document.getElementById('photoEmpty');
  const statsEl = document.getElementById('albumStats');
  const searchEl = document.getElementById('albumSearch');
  const placeEl = document.getElementById('albumPlace');
  const sortEl = document.getElementById('albumSort');
  if (!gridEl) return;

  // ===== currentList(): одоогийн шүүлтүүр, эрэмбэ тохируулгаар харагдах жагсаалт =====
  function currentList() {
    let list = album.photos;
    if (state.place !== 'all') list = filterByPlace(list, state.place);
    list = searchPhotos(list, state.query);
    if (state.sort === 'likes') list = sortByLikes(list);
    if (state.sort === 'title') list = sortByTitle(list);
    return list.map((photo) => updatePhoto(photo, { featured: album.isFeatured(photo.id) }));
  }

  // ===== БЭЛЭН: makeCard, renderCards (өөрчлөхгүй) =====
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text; // textContent: хэрэглэгчийн бичсэн текстийг аюулгүй гаргана
    return node;
  }

  function makeCard(photo) {
    const card = el('article', 'photo-card' + (photo.featured ? ' photo-card--featured' : ''));
    card.dataset.id = photo.id;

    const art = el('div', 'photo-card__art');
    art.style.setProperty('--hue', (photo.id * 47) % 360);
    if (photo.src) {
      const img = el('img', 'photo-card__img');
      img.src = photo.src;
      img.alt = photo.title;
      img.loading = 'lazy';
      art.append(img);
    }
    if (photo.featured) art.append(el('span', 'photo-card__badge', '★ Онцлох'));

    const meta = el('p', 'photo-card__meta', photo.place + (photo.date ? ' · ' + photo.date : ''));
    const tags = el('ul', 'photo-card__tags');
    photo.tags.forEach((tag) => tags.append(el('li', '', tag)));

    const like = el('button', 'photo-card__like', '♥ ' + photo.likes);
    like.type = 'button';
    like.dataset.id = photo.id;
    like.setAttribute('aria-label', `«${photo.title}» зургийг лайк дарах (одоо ${photo.likes})`);

    card.append(art, el('h3', 'photo-card__title', photo.title), meta, tags, like);
    return card;
  }

  function renderCards(list) {
    gridEl.replaceChildren(...list.map(makeCard));
    emptyEl.hidden = list.length > 0;
    const likes = list.map((p) => p.likes);
    statsEl.textContent = `${list.length} зураг · дундаж лайк ${average(...likes).toFixed(1)}`;
  }
  // ===== БЭЛЭН хэсгийн төгсгөл =====

  function refresh() {
    renderCards(currentList());
  }

  // Газрын сонголтыг цомгийн одоогийн газруудаар дүүргэнэ
  function fillPlaces() {
    const places = [...new Set(album.photos.map((p) => p.place))];
    const options = places.map((place) => {
      const option = el('option', '', place);
      option.value = place;
      return option;
    });
    const all = el('option', '', 'Бүгд');
    all.value = 'all';
    placeEl.replaceChildren(all, ...options);
    placeEl.value = places.includes(state.place) ? state.place : 'all';
    state.place = placeEl.value;
  }

  // ===== Listener-ууд =====
  // Like товч: бүх картыг нэг listener-ээр барина (event delegation)
  gridEl.addEventListener('click', (event) => {
    const button = event.target.closest('.photo-card__like');
    if (!button) return;
    const id = Number(button.dataset.id);
    album.like(id);
    saveAlbum();
    refresh();
    gridEl.querySelector(`.photo-card__like[data-id="${id}"]`)?.focus(); // дахин зурсны дараа фокус хэвээр
  });

  // Шүүлтүүр: хайлт, газар, эрэмбэ
  searchEl.addEventListener('input', (event) => {
    state.query = event.target.value;
    refresh();
  });
  placeEl.addEventListener('change', (event) => {
    state.place = event.target.value;
    refresh();
  });
  sortEl.addEventListener('change', (event) => {
    state.sort = event.target.value;
    refresh();
  });

  // Form (photoForm.js) энэ функцээр шинэ зураг нэмнэ
  window.albumApp = {
    addPhoto(photo) {
      const added = album.add(photo);
      saveAlbum();
      fillPlaces();
      refresh();
      return added;
    }
  };

  fillPlaces();
  refresh();
})();