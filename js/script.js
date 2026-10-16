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


  // Contact Advisor Modal Logic
  const openAdvisorBtn = document.getElementById('open-advisor-modal');
  const closeAdvisorBtn = document.getElementById('close-advisor-modal');
  const advisorModal = document.getElementById('advisor-modal');
  const advisorForm = document.getElementById('advisor-contact-form');
  const advisorSuccessState = document.getElementById('advisor-success-state');
  const advisorSuccessCloseBtn = document.getElementById('advisor-success-close-btn');
  const advisorSuccessName = document.getElementById('advisor-success-name');
  const advisorSubmitBtn = document.getElementById('advisor-submit-btn');
  const advisorSubmitText = document.getElementById('advisor-submit-text');
  const advisorSubmitError = document.getElementById('advisor-submit-error');

  if (advisorModal && openAdvisorBtn) {
    const openAdvisorModal = (e) => {
      if (e) e.preventDefault();
      // Ensure form is visible and success state reset on re-open
      if (advisorForm) advisorForm.classList.remove('hidden');
      if (advisorSuccessState) advisorSuccessState.classList.add('hidden');

      advisorModal.classList.remove('hidden');
      setTimeout(() => {
        advisorModal.classList.remove('opacity-0');
        advisorModal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
        const nameInput = document.getElementById('advisor-name');
        if (nameInput) nameInput.focus();
      }, 10);
    };

    const closeAdvisorModal = () => {
      advisorModal.classList.add('opacity-0');
      setTimeout(() => {
        advisorModal.classList.add('hidden');
        advisorModal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
      }, 300);
    };

    openAdvisorBtn.addEventListener('click', openAdvisorModal);
    if (closeAdvisorBtn) closeAdvisorBtn.addEventListener('click', closeAdvisorModal);
    if (advisorSuccessCloseBtn) advisorSuccessCloseBtn.addEventListener('click', closeAdvisorModal);

    advisorModal.addEventListener('click', (e) => {
      if (e.target === advisorModal) {
        closeAdvisorModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !advisorModal.classList.contains('hidden')) {
        closeAdvisorModal();
      }
    });

    if (advisorForm) {
      advisorForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('advisor-name');
        const emailInput = document.getElementById('advisor-email');
        const phoneInput = document.getElementById('advisor-phone');

        const nameError = document.getElementById('advisor-name-error');
        const emailError = document.getElementById('advisor-email-error');
        const phoneError = document.getElementById('advisor-phone-error');

        let isValid = true;

        // Reset errors
        [nameError, emailError, phoneError].forEach(err => err && err.classList.add('hidden'));
        [nameInput, emailInput, phoneInput].forEach(inp => inp && inp.classList.remove('border-rose-500'));
        if (advisorSubmitError) advisorSubmitError.classList.add('hidden');

        // Validate Name
        if (!nameInput || !nameInput.value.trim()) {
          if (nameError) nameError.classList.remove('hidden');
          if (nameInput) nameInput.classList.add('border-rose-500');
          isValid = false;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
          if (emailError) emailError.classList.remove('hidden');
          if (emailInput) emailInput.classList.add('border-rose-500');
          isValid = false;
        }

        // Validate Phone
        if (!phoneInput || phoneInput.value.trim().length < 6) {
          if (phoneError) phoneError.classList.remove('hidden');
          if (phoneInput) phoneInput.classList.add('border-rose-500');
          isValid = false;
        }

        if (!isValid) return;

        // Send the form to the email handler.
        if (advisorSubmitBtn) advisorSubmitBtn.disabled = true;
        if (advisorSubmitText) advisorSubmitText.textContent = 'Verzenden...';

        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(advisorForm)
          });
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || `Verzenden mislukt (HTTP ${response.status}).`);
          }

          const submittedName = nameInput.value.trim();
          if (advisorSuccessName) advisorSuccessName.textContent = submittedName;

          advisorForm.reset();
          advisorForm.classList.add('hidden');
          if (advisorSuccessState) advisorSuccessState.classList.remove('hidden');
        } catch (error) {
          if (advisorSubmitError) {
            advisorSubmitError.textContent = `Verzenden is niet gelukt: ${error.message || 'Controleer uw verbinding en probeer het opnieuw.'}`;
            advisorSubmitError.classList.remove('hidden');
          }
        } finally {
          if (advisorSubmitBtn) advisorSubmitBtn.disabled = false;
          if (advisorSubmitText) advisorSubmitText.textContent = 'Verzend Aanvraag';
        }
      });
    }
  }
});

