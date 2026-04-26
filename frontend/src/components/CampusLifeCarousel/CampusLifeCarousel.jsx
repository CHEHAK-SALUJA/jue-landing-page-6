import { useState, useRef } from 'react';
import { campusLifeImages } from '../../data/constants';
import './CampusLifeCarousel.css';

export default function CampusLifeCarousel() {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef(null);
  const mouseStartX = useRef(null);

  const prevSlide = () => setIdx(prev => (prev - 1 + campusLifeImages.length) % campusLifeImages.length);
  const nextSlide = () => setIdx(prev => (prev + 1) % campusLifeImages.length);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  };

  const handleMouseDown = (e) => { mouseStartX.current = e.clientX; };
  const handleMouseUp = (e) => {
    if (mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    mouseStartX.current = null;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) nextSlide(); else prevSlide();
  };

  return (
    <section
      className="japan-choice-section reveal active"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ background: '#fff', padding: '40px 0' }}
      id="campus-life-section"
    >
      <h2 className="japan-choice-title">
        <span className="light-blue">Explore</span>{' '}
        <br className="mobile-only" />{' '}
        <span className="navy-blue">Campus Life at JUE</span>
      </h2>
      
      <div className="japan-carousel-container">
        <button className="carousel-nav-btn prev" onClick={prevSlide} aria-label="Previous slide">
          &#8249;
        </button>
        <div
          className="japan-carousel-track"
          style={{ transform: `translateX(calc(-${idx * 80}%))` }}
        >
          {campusLifeImages.map((item, i) => (
            <div
              key={item.title}
              className={`japan-carousel-item ${i === idx ? 'curr' : i < idx ? 'prev' : 'next'}`}
            >
              <div className="japan-img-box">
                <img src={item.img} alt={item.title} draggable="false" />
              </div>
              <p className="japan-img-caption">{item.title}</p>
              <p className="japan-img-desc">{item.desc}</p>
            </div>
          ))}
        </div>
        <button className="carousel-nav-btn next" onClick={nextSlide} aria-label="Next slide">
          &#8250;
        </button>
      </div>
    </section>
  );
}



