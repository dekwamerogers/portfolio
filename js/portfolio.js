const canvas= document.getElementById('aestheticCanvas');
const ctx= canvas.getContext('2d');

canvas.width= window.innerWidth;

canvas.height= window.innerHeight;

let stars=[];

if (window.innerWidth > 800) {
	multi= 0.13;
} else if (window.innerWidth > 400) {
	multi= 0.01;
} else {
	multi= 0.1;
}

const starCount= window.innerWidth * multi;

const mouse= {
	x: undefined,
	y: undefined
};

const mouseEventLayer= document.getElementById('header') || document.createElement('div');
mouseEventLayer.addEventListener('mousemove', (event)=> {

	mouse.x= event.clientX;
	mouse.y= event.clientY;
});
mouseEventLayer.addEventListener('mouseleave', ()=> {
	mouse.x= undefined;
	mouse.y= undefined;
});

const mouseConnectionDistance= 200;
const starConnectionDistance= 100;

/**
 * Initializes or re-initializes the stars array based on current canvas dimensions.
 * Each star gets a random position, radius, initial alpha (opacity),
 * a delta for its twinkling effect, and velocity for movement.
 */
function initStars() {
	stars=[];
	for (let i= 0; i < starCount; i++) {
		stars.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: Math.random() * 1.5 + 2,
			alpha: Math.random(),

			delta: (Math.random() * 0.02 + 0.003) * (Math.random() < 0.5 ? -1 : 1),

			vx: (Math.random() * 0.5 - 0.1),
			vy: (Math.random() * 0.5 - 0.1)
		});
	}
}

/**
 * Calculates the Euclidean distance between two points (x1, y1) and (x2, y2).
 * @param {number} x1 - X coordinate of the first point.
 * @param {number} y1 - Y coordinate of the first point.
 * @param {number} x2 - X coordinate of the second point.
 * @param {number} y2 - Y coordinate of the second point.
 * @returns {number} The distance between the two points.
 */
function getDistance(x1, y1, x2, y2) {
	const dx= x2 - x1;
	const dy= y2 - y1;
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Draws the stars on the canvas and updates their twinkling and movement effects.
 * Only draws connection lines between stars and to the mouse cursor
 * when the mouse is hovering over the canvas.
 * Clears the canvas, then iterates through each star to draw it.
 * Updates alpha for twinkling, updates position for movement, and handles boundary wrap-around.
 * Uses requestAnimationFrame for smooth animation.
 */
function draw() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let star of stars) {

		star.x += star.vx;
		star.y += star.vy;

		if (star.x < 0) {
			star.x= canvas.width;
		} else if (star.x > canvas.width) {
			star.x= 0;
		}

		if (star.y < 0) {
			star.y= canvas.height;
		} else if (star.y > canvas.height) {
			star.y= 0;
		}

		ctx.beginPath();
		ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
		ctx.fillStyle= `rgba(220, 53, 69, ${star.alpha})`;
		ctx.shadowBlur= 10;
		ctx.shadowColor= '#bb86fc';
		ctx.fill();

		star.alpha += star.delta;

		if (star.alpha <= 0 || star.alpha >= 1) {
			star.delta *= -1;
		}
	}

	if (mouse.x!== undefined && mouse.y!== undefined) {

		const activeStars=[];
		for (let i= 0; i < stars.length; i++) {
			const star= stars[i];
			const distToMouse= getDistance(star.x, star.y, mouse.x, mouse.y);

			if (distToMouse < mouseConnectionDistance) {
				activeStars.push(star);

				ctx.beginPath();
				ctx.moveTo(star.x, star.y);
				ctx.lineTo(mouse.x, mouse.y);

				ctx.strokeStyle= `rgba(187, 134, 252, ${1 - (distToMouse/mouseConnectionDistance)})`;
				ctx.lineWidth= 1.2;
				ctx.stroke();
			}
		}

		for (let i= 0; i < activeStars.length; i++) {
			const star1= activeStars[i];

			for (let j= i + 1; j < activeStars.length; j++) {
				const star2= activeStars[j];
				const distBetweenStars= getDistance(star1.x, star1.y, star2.x, star2.y);

				if (distBetweenStars < starConnectionDistance) {
					ctx.beginPath();
					ctx.moveTo(star1.x, star1.y);
					ctx.lineTo(star2.x, star2.y);

					ctx.strokeStyle= `rgba(255, 255, 255, ${1 - (distBetweenStars/starConnectionDistance)})`;
					ctx.lineWidth= 0.5;
					ctx.stroke();
				}
			}
		}
	}

	requestAnimationFrame(draw);
}

initStars();

draw();

window.addEventListener('resize', ()=> {

	canvas.width= window.innerWidth;

	canvas.height= window.innerHeight;

	initStars();

});

canvas.addEventListener('mousemove', (event)=> {
	mouse.x= event.clientX;
	mouse.y= event.clientY;
});

canvas.addEventListener('mouseleave', ()=> {
	mouse.x= undefined;
	mouse.y= undefined;
});