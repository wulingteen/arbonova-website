/* ================================================
   ArboNova — Main Application Logic
   ================================================ */

import './style.css';

// ─── Particle Canvas Background (Brutalist Style) ────────────────────────────────
class ParticleNetwork {
  private canvas: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: 0, y: 0 };

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) return; // Guard clause if canvas is missing
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => {
      this.resize();
      this.init(); // Reinitialize particles on resize to maintain density
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private init() {
    // Fewer particles for brutalist minimalist feel
    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 20000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height));
    }
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      p.update(this.canvas.width, this.canvas.height);
      p.draw(this.ctx);
    });

    // Draw rigid brutalist connections (lines)
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const opacity = (1 - dist / 180) * 0.2; // subtle brutalist line
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(26, 26, 26, ${opacity})`; // #1A1A1A Charcoal
          this.ctx.lineWidth = 1; // Thicker lines for brutalism
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Mouse interaction lines (harsh contrast)
    this.particles.forEach((p) => {
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250) {
        const opacity = (1 - dist / 250) * 0.4;
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(170, 113, 62, ${opacity})`; // Earth Bronze / Rust
        this.ctx.lineWidth = 1.5;
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }
    });

    requestAnimationFrame(this.animate);
  };
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;

  constructor(canvasW: number, canvasH: number) {
    this.x = Math.random() * canvasW;
    this.y = Math.random() * canvasH;
    // Slower, more deliberate movement
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.size = Math.random() * 3 + 1; // slightly larger
    this.opacity = Math.random() * 0.6 + 0.2;
  }

  update(canvasW: number, canvasH: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvasW) this.vx *= -1;
    if (this.y < 0 || this.y > canvasH) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(26, 26, 26, ${this.opacity})`; // #1A1A1A Charcoal
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}


// ─── Scroll-Triggered Animations ───────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, _index) => {
        if (entry.isIntersecting) {
          // Stagger animation for sibling elements
          const el = entry.target as HTMLElement;
          const parent = el.parentElement;
          if (parent) {
            const siblings = Array.from(parent.querySelectorAll('.animate-on-scroll'));
            const siblingIndex = siblings.indexOf(el);
            const delay = siblingIndex * 100;
            setTimeout(() => {
              el.classList.add('visible');
            }, delay);
          } else {
            el.classList.add('visible');
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
}

// ─── Navbar Scroll Effect ──────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar')!;
  const hamburger = document.getElementById('hamburger')!;
  const navLinks = document.getElementById('navLinks')!;

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── Counter Animation ─────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.target || '0', 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(el: HTMLElement, target: number) {
  const duration = 2000;
  const start = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toString();
    }
  }

  requestAnimationFrame(update);
}

// ─── Smooth Scroll ─────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = (anchor as HTMLAnchorElement).getAttribute('href')!;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offset = 72; // navbar height
        const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ─── Contact Form ──────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>已送出 ✓</span>';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.opacity = '1';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// ─── Splash Screen Logic (Dynamic Network Growth) ──────────────
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  const canvas = document.getElementById('splashCanvas') as HTMLCanvasElement | null;
  
  // If splash screen element doesn't exist, exit.
  if (!splash || !canvas) return;

  // Check if splash screen has already been played in this session
  if (sessionStorage.getItem('splashPlayed') === 'true') {
    splash.style.display = 'none'; // Instantly hide without animation
    return;
  }

  // Mark as played for future navigations
  sessionStorage.setItem('splashPlayed', 'true');

  document.body.style.overflow = 'hidden';

  const ctx = canvas.getContext('2d')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  type Shape = 'circle' | 'diamond' | 'triangle' | 'hexagon' | 'square';
  const SHAPES: Shape[] = ['circle', 'diamond', 'triangle', 'hexagon', 'square'];
  const LINE_COLORS = ['rgba(26,26,26,', 'rgba(50,101,58,', 'rgba(170,113,62,'];

  interface SplashNode {
    x: number; y: number; shape: Shape;
    radius: number; opacity: number; targetOpacity: number; born: number;
  }
  interface SplashEdge {
    from: SplashNode; to: SplashNode;
    progress: number; born: number; color: string;
  }

  const splashNodes: SplashNode[] = [];
  const splashEdges: SplashEdge[] = [];

  // Seed center node
  splashNodes.push({ x: cx, y: cy, shape: 'hexagon', radius: 8, opacity: 0, targetOpacity: 0.9, born: performance.now() });

  let waveCount = 0;
  const maxWaves = 14;
  const maxR = Math.hypot(cx, cy);

  function spawnWave() {
    if (waveCount >= maxWaves) return;
    waveCount++;
    const num = 3 + Math.floor(Math.random() * 4);
    const baseR = (waveCount / maxWaves) * maxR * 0.97;

    for (let i = 0; i < num; i++) {
      const angle = (i / num) * Math.PI * 2 + waveCount * 0.37;
      const spread = (Math.random() - 0.5) * 0.5;
      const dist = baseR * (0.75 + Math.random() * 0.5);
      const nx = cx + Math.cos(angle + spread) * dist;
      const ny = cy + Math.sin(angle + spread) * dist;
      const node: SplashNode = {
        x: nx, y: ny,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        radius: 3 + Math.random() * 5,
        opacity: 0, targetOpacity: 0.5 + Math.random() * 0.4,
        born: performance.now(),
      };
      splashNodes.push(node);

      // Connect to 1-2 nearest existing nodes
      const nearest = [...splashNodes.slice(0, -1)]
        .sort((a, b) => (a.x - nx) ** 2 + (a.y - ny) ** 2 - ((b.x - nx) ** 2 + (b.y - ny) ** 2))
        .slice(0, 1 + Math.floor(Math.random() * 2));
      nearest.forEach(target => splashEdges.push({
        from: node, to: target, progress: 0, born: performance.now(),
        color: LINE_COLORS[Math.floor(Math.random() * LINE_COLORS.length)],
      }));
    }
    if (waveCount < maxWaves) setTimeout(spawnWave, 250);
  }
  setTimeout(spawnWave, 120);

  // Shape drawing
  function drawShape(n: SplashNode) {
    const { x, y, radius: r, shape } = n;
    ctx.beginPath();
    if (shape === 'circle') ctx.arc(x, y, r, 0, Math.PI * 2);
    else if (shape === 'square') ctx.rect(x - r, y - r, r * 2, r * 2);
    else if (shape === 'diamond') { ctx.moveTo(x, y - r * 1.3); ctx.lineTo(x + r * 1.3, y); ctx.lineTo(x, y + r * 1.3); ctx.lineTo(x - r * 1.3, y); ctx.closePath(); }
    else if (shape === 'triangle') { const h = r * 1.7; ctx.moveTo(x, y - h); ctx.lineTo(x + h, y + h * 0.6); ctx.lineTo(x - h, y + h * 0.6); ctx.closePath(); }
    else if (shape === 'hexagon') { for (let j = 0; j < 6; j++) { const a = (j / 6) * Math.PI * 2 - Math.PI / 6; j === 0 ? ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); }
  }

  let animId: number;
  let stopped = false;

  function render(now: number) {
    if (stopped) return;
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);

    // Edges
    splashEdges.forEach(e => {
      e.progress = Math.min(1, (now - e.born) / 550);
      if (e.progress <= 0) return;
      const tx = e.from.x + (e.to.x - e.from.x) * e.progress;
      const ty = e.from.y + (e.to.y - e.from.y) * e.progress;
      ctx.beginPath();
      ctx.strokeStyle = e.color + Math.min(0.35, e.progress * 0.35) + ')';
      ctx.lineWidth = 0.8;
      ctx.moveTo(e.from.x, e.from.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    });

    // Nodes
    splashNodes.forEach(n => {
      n.opacity = Math.min(n.targetOpacity, ((now - n.born) / 350) * n.targetOpacity);
      ctx.fillStyle = `rgba(26,26,26,${n.opacity})`;
      drawShape(n);
      ctx.fill();
    });

    animId = requestAnimationFrame(render);
  }
  animId = requestAnimationFrame(render);

  // Text reveal after 1.8s
  const textEl = splash.querySelector('.splash-text') as HTMLElement | null;
  const wordmarkEl = splash.querySelector('.splash-wordmark') as HTMLElement | null;
  setTimeout(() => {
    if (wordmarkEl) wordmarkEl.style.opacity = '1';
    if (textEl) textEl.style.opacity = '1';
  }, 1800);

  // Dismiss at 4.8s
  setTimeout(() => {
    stopped = true;
    cancelAnimationFrame(animId);
    splash.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => splash.remove(), 900);
  }, 4800);
}

// ─── Internationalization (i18n) ──────────────────────────────
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    "nav.features": "Features",
    "nav.howItWorks": "How It Works",
    "nav.useCases": "Use Cases",
    "nav.jennyLink": "AI Agent (Jenny)",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    // Home - Hero
    "home.hero.badge": "<span class=\"badge-dot\"></span> AI-Powered Enterprise Solutions",
    "home.hero.title": "Building Your<br /><span class=\"gradient-text\">AI Agent Team</span>",
    "home.hero.subtitle": "Transforming complex business logic into automated workflows through multi-agent collaboration.<br />Empower your enterprise with unprecedented efficiency.",
    "home.hero.btn.consult": "<span>Get Started</span> <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.8\"><path d=\"M4 12h16m-6-6 l6 6-6 6\"/></svg>",
    "home.hero.btn.more": "Learn More",
    "home.hero.stat1.label": "Enterprise Clients",
    "home.hero.stat2.label": "AI Agents Deployed",
    "home.hero.stat3.label": "Client Satisfaction",

    // Home - Jenny Banner
    "home.banner.title": "Let top recruiters focus on \"closing\", leave the tedious outreach to AI.<br /><span class=\"gradient-text\">Meet Jenny</span> —— Your 24/7 Multi-Agent recruitment ally.",
    "home.banner.btn": "<span>See How Jenny Doubles Interview Rates</span> <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"><path d=\"M5 12h14M12 5l7 7-7 7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",

    // Jenny Page - Hero & Stats
    "jenny.hero.eyebrow": "Exclusive for Recruiters • AI Agent Team",
    "jenny.hero.title": "Jenny",
    "jenny.hero.subtitle": "Your 24/7 Automated Recruitment Ally",
    "jenny.hero.btn.demo": "Book a Demo",
    "jenny.hero.btn.features": "Explore Features",
    "jenny.statement.text": "Is this the daily challenge your team faces?<br /><span>A consultant's time should be spent on \"building human connections\" and \"closing deals\", not endless resume screening, paperwork, and progress tracking.</span>",

    // Jenny Page - Core Features
    "jenny.bento.header.title": "Jenny's 4 Core Capabilities",
    "jenny.bento.header.subtitle": "Building a High-Efficiency Recruitment Engine (HR Efficiency)",
    "jenny.bento.f1.title": "World's First<br />Multi-Agent Assistant",
    "jenny.bento.f1.desc": "To completely unleash productivity, ArboNova™ partnered with top industry experts to develop Jenny. She possesses three independent brains: deeply understanding the JD, hand-picking suitable resumes, and automatically writing high-response cold outreach emails.",
    "jenny.bento.f2.title": "Zero-Delay Automated Outreach",
    "jenny.bento.f2.desc": "From initial contact to follow-up emails, everything is fully automated. She generates and sends personalized icebreaker emails, dramatically increasing open and reply rates.",
    "jenny.bento.f3.title": "Deep Semantic Matching",
    "jenny.bento.f3.desc": "Going beyond traditional keyword searches to accurately uncover the \"hidden fit\" between the JD and resumes, digging up the dark horses that best match your corporate culture.",
    "jenny.bento.f4.title": "Automated Process Tracking<br />& Interview Validation",
    "jenny.bento.f4.desc": "Automatically tracks candidate responses and intentions, classifying them systematically. Combined with our exclusive RAG candidate database, it substantially improves the accuracy of personnel recommendations. Recruiters only need to step in at the most critical closing stage.",
    "jenny.callout.text": "In the Age of AI,<br /><span style=\"color: white; text-shadow: none;\">Let tech amplify your human value.</span>",

    // Home - Use Cases
    "home.features.tag": "Core Capabilities",
    "home.features.title": "Redefining Enterprise Efficiency<br /><span class=\"gradient-text\">with AI Agent Teams</span>",
    "home.features.desc": "Our AI Agent Team combines multi-agent technology with deep enterprise integration to deliver four core capabilities.",
    "home.features.f1.title": "Intelligent Collaboration",
    "home.features.f1.desc": "Multiple AI Agents perform specialized roles and coordinate like a professional human team to handle complex cross-departmental tasks.",
    "home.features.f2.title": "Workflow Automation",
    "home.features.f2.desc": "Fully automate repetitive workflows, from data collection and analysis to report generation, drastically reducing labor costs.",
    "home.features.f3.title": "Real-time Learning",
    "home.features.f3.desc": "Agents continuously learn and evolve based on interaction feedback, constantly optimizing decision quality.",
    "home.features.f4.title": "Security & Compliance",
    "home.features.f4.desc": "Enterprise-grade security, data encryption, and access control, compliant with ISO 27001 standards to protect your trade secrets.",
    // Home - How It Works
    "home.works.tag": "How It Works",
    "home.works.title": "Launch Your AI Team<br /><span class=\"gradient-text\">in 3 Steps</span>",
    "home.works.desc": "From requirement analysis to going live, we design the perfect AI Agent combination for you.",
    "home.works.s1.title": "Requirement Analysis",
    "home.works.s1.desc": "Deep dive into your enterprise pain points and process bottlenecks to tailor an AI Agent strategy and deployment architecture.",
    "home.works.s2.title": "Agent Deployment",
    "home.works.s2.desc": "Seamlessly integrate the AI Agent Team into your existing systems, including API connections, data flows, and permission settings.",
    "home.works.s3.title": "Continuous Optimization",
    "home.works.s3.desc": "Utilize real-time monitoring and feedback loops to continuously tune Agent performance, ensuring steady improvements in quality.",

    // Home - Use Cases
    "home.cases.tag": "Use Cases",
    "home.cases.title": "Intelligent Applications<br /><span class=\"gradient-text\">Across Industries</span>",
    "home.cases.desc": "AI Agent Teams flexibly adapt to different industry scenarios, delivering immediate and quantifiable benefits.",
    "home.cases.c1.title": "Intelligent Customer Service",
    "home.cases.c1.desc": "Multilingual AI support Agents collaborate to instantly resolve customer queries, automatically route tickets, and generate service summaries.",
    "home.cases.c1.m1": "Response Efficiency",
    "home.cases.c1.m2": "Labor Cost Reduction",
    "home.cases.c2.title": "Precision Marketing",
    "home.cases.c2.desc": "AI Agents automatically analyze market data, generate personalized content, execute A/B tests, and optimize ad strategies in real-time.",
    "home.cases.c2.m1": "Conversion Rate",
    "home.cases.c2.m2": "Marketing Cost Savings",
    "home.cases.c3.title": "Data Analytics",
    "home.cases.c3.desc": "Multiple analytical Agents collaboratively process massive datasets, automatically generating insight reports, trend forecasts, and risk alerts.",
    "home.cases.c3.m1": "Analysis Speed",
    "home.cases.c3.m2": "Report Accuracy",

    // Home - About
    "home.about.tag": "About Us",
    "home.about.desc": "ArboNova™ was founded by CEO Tim Kuo, leveraging a background in international finance. We combine financial risk control and governance thinking with the precise execution discipline of a PMP® to implement our core philosophy: the Intelligent Rainforest. We evolve AI from mere assistive tools into executing teams that enterprises can trust and operate long-term.",
    "home.about.v1.title": "Intelligent Rainforest",
    "home.about.v1.desc": "Making AI part of the enterprise ecosystem, evolving and collaborating diversely like a living rainforest.",
    "home.about.v2.title": "Vision",
    "home.about.v2.desc": "To become the most trusted AI Agent Team solution provider in the Asia-Pacific region.",
    "home.about.v3.title": "Core Philosophy",
    "home.about.v3.desc": "Human-Centric Tech as the Roots",

    // Home - Contact & Footer
    "home.contact.tag": "Contact Us",
    "home.contact.title": "Start Creating Your<br /><span class=\"gradient-text\">AI Agent Team</span>",
    "home.contact.desc": "Leave your information below, and our experts will contact you to arrange a customized demonstration.",
    "home.contact.label.address": "Address",
    "home.contact.val.address": "7F, No. 270, Sec. 4, Zhongxiao E. Rd., Da'an Dist., Taipei City",
    "home.contact.label.phone": "Phone",
    "home.contact.label.mobile": "Mobile",
    "home.contact.label.email": "Email",
    "home.contact.form.name": "Your Name *",
    "home.contact.form.title": "Company Title *",
    "home.contact.form.company": "Company Name *",
    "home.contact.form.email": "Work Email *",
    "home.contact.form.phone": "Contact Number *",
    "home.contact.form.interest": "Interested Application Scenarios *",
    "home.contact.form.opt1": "Please Select...",
    "home.contact.form.opt2": "Jenny (HR/Recruitment Agent)",
    "home.contact.form.opt3": "Intelligent Customer Service",
    "home.contact.form.opt4": "Precision Marketing / Lead Generation",
    "home.contact.form.opt5": "Internal Data Analytics / Process Automation",
    "home.contact.form.opt6": "Other (Please describe below)",
    "home.contact.form.message": "Current Pain Points or Goals (Optional)",
    "home.contact.form.submit": "Submit Request",
    "home.footer.rights": "© 2024 ArboNova™ Technology. All rights reserved."
  }
};

let currentLang = 'zh';

function initI18n() {
  const langSwitchBtns = document.querySelectorAll('.lang-switch');
  
  langSwitchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Toggle language
      currentLang = currentLang === 'zh' ? 'en' : 'zh';
      
      // Update button text globally
      langSwitchBtns.forEach(b => {
        b.textContent = currentLang === 'zh' ? 'EN' : '中文';
      });
      
      // Update document content
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          if (currentLang === 'en') {
            const translatedText = translations.en[key];
            if (translatedText) {
              // Store original Chinese text if not already stored
              if (!el.hasAttribute('data-i18n-zh')) {
                el.setAttribute('data-i18n-zh', el.innerHTML);
              }
              el.innerHTML = translatedText;
            }
          } else if (currentLang === 'zh' && el.hasAttribute('data-i18n-zh')) {
            // Restore original Chinese text
            el.innerHTML = el.getAttribute('data-i18n-zh')!;
          }
        }
      });
      
      // Re-initialize any dynamic text resizing or interactions if needed
    });
  });
}

// ─── Initialize Everything ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  new ParticleNetwork('particleCanvas');
  initScrollAnimations();
  initNavbar();
  initCounters();
  initSmoothScroll();
  initContactForm();
  initI18n();
});
