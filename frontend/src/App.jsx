import React, { useEffect, useState, useRef } from 'react';
import './index.css';

// ─── Components ───────────────────────────────────────────────────────────────
import ChatWidget           from './components/ChatWidget/ChatWidget';
import NewsCarousel         from './components/NewsCarousel/NewsCarousel';
import HighlightsCarousel   from './components/HighlightsCarousel/HighlightsCarousel';
import FeatureSlider        from './components/FeatureSlider/FeatureSlider';
import JapanChoiceCarousel  from './components/JapanChoiceCarousel/JapanChoiceCarousel';
import ExploreJapanCarousel from './components/ExploreJapanCarousel/ExploreJapanCarousel';
import CampusLifeCarousel   from './components/CampusLifeCarousel/CampusLifeCarousel';
import JourneySection       from './components/JourneySection/JourneySection';

// ─── Data ─────────────────────────────────────────────────────────────────────
import {
  heroSliderImages,
  fbLogo, igLogo, ytLogo, liLogo,
  programDetails,
  faqsList,
  specialSupportSteps2,
  supportSlides2,
  indianChoiceSteps,
  peaceOfMindData,
  statsSets,
  comparisonData,
} from './data/constants';
import { getOptimizedUrl } from './utils/cloudinary';

const successImages = [
  getOptimizedUrl('jue_site/jue-students'),
  getOptimizedUrl('jue_site/Undergraduate00'),
  getOptimizedUrl('jue_site/fukuokacampus02'),
];

