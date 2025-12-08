// Show the button when the user scrolls down 20px from the top of the document
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    let btn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}

/* INJECT NAVIGATION BAR */
document.addEventListener("DOMContentLoaded", function() {
    // 1. Define the HTML for the top bar
    const navbarHTML = `
    <nav class="lesson-nav">
        <div class="nav-content">
            <div class="nav-left">
                <a href="https://gitmez.com" class="home-link"><i class="fas fa-home"></i></a>
                <span style="color:#e5e7eb">/</span>
                <span class="nav-title">R Dersleri</span>
            </div>
            
            <div class="nav-right">
                <div class="dropdown-wrapper">
                    <button class="dropdown-btn">
                        Select Week <i class="fas fa-chevron-down" style="font-size:0.8em; margin-left:5px;"></i>
                    </button>
                    <div class="dropdown-menu">
                        ${Array.from({length: 15}, (_, i) => 
                            `<a href="r-ders-${i+1}.html">Week ${i+1}</a>`
                        ).join('')}
                    </div>
                </div>
                <a href="https://gitmez.com/rdersi/rdersi.html" style="font-size:0.9rem; font-weight:600;">Back to Course</a>
            </div>
        </div>
    </nav>`;

    // 2. Insert it immediately after the opening <body> tag
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);
});

/* INJECT BRANDING HEADER */
document.addEventListener("DOMContentLoaded", function() {
    // Top Bar HTML
    const navHTML = `
    <nav class="lesson-nav">
        <div style="font-weight:700; font-size:1.2rem; color:#1f2937; display:flex; align-items:center; gap:10px;">
            <span style="color:#276DC3; font-size:1.4rem;">R</span>
            <span>Dersleri - Ali Onur Gitmez</span>
        </div>
        <div style="margin-left:auto;">
           <a href="https://gitmez.com" style="color:#276DC3; font-weight:600; text-decoration:none;">Home</a>
        </div>
    </nav>`;

    document.body.insertAdjacentHTML("afterbegin", navHTML);
});
