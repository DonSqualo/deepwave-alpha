const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');

console.log(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const islands = [
  { path: "M50,50 Q70,30 90,50 T130,90 Q150,110 130,130 T90,170 Q70,190 50,170 T10,130 Q-10,110 10,90 T50,50", x: 200, y: 200, radius: 200, places: generatePlaces(5, 100) },
  { path: "M50,50 Q70,30 90,50 T130,90 Q150,110 130,130 T90,170 Q70,190 50,170 T10,130 Q-10,110 10,90 T50,50", x: 800, y: 300, radius: 250, places: generatePlaces(7, 150) },
  { path: "M50,50 Q70,30 90,50 T130,90 Q150,110 130,130 T90,170 Q70,190 50,170 T10,130 Q-10,110 10,90 T50,50", x: 400, y: 600, radius: 220, places: generatePlaces(6, 120) },
  { path: "M50,50 Q70,30 90,50 T130,90 Q150,110 130,130 T90,170 Q70,190 50,170 T10,130 Q-10,110 10,90 T50,50", x: 1000, y: 800, radius: 240, places: generatePlaces(5, 140) },
  { path: "M50,50 Q70,30 90,50 T130,90 Q150,110 130,130 T90,170 Q70,190 50,170 T10,130 Q-10,110 10,90 T50,50", x: 600, y: 1000, radius: 260, places: generatePlaces(9, 160) }
];

let offsetX = 0;
let offsetY = 0;
let scale = 1;

function generatePlaces(count, radius) {
  const places = [];
  const angleStep = Math.PI * 2 / count;
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep;
    const distance = radius * (0.5 + Math.random() * 0.5);  // Randomize distance from center
    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);
    places.push({ name: `Headline ${i + 1}`, x, y });
  }
  return places;
}

function drawIsland(island) {

  const path = new Path2D(island.path);
  ctx.save();
  ctx.translate(island.x - 130, island.y - 130); // Adjust positioning if necessary
  ctx.fillStyle = '#3e8e41';  // Green fill
  ctx.fill(path);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#2C5F2D';  // Darker outline for comic style
  ctx.stroke(path);
  ctx.restore();

}

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  islands.forEach(island => {
    drawIsland(island);
    placeHeadlines(island.x, island.y, island.places);
  });

  ctx.restore();
}

function placeHeadlines(x, y, places) {
  places.forEach(place => {
    ctx.fillStyle = 'white';
    ctx.font = "20px Arial bold";
    ctx.fillText(place.name, x + 15 + place.x - ctx.measureText(place.name).width, y + place.y - 10);
  });
}


function onScroll(event) {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    const mouseX = (event.clientX - offsetX) / scale;
    const mouseY = (event.clientY - offsetY) / scale;

    const delta = event.deltaY * -0.013;
    const newScale = Math.min(Math.max(0.5, scale + delta), 10);

    offsetX -= mouseX * (newScale - scale);
    offsetY -= mouseY * (newScale - scale);

    scale = newScale;
    drawMap();
  }
}

function onDrag(event) {
  offsetX += event.movementX;
  offsetY += event.movementY;
  drawMap();
}

let isDragging = false;
let lastTouchX, lastTouchY, lastTouchDist;

canvas.addEventListener('wheel', onScroll, { passive: false });
canvas.addEventListener('mousedown', () => {
  isDragging = true;
  canvas.addEventListener('mousemove', onDrag);
});
canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.removeEventListener('mousemove', onDrag);
});
canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  canvas.removeEventListener('mousemove', onDrag);
});

canvas.addEventListener('touchstart', (event) => {
  event.preventDefault()
  if (event.touches.length === 1) {
    isDragging = true;
    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;
  } else if (event.touches.length === 2) {
    isDragging = false;
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    lastTouchDist = Math.sqrt(dx * dx + dy * dy);
  }
});

canvas.addEventListener('touchmove', (event) => {
  event.preventDefault()
  if (event.touches.length === 1 && isDragging) {
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    offsetX += touchX - lastTouchX;
    offsetY += touchY - lastTouchY;
    lastTouchX = touchX;
    lastTouchY = touchY;
    drawMap();
  } else if (event.touches.length === 2) {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const scaleChange = dist / lastTouchDist;
    const touchCenterX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
    const touchCenterY = (event.touches[0].clientY + event.touches[1].clientY) / 2;

    const mouseX = (touchCenterX - offsetX) / scale;
    const mouseY = (touchCenterY - offsetY) / scale;

    const newScale = Math.min(Math.max(0.5, scale * scaleChange), 3);

    offsetX -= mouseX * (newScale - scale);
    offsetY -= mouseY * (newScale - scale);

    scale = newScale;
    lastTouchDist = dist;
    drawMap();
  }
});

canvas.addEventListener('touchend', event => {
  event.preventDefault();
  isDragging = false;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawMap();
});

drawMap();
