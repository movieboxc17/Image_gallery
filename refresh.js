// Enhanced auto refresh with memory management
function autoRefresh() {
    const refreshInterval = 900000; // 15 minutes
    
    // Clear memory before refresh
    function prepareForRefresh() {
        // Remove event listeners
        const slideshow = document.querySelector('.slideshow-container');
        if (slideshow) {
            const clonedSlideshow = slideshow.cloneNode(true);
            slideshow.parentNode.replaceChild(clonedSlideshow, slideshow);
        }
        
        // Clear any pending timeouts/intervals
        const highestTimeoutId = setTimeout(";");
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
        
        // Reload the page
        window.location.reload();
    }
    
    // Set refresh timer
    setTimeout(prepareForRefresh, refreshInterval);
    
    // Also refresh if the tab becomes active after being inactive for too long
    let lastActivity = Date.now();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // If page has been hidden for more than 10 minutes, refresh
            if (Date.now() - lastActivity > 600000) {
                prepareForRefresh();
            }
        } else {
            lastActivity = Date.now();
        }
    });
}

// Start the refresh cycle
autoRefresh();
