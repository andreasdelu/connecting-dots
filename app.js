const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let dots = [];

let maxDots = 40;

class Dot {
	constructor(x = null, y = null) {
		this.id = Math.floor(Math.random() * canvas.width);
		this.x = x == null ? Math.floor(Math.random() * canvas.width) : x;
		this.y = y == null ? Math.floor(Math.random() * canvas.height) : y;
		this.size = Math.floor(Math.random()) + 4;
		this.speed = 0.1;
		this.direction = {
			x: Math.random() * (Math.round(Math.random()) ? this.speed : -this.speed),
			y: Math.random() * (Math.round(Math.random()) ? this.speed : -this.speed),
		};
		this.opacity = 0;
		this.lineOpacity = 0;
		this.maxDistance = 150;
	}
	draw() {
		if (this.opacity < 1) {
			this.opacity += 0.01;
		}
		context.beginPath();
		context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
		context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
		context.fill();
	}
	move() {
		this.x += this.direction.x;
		this.y += this.direction.y;
	}
	checkCollision() {
		if (this.x + this.size > canvas.width || this.x - this.size < 0) {
			this.direction.x *= -1;
			this.direction.y *= 1;
		}
		if (this.y + this.size > canvas.height || this.y - this.size < 0) {
			this.direction.x *= 1;
			this.direction.y *= -1;
		}

		let otherDots = dots.filter((dot) => dot.id != this.id);

		otherDots.forEach((dot) => {
			let distance = Math.sqrt(
				Math.pow(dot.x - this.x, 2) + Math.pow(dot.y - this.y, 2)
			);
			if (distance <= this.maxDistance) {
				this.createLine(dot.x, dot.y, distance);
			}
		});
	}
	createLine(x, y, distance) {
		this.lineOpacity = distance / -this.maxDistance + 1;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(this.x, this.y);
		context.strokeStyle = `rgba(200, 200, 200, ${this.lineOpacity})`;
		context.lineWidth = 1;
		context.stroke();
	}
}

for (let i = 0; i < maxDots; i++) {
	const dot = new Dot();
	dots.push(dot);
}

function renderLoop() {
	context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	dots.forEach((dot) => {
		dot.move();
		dot.checkCollision();
		dot.draw();
	});
	window.requestAnimationFrame(renderLoop);
}

window.requestAnimationFrame(renderLoop);

const getCursorPosition = (canvas, event) => {
	const x = event.clientX / 100;
	const y = event.clientY / canvas.height;
	console.log(x, y);
	/* const dot = new Dot(x, y);
    dots.push(dot) */
};
canvas.addEventListener("mousedown", (e) => {
	getCursorPosition(canvas, e);
});
