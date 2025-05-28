/**
 * Panel Utilities
 * Helper functions for loading states, error handling, and common panel operations
 */

class PanelUtils {
  /**
   * Show loading state in a container
   * @param {HTMLElement} container - The container element
   * @param {string} message - Loading message
   * @returns {Function} Function to clear the loading state
   */
  static showLoading(container, message = 'Loading...') {
    const previousContent = container.innerHTML;
    
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 20px;">
        <loading-spinner size="large" color="primary" text="${message}"></loading-spinner>
      </div>
    `;
    
    // Return function to restore content
    return () => {
      container.innerHTML = previousContent;
    };
  }
  
  /**
   * Show error state in a container
   * @param {HTMLElement} container - The container element
   * @param {Object} options - Error options
   * @returns {Function} Function to clear the error state
   */
  static showError(container, options = {}) {
    const {
      title = 'Error',
      message = 'Something went wrong',
      type = 'error',
      showRetry = true,
      onRetry = null
    } = options;
    
    const previousContent = container.innerHTML;
    const errorId = `error-${Date.now()}`;
    
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px;">
        <error-message 
          id="${errorId}"
          title="${title}"
          message="${message}"
          type="${type}"
          show-retry="${showRetry}"
        ></error-message>
      </div>
    `;
    
    // Add retry listener if provided
    if (onRetry && showRetry) {
      const errorElement = container.querySelector(`#${errorId}`);
      errorElement.addEventListener('retry', () => {
        container.innerHTML = previousContent;
        onRetry();
      });
    }
    
    // Return function to restore content
    return () => {
      container.innerHTML = previousContent;
    };
  }
  
  /**
   * Wrap an async function with loading and error states
   * @param {HTMLElement} container - The container element
   * @param {Function} asyncFn - The async function to execute
   * @param {Object} options - Options for loading/error states
   */
  static async withLoadingState(container, asyncFn, options = {}) {
    const {
      loadingMessage = 'Loading...',
      errorTitle = 'Error',
      errorMessage = 'Failed to load content',
      showRetry = true
    } = options;
    
    // Show loading state
    const clearLoading = this.showLoading(container, loadingMessage);
    
    try {
      // Execute the async function
      await asyncFn();
    } catch (error) {
      console.error('Panel operation failed:', error);
      
      // Show error state
      this.showError(container, {
        title: errorTitle,
        message: error.message || errorMessage,
        showRetry,
        onRetry: async () => {
          // Retry the operation
          await this.withLoadingState(container, asyncFn, options);
        }
      });
    }
  }
  
  /**
   * Add error boundary to a panel
   * @param {HTMLElement} container - The container element
   * @param {Function} renderFn - The render function
   */
  static addErrorBoundary(container, renderFn) {
    try {
      renderFn();
    } catch (error) {
      console.error('Panel render error:', error);
      this.showError(container, {
        title: 'Render Error',
        message: 'Failed to render panel content',
        showRetry: true,
        onRetry: () => {
          this.addErrorBoundary(container, renderFn);
        }
      });
    }
  }
  
  /**
   * Handle save operations with feedback
   * @param {Function} saveFn - The save function
   * @param {Object} options - Options for feedback
   */
  static async handleSave(saveFn, options = {}) {
    const {
      successMessage = 'Data Saved',
      errorMessage = 'Save Failed',
      showIndicator = true
    } = options;
    
    try {
      await saveFn();
      
      if (showIndicator && window.showSaveIndicator) {
        window.showSaveIndicator(successMessage);
      }
      
      // Play success sound
      if (window.soundManager) {
        window.soundManager.play('uiSuccess');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Save operation failed:', error);
      
      // Show error notification
      this.showNotification(errorMessage, 'error');
      
      // Play error sound
      if (window.soundManager) {
        window.soundManager.play('uiError');
      }
      
      return { success: false, error };
    }
  }
  
  /**
   * Show a temporary notification
   * @param {string} message - The notification message
   * @param {string} type - The notification type (success, error, info)
   */
  static showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: var(--bg-surface);
      border: 1px solid var(--${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'});
      padding: 12px 20px;
      border-radius: 4px;
      color: var(--${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'});
      font-size: 14px;
      z-index: 10002;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  /**
   * Debounce a function
   * @param {Function} fn - The function to debounce
   * @param {number} delay - Delay in milliseconds
   */
  static debounce(fn, delay = 300) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  
  /**
   * Throttle a function
   * @param {Function} fn - The function to throttle
   * @param {number} limit - Time limit in milliseconds
   */
  static throttle(fn, limit = 100) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  /**
   * Validate input with error display
   * @param {HTMLElement} input - The input element
   * @param {Function} validator - Validation function
   * @param {string} errorMessage - Error message to display
   */
  static validateInput(input, validator, errorMessage) {
    const isValid = validator(input.value);
    
    if (!isValid) {
      input.setAttribute('error', errorMessage);
      return false;
    } else {
      input.removeAttribute('error');
      return true;
    }
  }
  
  /**
   * Create a confirmation dialog
   * @param {string} message - Confirmation message
   * @param {Object} options - Dialog options
   */
  static async confirm(message, options = {}) {
    const {
      title = 'Confirm',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      type = 'warning'
    } = options;
    
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10003;
        animation: fadeIn 0.2s ease-out;
      `;
      
      dialog.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid var(--${type === 'danger' ? 'danger' : 'warning'}); 
                    padding: 20px; border-radius: 4px; max-width: 400px; width: 90%;">
          <h3 style="margin: 0 0 15px 0; color: var(--${type === 'danger' ? 'danger' : 'warning'}); 
                     font-size: 18px; text-transform: uppercase;">${title}</h3>
          <p style="margin: 0 0 20px 0; color: var(--text-primary); font-size: 14px; line-height: 1.5;">${message}</p>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="cancel-btn" style="padding: 8px 16px; background: var(--bg-overlay); 
                    border: 1px solid var(--border-color); color: var(--text-secondary); 
                    cursor: pointer; font-size: 12px;">${cancelText}</button>
            <button class="confirm-btn" style="padding: 8px 16px; background: var(--${type === 'danger' ? 'danger' : 'warning'}); 
                    border: none; color: var(--bg-primary); cursor: pointer; font-size: 12px; 
                    font-weight: bold;">${confirmText}</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(dialog);
      
      const confirmBtn = dialog.querySelector('.confirm-btn');
      const cancelBtn = dialog.querySelector('.cancel-btn');
      
      confirmBtn.addEventListener('click', () => {
        dialog.remove();
        resolve(true);
      });
      
      cancelBtn.addEventListener('click', () => {
        dialog.remove();
        resolve(false);
      });
    });
  }
}

// Add fadeOut animation if not exists
if (!document.querySelector('#panel-utils-styles')) {
  const style = document.createElement('style');
  style.id = 'panel-utils-styles';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PanelUtils;
}