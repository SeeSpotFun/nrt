// NRT Dosing Data
const dosingData = [
    {"cigarettes": 10, "nicotine_need": 15, "patches": "1 x 21mg", "short_acting": "2-4mg gum/lozenge every 1-2 hours as needed"},
    {"cigarettes": 20, "nicotine_need": 30, "patches": "1 x 21mg", "short_acting": "2-4mg gum/lozenge every 1-2 hours as needed"},
    {"cigarettes": 30, "nicotine_need": 45, "patches": "1-2 x 21mg", "short_acting": "4mg gum/lozenge every 1-2 hours as needed"},
    {"cigarettes": 40, "nicotine_need": 60, "patches": "1-2 x 21mg", "short_acting": "4mg gum/lozenge every 1-2 hours as needed"},
    {"cigarettes": 50, "nicotine_need": 75, "patches": "2-3 x 21mg", "short_acting": "4mg gum/lozenge every 1 hour as needed"},
    {"cigarettes": 60, "nicotine_need": 90, "patches": "2-3 x 21mg", "short_acting": "4mg gum/lozenge every 1 hour as needed"},
    {"cigarettes": 70, "nicotine_need": 105, "patches": "3-4 x 21mg", "short_acting": "4mg gum/lozenge every 1 hour as needed"},
    {"cigarettes": 80, "nicotine_need": 120, "patches": "3-4 x 21mg", "short_acting": "4mg gum/lozenge every 1 hour as needed"},
    {"cigarettes": 90, "nicotine_need": 135, "patches": "3-4 x 21mg", "short_acting": "4mg gum/lozenge every 1 hour as needed"},
    {"cigarettes": 100, "nicotine_need": 150, "patches": "3-4 x 21mg", "short_acting": "4mg gum/lozenge every 1 hour as needed"}
];

const heavySmokerData = [
    {"level": "3.0 packs/day (60 cigs)", "nicotine_need": 90, "patches": "3 x 21mg patches", "total_nicotine": 63, "support": "4mg every hour as needed", "supervision": "Recommended"},
    {"level": "3.5 packs/day (70 cigs)", "nicotine_need": 105, "patches": "3-4 x 21mg patches", "total_nicotine": "63-84", "support": "4mg every hour as needed", "supervision": "Strongly Recommended"},
    {"level": "4.0 packs/day (80 cigs)", "nicotine_need": 120, "patches": "4 x 21mg patches", "total_nicotine": 84, "support": "4mg every 30-60 min as needed", "supervision": "Required"},
    {"level": "4.5 packs/day (90 cigs)", "nicotine_need": 135, "patches": "4-5 x 21mg patches", "total_nicotine": "84-105", "support": "4mg every 30-60 min as needed", "supervision": "Required"},
    {"level": "5.0 packs/day (100 cigs)", "nicotine_need": 150, "patches": "5 x 21mg patches", "total_nicotine": 105, "support": "4mg every 30-60 min as needed", "supervision": "Required"}
];

// Global function to calculate dosing (accessible from HTML)
function calculateDosing() {
    console.log('calculateDosing function called');
    
    const cigarettesInput = document.getElementById('cigarettes');
    if (!cigarettesInput) {
        console.error('Cigarettes input field not found');
        return;
    }
    
    const cigarettes = parseInt(cigarettesInput.value);
    console.log('Cigarettes input value:', cigarettes);
    
    if (!cigarettes || cigarettes < 1) {
        alert('Please enter a valid number of cigarettes per day.');
        cigarettesInput.focus();
        return;
    }

    // Find the closest dosing recommendation
    let recommendation = null;
    
    // Find exact match or closest higher value
    for (let i = 0; i < dosingData.length; i++) {
        if (cigarettes <= dosingData[i].cigarettes) {
            recommendation = dosingData[i];
            break;
        }
    }
    
    // If more than 100 cigarettes, use the highest recommendation
    if (!recommendation) {
        recommendation = dosingData[dosingData.length - 1];
    }
    
    // If less than 10 cigarettes, use the lowest recommendation
    if (cigarettes < 10) {
        recommendation = dosingData[0];
    }

    console.log('Selected recommendation:', recommendation);
    
    // Display results
    displayDosingResults(recommendation, cigarettes);
}

