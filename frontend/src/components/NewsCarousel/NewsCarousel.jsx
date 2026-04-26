import { useRef, useEffect, useState } from 'react';
import { getOptimizedUrl } from '../../utils/cloudinary';
import './NewsCarousel.css';

const news1 = getOptimizedUrl("jue_news_fresh_1");
const news2 = getOptimizedUrl("jue_news_fresh_2");
const news3 = getOptimizedUrl("jue_news_fresh_3");
const news4 = getOptimizedUrl("jue_news_fresh_4");
const news5 = getOptimizedUrl("jue_news_fresh_5");
const news6 = getOptimizedUrl("jue_news_fresh_6");

const defaultNews = [
  { 
    img: news1, 
    title: 'Gateway to Japan: SRM AP Signs MoU with JUE',
    text: 'Expanding academic excellence and global career pathways. Initiative supports â€œDestination Japanâ€ with direct access to education and employment in Japan.',
    url: 'https://www.srmap.edu.in/news/srm-ap-strengthens-ties-with-japan-university-of-economics/'
  },
  { 
    img: news2, 
    title: 'JUE Blends Tradition & Innovation to Shape Global Leaders',
    text: '50+ years of excellence in business and economics education. Empowering international students with skills for global careers in Japan.',
    url: 'https://www.theworldfolio.com/news/tradition-and-modernity-how-japan-university-of-economics-shapes-tomorrows-global-leaders/5076/'
  },
  { 
    img: news3, 
    title: 'JUE\'s My Campus Site Earns Studio Design Award 2025 Nomination',
    text: 'Recognized for outstanding design and user experience. Invites global audience support through public voting.',
    url: 'https://mycampus.jue.ac.jp/news'
  },
  { 
    img: news4, 
    title: 'JUE Leads the Way in Global Education & Career Success',
    text: '97% placement rate for international graduates with Japanese language & cultural training. Bridging cultures while preparing students for Japan\'s workforce.',
    url: 'https://www.theworldfolio.com/interviews/japan-university-of-economics-nurturing-global-talent-and-bridging-cultures/6758/'
  },
  { 
    img: news5, 
    title: 'Japan University of Economics Wins 2026 Prime Minister\'s Commendation',
    text: 'Awarded for leadership in environmental conservation and green initiatives. Recognized nationally for sustainability and community impact.',
    url: 'https://www.jue.ac.jp/information/green-award2026/'
  },
  { 
    img: news6, 
    title: 'JUE Begins Academic Year 2026 with Grand Entrance Ceremony',
    text: 'Students from 25+ countries join a diverse global campus. Encouraging growth through education, culture, and real-world skills.',
    url: 'https://www.jue.ac.jp/information/260413_entrance-ceremony_fukuoka/'
  },
];

export default function NewsCarousel({ title = 'News & Press Release', items = defaultNews }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const touchStartX = useRef(null);
  const isTeleporting = useRef(false);

  // Triple the items to create an infinite scroll illusion
  const infiniteItems = [...items, ...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      // Start in the middle set of items
      const setWidth = track.scrollWidth / 3;
      track.scrollLeft = setWidth;
    }
  }, [items.length]);

  const handleScroll = () => {
    if (isTeleporting.current) return;
    const track = trackRef.current;
    if (!track) return;

    const setWidth = track.scrollWidth / 3;
    
    // If we've scrolled into the first set, teleport to the second set
    if (track.scrollLeft < setWidth * 0.5) {
      isTeleporting.current = true;
      track.scrollLeft += setWidth;
      setTimeout(() => { isTeleporting.current = false; }, 50);
    } 
    // If we've scrolled into the third set, teleport back to the second set
    else if (track.scrollLeft > setWidth * 1.5) {
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
            <a href={items[activeIndex].url} target="_blank" rel="noopener noreferrer" className="news-card-link">
              <div className="news-card__image main-img">
                <img src={items[activeIndex].img} alt="Main news" />
              </div>
              <div className="news-card__body">
                 <h3 className="news-card__title">{items[activeIndex].title}</h3>
                 <p className="news-card__text">{items[activeIndex].text}</p>
              </div>
            </a>
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
                     <img src={item.img} alt="Side news" />
                  </div>
                  <div className="news-card__body-mini">
                     <h4 className="news-card__title-mini">{item.title}</h4>
                     <p className="news-card__text-mini">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* Desktop Snap Track — Visible only on Desktop via CSS */}
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
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="news-card-link">
              <div className="news-card__image">
                <img src={item.img} alt={`card ${i + 1}`} draggable={false} />
              </div>
              <div className="news-card__body">
                <h3 className="news-card__title">{item.title}</h3>
                <p className="news-card__text">{item.text}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}



