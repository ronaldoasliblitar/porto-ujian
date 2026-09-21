(function(){
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('mhe-theme'); } catch(e){}
  if(saved === 'light' || saved === 'dark'){
    root.setAttribute('data-theme', saved);
  }
  function applyTheme(t){
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('mhe-theme', t); } catch(e){}
  }
  function toggleTheme(){
    var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  }
  var tBtn = document.getElementById('themeToggle');
  var tBtnMobile = document.getElementById('themeToggleMobile');
  if(tBtn) tBtn.addEventListener('click', toggleTheme);
  if(tBtnMobile) tBtnMobile.addEventListener('click', toggleTheme);

  /* ---------- Navbar background on scroll ---------- */
  var nav = document.getElementById('siteNav');
  function onScrollNav(){
    if(window.scrollY > 30){ nav.classList.add('scrolled'); }
    else { nav.classList.remove('scrolled'); }
  }
  document.addEventListener('scroll', onScrollNav, {passive:true});
  onScrollNav();

  /* ---------- Back to top ---------- */
  var backTop = document.getElementById('backTop');
  function onScrollTop(){
    if(window.scrollY > 500){ backTop.classList.add('show'); }
    else { backTop.classList.remove('show'); }
  }
  document.addEventListener('scroll', onScrollTop, {passive:true});
  backTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  });

  /* ---------- Close mobile offcanvas when a link is tapped ---------- */
  var offcanvasEl = document.getElementById('mobileNav');
  document.querySelectorAll('.nav-links-mobile').forEach(function(link){
    link.addEventListener('click', function(){
      var oc = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if(oc) oc.hide();
    });
  });

  /* ---------- Active nav link highlighting ---------- */
  var sections = ['home','about','skill','project','contact'].map(function(id){
    return document.getElementById(id);
  });
  var navAnchors = document.querySelectorAll('[data-nav]');
  var navObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var id = entry.target.id;
        navAnchors.forEach(function(a){
          a.classList.toggle('active', a.getAttribute('data-nav') === id);
        });
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
  sections.forEach(function(s){ if(s) navObserver.observe(s); });

  /* ---------- Reveal-on-scroll + animated skill bars ---------- */
  var revealObserver = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ revealObserver.observe(el); });

  var barObserver = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var fills = entry.target.querySelectorAll('.bar-fill');
        fills.forEach(function(f){
          var pct = f.getAttribute('data-percent') || 0;
          requestAnimationFrame(function(){ f.style.width = pct + '%'; });
        });
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.3});
  document.querySelectorAll('.skill-card').forEach(function(card){ barObserver.observe(card); });

  /* ---------- Project filter ---------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterButtons.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      projectCards.forEach(function(card){
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Contact form (demo, no backend) ---------- */
  var form = document.getElementById('contactForm');
  var successMsg = document.getElementById('formSuccess');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    successMsg.style.display = 'block';
    form.reset();
    setTimeout(function(){ successMsg.style.display = 'none'; }, 6000);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
