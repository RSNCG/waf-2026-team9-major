document.addEventListener('DOMContentLoaded', function() {
    
    // Get data passed from Flask template
    const rawData = document.getElementById('chart-data-source');
    if (!rawData) return;
    
    const data = JSON.parse(rawData.textContent);
    
    // 1. Bar Chart (Safe vs Blocked) - Using Brand Colors
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Safe Requests', 'Blocked Threats'],
            datasets: [{
                label: 'Request Count',
                data: [data.safe, data.blocked],
                backgroundColor: [
                    '#34d399', // Emerald-400 (Safe)
                    '#f87171'  // Red-400 (Blocked)
                ],
                borderColor: [
                    '#10b981', // Emerald-500
                    '#ef4444'  // Red-500
                ],
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9', // Slate-100
                        drawBorder: false
                    },
                    ticks: {
                        font: { family: "'Inter', sans-serif", size: 11 },
                        color: '#64748b' // Slate-500
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Inter', sans-serif", size: 12, weight: '600' },
                        color: '#475569' // Slate-600
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b', // Slate-800
                    titleFont: { family: "'Inter', sans-serif", size: 13 },
                    bodyFont: { family: "'Inter', sans-serif", size: 12 },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false
                }
            }
        }
    });

    // 2. Pie Chart (Attack Types) - Using Brand Palette
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    
    // Prepare labels and data for Pie
    const typeLabels = Object.keys(data.types);
    const typeValues = Object.values(data.types);
    
    // Fallback if empty
    if (typeLabels.length === 0) {
        typeLabels.push('No Threats Yet');
        typeValues.push(1);
    }

    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: typeLabels,
            datasets: [{
                data: typeValues,
                backgroundColor: [
                    '#fbbf24', // Amber-400
                    '#f97316', // Orange-500
                    '#ef4444', // Red-500
                    '#8b5cf6', // Violet-500
                    '#ec4899', // Pink-500
                    '#06b6d4'  // Cyan-500
                ],
                borderWidth: 2,
                borderColor: '#ffffff', // White border for separation
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 20
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { family: "'Inter', sans-serif", size: 11 },
                        color: '#475569', // Slate-600
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    bodyFont: { family: "'Inter', sans-serif" },
                    padding: 10,
                    cornerRadius: 8
                }
            }
        }
    });
});