/* button-2.js */

document.addEventListener("DOMContentLoaded", function() {

    // --- 1. CLEANUP OLD ELEMENTS ---
    const oldTab = document.querySelector('.tab');
    if(oldTab) oldTab.remove();

    // --- 2. INJECT NAVBAR ---
    const navbarHTML = `
    <nav class="lesson-nav">
        <div class="nav-content">
            <div style="display: flex; align-items: center; gap: 10px;">
                <a href="https://gitmez.com" style="color: #276DC3; font-size: 1.2rem; text-decoration: none;">
                    <i class="fas fa-home"></i>
                </a>
                <span style="color: #e5e7eb;">/</span>
                <span style="font-weight: 600; color: #111;">R Dersleri</span>
            </div>

            <div style="display: flex; align-items: center; gap: 20px;">
                <div class="dropdown-wrapper">
                    <button class="dropdown-btn" id="weekBtn">
                        <span>Hafta Seçiniz</span>
                        <i class="fas fa-chevron-down" style="font-size: 0.8em; opacity: 0.6;"></i>
                    </button>
                    <div class="dropdown-menu-custom" id="weekMenu">
                        ${Array.from({length: 15}, (_, i) => 
                            `<a href="r-ders-${i+1}.html">Ders ${i+1}</a>`
                        ).join('')}
                    </div>
                </div>
                <a href="https://gitmez.com/rdersi/rdersi.html" style="font-size: 14px; font-weight: 600; color: #276DC3; text-decoration: none;">
                    Ana Sayfa
                </a>
            </div>
        </div>
    </nav>
    <button id="backToTopBtn" title="Yukarı Çık"><i class="fas fa-arrow-up"></i></button>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbarHTML);


    // --- 3. NAVBAR DROPDOWN LOGIC ---
    const btn = document.getElementById("weekBtn");
    const menu = document.getElementById("weekMenu");
    const arrow = btn.querySelector(".fa-chevron-down");

    if(btn && menu) {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            menu.classList.toggle("show");
            // Rotate arrow
            if(menu.classList.contains("show")) {
                arrow.style.transform = "rotate(180deg)";
            } else {
                arrow.style.transform = "rotate(0deg)";
            }
        });
        document.addEventListener("click", function(e) {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove("show");
                arrow.style.transform = "rotate(0deg)";
            }
        });
    }


    // --- 4. BACK TO TOP LOGIC ---
    const topBtn = document.getElementById("backToTopBtn");
    
    window.onscroll = function() {
        // Show button after scrolling down 300px
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            topBtn.style.display = "flex"; // Use flex to center the icon
        } else {
            topBtn.style.display = "none";
        }
    };

    topBtn.addEventListener("click", function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });


    // --- 5. INJECT NEXT/PREVIOUS BUTTONS ---
    // Try to find the content container (RMarkdown usually uses .toc-content or .main-container)
    const contentContainer = document.querySelector('.toc-content') || document.querySelector('.main-container');

    if (contentContainer) {
        // Extract current lesson number from URL (e.g., "r-ders-5.html")
        const path = window.location.pathname;
        const match = path.match(/r-ders-(\d+)/i); // Looks for number after "r-ders-"
        
        if (match) {
            const currentNum = parseInt(match[1]);
            const prevNum = currentNum - 1;
            const nextNum = currentNum + 1;
            const maxLessons = 15; // You mentioned 15 lessons

            // Generate HTML for buttons
            const prevLink = prevNum > 0 
                ? `<a href="r-ders-${prevNum}.html" class="bottom-nav-btn"><i class="fas fa-arrow-left"></i> Ders ${prevNum}</a>` 
                : '<div></div>'; // Empty div to keep alignment if no previous
            
            const nextLink = nextNum <= maxLessons 
                ? `<a href="r-ders-${nextNum}.html" class="bottom-nav-btn">Ders ${nextNum} <i class="fas fa-arrow-right"></i></a>` 
                : '<div></div>';

            const bottomNavHTML = `
            <div class="bottom-nav-container">
                ${prevLink}
                ${nextLink}
            </div>`;
            
            // Append to the bottom of the content area
            contentContainer.insertAdjacentHTML('beforeend', bottomNavHTML);
        }
    }
});
