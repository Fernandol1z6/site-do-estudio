gsap.registerPlugin(ScrollTrigger);

gsap.to("header", {
    scrollTrigger: {
        trigger: "header",
        start: "top top",
        end: 200,
        scrub: true,
    },
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
});
gsap.to(".logo", {
    scrollTrigger: {
        trigger: "header",
        start: "top top",
        end: 200,
        scrub: true,
    },
    color: "#000000ea"

});
gsap.to(".nav-links a", {
    scrollTrigger: {
        trigger: "header",
        start: "top top",
        end: 200,
        scrub: true,
    },
    color: "#050505ff",
});

gsap.utils.toArray(".parallax-item").forEach(item => {
    gsap.to(item, {
        scrollTrigger: {
            trigger: item,
            scrub: true,
            start: "top bottom",
            end: "bottom top",
        },
        backgroundPosition: "center 80%",
        ease: "none"
    });
});

gsap.utils.toArray(".reveal-item").forEach(item => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const galeriaItems = document.querySelectorAll(".galeria-item");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add("loaded");
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: "0px 0px -100px 0px"
    });

    galeriaItems.forEach(img => {
        observer.observe(img);
    });
});