// Auto refresh every 15 minutes (900000 milliseconds)
function autoRefresh() {
    const refreshInterval = 900000;
    setInterval(() => {
        window.location.reload();
    }, refreshInterval);
}

// Start the refresh cycle
autoRefresh();
