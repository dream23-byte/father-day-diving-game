let foundEquipment = [];
let currentEquipment = null;
let currentPhotoIndex = 0;
let equippedItems = {};

const EQUIPMENT_POSITIONS = {
  mask: 'eyes',
  goggles: 'face',
  snorkel: 'mouth',
  wetsuit: 'body',
  tank: 'back',
  fins: 'feet'
};

const screens = {
  start: document.getElementById('screen-start'),
  search: document.getElementById('screen-search'),
  question: document.getElementById('screen-question'),
  get: document.getElementById('screen-get'),
  equip: document.getElementById('screen-equip'),
  dive: document.getElementById('screen-dive'),
  photo: document.getElementById('screen-photo'),
  bubble: document.getElementById('screen-bubble'),
  postcard: document.getElementById('screen-postcard')
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function updateProgress() {
  const total = gameConfig.equipment.length;
  const found = foundEquipment.length;
  const percent = (found / total) * 100;
  document.getElementById('progress-fill').style.width = percent + '%';
  document.getElementById('progress-text').textContent = `已找到 ${found} / ${total} 件裝備`;
}

function assetUrl(path) {
  return path + '?v=' + gameConfig.version;
}

function renderEquipmentMap() {
  const map = document.getElementById('equipment-map');
  map.innerHTML = '';

  gameConfig.equipment.forEach(eq => {
    const item = document.createElement('div');
    item.className = 'equipment-item' + (foundEquipment.includes(eq.id) ? ' found' : '');
    item.style.left = eq.location.x + '%';
    item.style.top = eq.location.y + '%';

    const img = document.createElement('img');
    img.src = assetUrl(eq.icon);
    img.alt = eq.name;
    img.onerror = function() {
      this.style.display = 'none';
      item.textContent = '📦';
    };

    item.appendChild(img);
    item.addEventListener('click', () => startQuestion(eq));
    map.appendChild(item);
  });
}

function initCarousel(photos) {
  currentPhotoIndex = 0;
  updateCarouselImage(photos);
  renderCarouselDots(photos.length);
}

function updateCarouselImage(photos) {
  const img = document.getElementById('question-image');
  if (photos && photos.length > 0) {
    img.src = assetUrl(photos[currentPhotoIndex]);
    img.onerror = function() {
      this.style.display = 'none';
      this.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;">📸</div>';
    };
  }
}

function renderCarouselDots(count) {
  const dotsContainer = document.getElementById('carousel-dots');
  dotsContainer.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === currentPhotoIndex ? ' active' : '');
    dot.addEventListener('click', () => goToPhoto(i));
    dotsContainer.appendChild(dot);
  }
}

function goToPhoto(index) {
  const photos = currentEquipment.photos;
  if (index >= 0 && index < photos.length) {
    currentPhotoIndex = index;
    updateCarouselImage(photos);
    updateCarouselDots();
  }
}

function updateCarouselDots() {
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentPhotoIndex);
  });
}

function nextPhoto() {
  const photos = currentEquipment.photos;
  if (currentPhotoIndex < photos.length - 1) {
    goToPhoto(currentPhotoIndex + 1);
  }
}

function prevPhoto() {
  if (currentPhotoIndex > 0) {
    goToPhoto(currentPhotoIndex - 1);
  }
}

function startQuestion(eq) {
  currentEquipment = eq;
  document.getElementById('question-title').textContent = eq.name + ' - 回憶錄';
  document.getElementById('question-text').textContent = eq.question;

  const photos = eq.photos || (eq.photo ? [eq.photo] : []);
  initCarousel(photos);
  showScreen('question');
}

function answerQuestion(isCorrect) {
  if (isCorrect) {
    foundEquipment.push(currentEquipment.id);

    const getIcon = document.getElementById('get-icon');
    getIcon.innerHTML = '';
    const img = document.createElement('img');
    img.src = assetUrl(currentEquipment.icon);
    img.alt = currentEquipment.name;
    img.onerror = function() {
      this.style.display = 'none';
      getIcon.textContent = '📦';
    };
    getIcon.appendChild(img);

    document.getElementById('get-name').textContent = currentEquipment.name;
    showScreen('get');
  } else {
    showScreen('search');
  }
}

