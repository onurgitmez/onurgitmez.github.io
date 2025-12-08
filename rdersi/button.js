/* =========================================
   TOC TOGGLE BUTTON (Show/Hide Table of Contents)
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {
    // Ensure jQuery is available (RMarkdown pages usually load it by default)
    if (typeof jQuery === 'undefined') return;
    var $ = jQuery;

    // 1. Create the Toggle Button
    // We use icons from FontAwesome which is included in your project
    var $btn = $('<button id="toc-toggle-btn" title="Toggle Table of Contents"><i class="fas fa-list"></i></button>');

    // 2. Apply Styles to the Button (Fixed position on the left)
    $btn.css({
        "position": "fixed",
        "top": "100px",        /* Positioning it below the top navbar */
        "left": "10px",
        "z-index": "1000",     /* Ensure it sits above other content */
        "background-color": "#276DC3", /* Matches your --r-blue variable */
        "color": "white",
        "border": "none",
        "padding": "10px 15px",
        "border-radius": "5px",
        "cursor": "pointer",
        "font-size": "1.2rem",
        "box-shadow": "0 2px 5px rgba(0,0,0,0.2)",
        "transition": "all 0.3s ease"
    });

    // Optional: Add hover effect
    $btn.hover(
        function() { $(this).css("background-color", "#1d4ed8"); }, // Hover in
        function() { $(this).css("background-color", "#276DC3"); }  // Hover out
    );

    // 3. Append the button to the body
    $('body').append($btn);

    // 4. Add the Click Logic
    $btn.click(function() {
        // Select the column containing the TOC (usually col-sm-4 or col-md-3)
        var $tocColumn = $('#TOC').parent(); 
        
        // Select the column containing the main content
        var $contentColumn = $('.toc-content'); 

        if ($tocColumn.is(':visible')) {
            // --- HIDE MODE ---
            
            // Hide the TOC container
            $tocColumn.hide();
            
            // Expand the content container to full width
            // We remove the specific sizing classes and add full-width classes
            $contentColumn.removeClass('col-sm-8 col-md-9').addClass('col-sm-12 col-md-12');
            
            // Optional: visual indication on button (e.g., make it semi-transparent)
            $(this).css("opacity", "0.7");
            
        } else {
            // --- VIEW MODE ---
            
            // Show the TOC container
            $tocColumn.show();
            
            // Shrink the content container back to original width
            $contentColumn.removeClass('col-sm-12 col-md-12').addClass('col-sm-8 col-md-9');
            
            // Restore button opacity
            $(this).css("opacity", "1");
        }

        // Trigger a window resize event to ensure any R plots or widgets resize correctly
        $(window).trigger('resize');
    });
});
