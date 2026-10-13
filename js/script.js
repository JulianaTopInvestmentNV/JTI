document.addEventListener('DOMContentLoaded', () => {
  // Tabs Logic
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileMenuIcon = document.getElementById('mobile-menu-icon');

  function setMobileMenuOpen(isOpen) {
    if (!mobileMenuToggle || !mobileNav) return;

    mobileNav.classList.toggle('hidden', !isOpen);
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Sluit navigatiemenu' : 'Open navigatiemenu');
    if (mobileMenuIcon) mobileMenuIcon.textContent = isOpen ? 'close' : 'menu';
  }

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      setMobileMenuOpen(mobileMenuToggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('click', (event) => {
      if (!mobileNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    });
  }

  function activateTab(targetId) {
    if (!targetId || typeof targetId !== 'string') return;
    const escapedTargetId = window.CSS && window.CSS.escape ? CSS.escape(targetId) : targetId.replace(/["\\]/g, '\\$&');

    // Remove active state from all buttons
    tabBtns.forEach(b => {
      b.classList.remove('border-[#8c7343]', 'text-stone-900', 'font-bold');
      b.classList.add('border-transparent', 'text-stone-500', 'hover:text-stone-800', 'hover:border-stone-300', 'font-semibold');
    });

    // Hide all contents
    tabContents.forEach(content => {
      content.classList.add('hidden');
      content.classList.remove('block');
    });

    // Keep the desktop and mobile versions of the selected tab in sync
    document.querySelectorAll(`.tab-btn[data-target="${escapedTargetId}"]`).forEach(matchingBtn => {
      matchingBtn.classList.remove('border-transparent', 'text-stone-500', 'text-stone-600', 'hover:text-stone-800', 'hover:border-stone-300', 'font-medium', 'font-semibold');
      matchingBtn.classList.add('border-[#8c7343]', 'text-stone-900', 'font-bold');
    });

    // Show targeted content with fade
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.remove('hidden');
      targetContent.classList.add('block');
      targetContent.style.opacity = '0';
      setTimeout(() => {
        targetContent.style.transition = 'opacity 0.3s ease';
        targetContent.style.opacity = '1';
      }, 10);
      // Scroll to top of header
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (tabBtns.length > 0 && tabContents.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activateTab(btn.getAttribute('data-target'));
        setMobileMenuOpen(false);
      });
    });

    // Support tab-link elements (CTAs inside tab content that switch tabs)
    document.querySelectorAll('.tab-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        activateTab(link.getAttribute('data-target'));
        setMobileMenuOpen(false);
      });
    });
  }

  // Video Modal Logic
  const openVideoBtn = document.getElementById('open-video');
  const closeModalBtn = document.getElementById('close-modal');
  const videoModal = document.getElementById('video-modal');
  let iframe = videoModal ? videoModal.querySelector('iframe') : null;
  const iframeSrc = iframe ? iframe.src : '';

  if (openVideoBtn && closeModalBtn && videoModal) {
    openVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.classList.remove('hidden');
      // allow display:flex to apply
      setTimeout(() => {
        videoModal.classList.remove('opacity-0');
        videoModal.classList.add('flex');
      }, 10);
      
      if(iframe) {
        // Append autoplay parameter
        const connector = iframeSrc.includes('?') ? '&' : '?';
        iframe.src = iframeSrc + connector + 'autoplay=1';
      }
    });

    const closeModal = () => {
      videoModal.classList.add('opacity-0');
      setTimeout(() => {
        videoModal.classList.add('hidden');
        videoModal.classList.remove('flex');
        if(iframe) iframe.src = iframeSrc; // Reset src
      }, 300);
    };

    closeModalBtn.addEventListener('click', closeModal);

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }
});
