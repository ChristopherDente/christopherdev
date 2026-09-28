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

    // 4. JSON Formatter
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatJsonBtn = document.getElementById('formatJsonBtn');
    const minifyJsonBtn = document.getElementById('minifyJsonBtn');
    const jsonStatus = document.getElementById('jsonStatus');

    function processJson(minify = false) {
        if (!jsonInput || !jsonOutput) return;
        const val = jsonInput.value.trim();
        if (!val) {
            jsonStatus.textContent = '';
            jsonOutput.value = '';
            return;
        }
        try {
            const parsed = JSON.parse(val);
            jsonOutput.value = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 4);
            jsonStatus.textContent = 'Valid JSON ✓';
            jsonStatus.className = 'text-success';
        } catch (e) {
            jsonOutput.value = e.message;
            jsonStatus.textContent = 'Invalid JSON ✗';
            jsonStatus.className = 'text-danger';
        }
    }

    if (formatJsonBtn) formatJsonBtn.addEventListener('click', () => processJson(false));
    if (minifyJsonBtn) minifyJsonBtn.addEventListener('click', () => processJson(true));

    // 5. Base64 Encoder / Decoder
    const base64Input = document.getElementById('base64Input');
    const base64Output = document.getElementById('base64Output');
    const encodeBase64Btn = document.getElementById('encodeBase64Btn');
    const decodeBase64Btn = document.getElementById('decodeBase64Btn');

    if (encodeBase64Btn) {
        encodeBase64Btn.addEventListener('click', () => {
            try {
                base64Output.value = btoa(unescape(encodeURIComponent(base64Input.value)));
            } catch (e) {
                base64Output.value = "Error encoding string.";
            }
        });
    }
    if (decodeBase64Btn) {
        decodeBase64Btn.addEventListener('click', () => {
            try {
                base64Output.value = decodeURIComponent(escape(atob(base64Input.value.trim())));
            } catch (e) {
                base64Output.value = "Invalid Base64 string.";
            }
        });
    }

    // 6. CSS Box Shadow Generator
    const shadowH = document.getElementById('shadowH');
    const shadowV = document.getElementById('shadowV');
    const shadowBlur = document.getElementById('shadowBlur');
    const shadowSpread = document.getElementById('shadowSpread');
    const shadowColor = document.getElementById('shadowColor');
    const shadowOpacity = document.getElementById('shadowOpacity');
    const shadowPreviewBox = document.getElementById('shadowPreviewBox');
    const shadowCode = document.getElementById('shadowCode');

    function hexToRgbA(hex, opacity){
        let c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c = hex.substring(1).split('');
            if(c.length === 3){
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(', ')+', '+opacity+')';
        }
        return `rgba(0, 0, 0, ${opacity})`;
    }

    function updateShadow() {
        if(!shadowH) return;
        const h = shadowH.value;
        const v = shadowV.value;
        const blur = shadowBlur.value;
        const spread = shadowSpread.value;
        const color = shadowColor.value;
        const opacity = shadowOpacity.value;

        document.getElementById('shadowHVal').textContent = h;
        document.getElementById('shadowVVal').textContent = v;
        document.getElementById('shadowBlurVal').textContent = blur;
        document.getElementById('shadowSpreadVal').textContent = spread;
        document.getElementById('shadowOpacityVal').textContent = opacity;

        const rgbaColor = hexToRgbA(color, opacity);
        const shadowString = `${h}px ${v}px ${blur}px ${spread}px ${rgbaColor}`;
        
        shadowPreviewBox.style.boxShadow = shadowString;
        shadowCode.textContent = `box-shadow: ${shadowString};`;
    }

    if (shadowH) {
        [shadowH, shadowV, shadowBlur, shadowSpread, shadowColor, shadowOpacity].forEach(el => {
            el.addEventListener('input', updateShadow);
        });
        updateShadow();
    }


    // 8. Interactive Chat Simulator (real-time-messaging-platform.html)
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');

    if (chatBox && chatInput && sendChatBtn) {
        // Generate a random user ID for this tab
        const myUserId = 'user_' + Math.floor(Math.random() * 10000);

        function appendMessage(text, isMe) {
            const wrapper = document.createElement('div');
            wrapper.className = `d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'} mb-1`;

            const div = document.createElement('div');
            // Professional iMessage-like styling
            if (isMe) {
                div.className = 'bg-primary text-white px-3 py-2 shadow-sm';
                div.style.borderRadius = '18px 18px 4px 18px';
            } else {
                div.className = 'bg-white text-dark border px-3 py-2 shadow-sm';
                div.style.borderRadius = '18px 18px 18px 4px';
            }
            div.style.maxWidth = '85%';
            div.style.fontSize = '0.9rem';
            div.textContent = text;
            
            wrapper.appendChild(div);
            chatBox.appendChild(wrapper);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function sendMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            // Display in my own window
            appendMessage(text, true);

            // Broadcast to other tabs using localStorage
            const payload = JSON.stringify({ sender: myUserId, text: text, timestamp: Date.now() });
            localStorage.setItem('chat_message', payload);

            chatInput.value = '';
        }

        sendChatBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Listen for messages from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'chat_message' && e.newValue) {
                const data = JSON.parse(e.newValue);
                if (data.sender !== myUserId) {
                    appendMessage(data.text, false);
                }
            }
        });
    }

    // 9. Interactive Face Detection Simulator (dtr.html)
    const startCamBtn = document.getElementById('startCamBtn');
    const stopCamBtn = document.getElementById('stopCamBtn');
    const webcam = document.getElementById('webcam');
    const overlay = document.getElementById('overlay');
    const camStatusBadge = document.getElementById('camStatusBadge');
    const camOverlayText = document.getElementById('camOverlayText');
    let detectionInterval;
    let localStream;

    if (startCamBtn && webcam && overlay) {
        startCamBtn.addEventListener('click', async () => {
            try {
                // Update UI
                startCamBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading AI Models...';
                startCamBtn.disabled = true;

                // Load models from CDN
                const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
                ]);
                
                startCamBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting Camera...';

                // Request camera access
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                webcam.srcObject = localStream;
                
                webcam.addEventListener('loadedmetadata', () => {
                    webcam.classList.remove('d-none');
                    camOverlayText.classList.add('d-none');
                    if (stopCamBtn) stopCamBtn.classList.remove('d-none');
                    
                    camStatusBadge.className = 'badge bg-success text-white px-3 py-2 rounded-pill blink-animation';
                    camStatusBadge.textContent = 'Camera: Active & Detecting';
                    
                    // Setup canvas
                    const displaySize = { width: webcam.clientWidth, height: webcam.clientHeight };
                    faceapi.matchDimensions(overlay, displaySize);

                    isDetecting = true;
                    
                    // Asynchronous Detection loop (prevents lag from promise stacking)
                    async function detectLoop() {
                        if (!isDetecting || webcam.paused || webcam.ended) return;
                        
                        try {
                            const detections = await faceapi.detectAllFaces(webcam, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender();
                            const resizedDetections = faceapi.resizeResults(detections, displaySize);
                            
                            const ctx = overlay.getContext('2d');
                            ctx.clearRect(0, 0, overlay.width, overlay.height);
                            
                            // Draw custom boxes for a cool UI effect
                            resizedDetections.forEach(det => {
                                const box = det.detection.box;
                                const age = Math.round(det.age);
                                const gender = det.gender;
                                const prob = Math.round(det.genderProbability * 100);

                                ctx.strokeStyle = '#0d6efd'; // Bootstrap Primary
                                ctx.lineWidth = 3;
                                ctx.strokeRect(box.x, box.y, box.width, box.height);
                                
                                // Draw label
                                ctx.fillStyle = '#0d6efd';
                                ctx.fillRect(box.x, box.y - 45, box.width, 45);
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '14px monospace';
                                ctx.fillText(`Face Detected`, box.x + 5, box.y - 28);
                                ctx.fillText(`${gender} (${prob}%) | ~${age}y/o`, box.x + 5, box.y - 8);
                            });
                        } catch (err) {
                            console.error("Detection error:", err);
                        }
                        
                        // Wait for the previous frame to finish processing before scheduling the next one
                        setTimeout(detectLoop, 100);
                    }
                    
                    // Start the loop
                    detectLoop();
                });
            } catch (err) {
                console.error(err);
                startCamBtn.innerHTML = '<i class="fas fa-video"></i> Start Camera';
                startCamBtn.disabled = false;
                alert("Could not access camera or load models. Please ensure you're on HTTPS or localhost and have granted camera permissions.");
            }
        });

        if (stopCamBtn) {
            stopCamBtn.addEventListener('click', () => {
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
                
                isDetecting = false; // Stop the loop
                
                const ctx = overlay.getContext('2d');
                ctx.clearRect(0, 0, overlay.width, overlay.height);
                
                webcam.classList.add('d-none');
                camOverlayText.classList.remove('d-none');
                stopCamBtn.classList.add('d-none');
                
                startCamBtn.innerHTML = '<i class="fas fa-video"></i> Start Camera';
                startCamBtn.disabled = false;
                
                camStatusBadge.className = 'badge bg-danger text-white px-3 py-2 rounded-pill blink-animation';
                camStatusBadge.textContent = 'Camera: Offline';
            });
        }
    }
});