function checkAllFound() {
  if (foundEquipment.length >= gameConfig.equipment.length) {
    setTimeout(() => {
      showEquipScreen();
    }, 500);
  }
}

function showEquipScreen() {
  renderEquipmentPool();
  resetSlots();
  equippedItems = {};
  updateEquipProgress();
  document.getElementById('btn-dive').disabled = true;
  showScreen('equip');
}

function renderEquipmentPool() {
  const pool = document.getElementById('equipment-pool');
  pool.innerHTML = '';

  gameConfig.equipment.forEach(eq => {
    const item = document.createElement('div');
    item.className = 'draggable-equipment';
    item.dataset.id = eq.id;

    const img = document.createElement('img');
    img.src = assetUrl(eq.icon);
    img.alt = eq.name;
    img.onerror = function() {
      this.style.display = 'none';
      item.textContent = '📦';
    };

    item.appendChild(img);
    item.addEventListener('pointerdown', handleDragPointerDown);
    pool.appendChild(item);
  });
}

function resetSlots() {
  document.querySelectorAll('.body-part').forEach(slot => {
    slot.classList.remove('filled');
    slot.innerHTML = '<span class="slot-label">' + slot.querySelector('.slot-label')?.textContent + '</span>';
    const partName = slot.dataset.part;
    const label = getSlotLabel(partName);
    slot.innerHTML = '<span class="slot-label">' + label + '</span>';
  });
}

function getSlotLabel(part) {
  const labels = {
    eyes: '眼睛',
    face: '臉部',
    mouth: '嘴巴',
    body: '身體',
    back: '背部',
    feet: '腳'
  };
  return labels[part] || part;
}

let dragClone = null;
let dragEqId = null;

function handleDragPointerDown(e) {
  const item = e.target.closest('.draggable-equipment');
  if (!item || item.classList.contains('placed')) return;

  e.preventDefault();
  dragEqId = item.dataset.id;

  dragClone = item.cloneNode(true);
  dragClone.classList.add('dragging');
  const rect = item.getBoundingClientRect();
  dragClone.style.width = rect.width + 'px';
  dragClone.style.height = rect.height + 'px';
  dragClone.style.left = (e.clientX - rect.width / 2) + 'px';
  dragClone.style.top = (e.clientY - rect.height / 2) + 'px';
  document.body.appendChild(dragClone);

  try { item.setPointerCapture(e.pointerId); } catch (err) {}

  item.addEventListener('pointermove', handleDragPointerMove);
  item.addEventListener('pointerup', handleDragPointerUp);
  item.addEventListener('pointercancel', handleDragPointerCancel);
}

function handleDragPointerMove(e) {
  e.preventDefault();
  if (!dragClone) return;

  const rect = dragClone.getBoundingClientRect();
  dragClone.style.left = (e.clientX - rect.width / 2) + 'px';
  dragClone.style.top = (e.clientY - rect.height / 2) + 'px';

  document.querySelectorAll('.body-part').forEach(slot => {
    const sr = slot.getBoundingClientRect();
    const hit = e.clientX >= sr.left && e.clientX <= sr.right && e.clientY >= sr.top && e.clientY <= sr.bottom;
    slot.classList.toggle('highlight', hit);
  });
}

function handleDragPointerUp(e) {
  e.preventDefault();
  cleanupDragListeners(e);

  if (!dragClone) return;

  const target = document.elementFromPoint(e.clientX, e.clientY);
  const slot = target ? target.closest('.body-part') : null;
  document.querySelectorAll('.body-part').forEach(s => s.classList.remove('highlight'));

  if (slot && slot.dataset.part === EQUIPMENT_POSITIONS[dragEqId]) {
    placeEquipment(dragEqId, slot);
  }

  dragClone.remove();
  dragClone = null;
  dragEqId = null;
}

