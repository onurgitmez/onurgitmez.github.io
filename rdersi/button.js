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

/* INJECT TOP NAVIGATION MENU */
document.addEventListener("DOMContentLoaded", function() {
    // 1. Create the Navbar HTML matching your main site style
    const navHTML = `
    <nav class="lesson-nav">
        <div class="nav-content">
            <div class="nav-left">
                <a href="https://gitmez.com" class="home-icon"><i class="fas fa-home"></i></a>
                <span class="divider">/</span>
                <span class="nav-title">R Dersleri</span>
            </div>
            
            <div class="nav-right">
                <div class="dropdown">
                    <button class="dropbtn">Jump to Week <i class="fas fa-chevron-down"></i></button>
                    <div class="dropdown-content">
                        ${Array.from({length: 15}, (_, i) => 
                            `<a href="r-ders-${i+1}.html">Week ${i+1}</a>`
                        ).join('')}
                    </div>
                </div>
                <a href="https://gitmez.com/rdersi/rdersi.html" class="nav-link">Course Home</a>
            </div>
        </div>
    </nav>`;

    // 2. Insert it at the very start of the body
    document.body.insertAdjacentHTML("afterbegin", navHTML);
});
