/* =========================================
   1. SCROLL & BACK TO TOP LOGIC
   ========================================= */
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    let btn = document.getElementById("backToTopBtn");
    if (!btn) return; // Guard clause if button doesn't exist yet
    
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

/* =========================================
   2. UI INJECTION (NAVBAR & SIDEBAR LOGIC)
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {

    // A. Inject the Back to Top Button if not present
    if (!document.getElementById("backToTopBtn")) {
        const btnHTML = `<button onclick="topFunction()" id="backToTopBtn" title="Go to top"><i class="fas fa-arrow-up"></i></button>`;
        document.body.insertAdjacentHTML("beforeend", btnHTML);
    }

    // B. Define the New Top Navigation HTML
    const navbarHTML = `
    <nav class="lesson-nav">
        <div class="nav-content">
            <div class="nav-left">
                <button id="tocToggleBtn">
                    <i class="fas fa-bars"></i>
                </button>
                
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
                <a href="https://gitmez.com/rdersi/rdersi.html" style="font-size:0.9rem; font-weight:600; text-decoration:none; color:var(--r-blue);">Back to Course</a>
            </div>
        </div>
    </nav>`;

    // C. Insert Navbar at the very top of body
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // D. "Kidnap" the RMarkdown TOC and turn it into our Sidebar
    // RMarkdown usually generates a div with id="TOC" inside a col-md-3.
    // We want to move it out of there so we can control it fully.
    const tocElement = document.getElementById('TOC');
    
    if (tocElement) {
        // 1. Add our custom class for styling
        tocElement.classList.add('toc-sidebar');
        
        // 2. Move it to the <body> tag directly (detach from grid)
        document.body.appendChild(tocElement);
        
        // 3. Add Close functionality (optional close X inside menu)
        // Not strictly needed since we toggle, but good for mobile
    }

    // E. Setup Toggle Logic
    const toggleBtn = document.getElementById('tocToggleBtn');
    
    if (toggleBtn && tocElement) {
        // Click button -> Toggle Menu
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent click from bubbling to document
            tocElement.classList.toggle('open');
        });

        // Click Anywhere Else -> Close Menu
        document.addEventListener('click', function(e) {
            if (tocElement.classList.contains('open') && 
                !tocElement.contains(e.target) && 
                e.target !== toggleBtn) {
                tocElement.classList.remove('open');
            }
        });
    }
});
