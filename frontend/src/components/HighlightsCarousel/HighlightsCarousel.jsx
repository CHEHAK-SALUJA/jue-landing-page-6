import { useRef, useEffect, useState } from 'react';
import { getOptimizedUrl } from '../../utils/cloudinary';
import './HighlightsCarousel.css';

const highlight1 = getOptimizedUrl("jue_site/highlight_1");
const highlight2 = getOptimizedUrl("jue_site/highlight_2");
const highlight3 = getOptimizedUrl("jue_site/highlight_3");
const highlight4 = getOptimizedUrl("jue_site/highlight_4");
const highlight5 = getOptimizedUrl("jue_site/highlight_5");
const highlight6 = getOptimizedUrl("jue_site/highlight_6");

const defaultHighlights = [
  { img: highlight1, date: '2026.04.10', text: 'Innovative Robotics Lab: Leading the Future of Japanese Engineering.' },
  { img: highlight2, date: '2026.04.10', text: 'Vibrant Campus Life: Discovering the Hearts and Minds of Global Students.' },
  { img: highlight3, date: '2026.04.10', text: 'Prime Minister\'s Commendation for Distinguished Service in Greenery Promotion.' },
  { img: highlight4, date: '2026.04.10', text: 'Academic Excellence: Students collaborating in our modern, bright library space.' },
  { img: highlight5, date: '2026.04.10', text: 'Cultural Inclusion: International food festival celebrating our diverse student body.' },
  { img: highlight6, date: '2026.04.10', text: 'Career Success: Students connecting with top global recruiters at our annual fair.' },
];

export default function HighlightsCarousel({ title = 'Highlights', items = defaultHighlights }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const touchStartX = useRef(null);
  const isTeleporting = useRef(false);

  // Triple items for infinite loop effect
  const infiniteItems = [...items, ...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      // Start in middle
      const setWidth = track.scrollWidth / 3;
      track.scrollLeft = setWidth;
    }
  }, [items.length]);

  const handleScroll = () => {
    if (isTeleporting.current) return;
    const track = trackRef.current;
    if (!track) return;

    const setWidth = track.scrollWidth / 3;
    if (track.scrollLeft < setWidth * 0.5) {
      isTeleporting.current = true;
      track.scrollLeft += setWidth;
      setTimeout(() => { isTeleporting.current = false; }, 50);
    } else if (track.scrollLeft > setWidth * 1.5) {
      isTeleporting.current = true;
      track.scrollLeft -= setWidth;
      setTimeout(() => { isTeleporting.current = false; }, 50);
    }
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diff) < 30) return;

    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.offsetWidth / 3;
    track.scrollBy({ left: diff > 0 ? cardWidth : -cardWidth, behavior: 'smooth' });
  };

  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');
  const touchStartY = useRef(null);

  const handleSwap = (clickedIdx) => {
    if (isSliding || clickedIdx === activeIndex) return;
    
    setSlideDirection('down');
    setIsSliding(true);
    
    setTimeout(() => {
      setActiveIndex(clickedIdx);
    }, 200); // Update content at midpoint of animation
    
    setTimeout(() => {
      setIsSliding(false);
    }, 400); 
  };

  const onMobileTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onMobileTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      // Swipe up -> Next
      const nextIdx = (activeIndex + 1) % items.length;
      handleSwap(nextIdx);
    } else {
      // Swipe down -> Prev
      const prevIdx = (activeIndex - 1 + items.length) % items.length;
      handleSwap(prevIdx);
    }
  };

  // Items for sidebar (the next 3 after activeIndex, or wrap around)
  const sidebarItems = [
    { ...items[(activeIndex - 1 + items.length) % items.length], action: 'prev' },
    { ...items[(activeIndex + 2) % items.length], action: 'swap', index: (activeIndex + 2) % items.length },
    { ...items[(activeIndex + 1) % items.length], action: 'next' }
  ];

  const handleAction = (item) => {
    if (item.action === 'prev') {
      const prevIdx = (activeIndex - 1 + items.length) % items.length;
      handleSwap(prevIdx);
    } else if (item.action === 'next') {
      const nextIdx = (activeIndex + 1) % items.length;
      handleSwap(nextIdx);
    } else {
      handleSwap(item.index);
    }
  };

  const mouseStartX = useRef(null);

  const onMouseDown = (e) => {
    mouseStartX.current = e.clientX;
  };

  const onMouseUp = (e) => {
    if (mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    mouseStartX.current = null;
    if (Math.abs(diff) < 30) return;

    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.offsetWidth / 3;
    track.scrollBy({ left: diff > 0 ? cardWidth : -cardWidth, behavior: 'smooth' });
  };

  return (
    <div className="news-carousel-wrapper">
      <h2 className="news-title">{title}</h2>

      {/* Mobile Swap Layout [NEW] */}
      <div 
        className="news-mobile-split"
        onTouchStart={onMobileTouchStart}
        onTouchEnd={onMobileTouchEnd}
      >
         <div className={`news-main-card news-card ${isSliding ? `sliding-${slideDirection}` : ''}`}>
            <div className="news-card__image main-img">
              <img src={items[activeIndex].img} alt="Main highlight" />
            </div>
            <div className="news-card__body">
               <p className="news-card__date">{items[activeIndex].date}</p>
               <p className="news-card__text">{items[activeIndex].text}</p>
            </div>
         </div>
         <div className="news-sidebar">
            <div className="news-sidebar-track">
              {sidebarItems.map((item, idx) => (
                <div 
                  className="news-side-card news-card" 
                  key={idx}
                  onClick={() => handleAction(item)}
                >
                  <div className="news-card__image-mini">
                     <img src={item.img} alt="Side highlight" />
                  </div>
                  <div className="news-card__body-mini">
                     <p className="news-card__date-mini">{item.date}</p>
                     <p className="news-card__text-mini">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* Desktop Snap Track — Hidden on Mobile */}
      <div
        ref={trackRef}
        className="news-snap-track desktop-only"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onScroll={handleScroll}
      >
        {infiniteItems.map((item, i) => (
          <div className="news-snap-card news-card" key={i}>
            <div className="news-card__image">
              <img src={item.img} alt={`highlight ${i + 1}`} draggable={false} />
            </div>
            <div className="news-card__body">
              <p className="news-card__date">{item.date}</p>
              <p className="news-card__text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
