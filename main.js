// Based on https://stackoverflow.com/questions/12700731/extract-path-from-text-html-canvas/30204783#30204783

let context = document.querySelector("canvas").getContext("2d");
let words = ['API', 'Impact', 'Data', 'Design', 'Tech'];
let w = context.canvas.width;
let h = context.canvas.height;
let bubbles = [];
const bubbles_max = 500;

context.font = "18px Poppins";
context.textAlign = "center";
// context.globalAlpha = 0.8;

let random_int = size => Math.floor(Math.random() * size);
let current_text;

window.onload = function () {
  generate();
  requestAnimationFrame(animate);
};

function generate() {
  let text;
  do {
    text = words[random_int(words.length)];
  } while (current_text === text);
  current_text = text;

  let radius = 3;
  bubbles = []; // clear array
  context.clearRect(0, 0, w, h);
  // context.fillText(text, context.measureText(text).width / 2, 20);
  context.fillText(text, 32, 20);

  let data = context.getImageData(0, 0, w, h).data.buffer;
  let data32 = new Uint32Array(data); //uint32 for speed

  for (let i = 0; i < data32.length; i++) {
    if (data32[i] & 0xff000000) { // only if alpha mask == 255 (solid)
      bubbles.push({
        x: (i % w) * radius * 2 + radius + (Math.random() - 0.5) * radius,
        y: (i / w) * radius * 2 + radius + (Math.random() - 0.5) * radius,
        radius: radius + (Math.random() - 0.5) * radius / 2,
        alpha: 0.5 + Math.random() * 0.5,
        count: Math.random() * 1000
      });
    }
  }
  // //randomly pull some points out
  // for (let i = 0; i < bubbles.length - bubbles_max; i++) {
  //   bubbles.splice(random_int(bubbles.length), 1);
  // }
}

let bubble, x, y, radius; //, rgValue;
let frame_count = 0;

function animate() {
  context.clearRect(0, 0, w, h);
  // context.fillStyle = '#E9337D';

  for (let i = 0, bubble; i < bubbles.length; i++) {
    context.beginPath();

    bubble = bubbles[i];
    x = bubble.x + Math.sin(bubble.count * 0.04) + bubble.radius;
    y = bubble.y + Math.cos(bubble.count * 0.04) + bubble.radius;
    radius = bubble.radius; //+ Math.sin(bubble.count * 0.01) + bubble.radius / 10;
    bubble.count++;

    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.closePath();

    context.fillStyle = `rgba(237,46,124,${bubble.alpha})`;
    context.fill();
  }

  frame_count++;
  if (frame_count >= 500) {
    generate();
    frame_count = 0;
  }

  requestAnimationFrame(animate);
}
