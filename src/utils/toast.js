let toastTimeout;

/**
 * Shows a toast message for 5 seconds
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('error' or 'success')
 */
function showToast(message, type = 'error') {
    const toastElement = document.getElementById('errorToast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Clear any existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    // Update alert type and message
    toastElement.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
    toastMessage.textContent = message;
    
    // Show alert with animation
    toastElement.style.display = 'block';
    
    // Hide alert after 5 seconds
    toastTimeout = setTimeout(() => {
        toastElement.style.display = 'none';
    }, 5000);
}

/**
 * Initializes the toast close button functionality
 */
function initializeToast() {
    const closeButton = document.querySelector('#errorToast .btn-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            document.getElementById('errorToast').style.display = 'none';
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        });
    }
}

export { showToast, initializeToast };
