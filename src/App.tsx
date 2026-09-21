import React, { useState, useEffect, useRef } from 'react';

// Custom typewriter hook
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(2);
  const isSeekingRef = useRef<boolean>(false);

  const typewriterText =
    "Glad you found us. Exceptional spaces have a way of elevating the work that happens within them. What are you building next?";
  const { displayed, done } = useTypewriter(typewriterText);

  useEffect(() => {
    const timer = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Force video to start at 2 seconds
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.currentTime = 2;
      targetTimeRef.current = 2;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) {
      video.currentTime = 2;
      targetTimeRef.current = 2;
    }

    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, []);

  // Mouse scrub video effect (desktop only)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      if (!video.duration || isNaN(video.duration)) return;

      const SENSITIVITY = 0.8;
      const duration = video.duration;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;

      let newTime = targetTimeRef.current + timeOffset;
      if (newTime < 2) newTime = 2;
      if (newTime > duration) newTime = duration;

      targetTimeRef.current = newTime;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (video.currentTime !== targetTimeRef.current) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@hiveandco.space');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://v1.pinimg.com/videos/mc/720p/10/c6/e4/10c6e421c8f8384f8df1f79d581df34f.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 w-full h-full object-cover object-[70%_center] pointer-events-none"
      />

      {/* Slight dark gradient for readability on all devices */}
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40 pointer-events-none" />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-30 px-4 sm:px-6 md:px-8 py-3 sm:py-5 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
          <span className="text-[18px] sm:text-[22px] md:text-[26px] tracking-tight text-white font-medium">
            Hive &amp; Co®
          </span>
          <span className="text-[20px] sm:text-[26px] md:text-[30px] text-white select-none leading-none -tracking-[0.02em]">
            ✳︎
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center text-[18px] lg:text-[22px] text-white gap-1">
          <a href="#spaces" className="hover:opacity-60 transition-opacity">Spaces</a>
          <span className="text-white/50">,</span>
          <a href="#amenities" className="hover:opacity-60 transition-opacity ml-2">Amenities</a>
          <span className="text-white/50">,</span>
          <a href="#locations" className="hover:opacity-60 transition-opacity ml-2">Locations</a>
          <span className="text-white/50">,</span>
          <a href="#membership" className="hover:opacity-60 transition-opacity ml-2">Membership</a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className="text-[18px] lg:text-[22px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Book a tour
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-between w-6 h-5 relative z-40 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-full h-[2px] bg-white transition-all duration-300 transform ${
              mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''
            }`}
          />
          <span
            className={`w-full h-[2px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-full h-[2px] bg-white transition-all duration-300 transform ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-30 flex flex-col justify-center px-8 gap-5 transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {['Spaces', 'Amenities', 'Locations', 'Membership'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setMobileMenuOpen(false)}
            className="text-[28px] sm:text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
          >
            {item}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[28px] sm:text-[32px] font-medium text-white underline underline-offset-4 hover:opacity-60 transition-opacity mt-3"
        >
          Book a tour
        </a>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[100dvh] flex flex-col justify-end md:justify-center px-5 sm:px-8 md:px-10 pb-10 sm:pb-14 md:pb-0 pt-24">
        <div className="w-full max-w-xl">
          {/* Intro label — no more blur */}
          <p
            className="text-white/70 font-normal mb-4 sm:mb-5"
            style={{ fontSize: 'clamp(15px, 3.6vw, 22px)', lineHeight: 1.35 }}
          >
            Welcome to Hive &amp; Co.
            <br />
            A thoughtfully designed coworking environment
          </p>

          {/* Typewriter text — reserve space to avoid layout shift */}
          <p
            className="text-white font-normal mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(17px, 4vw, 26px)',
              lineHeight: 1.35,
              minHeight: 'calc(1.35em * 3)',
            }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.05em] bg-white align-[-0.15em] ml-[2px] animate-pulse" />
            )}
          </p>

          {/* Action pills */}
          <div
            className={`flex flex-wrap gap-2 transition-all duration-500 ${
              pillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {[
              { label: 'Explore private suites', msg: 'Explore our private suites and dedicated workspaces.' },
              { label: 'Schedule a private tour', msg: 'Schedule a private tour of our spaces.' },
              { label: 'Discover community events', msg: 'Discover upcoming community events and gatherings.' },
              { label: 'View membership options', msg: 'View our flexible membership options.' },
            ].map(({ label, msg }) => (
              <button
                key={label}
                onClick={() => alert(msg)}
                className="inline-flex items-center justify-center bg-white text-black rounded-full text-[12px] sm:text-[14px] px-3.5 sm:px-5 py-1.5 whitespace-nowrap hover:bg-black hover:text-white border border-white transition-colors duration-200 cursor-pointer"
              >
                {label}
              </button>
            ))}

            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[12px] sm:text-[14px] px-3.5 sm:px-5 py-1.5 whitespace-nowrap gap-2 hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              <span className="underline underline-offset-1">
                {copied ? 'Copied!' : 'Reach us: hello@hiveandco.space'}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}