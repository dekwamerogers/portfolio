
        // Get the canvas element and its 2D rendering context
        const canvas = document.getElementById('aestheticCanvas');
        const ctx = canvas.getContext('2d');

        // Initialize canvas dimensions to the full window size
        canvas.width =  document.documentElement.clientWidth;

        canvas.height = document.documentElement.clientHeight;

        // Array to store star objects
        let stars = [];
        // Desired number of stars in the field
        console.log(window.innerWidth)

        if (window.innerWidth > 800){
             multi = 0.13;
        }
        else if (window.innerWidth > 400) {
            multi = 0.01;
        }
        else{
            multi = 0.1;
        }
           
        const starCount = window.innerWidth * multi; // Increased star count for a denser field

        // Object to store mouse coordinates, initialized outside the canvas
        // Mouse coordinates are 'undefined' when the mouse is not hovering.
        const mouse = {
            x: undefined,
            y: undefined
        };

        const mouseEventLayer = document.getElementById('header') || document.createElement('div');
        mouseEventLayer.addEventListener('mousemove', (event) => {
            // Pass event coordinates to your 'mouse' object
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });
        mouseEventLayer.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        // Distance threshold for stars to connect to the mouse
        const mouseConnectionDistance = 200; // Slightly increased for a larger interaction area
        // Distance threshold for stars to connect to other stars within the mouse's influence
        const starConnectionDistance = 100; // Adjusted for local connections

        /**
         * Initializes or re-initializes the stars array based on current canvas dimensions.
         * Each star gets a random position, radius, initial alpha (opacity),
         * a delta for its twinkling effect, and velocity for movement.
         */
        function initStars() {
            stars = []; // Clear existing stars
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,       // Random X within canvas width
                    y: Math.random() * canvas.height,      // Random Y within canvas height
                    radius: Math.random() * 1.5 + 2,     // Random radius between 0.5 and 2
                    alpha: Math.random(),                  // Random initial opacity between 0 and 1
                    // Random delta for twinkling, positive or negative (reduced range for smoother effect)
                    delta: (Math.random() * 0.02 + 0.003) * (Math.random() < 0.5 ? -1 : 1),
                    // Small random velocity for movement (positive or negative)
                    vx: (Math.random() * 0.5 - 0.1), // Velocity X between -0.1 and 0.1
                    vy: (Math.random() * 0.5 - 0.1)  // Velocity Y between -0.1 and 0.1
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
            const dx = x2 - x1;
            const dy = y2 - y1;
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
            // Clear the entire canvas for the next frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw and update all stars
            for (let star of stars) {
                // Update star position based on velocity
                star.x += star.vx;
                star.y += star.vy;

                // Handle wrap-around for X-coordinate
                if (star.x < 0) {
                    star.x = canvas.width;
                } else if (star.x > canvas.width) {
                    star.x = 0;
                }

                // Handle wrap-around for Y-coordinate
                if (star.y < 0) {
                    star.y = canvas.height;
                } else if (star.y > canvas.height) {
                    star.y = 0;
                }

                ctx.beginPath(); // Start a new path for the star
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); // Draw a circle
                ctx.fillStyle = `rgba(255, 100, 100, ${star.alpha})`; // Set fill color with current alpha
                ctx.shadowBlur = 10; // Add a glowing shadow effect
                ctx.shadowColor = '#bb86fc'; // Purple shadow color
                ctx.fill(); // Fill the star circle

                // Update alpha for twinkling effect
                star.alpha += star.delta;
                // Reverse direction of alpha change if bounds (0 or 1) are reached
                if (star.alpha <= 0 || star.alpha >= 1) {
                    star.delta *= -1;
                }
            }

            // Only draw lines (connections) if the mouse is currently hovering over the canvas
            if (mouse.x !== undefined && mouse.y !== undefined) {
                // Filter stars that are close enough to the mouse to be considered 'active' for connections
                const activeStars = [];
                for (let i = 0; i < stars.length; i++) {
                    const star = stars[i];
                    const distToMouse = getDistance(star.x, star.y, mouse.x, mouse.y);

                    if (distToMouse < mouseConnectionDistance) {
                        activeStars.push(star);

                        // Draw line from the active star to the mouse cursor
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        // Opacity of the line decreases as distance from mouse increases
                        ctx.strokeStyle = `rgba(187, 134, 252, ${1 - (distToMouse / mouseConnectionDistance)})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }

                // Draw lines between the 'active' stars themselves (those near the mouse)
                for (let i = 0; i < activeStars.length; i++) {
                    const star1 = activeStars[i];
                    // Start from i + 1 to avoid duplicate lines and connecting a star to itself
                    for (let j = i + 1; j < activeStars.length; j++) {
                        const star2 = activeStars[j];
                        const distBetweenStars = getDistance(star1.x, star1.y, star2.x, star2.y);

                        // Connect if the two active stars are within the starConnectionDistance
                        if (distBetweenStars < starConnectionDistance) {
                            ctx.beginPath();
                            ctx.moveTo(star1.x, star1.y);
                            ctx.lineTo(star2.x, star2.y);
                            // Opacity of the line decreases as distance between stars increases
                            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - (distBetweenStars / starConnectionDistance)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }

            // Request the next animation frame for a continuous loop
            requestAnimationFrame(draw);
        }

        // Initialize stars for the first time when the script loads
        initStars();
        // Start the animation loop
        draw();

        // Add event listener for window resize
        window.addEventListener('resize', () => {
            // Update canvas dimensions to match the new window size
             canvas.width =  document.documentElement.clientWidth;
        

        canvas.height = document.documentElement.clientHeight;
            // Re-initialize stars to fill the new canvas area evenly
            initStars();
            
        });

        // Add event listener for mouse movement on the canvas
        // Updates the mouse coordinates whenever the mouse moves
        canvas.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        // Add event listener for mouse leaving the canvas
        // Resets mouse coordinates, causing connections to disappear
        canvas.addEventListener('mouseleave', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    


