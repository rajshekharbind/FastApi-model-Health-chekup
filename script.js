const API_URL = 'http://127.0.0.1:8000/predict';
const form = document.getElementById('predictionForm');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const resultContainer = document.getElementById('resultContainer');
const errorContainer = document.getElementById('errorContainer');
const predictionResult = document.getElementById('predictionResult');
const errorMessage = document.getElementById('errorMessage');

// Open localhost functions
function openHome() {
    window.open('http://127.0.0.1:8001', '_blank');
}

function openAPI() {
    window.open('http://127.0.0.1:8000/docs', '_blank');
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous results/errors
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    
    // Show loader
    submitBtn.disabled = true;
    loader.style.display = 'inline-block';
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const inputData = {
            age: parseInt(formData.get('age')),
            weight: parseFloat(formData.get('weight')),
            height: parseFloat(formData.get('height')),
            income_lpa: parseFloat(formData.get('income_lpa')),
            smoker: formData.get('smoker') === 'true',
            city: formData.get('city'),
            occupation: formData.get('occupation')
        };

        // Validate inputs
        if (!validateInputs(inputData)) {
            throw new Error('Please check your inputs and try again.');
        }

        // Make API request
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail ? errorData.detail[0].msg : 'API request failed');
        }

        const result = await response.json();
        
        // Display result
        displayResult(result, inputData);

    } catch (error) {
        displayError(error.message);
    } finally {
        submitBtn.disabled = false;
        loader.style.display = 'none';
    }
});

function validateInputs(data) {
    if (data.age < 1 || data.age > 119) {
        errorMessage.textContent = 'Age must be between 1 and 119 years.';
        errorContainer.style.display = 'block';
        return false;
    }

    if (data.weight <= 0) {
        errorMessage.textContent = 'Weight must be greater than 0 kg.';
        errorContainer.style.display = 'block';
        return false;
    }

    if (data.height <= 0 || data.height >= 2.5) {
        errorMessage.textContent = 'Height must be between 0.5m and 2.5m.';
        errorContainer.style.display = 'block';
        return false;
    }

    if (data.income_lpa <= 0) {
        errorMessage.textContent = 'Annual income must be greater than 0 LPA.';
        errorContainer.style.display = 'block';
        return false;
    }

    if (!data.city.trim()) {
        errorMessage.textContent = 'Please enter your city.';
        errorContainer.style.display = 'block';
        return false;
    }

    if (!data.occupation) {
        errorMessage.textContent = 'Please select your occupation.';
        errorContainer.style.display = 'block';
        return false;
    }

    return true;
}

function displayResult(result, inputData) {
    // Calculate BMI
    const bmi = (inputData.weight / (inputData.height ** 2)).toFixed(2);

    // Determine lifestyle risk
    let lifestyleRisk = 'Low';
    if (inputData.smoker && bmi > 30) {
        lifestyleRisk = 'High';
    } else if (inputData.smoker || bmi > 27) {
        lifestyleRisk = 'Medium';
    }

    // Determine age group
    let ageGroup = 'Young';
    if (inputData.age >= 25 && inputData.age < 45) {
        ageGroup = 'Adult';
    } else if (inputData.age >= 45 && inputData.age < 60) {
        ageGroup = 'Middle-aged';
    } else if (inputData.age >= 60) {
        ageGroup = 'Senior';
    }

    // Determine city tier
    const tier1Cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];
    const tier2Cities = [
        "Jaipur", "Chandigarh", "Indore", "Lucknow", "Patna", "Ranchi", "Visakhapatnam", "Coimbatore",
        "Bhopal", "Nagpur", "Vadodara", "Surat", "Rajkot", "Jodhpur", "Raipur", "Amritsar", "Varanasi",
        "Agra", "Dehradun", "Mysore", "Jabalpur", "Gwalior", "Dhanbad", "Bareilly", "Aligarh", "Gaya", 
        "Kozhikode", "Warangal", "Kolhapur", "Bilaspur", "Jalandhar", "Noida", "Guntur", "Asansol", "Siliguri"
    ];
    let cityTier = 3;
    if (tier1Cities.includes(inputData.city)) {
        cityTier = 1;
    } else if (tier2Cities.includes(inputData.city)) {
        cityTier = 2;
    }

    // Create result HTML
    const resultHTML = `
        <div class="result-details">
            <div class="result-item">
                <strong>Predicted Premium Category:</strong>
                <span class="category-badge">${result.predicted_category}</span>
            </div>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">

            <h3 style="margin-bottom: 12px;">� Model Confidence</h3>
            <div class="confidence">
                <strong>${(result.confidence * 100).toFixed(1)}%</strong> confident in this prediction
            </div>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">

            <h3 style="margin-bottom: 12px;">�📈 Your Health Profile</h3>
            
            <div class="profile-grid">
                <div class="profile-item">
                    <small>BMI</small>
                    <strong>${bmi}</strong>
                </div>
                <div class="profile-item">
                    <small>Age Group</small>
                    <strong>${ageGroup}</strong>
                </div>
                <div class="profile-item">
                    <small>Risk Level</small>
                    <strong>${lifestyleRisk}</strong>
                </div>
                <div class="profile-item">
                    <small>City Tier</small>
                    <strong>${cityTier}</strong>
                </div>
            </div>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">

            <h3 style="margin-bottom: 12px;">💰 Financial Info</h3>
            <div class="profile-item">
                <small>Annual Income</small>
                <strong>₹${(inputData.income_lpa * 100000).toLocaleString()}</strong>
            </div>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">

            <p style="font-size: 0.9rem; font-style: italic; opacity: 0.9; margin-top: 10px;">
                ℹ️ This prediction is based on the ML model analysis. For accurate premium quotes, 
                please consult with an insurance agent.
            </p>
        </div>
    `;

    predictionResult.innerHTML = resultHTML;
    resultContainer.style.display = 'block';
    
    // Initialize charts with a small delay to ensure DOM is ready
    setTimeout(() => {
        initializeCharts(result, inputData);
        simulateRealtimeUpdates(result);
    }, 100);
    
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Chart instances
let probabilityChart = null;
let confidenceChart = null;

