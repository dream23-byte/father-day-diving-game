let foundEquipment = [];
let currentEquipment = null;
let currentPhotoIndex = 0;
let equippedItems = {};
let draggedItem = null;

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

function renderEquipmentMap() {
  const map = document.getElementById('equipment-map');
  map.innerHTML = '';

  gameConfig.equipment.forEach(eq => {
    const item = document.createElement('div');
    item.className = 'equipment-item' + (foundEquipment.includes(eq.id) ? ' found' : '');
    item.style.left = eq.location.x + '%';
    item.style.top = eq.location.y + '%';

    const img = document.createElement('img');
    img.src = eq.icon;
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
    img.src = photos[currentPhotoIndex];
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
    img.src = currentEquipment.icon;
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
    item.draggable = true;

    const img = document.createElement('img');
    img.src = eq.icon;
    img.alt = eq.name;
    img.onerror = function() {
      this.style.display = 'none';
      item.textContent = '📦';
    };

    item.appendChild(img);
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
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

function handleDragStart(e) {
  draggedItem = e.target.closest('.draggable-equipment');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedItem.dataset.id);
}

function handleTouchStart(e) {
  draggedItem = e.target.closest('.draggable-equipment');
  if (!draggedItem) return;

  const touch = e.touches[0];
  const rect = draggedItem.getBoundingClientRect();

  draggedItem.style.position = 'fixed';
  draggedItem.style.left = (touch.clientX - rect.width / 2) + 'px';
  draggedItem.style.top = (touch.clientY - rect.height / 2) + 'px';
  draggedItem.style.zIndex = '1000';
  draggedItem.style.pointerEvents = 'none';

  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!draggedItem) return;

  const touch = e.touches[0];
  const rect = draggedItem.getBoundingClientRect();

  draggedItem.style.left = (touch.clientX - rect.width / 2) + 'px';
  draggedItem.style.top = (touch.clientY - rect.height / 2) + 'px';

  document.querySelectorAll('.body-part').forEach(slot => {
    const slotRect = slot.getBoundingClientRect();
    if (isOverlapping(touch.clientX, touch.clientY, slotRect)) {
      slot.classList.add('highlight');
    } else {
      slot.classList.remove('highlight');
    }
  });
}

function handleTouchEnd(e) {
  if (!draggedItem) return;

  const touch = e.changedTouches[0];
  const eqId = draggedItem.dataset.id;
  const correctSlot = EQUIPMENT_POSITIONS[eqId];

  let dropped = false;

  document.querySelectorAll('.body-part').forEach(slot => {
    const slotRect = slot.getBoundingClientRect();
    if (isOverlapping(touch.clientX, touch.clientY, slotRect)) {
      if (slot.dataset.part === correctSlot) {
        placeEquipment(eqId, slot);
        dropped = true;
      } else {
        slot.classList.remove('highlight');
      }
    }
    slot.classList.remove('highlight');
  });

  if (!dropped) {
    returnDraggable(draggedItem);
  }

  draggedItem.style.position = '';
  draggedItem.style.left = '';
  draggedItem.style.top = '';
  draggedItem.style.zIndex = '';
  draggedItem.style.pointerEvents = '';

  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleTouchEnd);
  draggedItem = null;
}

function isOverlapping(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function returnDraggable(item) {
  item.style.opacity = '';
}

function placeEquipment(eqId, slot) {
  const eq = gameConfig.equipment.find(e => e.id === eqId);
  if (!eq) return;

  slot.classList.add('filled');
  slot.innerHTML = '<img src="' + eq.icon + '" alt="' + eq.name + '" style="width:100%;height:100%;object-fit:contain;">';

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

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
  e.preventDefault();
  if (!draggedItem) return;

  const eqId = draggedItem.dataset.id;
  const correctSlot = EQUIPMENT_POSITIONS[eqId];
  const slot = e.target.closest('.body-part');

  if (slot && slot.dataset.part === correctSlot) {
    placeEquipment(eqId, slot);
  } else if (slot) {
    slot.classList.remove('highlight');
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

document.querySelectorAll('.body-part').forEach(slot => {
  slot.addEventListener('dragover', handleDragOver);
  slot.addEventListener('drop', handleDrop);
  slot.addEventListener('dragenter', (e) => {
    e.preventDefault();
    slot.classList.add('highlight');
  });
  slot.addEventListener('dragleave', () => {
    slot.classList.remove('highlight');
  });
});

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
