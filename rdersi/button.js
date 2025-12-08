document.addEventListener("DOMContentLoaded", function() {

    // 1. Remove old elements if they exist
    const oldTab = document.querySelector('.tab');
    if(oldTab) oldTab.remove();

    // 2. The HTML for your new Modern Navbar
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
    `;

    // 3. Inject into Body
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // 4. Dropdown Click Logic
    const btn = document.getElementById("weekBtn");
    const menu = document.getElementById("weekMenu");
    const arrow = btn.querySelector(".fa-chevron-down");

    if(btn && menu) {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const isOpen = menu.classList.contains("show");
            
            if (isOpen) {
                menu.classList.remove("show");
                arrow.style.transform = "rotate(0deg)";
            } else {
                menu.classList.add("show");
                arrow.style.transform = "rotate(180deg)";
            }
        });

        // Close when clicking outside
        document.addEventListener("click", function(e) {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove("show");
                arrow.style.transform = "rotate(0deg)";
            }
        });
    }
});
