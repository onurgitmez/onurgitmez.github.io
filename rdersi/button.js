/* button-2.js */

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Force remove the old 'tab' div if JS loads faster than CSS hides it
    const oldTab = document.querySelector('.tab');
    if(oldTab) oldTab.style.display = 'none';

    // 2. Define the new Navbar
    const navbarHTML = `
    <nav class="lesson-nav">
        <div class="nav-content">
            <div class="nav-left">
                <a href="https://gitmez.com" style="color:#276DC3; font-size:1.2rem;">
                    <i class="fas fa-home"></i>
                </a>
                <span style="color:#e5e7eb">/</span>
                <span style="color:#1f2937;">R Dersleri</span>
            </div>
            
            <div class="nav-right" style="position: relative;">
                <div style="position: relative;">
                    <button class="dropdown-btn" id="weekBtn">
                        Hafta Seçiniz <i class="fas fa-chevron-down" style="font-size: 0.8em"></i>
                    </button>
                    <div class="dropdown-menu-custom" id="weekMenu">
                        ${Array.from({length: 15}, (_, i) => 
                            `<a href="r-ders-${i+1}.html">Ders ${i+1}</a>`
                        ).join('')}
                    </div>
                </div>
                <a href="https://gitmez.com/rdersi/rdersi.html" style="font-weight:600; font-size:0.9rem;">
                    Ana Sayfa
                </a>
            </div>
        </div>
    </nav>`;

    // 3. Inject Navbar
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // 4. Dropdown Logic
    const btn = document.getElementById("weekBtn");
    const menu = document.getElementById("weekMenu");

    if(btn && menu) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.remove("show");
            }
        });
    }
});
