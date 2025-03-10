// Enhanced auto refresh with improved memory management
function autoRefresh() {
    const refreshInterval = 900000; // 15 minutes
    let refreshTimer;
    
    // Clear memory before refresh
    function prepareForRefresh() {
        // Remove event listeners
        const elements = document.querySelectorAll('.slide img, .nav-arrow, .progress-dot, .social-button');
        elements.forEach(el => {
            const newEl = el.cloneNode(true);
            if (el.parentNode) {
                el.parentNode.replaceChild(newEl, el);
            }
        });
        
        // Clear any pending timeouts/intervals
        const highestTimeoutId = setTimeout(";");
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
            clearInterval(i);
        }
        
        // Clear any event listeners on window and document
        const oldBody = document.body;
        const newBody = oldBody.cloneNode(true);
        oldBody.parentNode.replaceChild(newBody, oldBody);
        
        // Force garbage collection hint (doesn't guarantee execution)
        if (window.gc) {
            try {
                window.gc();
            } catch (e) {
                console.log('GC not available');
            }
        }
        
        // Reload the page
        window.location.reload();
    }
    
    // Set refresh timer
    refreshTimer = setTimeout(prepareForRefresh, refreshInterval);
    
    // Also refresh if the tab becomes active after being inactive for too long
    let lastActivity = Date.now();
    
    // Better handling of visibility change
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // If page has been hidden for more than 10 minutes, refresh
            if (Date.now() - lastActivity > 600000) {
                clearTimeout(refreshTimer);
                prepareForRefresh();
            }
        } else {
            lastActivity = Date.now();
        }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for errors that might indicate memory issues
    window.addEventListener('error', function(e) {
        console.log('Error detected, refreshing page:', e.message);
        prepareForRefresh();
    });
    
    // Return a cleanup function
    return function cleanup() {
        clearTimeout(refreshTimer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}

// Start the refresh cycle
const cleanupRefresh = autoRefresh();

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (cleanupRefresh) cleanupRefresh();
});
