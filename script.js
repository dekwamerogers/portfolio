document.addEventListener('DOMContentLoaded', function () {
    const projectSections = document.querySelectorAll('.project-section');

    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: '0px',
        threshold: 0.2 // When 20% of the target element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const detailsElement = entry.target.querySelector('.project-details');
            
            // Check if it's a desktop viewport (md breakpoint and up in Bootstrap)
            // This ensures the animation only triggers on larger screens
            const isDesktop = window.innerWidth >= 768; 

            if (entry.isIntersecting) {
                if (isDesktop) {
                    detailsElement.classList.add('is-visible');
                } else {
                    // Ensure it's visible on mobile without animation
                    detailsElement.classList.add('is-visible'); 
                }
            } else {
                // Optional: Remove 'is-visible' when section leaves viewport
                // This allows the animation to re-trigger if you scroll up and down
                // If you want it to appear once and stay, remove this 'else' block.
                if (isDesktop) {
                    detailsElement.classList.remove('is-visible');
                }
            }
        });
    }, observerOptions);

    // Observe each project section
    projectSections.forEach(section => {
        observer.observe(section);
    });
});