function handleDragPointerCancel(e) {
  cleanupDragListeners(e);
  if (dragClone) {
    dragClone.remove();
    dragClone = null;
    dragEqId = null;
  }
  document.querySelectorAll('.body-part').forEach(s => s.classList.remove('highlight'));
}

function cleanupDragListeners(e) {
  const item = e.target && e.target.closest ? e.target.closest('.draggable-equipment') : null;
  if (item) {
    item.removeEventListener('pointermove', handleDragPointerMove);
    item.removeEventListener('pointerup', handleDragPointerUp);
    item.removeEventListener('pointercancel', handleDragPointerCancel);
  }
}

function placeEquipment(eqId, slot) {
  const eq = gameConfig.equipment.find(e => e.id === eqId);
  if (!eq) return;

  slot.classList.add('filled');
  slot.innerHTML = '<img src="' + assetUrl(eq.icon) + '" alt="' + eq.name + '" style="width:100%;height:100%;object-fit:contain;">';

  const poolItem = document.querySelector('.draggable-equipment[data-id="' + eqId + '"]');
  if (poolItem) {
    poolItem.classList.add('placed');
  }

  equippedItems[eqId] = true;
  updateEquipProgress();
}

function updateEquipProgress() {
  const total = gameConfig.equipment.length;
  const equipped = Object.keys(equippedItems).length;
  document.getElementById('equip-progress').textContent = `已穿戴 ${equipped} / ${total} 件裝備`;

  if (equipped >= total) {
    document.getElementById('btn-dive').disabled = false;
  }
}

function showBubbleTransition() {
  showScreen('bubble');
  setTimeout(() => {
    showPostcard();
  }, 3500);
}

function showPostcard() {
  const pc = gameConfig.postcard;
  document.getElementById('postcard-message').textContent = pc.message;
  document.getElementById('postcard-address').textContent = pc.address;
  document.getElementById('postcard-stamp').textContent = pc.stamp;
  showScreen('postcard');
}

function restartGame() {
  foundEquipment = [];
  currentEquipment = null;
  currentPhotoIndex = 0;
  equippedItems = {};
  updateProgress();
  renderEquipmentMap();
  showScreen('start');
}

document.getElementById('btn-start').addEventListener('click', () => {
  renderEquipmentMap();
  updateProgress();
  showScreen('search');
});

document.querySelectorAll('.btn-answer').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.dataset.answer;
    answerQuestion(answer === 'correct');
  });
});

document.getElementById('btn-continue').addEventListener('click', () => {
  if (foundEquipment.length >= gameConfig.equipment.length) {
    showEquipScreen();
  } else {
    renderEquipmentMap();
    updateProgress();
    showScreen('search');
  }
});

document.getElementById('carousel-prev').addEventListener('click', prevPhoto);
document.getElementById('carousel-next').addEventListener('click', nextPhoto);

document.getElementById('btn-dive').addEventListener('click', () => {
  showScreen('dive');
});

document.getElementById('btn-photo').addEventListener('click', () => {
  const resultImg = document.getElementById('photo-result');

  const defaultPhoto = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280">
      <defs>
        <linearGradient id="ocean" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#87CEEB"/>
          <stop offset="50%" style="stop-color:#40E0D0"/>
          <stop offset="100%" style="stop-color:#20B2AA"/>
        </linearGradient>
      </defs>
      <rect fill="url(#ocean)" width="280" height="280"/>
      <text x="140" y="100" text-anchor="middle" font-size="60">🤿</text>
      <text x="80" y="200" text-anchor="middle" font-size="40">🐟</text>
      <text x="140" y="180" text-anchor="middle" font-size="50">👨‍👧</text>
      <text x="200" y="200" text-anchor="middle" font-size="40">🐠</text>
    </svg>
  `);

  resultImg.src = defaultPhoto;
  showScreen('photo');
});

document.getElementById('btn-bubble').addEventListener('click', showBubbleTransition);
document.getElementById('btn-restart').addEventListener('click', restartGame);

document.title = gameConfig.siteTitle;
