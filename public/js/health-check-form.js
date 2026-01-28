/**
 * Health Check Form Handler
 * Handles form submission, validation, and UI feedback
 */

(function() {
  'use strict';

  const form = document.getElementById('health-check-form');
  const submitButton = document.getElementById('submit-button');
  const messagesDiv = document.getElementById('form-messages');

  if (!form) {
    return; // Form not on this page
  }

  /**
   * Clear all error messages
   */
  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    messagesDiv.innerHTML = '';
    messagesDiv.className = 'form-messages';
  }

  /**
   * Show error message for a specific field
   */
  function showFieldError(fieldName, message) {
    const errorEl = document.getElementById(`${fieldName}_error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  /**
   * Show general form message
   */
  function showMessage(message, type = 'error') {
    messagesDiv.innerHTML = `<div class="message message--${type}">${message}</div>`;
    messagesDiv.className = `form-messages message--${type}`;
    messagesDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Validate form before submission
   */
  function validateForm() {
    clearErrors();
    let isValid = true;

    // Required text fields
    const requiredTextFields = ['org_name', 'contact_name', 'email'];
    requiredTextFields.forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (!field || !field.value.trim()) {
        showFieldError(fieldName, 'This field is required');
        isValid = false;
      }
    });

    // Email validation
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
      }
    }

    // Required select fields
    const requiredSelectFields = ['org_size', 'backups_maturity', 'security_confidence', 'budget_comfort', 'timeline'];
    requiredSelectFields.forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (!field || !field.value) {
        showFieldError(fieldName, 'Please select an option');
        isValid = false;
      }
    });

    // Checkbox groups (must have at least one selected)
    const checkboxGroups = [
      { name: 'current_tools', errorId: 'current_tools_error' },
      { name: 'top_pain_points', errorId: 'top_pain_points_error' }
    ];

    checkboxGroups.forEach(group => {
      const checked = form.querySelectorAll(`input[name="${group.name}"]:checked`);
      if (checked.length === 0) {
        const errorEl = document.getElementById(group.errorId);
        if (errorEl) {
          errorEl.textContent = 'Please select at least one option';
          errorEl.style.display = 'block';
        }
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Collect form data
   */
  function collectFormData() {
    const formData = new FormData(form);
    const data = {
      org_name: formData.get('org_name') || '',
      contact_name: formData.get('contact_name') || '',
      email: formData.get('email') || '',
      org_size: formData.get('org_size') || '',
      current_tools: formData.getAll('current_tools'),
      top_pain_points: formData.getAll('top_pain_points'),
      backups_maturity: formData.get('backups_maturity') || '',
      security_confidence: formData.get('security_confidence') || '',
      budget_comfort: formData.get('budget_comfort') || '',
      timeline: formData.get('timeline') || '',
      notes: formData.get('notes') || '',
      honeypot: formData.get('honeypot') || ''
    };

    return data;
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();
    clearErrors();

    // Validate form
    if (!validateForm()) {
      showMessage('Please correct the errors below and try again.', 'error');
      return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // Collect form data
    const data = collectFormData();

    try {
      // Submit to API
      const response = await fetch('/api/healthcheck/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.ok) {
        // Success
        showMessage('Thank you! Check your email in a few minutes for your personalized IT Health Check report.', 'success');
        form.reset();
        
        // Optionally redirect after delay
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 5000);
      } else {
        // Handle validation errors
        if (result.errors) {
          Object.keys(result.errors).forEach(fieldName => {
            showFieldError(fieldName, result.errors[fieldName]);
          });
          showMessage('Please correct the errors below and try again.', 'error');
        } else {
          showMessage(result.message || 'An error occurred. Please try again later.', 'error');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage('An error occurred submitting your form. Please try again later.', 'error');
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Assessment';
    }
  }

  // Attach submit handler
  form.addEventListener('submit', handleSubmit);

  // Real-time validation (optional - validate on blur)
  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(field => {
    field.addEventListener('blur', function() {
      if (this.hasAttribute('required') && !this.value.trim()) {
        const fieldName = this.name || this.id;
        showFieldError(fieldName, 'This field is required');
      }
    });
  });
})();
