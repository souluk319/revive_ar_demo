// Minimal 'AR-like' demo: camera preview + draggable/rotatable/scalable label
const qs = new URLSearchParams(location.search);
const $ = (s) => document.querySelector(s);
const camera = $("#camera");
const label = $("#label");
const info = $("#info");
const productName = $("#productName");
const ingredients = $("#ingredients");
const sizeEl = $("#size");
const eventEl = $("#event");
const artwork = $("#artwork");
const toast = $("#toast");

// populate from query
productName.textContent = qs.get('name') || "RE:VIVE COLA";
ingredients.textContent = qs.get('ing') || "물, 탄산수, 카라멜색소, 천연향료";
sizeEl.textContent = qs.get('size') || "500ml";
eventEl.textContent = qs.get('event') || "#FandomForEarth";
const img = qs.get('img');
if (img) { artwork.style.background = `center/cover no-repeat url(${img})`; artwork.textContent = ''; }

// camera
async function initCam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
    camera.srcObject = stream;
  } catch (e) {
    showToast('카메라 권한이 필요합니다. 브라우저 설정을 확인하세요.');
  }
}
initCam();

// UI actions
$("#toggleInfo").onclick = () => { info.classList.toggle('collapsed'); };
$("#recenter").onclick = () => { label.style.left = '50%'; label.style.top = '55%'; label.style.transform = 'translate(-50%,-50%) rotate(0deg) scale(1)'; };
$("#closeHelp").onclick = () => { $("#help-panel").classList.add('hide'); };
$("#help").onclick = () => { $("#help-panel").classList.remove('hide'); };

$("#recycleBtn").onclick = () => {
  showToast('분리수거 인증: 리워드가 지급되었습니다 (데모).');
};

// gestures (drag / pinch-zoom / rotate)
let state = { x: 0, y: 0, scale: 1, rot: 0, dx: 0, dy: 0, fingers: [] };
function setTransform() {
  label.style.transform = `translate(-50%, -50%) rotate(${state.rot}deg) scale(${state.scale})`;
  label.style.left = `calc(50% + ${state.x}px)`;
  label.style.top = `calc(55% + ${state.y}px)`;
}

function onPointerDown(e) {
  label.setPointerCapture(e.pointerId);
  state.fingers.push({ id: e.pointerId, x: e.clientX, y: e.clientY });
}
function onPointerUp(e) {
  state.fingers = state.fingers.filter(f => f.id !== e.pointerId);
}
function onPointerMove(e) {
  if (!state.fingers.find(f => f.id === e.pointerId)) return;
  const idx = state.fingers.findIndex(f => f.id === e.pointerId);
  state.fingers[idx] = { id: e.pointerId, x: e.clientX, y: e.clientY };
  if (state.fingers.length === 1) {
    // drag
    const f = state.fingers[0];
    state.x += e.movementX;
    state.y += e.movementY;
  } else if (state.fingers.length >= 2) {
    const [a, b] = state.fingers;
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx) * 180 / Math.PI;
    if (!state.base) { state.base = { dist, ang, x: state.x, y: state.y, scale: state.scale, rot: state.rot }; }
    const scale = Math.min(2.5, Math.max(0.5, state.base.scale * (dist / state.base.dist)));
    const rot = state.base.rot + (ang - state.base.ang);
    state.scale = scale; state.rot = rot;
  }
  setTransform();
}
function onPointerCancel() {
  state.fingers = [];
  state.base = null;
}
label.addEventListener('pointerdown', onPointerDown);
label.addEventListener('pointerup', onPointerUp);
label.addEventListener('pointermove', onPointerMove);
label.addEventListener('pointercancel', onPointerCancel);
label.addEventListener('pointerleave', onPointerCancel);

$("#screenshot").onclick = async () => {
  const canvas = document.createElement('canvas');
  canvas.width = camera.videoWidth; canvas.height = camera.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
  const rect = label.getBoundingClientRect();
  // render label to canvas (approximate via html2canvas-less approach: simple box)
  ctx.save();
  // draw a rounded rect background reflecting label position approx (not exact transform in demo)
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#ffffff';
  const pad = 12;
  const x = rect.left, y = rect.top, w = rect.width, h = rect.height;
  // scale from CSS pixel to video pixel
  const sx = canvas.width / window.innerWidth;
  const sy = canvas.height / window.innerHeight;
  roundRect(ctx, x * sx, y * sy, w * sx, h * sy, 18);
  ctx.fill();
  ctx.restore();
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url; a.download = 'revive_ar_screenshot.png'; a.click();
  showToast('스크린샷을 저장했습니다.');
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hide');
  setTimeout(() => toast.classList.add('hide'), 1600);
}

// If opened without user gesture, prompt help once
// setTimeout(()=>{ if(!qs.has('name')) { document.getElementById('help-panel').classList.remove('hide'); } }, 400);

// If opened without user gesture, prompt help once
setTimeout(() => {
  if (!qs.has('name')) {
    document.getElementById('help-panel').classList.remove('hide');
  }
}, 400);

// 🧩 수정된 도움말 열기/닫기 이벤트 (이 부분을 바로 아래에 추가)
document.getElementById('help').onclick = (e) => {
  e.preventDefault();
  document.getElementById('help-panel').classList.remove('hide');
};

document.getElementById('closeHelp').onclick = (e) => {
  e.preventDefault();
  document.getElementById('help-panel').classList.add('hide');
};
