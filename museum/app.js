// Museum AR Docent - QR-anchored label using BarcodeDetector
// Fallback: manual center placement if detector unsupported.
const $ = (s) => document.querySelector(s);
const camera = $("#camera");
const label = $("#label");
const info = $("#info");
const helpPanel = $("#help");
const qs = new URLSearchParams(location.search);

// UI Controls
$("#toggleInfo").onclick = () => { 
  info.classList.toggle('collapsed'); 
};

$("#reset").onclick = () => { 
  manualCenter(); 
};

document.querySelector(".help").onclick = (e) => { 
  e.preventDefault(); 
  helpPanel.classList.remove('hide'); 
};

$("#closeHelp").onclick = (e) => { 
  e.preventDefault(); 
  helpPanel.classList.add('hide'); 
};

$("#playAudio").onclick = () => {
  alert("🎧 음성 안내 기능은 준비 중입니다.\n\n실제 서비스에서는 유물에 대한 상세한 음성 설명을 들으실 수 있습니다.");
};

// Populate from query parameters (for demo flexibility)
$("#artifactName").textContent = qs.get('name') || "금동미륵보살반가사유상";
$("#period").textContent = qs.get('period') || "삼국시대 (7세기 전반)";
$("#material").textContent = qs.get('material') || "청동에 금도금";
$("#size").textContent = qs.get('size') || "높이 93.5cm";
$("#location").textContent = qs.get('location') || "국립중앙박물관 사유의 방";

// Camera initialization
async function initCam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: { ideal: 'environment' } }, 
      audio: false 
    });
    camera.srcObject = stream;
    requestAnimationFrame(loop);
  } catch (e) {
    alert("카메라 권한이 필요합니다: " + e.message);
  }
}
initCam();

// BarcodeDetector setup
let detector = null;
if ('BarcodeDetector' in window) {
  try {
    detector = new BarcodeDetector({ formats: ['qr_code'] });
    console.log("✅ BarcodeDetector 지원: QR 코드 자동 인식 활성화");
  } catch (e) { 
    detector = null; 
    console.log("⚠️ BarcodeDetector 초기화 실패");
  }
} else {
  console.log("⚠️ BarcodeDetector 미지원: 수동 배치 모드");
}

const cvs = document.createElement('canvas');
const ctx = cvs.getContext('2d', { willReadFrequently: true });

function manualCenter() {
  label.style.left = '50%';
  label.style.top = '55%';
  label.style.transform = 'translate(-50%,-50%) scale(1) rotate(0deg)';
}
manualCenter();

async function loop() {
  if (camera.readyState >= 2) {
    const vw = camera.videoWidth, vh = camera.videoHeight;
    if (vw && vh) {
      cvs.width = vw; 
      cvs.height = vh;
      ctx.drawImage(camera, 0, 0, vw, vh);
      
      if (detector) {
        try {
          const bitmap = await createImageBitmap(cvs);
          const codes = await detector.detect(bitmap);
          
          if (codes && codes.length) {
            const c = codes[0];
            const poly = c.cornerPoints || c.cornerPoints;
            let x = vw / 2, y = vh / 2, w = 300, ang = 0;
            
            if (poly && poly.length >= 4) {
              const p0 = poly[0], p1 = poly[1], p2 = poly[2];
              const dx = p1.x - p0.x, dy = p1.y - p0.y;
              ang = Math.atan2(dy, dx) * 180 / Math.PI;
              const side = Math.hypot(dx, dy);
              w = Math.min(420, Math.max(160, side * 2.2));
              x = (p0.x + p2.x) / 2;
              y = (p0.y + p2.y) / 2 - side * 1.2;
            } else if (c.boundingBox) {
              const bb = c.boundingBox;
              x = bb.x + bb.width / 2;
              y = bb.y - bb.height * 0.8;
              w = Math.min(420, Math.max(160, bb.width * 2.2));
            }
            
            const scale = w / 360;
            const sx = window.innerWidth / vw;
            const sy = window.innerHeight / vh;
            const cx = x * sx;
            const cy = y * sy;
            
            label.style.width = `${Math.round(360 * scale)}px`;
            label.style.left = `${cx}px`;
            label.style.top = `${cy}px`;
            label.style.transform = `translate(-50%,-0%) rotate(${ang}deg)`;
          }
        } catch (_) {}
      }
    }
  }
  requestAnimationFrame(loop);
}

// Show help on first load
setTimeout(() => { 
  helpPanel.classList.remove('hide'); 
}, 500);
