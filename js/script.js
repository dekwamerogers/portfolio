document.addEventListener('DOMContentLoaded', function() {
	const projectSections= document.querySelectorAll('.project-section');

	const observerOptions= {
		root: null,
		rootMargin: '0px',
		threshold: 0.2
	};

	const observer= new IntersectionObserver((entries, observer)=> {
		entries.forEach(entry=> {
			const detailsElement= entry.target.querySelector('.project-details');

			const isDesktop= window.innerWidth >=768;

			if (entry.isIntersecting) {
				if (isDesktop) {
					detailsElement.classList.add('is-visible');
				} else {

					detailsElement.classList.add('is-visible');
				}
			} else {

				if (isDesktop) {
					detailsElement.classList.remove('is-visible');
				}
			}
		});
	}, observerOptions);

	projectSections.forEach(section=> {
		observer.observe(section);
	});
});

const fadeInElements= document.querySelectorAll('.fade-in-element');
const buttons= document.querySelectorAll('.bounce-on-scroll');

const observer= new IntersectionObserver((entries)=> {
	entries.forEach(entry=> {
		if (entry.isIntersecting) {
			entry.target.classList.add('in-view');
			entry.target.dataset.inView= "true";
			observer.unobserve(entry.target);
		}
	});
}, {
	threshold: 0.2
});

fadeInElements.forEach(element=> {
	observer.observe(element);
});

buttons.forEach(element=> {
	observer.observe(element);
});