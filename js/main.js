document.addEventListener('DOMContentLoaded', () => {
    // Handle frontend-only contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success alert
            const alertContainer = document.getElementById('formAlertContainer');
            if (alertContainer) {
                alertContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                        <strong>Thank you!</strong> Your message has been sent successfully. I will get back to you shortly.
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

    // --- AI / ML / IoT Tools Logic ---

    // 2. Barcode Generator
    const barcodeInput = document.getElementById('barcodeInput');
    const generateBarcodeBtn = document.getElementById('generateBarcodeBtn');
    if (barcodeInput && generateBarcodeBtn && typeof JsBarcode !== 'undefined') {
        function renderBarcode() {
            const val = barcodeInput.value || "EMP-10293";
            JsBarcode("#barcodeSvg", val, {
                format: "CODE128",
                lineColor: "#000",
                width: 2,
                height: 50,
                displayValue: true
            });
        }
        
        // Initial render
        renderBarcode();
        
        generateBarcodeBtn.addEventListener('click', renderBarcode);
        barcodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') renderBarcode();
        });
    }

    // 3. API Endpoint Simulator
    const apiEndpoint = document.getElementById('apiEndpoint');
    const apiPayload = document.getElementById('apiPayload');
    const apiSendBtn = document.getElementById('apiSendBtn');
    const apiResponse = document.getElementById('apiResponse');
    const apiLoading = document.getElementById('apiLoading');

    const apiMethod = document.getElementById('apiMethod');

    if (apiSendBtn && apiEndpoint && apiPayload) {
        apiSendBtn.addEventListener('click', async () => {
            const url = apiEndpoint.value.trim();
            const payload = apiPayload.value.trim();
            const method = apiMethod ? apiMethod.value : 'POST';
            
            if (!url) {
                alert('Please enter an endpoint URL.');
                return;
            }
            
            // UI state
            apiSendBtn.disabled = true;
            apiResponse.classList.add('d-none');
            apiLoading.classList.remove('d-none');
            
            try {
                let fetchOptions = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                // Only attach body if method is not GET or HEAD
                if (method !== 'GET' && method !== 'HEAD') {
                    let parsedPayload;
                    try {
                        parsedPayload = JSON.parse(payload);
                    } catch(e) {
                        throw new Error("Invalid JSON Payload.");
                    }
                    fetchOptions.body = JSON.stringify(parsedPayload);
                }

                // Make the network request
                const res = await fetch(url, fetchOptions);
                
                // Read response
                const json = await res.json();
                
                // Show response
                apiResponse.textContent = JSON.stringify(json, null, 2);
                if (res.ok) {
                    apiResponse.classList.replace('text-danger', 'text-success');
                } else {
                    apiResponse.classList.replace('text-success', 'text-danger');
                }
            } catch (err) {
                apiResponse.textContent = `{\n  "error": "${err.message}"\n}`;
                apiResponse.classList.replace('text-success', 'text-danger');
            } finally {
                // Restore UI state
                apiSendBtn.disabled = false;
                apiLoading.classList.add('d-none');
                apiResponse.classList.remove('d-none');
            }
        });
    }


});