// Initialize Charts
function initializeCharts(result, inputData) {
    const bmi = (inputData.weight / (inputData.height ** 2)).toFixed(2);
    
    // Destroy existing charts
    if (probabilityChart) probabilityChart.destroy();
    if (confidenceChart) confidenceChart.destroy();

    // 1. Probability Distribution Chart (Doughnut)
    const probCtx = document.getElementById('probabilityChart');
    if (probCtx) {
        const probs = result.class_probabilities || {};
        const labels = Object.keys(probs);
        const data = Object.values(probs).map(v => (v * 100).toFixed(1));
        
        probabilityChart = new Chart(probCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#ef4444',  // Red
                        '#f59e0b',  // Orange  
                        '#10b981'   // Green
                    ],
                    borderColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: { size: 12, weight: 'bold' },
                            padding: 15
                        }
                    }
                }
            }
        });
    }

    // 2. Confidence Level Chart (Horizontal Bar)
    const confCtx = document.getElementById('confidenceChart');
    if (confCtx) {
        const confidence = (result.confidence * 100).toFixed(1);
        const confidenceLabel = confidence >= 80 ? 'Very High' : confidence >= 60 ? 'Good' : 'Moderate';
        
        confidenceChart = new Chart(confCtx, {
            type: 'bar',
            data: {
                labels: ['Confidence'],
                datasets: [{
                    label: 'Model Confidence %',
                    data: [confidence],
                    backgroundColor: confidence >= 80 ? '#10b981' : confidence >= 60 ? '#f59e0b' : '#ef4444',
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderWidth: 2,
                    borderRadius: 8,
                    barThickness: 40
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: 'white',
                            callback: (value) => value + '%'
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        ticks: { color: 'white' },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: (context) => `${context.parsed.x.toFixed(1)}% - ${confidenceLabel}`
                        }
                    }
                }
            }
        });
    }
}

// Real-time update simulation
function simulateRealtimeUpdates(result) {
    let updateCount = 0;
    const maxUpdates = 3;
    
    const updateInterval = setInterval(() => {
        if (updateCount >= maxUpdates) {
            clearInterval(updateInterval);
            return;
        }
        
        updateCount++;
        
        // Simulate confidence fluctuation (±2%)
        const variation = (Math.random() - 0.5) * 0.04;
        const updatedConfidence = Math.max(0, Math.min(1, result.confidence + variation));
        
        // Update confidence bar animation
        const confBar = document.querySelector('.confidence-bar');
        if (confBar) {
            const newWidth = updatedConfidence * 100;
            confBar.style.width = newWidth + '%';
            const confText = confBar.querySelector('.confidence-text');
            if (confText) {
                confText.textContent = newWidth.toFixed(1) + '%';
            }
        }
        
        console.log(`Real-time Update ${updateCount}: Confidence ${(updatedConfidence * 100).toFixed(1)}%`);
    }, 2000);
}

function displayError(message) {
    errorMessage.textContent = message || 'An unexpected error occurred. Please try again.';
    errorContainer.style.display = 'block';
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideError() {
    errorContainer.style.display = 'none';
}

function resetForm() {
    form.reset();
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Real-time BMI calculation display
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');

function updateBMIDisplay() {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    
    if (weight > 0 && height > 0) {
        const bmi = (weight / (height ** 2)).toFixed(2);
        console.log(`Current BMI: ${bmi}`);
    }
}

weightInput.addEventListener('change', updateBMIDisplay);
heightInput.addEventListener('change', updateBMIDisplay);

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
