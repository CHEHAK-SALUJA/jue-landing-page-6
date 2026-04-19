import { useState, useEffect, useRef } from 'react';
import { getOptimizedUrl } from '../../utils/cloudinary';
import './JourneySection.css';
import { journeySteps } from '../../data/constants';

export default function JourneySection() {
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && window.scrollY > 100) {
        setIsActive(true);
      }
    }, { threshold: 0.5 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isActive && animRef.current && animRef.current.beginElement) {
      animRef.current.beginElement();
    }
  }, [isActive]);

  const pathData = 'M 20 85 C 80 85, 20 15, 80 15';

  const getBezierPoint = (t, p0, p1, p2, p3) => {
    const mt = 1 - t;
    return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
  };

  return (
    <section className="journey-wrapper reveal" id="journey" ref={sectionRef}>
      <div className="journey-header">
        <h2>Your Journey from India to Japan</h2>
      </div>
      <div className="journey-container">
        {/* Maps */}
        <img src={getOptimizedUrl('jue_site/india_map-removebg-preview')} alt="India" className="map-india" />
        <img src={getOptimizedUrl('jue_site/japan_map-removebg-preview')} alt="Japan" className="map-japan" />

        <svg className="journey-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            id="flight-path"
            d={pathData}
            fill="none"
            stroke="#003B6F"
            strokeWidth="0.4"
            strokeDasharray="1.5, 1.5"
            vectorEffect="non-scaling-stroke"
          />
          <image
            href={getOptimizedUrl('jue_site/airplane-removebg-preview')}
            width="20"
            height="20"
            x="-10"
            y="-10"
            transform="rotate(30)"
            style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
          >
            <animateMotion
              ref={animRef}
              dur="12s"
              repeatCount="1"
              fill="freeze"
              path={pathData}
              begin="indefinite"
            />
          </image>
        </svg>

        {journeySteps.map((step, idx) => {
          const x = getBezierPoint(step.t, 20, 80, 20, 80);
          const y = getBezierPoint(step.t, 85, 85, 15, 15);
          const dotColor = step.color === 'green' ? '#2ecc71' : '#3498db';

          return (
            <div
              key={idx}
              className="journey-marker"
              style={{ left: `${x}%`, top: `${y}%`, borderColor: dotColor }}
            >
              <div
                className={`step-text-container ${step.align} ${isActive ? 'fade-in-on-pass' : ''}`}
                style={{ animationDelay: `${step.t * 12}s`, opacity: 0 }}
              >
                <div className="step-title" style={{ color: dotColor }}>{step.title}</div>
                <div className="step-sub">{step.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


