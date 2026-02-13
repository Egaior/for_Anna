const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
const messageElement = document.getElementById('message');
const bgMusic = document.getElementById('bgMusic');

let width, height;
let stars = [];
const starCount = 1000;

let speed = 0.1;
let targetSpeed = 0.1;
let isAccelerating = false;
let warpFactor = 0;

let musicStarted = false;

/* ============================= */
/* ФРАЗИ */
/* ============================= */

const phrases = [
"Привіт, серденько",
"Не те що б мені потрібен був якийсь привід що б казати тобі про те що ти завжди в моїх думках, але...)",
"Ти — теплий промінь світла посеред мороку довкола",
"Ти — надзвичайно важлива для мене людина",
"Ти — неймовірно прекрасна, добра, чуйна і турботлива",
"Кожен день я прокидаюсь і засинаю з думками про тебе",
"Завдяки тобі я бачу світ під різними кутами, постійно вивчаю щось нове і торкаюсь тем про котрі раніше навіть не думав",
"Ти, без перебільшення, моє натхнення",
"Ти — мій спокій, моя тиша та мій затишок",
"Ти — обійми, котрі не хочеться ніколи розтискати",
"Ти — теплий погляд неймовірно прекрасних очей, від якого в голові все збирається докупи",
"Ти — 1001 маленьких рухів, деталей та тонких ліній котрими я милуюсь постійно",
"Я завжди поруч",
"Я завжди в твоїй команді",
"Я обожнюю твій голос, те як ти мислиш і про що мрієш",
"І я обожнюю темну сторону інтернету котру ти мені приносиш)",
"І теорії змови)",
"Та якщо бути відвертим я взагалі все з тобою пов’язане обожнюю",
"Неймовірно щасливий що можу йти з тобою поруч тримаючи за руку в усіх можливих сенсах",
"Ти — прекрасна людина, неймовірно вродлива дівчина і особистість з котрої багато в чому я хочу брати приклад",
"І байдуже яка сьогодні дата. Я кохаю тебе кожен день ❤️"
];

let currentPhraseIndex = -1;
let isTransitioning = false;

/* ============================= */
/* RESIZE */
/* ============================= */

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

/* ============================= */
/* ЗІРКИ */
/* ============================= */

class Star {
    constructor() { this.reset(true); }

    reset(randomZ = false) {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = randomZ ? Math.random() * width : width;
        this.pz = this.z;
    }

    update() {
        this.z -= speed * (width * 0.02);
        if (this.z < 1) {
            this.reset();
            this.z = width;
            this.pz = width;
        }
    }

    draw() {
        const x = (this.x / this.z) * width + width / 2;
        const y = (this.y / this.z) * height + height / 2;
        const size = (1 - this.z / width) * 3;

        if (x < 0 || x > width || y < 0 || y > height) return;

        const px = (this.x / this.pz) * width + width / 2;
        const py = (this.y / this.pz) * height + height / 2;
        this.pz = this.z;

        const opacity = (1 - this.z / width);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;

        if (isAccelerating && warpFactor > 0.1) {
            ctx.lineWidth = size * warpFactor * 0.8;
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
}

/* ============================= */
/* СЕРЦЯ */
/* ============================= */

let hearts = [];
let showHearts = false;

class Heart {
    constructor() {
        this.x = Math.random() * width;
        this.y = height + 20;
        this.size = Math.random() * 15 + 10;
        this.speedY = Math.random() * 1 + 0.5;
        this.opacity = 1;
    }

    update() {
        this.y -= this.speedY;
        this.opacity -= 0.003;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "rgba(255, 100, 150, 1)";
        ctx.beginPath();

        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(this.x - this.size, this.y - this.size,
                          this.x - this.size * 1.5, this.y + this.size / 2,
                          this.x, this.y + this.size);

        ctx.bezierCurveTo(this.x + this.size * 1.5, this.y + this.size / 2,
                          this.x + this.size, this.y - this.size,
                          this.x, this.y);

        ctx.fill();
        ctx.restore();
    }
}

/* ============================= */
/* АНІМАЦІЯ */
/* ============================= */

function animate() {
    ctx.clearRect(0, 0, width, height);

    if (isAccelerating) {
        speed += (targetSpeed - speed) * 0.04;
        warpFactor += (1 - warpFactor) * 0.04;
    } else {
        speed += (0.1 - speed) * 0.05;
        warpFactor += (0 - warpFactor) * 0.05;
    }

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    if (showHearts) {
        if (Math.random() < 0.05) hearts.push(new Heart());

        hearts.forEach((heart, index) => {
            heart.update();
            heart.draw();
            if (heart.opacity <= 0) hearts.splice(index, 1);
        });
    }

    requestAnimationFrame(animate);
}
animate();

/* ============================= */
/* ПЕРЕХІД ФРАЗ */
/* ============================= */

function nextPhrase() {
    if (isTransitioning) return;
    isTransitioning = true;

    messageElement.classList.remove('visible');

    isAccelerating = true;
    targetSpeed = 3.5;

    setTimeout(() => {

        currentPhraseIndex++;
        if (currentPhraseIndex >= phrases.length) {
            currentPhraseIndex = 0;
        }

        messageElement.innerHTML = phrases[currentPhraseIndex];

        if (currentPhraseIndex === phrases.length - 1) {
            document.body.classList.add('final-scene');
            showHearts = true;
        } else {
            document.body.classList.remove('final-scene');
            showHearts = false;
        }

        isAccelerating = false;

        setTimeout(() => {
            messageElement.classList.add('visible');
            isTransitioning = false;
        }, 1000);

    }, 1600);
}

/* ============================= */
/* ПРАВИЛЬНИЙ ЗАПУСК МУЗИКИ */
/* ============================= */

function handleInteraction(e) {
    e.preventDefault();

    // Музика запускається одразу при першому кліку
    if (!musicStarted) {
        musicStarted = true;
        bgMusic.volume = 1;
        bgMusic.play().catch(() => {});
    }

    nextPhrase();
}

document.body.addEventListener('click', handleInteraction);
document.body.addEventListener('touchstart', handleInteraction, { passive: false });

setTimeout(() => {
    messageElement.classList.add('visible');
}, 600);
