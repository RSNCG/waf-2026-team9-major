SmartGuard System Documentation

1. System Overview

SmartGuard is a lightweight Web Application Firewall (WAF) designed to demonstrate the efficacy of Machine Learning in cybersecurity. Unlike traditional WAFs that rely solely on signature databases (which fail against zero-day attacks), SmartGuard employs a structural analysis approach.

2. ML Pipeline

The core intelligence resides in the models/ directory:

Feature Extraction: Raw HTTP payloads are converted into a numerical vector (size 14). Features include SQL keyword count, special character density, entropy, and URL length.

Scaling: A MinMaxScaler normalizes these features to a 0-1 range.

Classification: A RandomForestClassifier predicts the probability of the request being Malicious (1) or Normal (0).

3. Decision Logic (The Engine)

SmartGuard uses a Hybrid Decision Engine to ensure reliability:

Primary: The ML model's prediction.

Secondary: A rule-based regex system checks for obvious signatures (e.g., <script>).

Conflict Resolution:

If ML detects an attack -> BLOCK.

If ML is unsure but regex detects a known signature -> BLOCK.

If decision is ACCEPTED, the detected type is forced to "Normal" for consistency.

4. Academic Disclaimer

This project simulates network traffic features (like response_code or time_gap) within the app.py logic because the "Try Now" demo runs on the client side without a real backend network loop. This ensures the ML model receives the expected input shape for demonstration purposes.