// ─── Counter (used in stats) ──────────────────────────────────────────────────
const Counter = ({ target, duration = 800, suffix = '' }) => {
  const [count, setCount]     = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    const end = parseFloat(target.replace(/,/g, ''));
    if (isNaN(end)) return setCount(target);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(progress * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  const formatNumber = (num) => {
    if (typeof num === 'string') return num;
    if (target.includes('.')) return num.toFixed(1);
    return Math.floor(num).toLocaleString();
  };

  return <span ref={countRef}>{formatNumber(count)}{suffix}</span>;
};

// ─── Peace icon helper ────────────────────────────────────────────────────────
const PeaceIcon = ({ type }) => {
  if (type === 'lock') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
  if (type === 'grid') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  // ── UI state ─────────────────────────────────────────────────────────────
  const [heroIndex, setHeroIndex]           = useState(0);
  const [peaceTab, setPeaceTab]             = useState('safety');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showStories, setShowStories]       = useState(false);
  const [showCampusLife, setShowCampusLife] = useState(false);
  const [showMoreHome, setShowMoreHome]     = useState(false);
  const [isMenuOpen, setIsMenuOpen]         = useState(false);
  const [isScrolling, setIsScrolling]       = useState(true);
  const [openFaqIndex, setOpenFaqIndex]     = useState(null);
  const scrollTimeout = useRef(null);

  // ── Special Support 2 ────────────────────────────────────────────────────
  const [selectedSupport2, setSelectedSupport2]   = useState('visa');
  const [activeSupportSlide2, setActiveSupportSlide2] = useState(0);
  const [slideAnim2, setSlideAnim2]               = useState('active');

  useEffect(() => { setActiveSupportSlide2(0); }, [selectedSupport2]);

  const nextSupportSlide2 = () => {
    setSlideAnim2('exit');
    setTimeout(() => {
      setActiveSupportSlide2(prev => (prev + 1) % supportSlides2[selectedSupport2].length);
      setSlideAnim2('active');
    }, 300);
  };
  const prevSupportSlide2 = () => {
    setSlideAnim2('exit');
    setTimeout(() => {
      setActiveSupportSlide2(prev => (prev - 1 + supportSlides2[selectedSupport2].length) % supportSlides2[selectedSupport2].length);
      setSlideAnim2('active');
    }, 300);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const [statSetIndex, setStatSetIndex]   = useState(0);
  const [statAnim, setStatAnim]           = useState('active');
  const [isStatsPaused, setIsStatsPaused] = useState(false);

  useEffect(() => {
    if (isStatsPaused) return;
    const statsTimer = setInterval(() => {
      setStatAnim('slide-out');
      setTimeout(() => {
        setStatSetIndex(prev => (prev + 1) % statsSets.length);
        setStatAnim('slide-in');
        setTimeout(() => setStatAnim('active'), 100);
      }, 500);
    }, 4000);
    return () => clearInterval(statsTimer);
  }, [isStatsPaused]);

  // ── Hero slider ───────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ── Reveal on scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ── Scroll-aware sticky button ────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 1000);
    };
    window.addEventListener('scroll', handleScroll);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 2000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleApplyNow = () => window.open('https://forms.gle/Ho44EJ3iFKZ5jfA48', '_blank');

  return (
    <div className="app">

      {/* ── Sticky Apply Button ── */}
      <button
        className={`sticky-apply-btn ${!isScrolling ? 'hidden' : ''}`}
        onClick={handleApplyNow}
      >
        APPLY NOW
      </button>

      {/* ── Navigation ── */}
      <header className="main-nav-bar">
        <div className="nav-container">
          <div
            className="nav-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ cursor: 'pointer' }}
          >
            JUE
          </div>
          <nav className="nav-menu desktop-only">
            <a href="#home">HOME</a>
            <a href="#programs">PROGRAMS</a>
            <a href="#journey">JOURNEY</a>
            <a href="#special-support2">SUPPORT</a>
            <a href="#faq">FAQs</a>
          </nav>
          <button
            className="hamburger-menu mobile-only"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`bar ${isMenuOpen ? 'active' : ''}`} />
            <div className={`bar ${isMenuOpen ? 'active' : ''}`} />
            <div className={`bar ${isMenuOpen ? 'active' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── Mobile Sidebar ── */}
      <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div
            className="nav-logo"
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }}
            style={{ cursor: 'pointer' }}
          />
          <button className="close-menu" onClick={() => setIsMenuOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-links">
          <a href="#home"              onClick={() => setIsMenuOpen(false)}>HOME</a>
          <a href="#programs"          onClick={() => setIsMenuOpen(false)}>PROGRAMS</a>
          <a href="#why-jue"           onClick={() => setIsMenuOpen(false)}>WHY JUE?</a>
          <a href="#why-japan-choice"  onClick={() => setIsMenuOpen(false)}>WHY JAPAN?</a>
          <a href="#explore-japan"     onClick={() => setIsMenuOpen(false)}>ABOUT JAPAN</a>
          <a href="#comparison"        onClick={() => setIsMenuOpen(false)}>THE SMARTER CHOICE</a>
          <a href="#campus-life-section" onClick={() => setIsMenuOpen(false)}>CAMPUS LIFE</a>
          <a href="#journey"           onClick={() => setIsMenuOpen(false)}>YOUR JOURNEY</a>
          <a href="#special-support2"  onClick={() => setIsMenuOpen(false)}>SPECIAL SUPPORT</a>
          <a href="#parents-peace"     onClick={() => setIsMenuOpen(false)}>FOR PARENTS</a>
          <a href="#success"           onClick={() => setIsMenuOpen(false)}>SUCCESS STORIES</a>
          <a href="#faq"               onClick={() => setIsMenuOpen(false)}>FAQs</a>
        </nav>
        <div className="sidebar-footer">
          <button className="apply-btn-mobile" onClick={handleApplyNow}>APPLY NOW</button>
        </div>
      </div>
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}

      {/* ── Hero ── */}
      <section className="hero" id="home">
        {heroSliderImages.map((img, idx) => (
          <div
            key={idx}
            className={`hero-image-bg ${idx === heroIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-body">
          <div className="hero-text">
            <p className="hero-eyebrow">Thinking of<br />studying abroad?</p>
            <h2 className="hero-headline">
              Then Why Not<br />
              <span className="hero-headline-bottom">
                Choose <span className="hero-japan-accent">Japan</span>
                <div className="hero-divider" />
                <div className="hero-subtitle">Special Support for Indian Students</div>
              </span>
            </h2>
          </div>
          <div className="hero-badges">
            <span className="hero-badge-gold" onClick={handleApplyNow} style={{ cursor: 'pointer' }}>
              Avail FREE Counselling
            </span>
          </div>
        </div>
      </section>

      {/* ── Institutional Stats Strip ── */}
      <section className="institutional-stats-strip reveal">
        <div className="stats-main-grid">
          <div className="stat-item"><span className="stat-number">60+</span><span className="stat-desc">Years Legacy</span></div>
          <div className="stat-item"><span className="stat-number">97%</span><span className="stat-desc">Placement</span></div>
          <div className="stat-item"><span className="stat-number">20+</span><span className="stat-desc">Countries Students</span></div>
        </div>
        <div className="alumni-banner">
          <span className="alumni-label">OUR ALUMNI WORK AT</span>
          <div className="alumni-logos ticker-container">
            <div className="ticker-track">
              <span>Chikusui Canycom Inc &nbsp;|&nbsp; Apple &nbsp;|&nbsp; T. Rowe Price &nbsp;|&nbsp; Japan University of Economics &nbsp;|&nbsp; Déesse Cosmetics of Switzerland &nbsp;|&nbsp;</span>
              <span>Chikusui Canycom Inc &nbsp;|&nbsp; Apple &nbsp;|&nbsp; T. Rowe Price &nbsp;|&nbsp; Japan University of Economics &nbsp;|&nbsp; Déesse Cosmetics of Switzerland &nbsp;|&nbsp;</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Indian Welcome ── */}
      <section className="indian-welcome reveal">
        <h2 className="welcome-title">We welcome students from India </h2>
        <div className="welcome-container">
          <div className="welcome-text-container">
            <p className="welcome-text-bold">
              For over 60 years since 1956, the Tsuzuki Education Group has been developing individual expertise in the academic context and are willing to provide unlimited support in education.
            </p>
            <p className="welcome-text-normal">
              We are now one of the biggest educational corporations in Japan, having established six universities, twelve junior colleges and vocational schools, three high schools, a junior high school, and four kindergartens and nursery schools.
            </p>
          </div>
        </div>
      </section>

      {/* ── Navy Stats ── */}
      <section
        className="navy-stats reveal"
        onMouseEnter={() => setIsStatsPaused(true)}
        onMouseLeave={() => setIsStatsPaused(false)}
        onTouchStart={() => setIsStatsPaused(true)}
        onTouchEnd={() => setIsStatsPaused(false)}
      >
        <div className="stats-grid">
          {statsSets[statSetIndex].map((stat, index) => (
            <div className="stats-block" key={index}>
              <div className="block-inner">
                <div className={`stats-slider-wrapper ${statAnim}`}>
                  <h3 className="block-title">{stat.title}</h3>
                  <div className="stat-detail">
                    <span className="stat-value">{stat.value}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Welcome JUE / Video ── */}
      <section className="welcome-jue reveal">
        <h2 className="welcome-jue-title">Welcome to Japan University of Economics <br className="mobile-only" /> (JUE)</h2>
        <div className="video-section">
          <div className="video-container">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/tB1vYUFAn5I?autoplay=1&mute=1&loop=1&playlist=tB1vYUFAn5I"
              title="JUE University Life"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── Programs Accordion ── */}
      <section className="programs-accordion-section reveal" id="programs">
        <div className="accordion-wrapper">
          <div className="accordion-header-strip">
            <h2 className="accordion-main-title">PROGRAMS WE OFFER</h2>
          </div>
          <div className="accordion-items">
            {Object.keys(programDetails).map((prog) => (
              <div
                key={prog}
                className={`accordion-item ${selectedProgram === prog ? 'expanded' : ''}`}
              >
                <div
                  className="accordion-stripe"
                  onClick={() => setSelectedProgram(selectedProgram === prog ? null : prog)}
                >
                  <span className="stripe-title">{prog}</span>
                  <span className="stripe-icon">{selectedProgram === prog ? '−' : '+'}</span>
                </div>
                <div className="accordion-content">
                  <div className="content-inner">
                    <p className="program-desc">{programDetails[prog]}</p>
                    <button className="learn-more-btn" onClick={() => window.open('#', '_blank')}>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Indian Students Choose ── */}
      <section className="indian-students-choice-section reveal">
        <div className="section-container-small">
          <div className="choice-header">
            <h3 className="choice-eyebrow">Why Indian Students Choose</h3>
            <h2 className="choice-title">Japan University of Economics?</h2>
          </div>
          <div className="choice-cards-container">
            {indianChoiceSteps.map((step, index) => (
              <div key={index} className="choice-card-item">
                <div className="choice-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7H16V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7ZM10 5H14V7H10V5ZM20 19H4V9H20V19Z" fill="#111" />
                  </svg>
                </div>
                <div className="choice-content">
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Japan Carousel ── */}
      <JapanChoiceCarousel />

      {/* ── Explore Life at Japan ── */}
      <ExploreJapanCarousel />

      {/* ── Comparison Table ── */}
      <section id="comparison" className="comparison-section reveal">
        <div className="section-container">
          <h2 className="comparison-title">
            <span className="light-blue">Why JUE Japan</span>{' '}
            <br className="mobile-only" />{' '}
            <span className="navy-blue">is the Smarter Choice</span>
          </h2>
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>JUE Japan</th>
                  <th>Other Countries</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="row-feature">{row.feature}</td>
                    <td className="row-jue">{row.jue}</td>
                    <td className="row-other">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Safe Welcoming Home ── */}
      <section className="safe-home-section reveal">
        <div className="section-container-small">
          <h2 className="safe-home-title">A Safe, Welcoming Home in Japan for Indian Students</h2>
          <p className="safe-home-intro">
            We offer a safe, welcoming, and supportive environment that understands the needs of Indian students and their families.
          </p>
          <div className="safe-home-checklist">
            <div className="checklist-item">
              <span className="check-icon">✓</span>
              <p><strong>Friendly Campus Community:</strong> We provide opportunities to build friendships with Japanese and international students in a welcoming environment.</p>
            </div>
            <div className="checklist-item">
              <span className="check-icon">✓</span>
              <p><strong>Mentor Support System:</strong> Dedicated mentor support to guide students academically and personally throughout their journey.</p>
            </div>
            {!showMoreHome && (
              <p
                onClick={() => setShowMoreHome(true)}
                style={{ color: '#3498db', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '15px', marginLeft: '30px' }}
              >
                more...
              </p>
            )}
            {showMoreHome && (
              <>
                <div className="checklist-item">
                  <span className="check-icon">✓</span>
                  <p><strong>Career Orientation Support:</strong> Comprehensive guidance on job hunting, resume building, and interview preparation for a successful career in Japan.</p>
                </div>
                <div className="checklist-item">
                  <span className="check-icon">✓</span>
                  <p><strong>Cultural Integration Programs:</strong> Regular workshops and events to help international students understand and adapt to Japanese lifestyle and customs.</p>
                </div>
                <div className="checklist-item">
                  <span className="check-icon">✓</span>
                  <p><strong>English Speaking Assistance:</strong> Dedicated desk for English-speaking students to resolve any administrative or daily life queries.</p>
                </div>
              </>
            )}
          </div>
          <button
            className={`explore-campus-btn ${!showCampusLife ? 'blink-btn' : ''}`}
            onClick={() => {
              setShowCampusLife(!showCampusLife);
              if (!showCampusLife) {
                setTimeout(() => {
                  document.getElementById('campus-life-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }
            }}
          >
            {showCampusLife ? 'Hide Campus Life' : 'Explore Campus Life'}
          </button>
        </div>
      </section>

      {/* ── Campus Life ── */}
      {showCampusLife && <CampusLifeCarousel />}

      {/* ── News ── */}
      <section className="news-press-section reveal">
        <div className="section-container">
          <NewsCarousel title="News &amp; Press Release" />
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="highlights-jue-section reveal">
        <div className="section-container">
          <HighlightsCarousel title="Highlights" />
        </div>
      </section>

      {/* ── Journey ── */}
      <JourneySection />

      {/* ── Connect with JUE ── */}
      <section className="whatsapp-cta-section reveal" id="connect-with-jue" style={{ backgroundColor: '#003B6F' }}>
        <div className="whatsapp-cta-banner">
          <div className="whatsapp-cta-text" style={{ whiteSpace: 'normal', lineHeight: '1.4', color: '#FFFFFF', marginBottom: '15px' }}>
            Hurrry up! Connect with Japanese students, discover life in Japan and JUE, and create lifelong friendships while building strong communication skills
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <img src={getOptimizedUrl('v1/jue_site/join_now_img.jpeg')} alt="Join Now" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          </div>
          <a href="https://chat.whatsapp.com/your-group-link" target="_blank" rel="noopener noreferrer" className="alumni-btn blink-btn" style={{ marginBottom: '15px', display: 'inline-block', textDecoration: 'none', fontSize: '1.25rem' }}>
            Click to connect now
          </a>
        </div>
      </section>

      {/* ── Special Support for Indian Students ── */}
      <section className="special-support-section2 reveal" id="special-support2">
        <div className="special-support-header2">
          <h2 className="special-support-line1">Special Support for</h2>
          <h2 className="special-support-line2">Indian Students</h2>
        </div>
        <div className="support-grid-rows2">
          {[0, 1, 2].map((rowIdx) => {
            const rowItems = specialSupportSteps2.slice(rowIdx * 2, rowIdx * 2 + 2);
            const isRowActive = rowItems.some(item => item.id === selectedSupport2);

            return (
              <React.Fragment key={rowIdx}>
                <div className="support-row-pair2">
                  {rowItems.map((step) => (
                    <div
                      key={step.id}
                      className={`support-card2 ${selectedSupport2 === step.id ? 'active-card-support2' : ''}`}
                      onClick={() => setSelectedSupport2(selectedSupport2 === step.id ? null : step.id)}
                    >
                      <div className="support-img-box2">
                        <img src={step.img} alt={step.title} />
                      </div>
                      <div className="support-info-box2">
                        <p>{step.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Slider for this Row */}
                <div className={`row-slider-wrapper2 ${isRowActive ? 'expanded' : ''}`}>
                  {isRowActive && selectedSupport2 && supportSlides2[selectedSupport2] && (
                    <div className="about-program-container2 inline-slider2">
                      <div className="about-program-slider2 sub-carousel-container2">
                        <div className="support-detail-layout2">
                          <div className="image-carousel-unit2">
                            <div className="sub-arrow-container2">
                              <button className="sub-arrow2 left" onClick={prevSupportSlide2}>‹</button>
                              <div className={`about-program-image2 sub-image2 ${slideAnim2}`}>
                                <img src={supportSlides2[selectedSupport2][activeSupportSlide2].img} alt="Support" />
                              </div>
                              <button className="sub-arrow2 right" onClick={nextSupportSlide2}>›</button>
                            </div>
                            <div className="slide-dots-image-align2">
                              {supportSlides2[selectedSupport2].map((_, i) => (
                                <span key={i} className={`slide-dot2 ${i === activeSupportSlide2 ? 'active' : ''}`} />
                              ))}
                            </div>
                          </div>
                          <div className={`about-program-info2 sub-info2 ${slideAnim2}`}>
                            <h2 className="about-program-title2">{supportSlides2[selectedSupport2][activeSupportSlide2].title}</h2>
                            <div className="about-program-underline2" />
                            <p className="about-program-text2">{supportSlides2[selectedSupport2][activeSupportSlide2].text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* ── Peace of Mind ── */}
      <section id="parents-peace" className="peace-of-mind reveal">
        <div className="section-container-small">
          <div className="peace-header">
            <span className="peace-badge">FOR FAMILIES</span>
            <h2 className="peace-main-title">Total Peace of Mind</h2>
            <p className="peace-subtitle">We understand sending your child abroad is daunting. JUE eliminates the risks.</p>
          </div>
          <div className="peace-tabs">
            {['safety', 'food', 'health'].map(tab => (
              <button
                key={tab}
                className={`peace-tab-btn ${peaceTab === tab ? 'active' : ''}`}
                onClick={() => setPeaceTab(tab)}
              >
                {tab === 'safety' ? 'Safety & Housing' : tab === 'food' ? 'Food & Culture' : 'Health & Support'}
              </button>
            ))}
          </div>
          <div className="peace-content-card">
            <div className="peace-icon-wrapper">
              <PeaceIcon type={peaceOfMindData[peaceTab].iconType} />
            </div>
            <h3 className="peace-card-title">{peaceOfMindData[peaceTab].title}</h3>
            <p className="peace-card-desc">{peaceOfMindData[peaceTab].desc}</p>
          </div>
        </div>
      </section>

      {/* ── Earn While You Learn ── */}
      <section className="earn-while-learn reveal">
        <div className="yellow-strip top" />
        <div className="section-container-small">
          <div className="earn-info-box">
            <h2 className="box-title">Earn While You Learn</h2>
            <p className="box-text">
              Under Japanese law, international students can work 28 hours per week.
              Earn up to <strong>₹60,000/month</strong> to easily cover your living expenses.
            </p>
          </div>
          <div className="journey-info-box">
            <h2 className="box-title highlight">The "Zero to N1" Journey</h2>
            <p className="box-text">
              Don't know Japanese? No problem. Our mandatory language integration program takes you from complete beginner to business-fluent (JLPT N1/N2) alongside your degree.
            </p>
            <div className="journey-box-divider" />
            <div className="journey-timeline-simple">
              <span className="year-mark">YEAR 1 : <span className="status-mark">BEGINNER</span></span>
              <span className="year-mark">YEAR 4 : <span className="status-mark">N1 BUSINESS FLUENT</span></span>
            </div>
          </div>
        </div>
        <div className="yellow-strip bottom" />
      </section>

      {/* ── Concerns Solved Heading ── */}
      <section id="concerns" className="community-cta reveal" style={{ position: 'relative', overflow: 'visible' }}>
        <h2 className="community-home-text">
          <span className="white-text">Your concerns</span>{' '}
          <span className="green-highlight">NOW SOLVED</span>
          <span className="animated-emoji" />
        </h2>
      </section>

      {/* ── Feature Slider ── */}
      <section className="reveal" id="features">
        <FeatureSlider />
      </section>

      {/* ── Alumni Inspiration ── */}
      <section className="alumni-inspiration-section reveal" id="mentors">
        <div className="alumni-content">
          <h2 className="alumni-title">Be inspired by our students and alumni</h2>
          <p className="alumni-subtitle">
            Discover how Education In JAPAN can give you unique opportunities for personal
            <br className="desktop-break" /> growth and career success.
          </p>
          <button
            className={`alumni-btn ${!showStories ? 'blink-btn' : ''}`}
            onClick={() => {
              if (!showStories) {
                setShowStories(true);
                setTimeout(() => document.getElementById('success').scrollIntoView({ behavior: 'smooth' }), 100);
              } else {
                setShowStories(false);
              }
            }}
          >
            {showStories ? 'Hide Student Stories' : 'Read Student Stories'}
          </button>
        </div>
      </section>

      {/* ── Success Stories ── */}
      <section className="success-stories" id="success">
        {showStories && (
          <>
            <div className="success-row reveal active">
              <div className="success-img-box">
                <img src={successImages[0]} alt="Student Presentation" />
              </div>
              <div className="success-pill">
                <strong>Kim Seong-min (Athlete)</strong><br />
                "JUE's disciplined campus prepared me perfectly for my professional career in sports."
              </div>
            </div>
            <div className="success-row reverse reveal active">
              <div className="success-img-box">
                <img src={successImages[1]} alt="Student Life" />
              </div>
              <div className="success-pill">
                <strong>Garkavenko Hanna (Industry)</strong><br />
                "JUE's career support gave me the tools to secure a rewarding career in Japan's industry."
              </div>
            </div>
            <div className="success-row reveal active">
              <div className="success-img-box">
                <img src={successImages[2]} alt="Alumni Founder" />
              </div>
              <div className="success-pill">
                <strong>Kang Rae-soo (CEO)</strong><br />
                "The market insights I gained at JUE were the foundation for founding my own company."
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="whatsapp-cta-section reveal">
        <div className="whatsapp-cta-banner">
          <div className="whatsapp-cta-text">
            Join Our whatsapp Community for <span className="whatsapp-green">UPDATES</span>
          </div>
          <a href="https://chat.whatsapp.com/your-group-link" target="_blank" rel="noopener noreferrer" className="whatsapp-join-btn">
            JOIN NOW
          </a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq reveal" id="faq">
        <div className="faq-header-strip">
          <h2>FAQs</h2>
        </div>
        <div className="faq-container-navy">
          <div className="faq-list">
            {faqsList.map((faq, idx) => (
              <div
                key={idx}
                className="faq-item-container"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              >
                <div className="faq-item">{faq.q}</div>
                {openFaqIndex === idx && (
                  <div className="faq-answer-static">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="thick-section-divider" />

      {/* ── Apply CTA ── */}
      <section className="apply-cta reveal">
        <h2>Ready to Begin Your Journey?</h2>
        <p>Join the next generation of global leaders at Japan University of Economics.</p>
        <button className="apply-btn" onClick={handleApplyNow}>APPLY FOR ADMISSIONS</button>
      </section>

      {/* ── Footer ── */}
      <footer className="enhanced-footer" id="inquiry">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Campus Locations</h4>
            <ul>
              <li><strong>Fukuoka</strong>: Dazaifu City, Gojo</li>
              <li><strong>Tokyo Shibuya</strong>: Sakuragaoka-cho</li>
              <li><strong>Kobe Sannomiya</strong>: Kumoidori, Chuo-ku</li>
              <li><a href="https://www.jue.ac.jp/access/" target="_blank" rel="noreferrer">Access Map &amp; Directions</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Admissions</h4>
            <ul>
              <li><a href="https://www.jue.ac.jp/for_applicant/" target="_blank" rel="noreferrer">Enrollment Info</a></li>
              <li><a href="https://www.jue.ac.jp/en/ADMISSION/Scholarship.html" target="_blank" rel="noreferrer">Scholarships</a></li>
              <li><a href="https://www.jue.ac.jp/group/" target="_blank" rel="noreferrer">Tsuzuki Education Group</a></li>
              <li><a href="https://www.jue.ac.jp/sitemap/" target="_blank" rel="noreferrer">Site Map</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Student Support</h4>
            <ul>
              <li><a href="https://www.jue.ac.jp/en/CAMPUSLIFE/Student_Support.html" target="_blank" rel="noreferrer">International Center</a></li>
              <li><a href="https://www.jue.ac.jp/privacy/" target="_blank" rel="noreferrer">Privacy Policy</a></li>
              <li><a href="https://www.jue.ac.jp/inquiry/" target="_blank" rel="noreferrer">General Inquiry</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect With Us</h4>
            <div className="social-icons">
              <a href="https://www.jue.ac.jp/facebook/" target="_blank" rel="noreferrer" className="social-icon">
                <img src={fbLogo} alt="Facebook" />
              </a>
              <a href="https://www.jue.ac.jp/instagram/" target="_blank" rel="noreferrer" className="social-icon">
                <img src={igLogo} alt="Instagram" />
              </a>
              <a href="https://youtube.com/@nihonkeizaidaigaku?si=vMhfU4ZPgmoINR9V" target="_blank" rel="noreferrer" className="social-icon">
                <img src={ytLogo} alt="YouTube" />
              </a>
              <a href="https://www.linkedin.com/school/%E6%97%A5%E6%9C%AC%E7%B5%8C%E6%B8%88%E5%A4%A7%E5%AD%A6/" target="_blank" rel="noreferrer" className="social-icon linkedin">
                <img src={liLogo} alt="LinkedIn" />
              </a>
            </div>
            <p style={{ fontSize: '0.8rem', marginTop: '20px', opacity: 0.6 }}>
              Institutional Knowledge Base for Global Students.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Japan University of Economics. All rights reserved.</p>
        </div>
      </footer>

      {/* ── Chat Widget ── */}
      <ChatWidget />
    </div>
  );
};

export default App;
