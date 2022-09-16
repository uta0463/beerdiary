const ScrollFadeIn = () => {
  const callback = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-slideIn');
      }
    })
  }

  const observer = new IntersectionObserver(callback, { threshold: 0.2 });

  const targets = document.querySelectorAll('.u__animation__fadeIn');
  targets.forEach((target) => {
    observer.observe(target);
  });
}

export default ScrollFadeIn;