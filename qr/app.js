// QR-anchored AR label demo using BarcodeDetector (if available).
// Fallback: manual center placement if detector unsupported.
const $ = (s)=>document.querySelector(s);
const camera = $("#camera");
const label = $("#label");
const info = $("#info");
const helpPanel = $("#help");
const qs = new URLSearchParams(location.search);
$("#toggleInfo").onclick = ()=>{ info.classList.toggle('collapsed'); };
$("#reset").onclick = ()=>{ manualCenter(); };
document.querySelector(".help").onclick = (e)=>{ e.preventDefault(); helpPanel.classList.remove('hide'); };
$("#closeHelp").onclick = (e)=>{ e.preventDefault(); helpPanel.classList.add('hide'); };

// populate from query
$("#productName").textContent = qs.get('name') || "RE:VIVE COLA";
$("#ingredients").textContent = qs.get('ing') || "물, 탄산수, 카라멜색소, 천연향료";
$("#size").textContent = qs.get('size') || "500ml";
$("#event").textContent = qs.get('event') || "#FandomForEarth";

async function initCam(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: {ideal:'environment'} }, audio:false });
    camera.srcObject = stream;
    requestAnimationFrame(loop);
  }catch(e){
    alert("카메라 권한이 필요합니다: " + e.message);
  }
}
initCam();

let detector = null;
if ('BarcodeDetector' in window) {
  try {
    detector = new BarcodeDetector({formats: ['qr_code']});
  } catch(e){ detector = null; }
}

const cvs = document.createElement('canvas');
const ctx = cvs.getContext('2d', { willReadFrequently: true });

function manualCenter(){
  label.style.left = '50%';
  label.style.top = '55%';
  label.style.transform = 'translate(-50%,-50%) scale(1) rotate(0deg)';
}
manualCenter();

async function loop(){
  if (camera.readyState >= 2) {
    const vw = camera.videoWidth, vh = camera.videoHeight;
    if (vw && vh) {
      cvs.width = vw; cvs.height = vh;
      ctx.drawImage(camera, 0, 0, vw, vh);
      if (detector){
        try {
          const bitmap = await createImageBitmap(cvs);
          const codes = await detector.detect(bitmap);
          if (codes && codes.length){
            const c = codes[0];
            const poly = c.cornerPoints || c.cornerPoints; // standard field
            let x=vw/2, y=vh/2, w=300, ang=0;
            if (poly && poly.length>=4){
              const p0=poly[0], p1=poly[1], p2=poly[2];
              const dx = p1.x - p0.x, dy = p1.y - p0.y;
              ang = Math.atan2(dy,dx) * 180/Math.PI;
              const side = Math.hypot(dx,dy);
              w = Math.min(420, Math.max(160, side*2.2));
              x = (p0.x + p2.x)/2;
              y = (p0.y + p2.y)/2 - side*1.2;
            } else if (c.boundingBox){
              const bb = c.boundingBox;
              x = bb.x + bb.width/2;
              y = bb.y - bb.height*0.8;
              w = Math.min(420, Math.max(160, bb.width*2.2));
            }
            const scale = w / 360;
            const sx = window.innerWidth / vw;
            const sy = window.innerHeight / vh;
            const cx = x * sx;
            const cy = y * sy;
            label.style.width = `${Math.round(360*scale)}px`;
            label.style.left = `${cx}px`;
            label.style.top  = `${cy}px`;
            label.style.transform = `translate(-50%,-0%) rotate(${ang}deg)`;
          }
        } catch(_) {}
      }
    }
  }
  requestAnimationFrame(loop);
}

// Show help once
setTimeout(()=>{ helpPanel.classList.remove('hide'); }, 300);
