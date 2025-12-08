/* =========================================
   1. UI CLEANUP & SETUP
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {

    // --- A. THE NAV KILLER (Removes the old top bar) ---
    // We select typical RMarkdown navbar classes
    const oldNavs = document.querySelectorAll('.navbar, .navbar-default, .navbar-fixed-top');
    oldNavs.forEach(el => el.remove()); // Physically remove them from HTML

    // Also remove the padding RMarkdown adds to the body for the navbar
    document.body.style.paddingTop = "0px";


    // --- B. Inject NEW Top Navigation ---
    const navbarHTML = `
    <nav class="lesson-nav">
        <div class="nav-content">
            <div class="nav-left">
                <a href="https://gitmez.com" class="home-link"><i class="fas fa-home"></i></a>
                <span style="color:#e5e7eb; margin:0 10px;">/</span>
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
                <a href="https://gitmez.com/rdersi/rdersi.html" style="font-size:0.9rem; font-weight:600; text-decoration:none; color:var(--r-blue); margin-left:15px;">Back to Course</a>
            </div>
        </div>
    </nav>`;

    document.body.insertAdjacentHTML("afterbegin", navbarHTML);


    // --- C. Setup the Sidebar (TOC) ---
    const tocElement = document.getElementById('TOC');
    
    if (tocElement) {
        // Add our styling class
        tocElement.classList.add('toc-sidebar');
        
        // Move it out of the bootstrap grid and directly into the body
        // This ensures it sticks to the left properly
        document.body.appendChild(tocElement);
    }
    
    // --- D. Back to Top Button ---
    if (!document.getElementById("backToTopBtn")) {
        const btnHTML = `<button onclick="topFunction()" id="backToTopBtn" title="Go to top"><i class="fas fa-arrow-up"></i></button>`;
        document.body.insertAdjacentHTML("beforeend", btnHTML);
    }
});

/* =========================================
   2. SCROLL FUNCTIONS
   ========================================= */
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    let btn = document.getElementById("backToTopBtn");
    if (!btn) return;
    
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
