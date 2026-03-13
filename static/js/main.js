// --- Mini Browser UI Logic ---

// 1. Update URL bar based on active tab
function updateUrl(suffix) {
    const el = document.getElementById('url-suffix');
    if (el) el.innerText = suffix;
    
    // Clear feedback
    const fb = document.getElementById('browser-feedback');
    if (fb) fb.classList.add('d-none');
}

// 2. Helper to set payloads from "Quick Scenarios" buttons
function setPayload(mainInputId, mainText, secText = null) {
    const mainEl = document.getElementById(mainInputId);
    if (mainEl) mainEl.value = mainText;
    
    // For Login scenario where we have a password field
    if (secText) {
        const passEl = document.getElementById('login-pass');
        if (passEl) passEl.value = secText;
    }
}

// 3. Handle Form Submission (AJAX to backend)
document.addEventListener('DOMContentLoaded', function() {
    
    const forms = document.querySelectorAll('.demo-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const actionType = this.getAttribute('data-action');
            let payload = "";
            
            // Extract meaningful payload based on scenario
            if (actionType === 'Login') {
                const u = this.querySelector('#login-user').value;
                const p = this.querySelector('#login-pass').value;
                payload = u + " " + p; // Concatenate for analysis
            } else if (actionType === 'Search') {
                payload = this.querySelector('#search-query').value;
            } else if (actionType === 'Comment') {
                payload = this.querySelector('#comment-text').value;
            }
            
            if (!payload.trim()) return;

            // Update UI State -> Analyzing
            updateAnalysisUI_Loading();

            // Send to Backend
            fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payload: payload, action_type: actionType })
            })
            .then(response => response.json())
            .then(data => {
                updateAnalysisUI_Result(data, actionType);
                updateBrowserFeedback(data, actionType);
            })
            .catch(err => {
                console.error(err);
                alert("Error connecting to SmartGuard backend.");
            });
        });
    });
});

function updateAnalysisUI_Loading() {
    const status = document.getElementById('panel-status');
    const decision = document.getElementById('decision-text');
    
    if(status) {
        status.innerText = "ANALYZING...";
        status.className = "badge bg-warning animate-pulse";
    }
    if(decision) {
        decision.innerText = "...";
        decision.className = "display-3 fw-bold mb-0 text-white";
    }
}

function updateAnalysisUI_Result(data, action) {
    // 1. Panel Header
    const status = document.getElementById('panel-status');
    status.innerText = "COMPLETE";
    status.className = "badge bg-success";

    // 2. Decision Big Text
    const decision = document.getElementById('decision-text');
    const reason = document.getElementById('decision-reason');
    
    decision.innerText = data.decision;
    if (data.decision === 'ACCEPTED') {
        decision.className = "display-3 fw-bold mb-0 text-success";
        reason.innerText = "Validation Passed. Request Safe.";
    } else {
        decision.className = "display-3 fw-bold mb-0 text-danger";
        reason.innerText = "Validation Failed. Threat Blocked.";
    }

    // 3. Details
    document.getElementById('res-action').innerText = action;
    document.getElementById('res-len').innerText = data.features.length + " chars";
    document.getElementById('res-spec').innerText = data.features.special_chars;
    
    const riskEl = document.getElementById('res-risk');
    riskEl.innerText = data.risk_level;
    
    // Updated Logic for Critical/High levels
    if (data.risk_level === 'Critical' || data.risk_level === 'High') {
        riskEl.className = 'fw-bold text-danger';
    } else if (data.risk_level === 'Medium') {
        riskEl.className = 'fw-bold text-warning';
    } else {
        riskEl.className = 'fw-bold text-success';
    }
    
    document.getElementById('res-type').innerText = data.detected_type;
    document.getElementById('res-conf').innerText = data.confidence;

    // 4. Harm Explanation (Manual KB)
    const harmEl = document.getElementById('harm-text');
    if (data.harm_text) {
        harmEl.innerText = data.harm_text;
    } else {
        harmEl.innerText = "Analysis details unavailable.";
    }

    // 5. LIME Explanation
    const limeList = document.getElementById('lime-features');
    limeList.innerHTML = ""; // clear
    
    if (data.explanation && data.explanation.length > 0) {
        data.explanation.forEach(item => {
            const featureName = item[0];
            const weight = item[1];
            const colorClass = weight > 0 ? 'text-danger' : 'text-success';
            const icon = weight > 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas ${icon} ${colorClass} me-2"></i> ${featureName} <span class="text-muted small">(${weight.toFixed(3)})</span>`;
            limeList.appendChild(li);
        });
    } else {
        limeList.innerHTML = "<li class='text-muted'>No significant features identified.</li>";
    }
}

function updateBrowserFeedback(data, action) {
    const fb = document.getElementById('browser-feedback');
    fb.classList.remove('d-none');
    
    if (data.decision === 'ACCEPTED') {
        fb.className = "mt-4 text-center text-success fw-bold fade-in p-3 bg-success bg-opacity-10 rounded border border-success";
        // Simple, clear acceptance message
        fb.innerHTML = "<i class='fas fa-check-circle me-2'></i>Validation Passed. Request Safe.";
    } else {
        fb.className = "mt-4 text-center text-danger fw-bold fade-in p-3 bg-danger bg-opacity-10 rounded border border-danger";
        fb.innerHTML = "<i class='fas fa-shield-virus me-2'></i>REQUEST BLOCKED: Threat Signature Detected.";
    }
}