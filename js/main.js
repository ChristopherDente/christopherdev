document.addEventListener('DOMContentLoaded', () => {
    // Handle frontend-only contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show alert indicating this is frontend only
            const alertContainer = document.getElementById('formAlertContainer');
            if (alertContainer) {
                alertContainer.innerHTML = `
                    <div class="alert alert-info alert-dismissible fade show mt-3" role="alert">
                        <strong>Notice:</strong> This form is currently for frontend demonstration purposes only and does not send messages. Please contact me via GitHub or LinkedIn.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            }
            
            contactForm.reset();
        });
    }

    // Set active nav link based on current URL
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
});
