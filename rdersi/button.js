/* button-2.js */

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Clean up old elements
    const oldTab = document.querySelector('.tab');
    if(oldTab) oldTab.remove();

    // 2. Navbar HTML
    const navbarHTML = `
    <nav class="lesson-nav">
        <div class="nav-content">
            <div class="nav-left" style="display:flex; align-items:center; gap:12px;">
                <a href="https://gitmez.com" style="color:#276DC3; font-size:1.2rem; text-decoration:none;">
                    <i class="fas fa-home"></i>
                </a>
                <span style="color:#e5e7eb">/</span>
                <span style="font-weight:600; color:#1f2937;">R Dersleri</span>
            </div>
            
            <div class="nav-right" style="display:flex; align-items:center; gap:20px; position:relative;">
                
                <div style="position: relative;">
                    <button class="dropdown-btn" id="weekBtn">
                        <span>Hafta Seçiniz</span>
                        <i class="fas fa-chevron-down" style="font-size: 0.7em; opacity: 0.6;"></i>
                    </button>
                    
                    <div class="dropdown-menu-custom" id="weekMenu">
                        ${Array.from({length: 15}, (_, i) => 
                            `<a href="r-ders-${i+1}.html">Ders ${i+1}</a>`
                        ).join('')}
                    </div>
                </div>

                <a href="https://gitmez.com/rdersi/rdersi.html" style="font-weight:600; font-size:0.9rem; color:#276DC3; text-decoration:none;">
                    Ana Sayfa
                </a>
            </div>
        </div>
    </nav>`;

    // 3. Inject
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // 4. Interaction
    const btn = document.getElementById("weekBtn");
    const menu = document.getElementById("weekMenu");

    if(btn && menu) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("show");
            // Rotate arrow effect (optional)
            const icon = btn.querySelector('.fa-chevron-down');
            if(icon) icon.style.transform = menu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove("show");
                const icon = btn.querySelector('.fa-chevron-down');
                if(icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    }
});
