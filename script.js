// Global JavaScript functionality for CPS website

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initScrollAnimations()
  initNavbarEffects()
  initGlobalInteractions()
})

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed")
      }
    })
  }, observerOptions)

  // Observe all elements that should animate on scroll
  const animatedElements = document.querySelectorAll(".glass-card, .glass-panel")
  animatedElements.forEach((el) => {
    el.classList.add("scroll-reveal")
    observer.observe(el)
  })
}

// Navbar effects
function initNavbarEffects() {
  const navbar = document.querySelector(".glass-nav")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(0, 0, 0, 0.4)"
      navbar.style.backdropFilter = "blur(25px)"
    } else {
      navbar.style.background = "rgba(0, 0, 0, 0.2)"
      navbar.style.backdropFilter = "blur(20px)"
    }
  })
}

// Global interactions
function initGlobalInteractions() {
  // Add loading animation to all elements
  const allElements = document.querySelectorAll(".glass-card, .glass-panel, .product-card")
  allElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`
    el.classList.add("loading")
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Enhanced button hover effects
  const buttons = document.querySelectorAll(".glass-btn, .glass-btn-outline")
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Newsletter subscription
  const newsletterForms = document.querySelectorAll("form")
  newsletterForms.forEach((form) => {
    const emailInput = form.querySelector('input[type="email"]')
    const submitBtn = form.querySelector('button[type="button"]')

    if (emailInput && submitBtn && submitBtn.textContent.includes("Subscribe")) {
      submitBtn.addEventListener("click", function (e) {
        e.preventDefault()
        if (emailInput.value && emailInput.checkValidity()) {
          // Simulate subscription
          const originalText = this.textContent
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
          this.disabled = true

          setTimeout(() => {
            this.innerHTML = '<i class="fas fa-check"></i> Subscribed!'
            emailInput.value = ""

            setTimeout(() => {
              this.textContent = originalText
              this.disabled = false
            }, 2000)
          }, 1500)
        } else {
          emailInput.focus()
          emailInput.classList.add("is-invalid")
          setTimeout(() => {
            emailInput.classList.remove("is-invalid")
          }, 3000)
        }
      })
    }
  })

  // Add to cart simulation
  const addToCartBtns = document.querySelectorAll("button, a")
  addToCartBtns.forEach((btn) => {
    if (btn.textContent.includes("Add to Cart")) {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        const originalText = this.innerHTML
        this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding...'
        this.disabled = true

        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-check me-2"></i>Added!'
          this.classList.remove("btn-primary")
          this.classList.add("btn-success")

          setTimeout(() => {
            this.innerHTML = originalText
            this.classList.remove("btn-success")
            this.classList.add("btn-primary")
            this.disabled = false
          }, 2000)
        }, 1000)
      })
    }
  })

  // Wishlist toggle
  const wishlistBtns = document.querySelectorAll("button")
  wishlistBtns.forEach((btn) => {
    if (btn.innerHTML.includes("fa-heart")) {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        const heartIcon = this.querySelector("i")
        if (heartIcon.classList.contains("far")) {
          heartIcon.classList.remove("far")
          heartIcon.classList.add("fas")
          heartIcon.style.color = "#ef4444"
          this.setAttribute("title", "Remove from wishlist")
        } else {
          heartIcon.classList.remove("fas")
          heartIcon.classList.add("far")
          heartIcon.style.color = ""
          this.setAttribute("title", "Add to wishlist")
        }
      })
    }
  })

  // Search functionality (if search input exists)
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i]')
  searchInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const query = this.value.toLowerCase()
      const searchableItems = document.querySelectorAll(".product-item, .review-item")

      searchableItems.forEach((item) => {
        const text = item.textContent.toLowerCase()
        if (text.includes(query) || query === "") {
          item.style.display = "block"
        } else {
          item.style.display = "none"
        }
      })
    })
  })

  // Lazy loading for images
  const images = document.querySelectorAll("img")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.classList.add("loaded")
        observer.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })

  // Toast notifications
  window.showToast = (message, type = "info") => {
    const toast = document.createElement("div")
    toast.className = `toast-notification toast-${type}`
    toast.innerHTML = `
            <div class="glass-panel p-3 d-flex align-items-center">
                <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"} me-2"></i>
                <span>${message}</span>
                <button class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `

    toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 5000)
  }
}

// Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .toast-notification {
        animation: slideInRight 0.3s ease;
    }
    
    .loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    img {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img[src] {
        opacity: 1;
    }
`
document.head.appendChild(style)
