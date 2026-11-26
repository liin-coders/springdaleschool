/* ==========================================================================
   Spring Dales English School, Kathua — Interactive Scripts
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky Header Shadow & Back-to-Top Visibility
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 20);
    if (backToTop) backToTop.classList.toggle("visible", y > 450);
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 2. Mobile Navigation Drawer
  const menuToggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("mobileDrawer");
  const drawerClose = document.getElementById("drawerClose");
  const backdrop = document.getElementById("drawerBackdrop");

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && drawer) {
    menuToggle.addEventListener("click", () => {
      drawer.classList.add("open");
      backdrop.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      menuToggle.setAttribute("aria-expanded", "true");
    });
  }
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  // 3. Scroll Reveal Animations (IntersectionObserver)
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // 4. Animated Stat Counters
  const counters = document.querySelectorAll(".stat-number[data-target]");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || "";
          const duration = 1200;
          const start = performance.now();

          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const current = Math.floor(progress * target);
            el.textContent = current.toLocaleString("en-IN") + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString("en-IN") + suffix;
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  // 5. Academic Stream Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = "tab-" + btn.dataset.tab;
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      tabPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // 6. FAQ Accordions
  const accItems = document.querySelectorAll(".acc-item");
  accItems.forEach((item) => {
    const trigger = item.querySelector(".acc-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      accItems.forEach((i) => {
        i.classList.remove("open");
        const t = i.querySelector(".acc-trigger");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 7. Admission Enquiry Form (Validation + Optional WhatsApp Dispatch)
  const admissionForm = document.getElementById("admissionForm");
  const admissionFeedback = document.getElementById("admissionFeedback");
  if (admissionForm && admissionFeedback) {
    admissionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const student = document.getElementById("studentName").value.trim();
      const grade = document.getElementById("grade").value.trim();
      const parent = document.getElementById("parentName").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const transport = document.getElementById("transport").value;
      const notes = document.getElementById("notes").value.trim();

      if (!student || !grade || !parent || phone.length < 10) {
        admissionFeedback.className = "form-feedback error";
        admissionFeedback.textContent = "Please complete all required fields with a valid 10-digit mobile number.";
        return;
      }

      const msg = encodeURIComponent(
        `Admission Enquiry (2026-27) - Spring Dales English School\nStudent: ${student}\nClass: ${grade}\nParent: ${parent}\nPhone: ${phone}\nTransport: ${transport}\nNotes: ${notes || "N/A"}`
      );
      const waUrl = `https://wa.me/916280039604?text=${msg}`;

      admissionFeedback.className = "form-feedback success";
      admissionFeedback.innerHTML = `Thank you, ${parent}! Your enquiry for ${student} has been recorded. <a href="${waUrl}" target="_blank" rel="noopener" style="text-decoration:underline;">Click here to also send directly via WhatsApp &rarr;</a>`;
      admissionForm.reset();
    });
  }

  // 8. Contact Form Handler
  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");
  if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("cName").value.trim();
      const phone = document.getElementById("cPhone").value.trim();
      const subject = document.getElementById("cSubject").value;
      const message = document.getElementById("cMessage").value.trim();

      if (!name || phone.length < 10 || !message) {
        contactFeedback.className = "form-feedback error";
        contactFeedback.textContent = "Please fill in your name, a valid phone number, and your message.";
        return;
      }

      const msg = encodeURIComponent(
        `Website Message - Spring Dales English School\nName: ${name}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`
      );
      const waUrl = `https://wa.me/916280039604?text=${msg}`;

      contactFeedback.className = "form-feedback success";
      contactFeedback.innerHTML = `Message received! Our office will reach out shortly. <a href="${waUrl}" target="_blank" rel="noopener" style="text-decoration:underline;">Send instantly on WhatsApp &rarr;</a>`;
      contactForm.reset();
    });
  }
});
