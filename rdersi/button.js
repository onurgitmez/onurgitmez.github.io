/* button-2.js */

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Create the Modern Navbar HTML
    const navbarHTML = `
    <nav class="lesson-nav">
        <div class="nav-content">
            <div class="nav-left">
                <a href="https://gitmez.com" class="home-link">
                    <i class="fas fa-home"></i>
                </a>
                <span style="color:#d1d5db">/</span>
                <span style="color:#111;">R Dersleri</span>
            </div>
            
            <div class="nav-right">
                <div class="dropdown-wrapper">
                    <button class="dropdown-btn" id="weekSelectBtn">
                        Hafta Seçiniz <i class="fas fa-chevron-down" style="font-size:0.8em;"></i>
                    </button>
                    <div class="dropdown-menu" id="weekDropdown">
                        ${Array.from({length: 15}, (_, i) => 
                            `<a href="r-ders-${i+1}.html">Ders ${i+1}</a>`
                        ).join('')}
                    </div>
                </div>
                <a href="https://gitmez.com/rdersi/rdersi.html" style="text-decoration:none; font-size:0.9rem; font-weight:600; color:#276DC3;">
                    Ana Sayfa
                </a>
            </div>
        </div>
    </nav>`;

    // 2. Inject it at the very top of the body
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // 3. Add Logic for the Dropdown
    const btn = document.getElementById("weekSelectBtn");
    const menu = document.getElementById("weekDropdown");

    // Toggle menu on click
    btn.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent click from bubbling to document
        menu.classList.toggle("show");
    });

    // Close menu when clicking anywhere else on the page
    document.addEventListener("click", function(e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove("show");
        }
    });
});
