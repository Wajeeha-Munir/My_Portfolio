import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const ParticleNetwork = ({ bgColor, lineColor: lineColorProp }: { bgColor: string; lineColor: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; dx: number; dy: number; radius: number; color: string; isGlowing: boolean }[] = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const colors = ['#00CED1', '#0EA5E9', '#22D3EE'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 1.0,
        dy: (Math.random() - 0.5) * 1.0,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        isGlowing: Math.random() > 0.8
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const ddx = particles[i].x - particles[j].x;
          const ddy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = lineColorProp;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.isGlowing) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bgColor, lineColorProp]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none'
      }}
    />
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navLinks = ['Home', 'About', 'Skills', 'Projects', 'Volunteer', 'Contact'];

  const dark = {
    pageBg: '#0A0E1A',
    sectionAltBg: '#0D1221',
    accent: '#0EA5E9',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    cardBg: 'rgba(240, 248, 255, 0.85)',
    cardText: '#0F172A',
    cardHeading: '#0F172A',
    cardBody: '#334155',
    navBg: 'rgba(8, 13, 26, 0.95)',
    navLinkColor: '#FFFFFF',
    particleLine: 'rgba(14, 165, 233, 0.15)',
    fontFamily: "'Poppins', sans-serif",
    footerBg: '#0A0E1A',
    footerBorder: 'rgba(255,255,255,0.05)',
    footerText: '#64748B'
  };

  const light = {
    pageBg: '#EBF5FF',
    sectionAltBg: '#F0F9FF',
    accent: '#0EA5E9',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    cardBg: '#FFFFFF',
    cardText: '#0F172A',
    cardHeading: '#0F172A',
    cardBody: '#334155',
    navBg: 'rgba(235, 245, 255, 0.97)',
    navLinkColor: '#0F172A',
    particleLine: 'rgba(14, 165, 233, 0.2)',
    fontFamily: "'Poppins', sans-serif",
    footerBg: '#EBF5FF',
    footerBorder: 'rgba(0,0,0,0.05)',
    footerText: '#64748B'
  };

  const t = isDark ? dark : light;

  const SectionHeading = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
    <div style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '3.5rem' }}>
      <div style={{ color: t.accent, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', fontWeight: 600, marginBottom: '0.5rem' }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: 700, color: t.textPrimary, margin: '0 0 1rem 0' }}>
        {title}
      </h2>
      <div style={{ height: '3px', width: '40px', backgroundColor: t.accent, margin: '0 auto 1.5rem auto', borderRadius: '2px' }} />
      {sub && (
        <p style={{ color: t.textSecondary, fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          {sub}
        </p>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: t.pageBg, color: t.textPrimary, minHeight: '100vh', fontFamily: t.fontFamily, overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        .hover-nav-link { transition: color 0.2s ease; }
        .hover-nav-link:hover { color: ${t.accent} !important; }
        .hover-btn-outline { transition: all 0.2s ease; }
        .hover-btn-outline:hover { background-color: rgba(14, 165, 233, 0.1) !important; }
        .hover-card-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-card-lift:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(14,165,233,0.15); }
        .download-btn { transition: opacity 0.2s ease; }
        .download-btn:hover { opacity: 0.88; }
        .toggle-btn { transition: all 0.2s ease; }
        .toggle-btn:hover { border-color: ${t.accent} !important; }
        @media (max-width: 767px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .vol-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: isScrolled ? t.navBg : (isDark ? 'rgba(10, 14, 26, 0.5)' : 'rgba(235, 245, 255, 0.7)'),
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
        padding: isMobile ? '0.85rem 1rem' : '1.1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        {/* Left spacer */}
        <div style={{ flex: 1 }} />

        {/* Center nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
            {navLinks.map(link => (
              <button
                key={link}
                className="hover-nav-link"
                onClick={() => scrollToSection(link.toLowerCase())}
                style={{
                  background: 'none', border: 'none', color: t.navLinkColor,
                  cursor: 'pointer', fontSize: '15px', padding: 0, fontWeight: 400,
                  fontFamily: t.fontFamily
                }}
              >
                {link}
              </button>
            ))}
            <button
              className="toggle-btn"
              onClick={() => setIsDark(prev => !prev)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                background: 'transparent',
                border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                borderRadius: '50px',
                width: '30px', height: '30px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '15px', marginLeft: '4px'
              }}
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          </div>
        )}

        {/* Right: Download CV + hamburger */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="/Wajeeha_Munir_CV.pdf"
            download="Wajeeha_Munir_CV.pdf"
            className="download-btn"
            style={{
              backgroundColor: t.accent, color: '#fff',
              padding: isMobile ? '7px 14px' : '8px 22px',
              borderRadius: '50px', textDecoration: 'none', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: isMobile ? '13px' : '14px',
              whiteSpace: 'nowrap'
            }}
          >
            ⬇ Download CV
          </a>
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: t.navLinkColor, cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {isMobile && mobileMenuOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            backgroundColor: t.navBg,
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            borderBottom: `1px solid ${t.footerBorder}`,
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
          }}>
            {navLinks.map(link => (
              <button key={link} onClick={() => scrollToSection(link.toLowerCase())} style={{
                background: 'none', border: 'none', color: t.navLinkColor, cursor: 'pointer',
                fontSize: '16px', fontWeight: 500, textAlign: 'left', padding: '0.5rem 0',
                fontFamily: t.fontFamily
              }}>
                {link}
              </button>
            ))}
            <button
              onClick={() => { setIsDark(prev => !prev); setMobileMenuOpen(false); }}
              style={{
                background: 'transparent', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                borderRadius: '50px', padding: '0.5rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                cursor: 'pointer', fontSize: '14px', color: t.navLinkColor, width: 'fit-content',
                fontFamily: t.fontFamily
              }}
            >
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '0 2rem', overflow: 'hidden'
      }}>
        <ParticleNetwork bgColor={t.pageBg} lineColor={t.particleLine} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', marginTop: '2rem' }}>
          <p style={{ color: t.textPrimary, fontSize: '18px', margin: '0 0 0.5rem 0', fontWeight: 400 }}>
            Hi! I'm
          </p>
          <h1 style={{ fontSize: isMobile ? '52px' : '88px', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.1, color: t.textPrimary }}>
            Wajeeha Munir
          </h1>
          <h2 style={{ fontSize: '24px', fontWeight: 300, color: t.accent, margin: '0 0 2rem 0' }}>
            Python Developer
          </h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/wajeeha-munir-823b90311/' },
              { label: 'GitHub', href: 'https://github.com/Wajeeha-Munir' },
              { label: 'Email', href: 'https://mail.google.com/mail/?view=cm&to=wajeehamunir515@gmail.com' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-btn-outline"
                style={{
                  backgroundColor: 'transparent', color: t.accent,
                  border: `1.5px solid ${t.accent}`,
                  padding: '8px 22px', borderRadius: '6px', fontSize: '14px',
                  textDecoration: 'none', fontWeight: 500
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', backgroundColor: t.sectionAltBg }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <SectionHeading eyebrow="WHO I AM" title="About Me" />
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: t.textPrimary, textAlign: 'center', margin: 0 }}>
            I am <strong style={{ fontWeight: 700 }}>Wajeeha Munir</strong>, a third-year Business IT student at UET Lahore, blending business strategy with information technology to create meaningful solutions. With hands-on experience in Python development, corporate HR field research, and graphic design leadership, I am driven by technology that solves real problems — and actively seeking an internship to grow my skills further.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', backgroundColor: t.pageBg }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <SectionHeading eyebrow="WHAT I KNOW" title="Skills & Expertise" />
          <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

            {/* TECHNICAL */}
            <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px', color: t.cardText }}>
              <h3 style={{ color: t.accent, fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textAlign: 'center', margin: '0 0 24px 0' }}>
                TECHNICAL
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: 'devicon-python-plain colored', name: 'Python (OOP)', val: '80%' },
                  { icon: 'devicon-html5-plain colored', name: 'HTML & CSS', val: '70%' },
                  { icon: 'devicon-javascript-plain colored', name: 'JavaScript', val: '65%' },
                  { icon: 'devicon-mysql-original colored', name: 'MySQL', val: '55%' },
                  { icon: 'devicon-react-original colored', name: 'React', val: '50%' },
                  { icon: '', name: 'Canva', val: '75%', customIcon: true },
                ].map((skill, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px' }}>
                      {skill.customIcon ? (
                        <div style={{ width: '18px', height: '18px', backgroundColor: '#00C4CC', borderRadius: '4px', flexShrink: 0 }} />
                      ) : (
                        <i className={skill.icon} style={{ fontSize: '18px', width: '18px', textAlign: 'center' }} />
                      )}
                      <span style={{ fontSize: '14px', fontWeight: 500, color: t.cardHeading }}>{skill.name}</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: skill.val, backgroundColor: t.accent, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOFT SKILLS */}
            <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px', color: t.cardText }}>
              <h3 style={{ color: t.accent, fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textAlign: 'center', margin: '0 0 24px 0' }}>
                SOFT SKILLS
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {['Problem-Solving', 'Team Management', 'Communication', 'Adaptability', 'Collaboration', 'Content Writing', 'Data Entry', 'Leadership'].map((skill, idx) => (
                  <span key={idx} style={{ border: '1px solid #CBD5E1', color: '#475569', backgroundColor: 'transparent', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 500 }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* LANGUAGES */}
            <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px', color: t.cardText }}>
              <h3 style={{ color: t.accent, fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textAlign: 'center', margin: '0 0 24px 0' }}>
                LANGUAGES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ fontWeight: 700, color: t.cardHeading, fontSize: '15px' }}>English</span>
                  <span style={{ backgroundColor: t.accent, color: '#fff', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 500 }}>Professional</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: t.cardHeading, fontSize: '15px' }}>Urdu</span>
                  <span style={{ backgroundColor: '#10B981', color: '#fff', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 500 }}>Native</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', backgroundColor: t.sectionAltBg }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <SectionHeading eyebrow="WHAT I'VE BUILT" title="Projects & Case Studies" sub="Technical work, industrial research, and social initiatives." />
          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

            {/* Card 1 */}
            <div className="hover-card-lift" style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: t.textMuted, fontSize: '13px' }}>Nov 2024</span>
                <span style={{ backgroundColor: '#CCFBF1', color: '#047857', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 600 }}>Python · OOP</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.cardHeading, margin: '0 0 12px 0' }}>Intern Management System</h3>
              <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px', padding: '6px 10px', borderRadius: '4px', marginBottom: '16px', fontWeight: 500, width: 'fit-content' }}>
                Skill: Object-Oriented Programming
              </div>
              <p style={{ color: t.cardBody, fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0', flexGrow: 1 }}>
                Automated system for task assignment, deadline tracking, performance evaluation, and incentive management for interns.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {['Python', 'OOP', 'Automation'].map((tag, idx) => (
                  <span key={idx} style={{ backgroundColor: '#E2E8F0', color: '#475569', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
              <a href="https://github.com/Wajeeha-Munir/Intern-Management-System" target="_blank" rel="noopener noreferrer" style={{ color: t.accent, fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                View on GitHub ↗
              </a>
            </div>

            {/* Card 2 */}
            <div className="hover-card-lift" style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: t.textMuted, fontSize: '13px' }}>2024</span>
                <span style={{ backgroundColor: '#CFFAFE', color: '#0F766E', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 600 }}>HR Research</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.cardHeading, margin: '0 0 16px 0' }}>HR & Corporate Practices</h3>
              <p style={{ color: t.cardBody, fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0', flexGrow: 1 }}>
                Field analysis of IT recruitment, onboarding, HR workflows, and managerial decision-making at NETSOL Technologies and Coding Crafts.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                {['HR Research', 'Field Analysis', 'Management'].map((tag, idx) => (
                  <span key={idx} style={{ backgroundColor: '#E2E8F0', color: '#475569', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Card 3 */}
            <div className="hover-card-lift" style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: t.textMuted, fontSize: '13px' }}>Mar 2025</span>
                <span style={{ backgroundColor: '#E0E7FF', color: '#0369A1', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 600 }}>Social Design</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.cardHeading, margin: '0 0 16px 0' }}>Social Impact – SDG 1</h3>
              <p style={{ color: t.cardBody, fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0', flexGrow: 1 }}>
                Mobile app-based model aligned with UN SDG 1, funding skill-based equipment through micro-donations to support financial independence.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                {['SDG 1', 'Social Impact', 'Mobile'].map((tag, idx) => (
                  <span key={idx} style={{ backgroundColor: '#E2E8F0', color: '#475569', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer */}
      <section id="volunteer" style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', backgroundColor: t.pageBg }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <SectionHeading eyebrow="GIVING BACK" title="Leadership & Volunteer Work" sub="Building communities, managing events, and guiding design teams." />
          <div className="vol-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>

            <div className="hover-card-lift" style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'inline-block', backgroundColor: '#CCFBF1', color: '#0EA5E9', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 600, marginBottom: '16px' }}>
                Leadership
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.cardHeading, margin: '0 0 4px 0' }}>Director of Graphic Designing</h3>
              <div style={{ color: t.accent, fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Justuju by IB&M UET</div>
              <p style={{ color: t.cardBody, fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Led design initiatives for society events and social media. Coordinated teams, managed timelines, and guided junior designers.
              </p>
            </div>

            <div className="hover-card-lift" style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'inline-block', backgroundColor: '#E2E8F0', color: '#475569', fontSize: '11px', padding: '4px 10px', borderRadius: '100px', fontWeight: 600, marginBottom: '16px' }}>
                Volunteer
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.cardHeading, margin: '0 0 4px 0' }}>Management Volunteer – Career Fair</h3>
              <div style={{ color: t.accent, fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Career Fair 2025 – UET Lahore</div>
              <p style={{ color: t.cardBody, fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                Coordinated with corporate guests, managed student flow, and supported event logistics for UET Career Fair 2025.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: isMobile ? '4rem 1.5rem' : '6rem 2rem', backgroundColor: t.sectionAltBg }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <SectionHeading eyebrow="REACH OUT" title="Get In Touch" sub="Open to internships, collaborations, and opportunities." />
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>

            <a
              href="https://mail.google.com/mail/?view=cm&to=wajeehamunir515@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-card-lift"
              style={{
                backgroundColor: t.cardBg, borderRadius: '14px', padding: '26px 20px',
                textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '26px', marginBottom: '12px' }}>💌</div>
              <div style={{ color: t.accent, fontSize: '11px', fontWeight: 600, letterSpacing: '1px', marginBottom: '8px' }}>EMAIL</div>
              <div style={{ color: t.cardHeading, fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                wajeehamunir515@gmail.com
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/wajeeha-munir-823b90311/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-card-lift"
              style={{
                backgroundColor: t.cardBg, borderRadius: '14px', padding: '26px 20px',
                textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '26px', marginBottom: '12px' }}>💼</div>
              <div style={{ color: t.accent, fontSize: '11px', fontWeight: 600, letterSpacing: '1px', marginBottom: '8px' }}>LINKEDIN</div>
              <div style={{ color: t.cardHeading, fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                wajeeha-munir-823b90311
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: t.footerBg, padding: '24px', textAlign: 'center',
        borderTop: `1px solid ${t.footerBorder}`
      }}>
        <p style={{ margin: 0, color: t.footerText, fontSize: '13px' }}>
          © 2026 Wajeeha Munir · Lahore, Pakistan
        </p>
      </footer>
    </div>
  );
}
