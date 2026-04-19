import { useState } from 'react';
import { exploreJapanImages } from '../../data/constants';
import './ExploreJapanCarousel.css';

export default function ExploreJapanCarousel() {
  const [idx, setIdx] = useState(0);
  const touchStartX = { current: null };

  const prevSlide = () => setIdx(prev => (prev - 1 + exploreJapanImages.length) % exploreJapanImages.length);
  const nextSlide = () => setIdx(prev => (prev + 1) % exploreJapanImages.length);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  };

  return (
    <section
      id="explore-japan"
      className="japan-choice-section reveal"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ background: '#f9f9f9' }}
    >
      <h2 className="japan-choice-title">
        <span className="light-blue">Explore Life</span>{' '}
        <br className="mobile-only" />{' '}
        <span className="navy-blue">at Japan</span>
      </h2>
      <div className="japan-carousel-container">
        <div
          className="japan-carousel-track"
          style={{ transform: `translateX(calc(-${idx * 80}%))` }}
        >
          {exploreJapanImages.map((item, i) => (
            <div
              key={item.title}
              className={`japan-carousel-item ${i === idx ? 'curr' : i < idx ? 'prev' : 'next'}`}
            >
              <div className="japan-img-box">
                <img src={item.img} alt={item.title} />
              </div>
              <p className="japan-img-caption">{item.title}</p>
              <p className="japan-img-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