// Display the dosing calculation results
function displayDosingResults(recommendation, cigarettes) {
    console.log('displayDosingResults called with:', recommendation, cigarettes);
    
    const resultDiv = document.getElementById('dosing-result');
    const nicotineNeed = document.getElementById('nicotine-need');
    const patchRec = document.getElementById('patch-rec');
    const shortActing = document.getElementById('short-acting');
    const supervisionNotice = document.getElementById('supervision-notice');
    
    console.log('Result elements:', {
        resultDiv: !!resultDiv,
        nicotineNeed: !!nicotineNeed,
        patchRec: !!patchRec,
        shortActing: !!shortActing,
        supervisionNotice: !!supervisionNotice
    });
    
    if (!resultDiv || !nicotineNeed || !patchRec || !shortActing) {
        console.error('Could not find result elements');
        return;
    }
    
    // Calculate actual nicotine need based on input
    const actualNicotineNeed = Math.round(cigarettes * 1.5); // Approximate 1.5mg per cigarette
    
    nicotineNeed.textContent = `${actualNicotineNeed} mg`;
    patchRec.textContent = recommendation.patches;
    shortActing.textContent = recommendation.short_acting;
    
    console.log('Updated result values:', {
        nicotineNeed: nicotineNeed.textContent,
        patchRec: patchRec.textContent,
        shortActing: shortActing.textContent
    });
    
    // Show supervision notice for heavy smokers (60+ cigarettes)
    if (supervisionNotice) {
        if (cigarettes >= 60) {
            supervisionNotice.style.display = 'block';
        } else {
            supervisionNotice.style.display = 'none';
        }
    }
    
    // Show results
    resultDiv.classList.remove('hidden');
    console.log('Results displayed');
    
    // Smooth scroll to results
    setTimeout(() => {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    populateDosingTable();
    populateHeavySmokerTable();
    setupSmoothScrolling();
    setupCalculatorInputHandler();
    
    // Make calculateDosing available globally
    window.calculateDosing = calculateDosing;
    console.log('calculateDosing function attached to window');
});

// Populate the main dosing table
function populateDosingTable() {
    const tableBody = document.getElementById('dosing-table-body');
    if (!tableBody) {
        console.error('Dosing table body not found');
        return;
    }

    tableBody.innerHTML = '';
    
    dosingData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.cigarettes}</td>
            <td>${item.nicotine_need} mg</td>
            <td>${item.patches}</td>
            <td>${item.short_acting}</td>
        `;
        tableBody.appendChild(row);
    });
    
    console.log('Dosing table populated with', dosingData.length, 'rows');
}

// Populate the heavy smoker table
function populateHeavySmokerTable() {
    const tableBody = document.getElementById('heavy-smoker-table-body');
    if (!tableBody) {
        console.error('Heavy smoker table body not found');
        return;
    }

    tableBody.innerHTML = '';
    
    heavySmokerData.forEach(item => {
        const row = document.createElement('tr');
        const supervisionClass = getSupervisionClass(item.supervision);
        
        row.innerHTML = `
            <td><strong>${item.level}</strong></td>
            <td>${item.nicotine_need} mg</td>
            <td>${item.patches}</td>
            <td>${item.total_nicotine} mg</td>
            <td>${item.support}</td>
            <td><span class="status ${supervisionClass}">${item.supervision}</span></td>
        `;
        tableBody.appendChild(row);
    });
    
    console.log('Heavy smoker table populated with', heavySmokerData.length, 'rows');
}

// Get supervision status class
function getSupervisionClass(supervision) {
    switch(supervision.toLowerCase()) {
        case 'recommended':
            return 'status--info';
        case 'strongly recommended':
            return 'status--warning';
        case 'required':
            return 'status--error';
        default:
            return 'status--info';
    }
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('nav__link--active'));
            
            // Add active class to clicked link
            this.classList.add('nav__link--active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            console.log('Nav link clicked:', targetId);
            
            if (targetElement) {
                // Add offset for header
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                console.log('Scrolling to:', targetId);
            } else {
                console.error('Target element not found:', targetId);
            }
        });
    });
    
    console.log('Smooth scrolling setup for', navLinks.length, 'nav links');
}

// Setup calculator input handler for Enter key
function setupCalculatorInputHandler() {
    const cigarettesInput = document.getElementById('cigarettes');
    const calculateButton = document.querySelector('button[onclick="calculateDosing()"]');
    
    if (cigarettesInput) {
        cigarettesInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateDosing();
            }
        });
        
        // Add input validation
        cigarettesInput.addEventListener('input', function(e) {
            let value = parseInt(e.target.value);
            if (value < 0) {
                e.target.value = 0;
            } else if (value > 200) {
                e.target.value = 200;
            }
        });
        
        console.log('Calculator input handler setup');
    } else {
        console.error('Cigarettes input field not found');
    }
    
    // Also add direct event listener to button as backup
    if (calculateButton) {
        calculateButton.addEventListener('click', function(e) {
            e.preventDefault();
            calculateDosing();
        });
        console.log('Calculate button event listener added');
    }
}

// Utility function to highlight active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('nav__link--active');
        }
    });
}

// Add scroll listener for active nav highlighting
window.addEventListener('scroll', updateActiveNavLink);

// Additional utility functions for enhanced functionality
function formatNicotineAmount(amount) {
    if (typeof amount === 'string' && amount.includes('-')) {
        return amount + ' mg';
    }
    return amount + ' mg';
}

// Print functionality
function printSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>NRT Clinical Guide - ${sectionId}</title>
                    <link rel="stylesheet" href="style.css">
                    <style>
                        body { padding: 20px; }
                        @media print {
                            .calculator-input { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Clinical Guide to Nicotine Replacement Therapy</h1>
                    ${section.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Validation helper for medical recommendations
function validateDosing(cigarettes, patches, shortActing) {
    const warnings = [];
    
    if (cigarettes >= 80 && !patches.includes('3')) {
        warnings.push('Consider higher patch dosing for very heavy smokers');
    }
    
    if (cigarettes >= 60 && !shortActing.includes('every 1 hour')) {
        warnings.push('More frequent short-acting NRT may be needed');
    }
    
    return warnings;
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateDosing,
        populateDosingTable,
        populateHeavySmokerTable,
        dosingData,
        heavySmokerData
    };
}