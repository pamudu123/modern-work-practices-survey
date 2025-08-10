function toggleCollapsed(element){
  element.classList.toggle('collapsed');
}

function findAncestor(el, selector){
  while (el && el !== document) {
    if (el.matches(selector)) return el;
    el = el.parentElement;
  }
  return null;
}

function isValidEmail(email){
  // Simple and robust email pattern for client-side checks
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailPattern.test(String(email).trim());
}

function validateForm(form){
  let valid = true;
  const errorElements = form.querySelectorAll('.error');
  errorElements.forEach(e => e.textContent = '');
  const highlighted = form.querySelectorAll('.highlight-missing');
  highlighted.forEach(e => e.classList.remove('highlight-missing'));
  const answeredContainers = form.querySelectorAll('.answered');
  answeredContainers.forEach(e => e.classList.remove('answered'));

  // Text/number/select required
  const requiredControls = form.querySelectorAll('[required]');
  const radioGroupsChecked = new Set();

  requiredControls.forEach(ctrl => {
    if (ctrl.type === 'radio') {
      if (radioGroupsChecked.has(ctrl.name)) return;
      radioGroupsChecked.add(ctrl.name);
      const group = form.querySelectorAll(`input[name="${ctrl.name}"]`);
      const isAnyChecked = Array.from(group).some(r => r.checked);
      if (!isAnyChecked) {
        valid = false;
        const error = form.querySelector(`[data-error-for="${ctrl.name}"]`);
        if (error) error.textContent = 'Please select an option.';
        // highlight group container if present
        const groupContainer = findAncestor(group[0], '.field');
        if (groupContainer) groupContainer.classList.add('highlight-missing');
      } else {
        const groupContainer = findAncestor(group[0], '.field');
        if (groupContainer) groupContainer.classList.add('answered');
      }
    } else if (ctrl.tagName === 'SELECT' || ctrl.tagName === 'INPUT' || ctrl.tagName === 'TEXTAREA') {
      if (!ctrl.value) {
        valid = false;
        const forName = ctrl.id || ctrl.name;
        const error = form.querySelector(`[data-error-for="${forName}"]`);
        if (error) error.textContent = 'This field is required.';
        ctrl.classList.add('highlight-missing');
      } else {
        const container = findAncestor(ctrl, '.field') || findAncestor(ctrl, 'fieldset');
        if (container) container.classList.add('answered');
      }
    }
  });

  // Conditional email requirement when Yes selected
  const wantReportYes = form.querySelector('input[name="final_receiveReport"][value="Yes"]');
  const emailInput = form.querySelector('#email');
  if (wantReportYes && wantReportYes.checked) {
    if (emailInput && !emailInput.value) {
      valid = false;
      const error = form.querySelector('[data-error-for="email"]');
      if (error) error.textContent = 'Email is required when choosing Yes.';
      emailInput.classList.add('highlight-missing');
    }
  }

  // If an email is provided (optional or required), validate format
  if (emailInput && emailInput.value) {
    if (!isValidEmail(emailInput.value)) {
      valid = false;
      const error = form.querySelector('[data-error-for="email"]');
      if (error) error.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('highlight-missing');
    }
  }

  return valid;
}

document.addEventListener('DOMContentLoaded', () => {
  // toggling sections
  document.querySelectorAll('[data-section] > [data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => toggleCollapsed(btn.parentElement));
  });
  document.querySelectorAll('[data-subsection] > [data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => toggleCollapsed(btn.parentElement));
  });

  // auto-collapse when all required questions in a block are answered
  function checkAndAutoCollapse(container){
    const required = container.querySelectorAll('[required]');
    const radioGroups = new Map();
    let allAnswered = true;
    required.forEach(ctrl => {
      if (ctrl.type === 'radio') {
        if (!radioGroups.has(ctrl.name)) {
          radioGroups.set(ctrl.name, Array.from(container.querySelectorAll(`input[name="${ctrl.name}"]`)));
        }
      } else if (!ctrl.value) {
        allAnswered = false;
      }
    });
    for (const [_name, group] of radioGroups) {
      if (!group.some(r => r.checked)) { allAnswered = false; break; }
    }

    // Special handling: Final Report section should not collapse when 'Yes' is selected
    // until the email field (shown conditionally) is filled.
    const yesFinal = container.querySelector('input[name="final_receiveReport"][value="Yes"]:checked');
    if (yesFinal) {
      const emailInput = container.querySelector('#email');
      if (!emailInput || !emailInput.value) {
        allAnswered = false;
      }
    }

    if (allAnswered) container.classList.add('collapsed');
  }

  // monitor changes to inputs to auto-collapse
  document.querySelectorAll('[data-section], [data-subsection]').forEach(container => {
    container.addEventListener('change', () => checkAndAutoCollapse(container));
  });

  // Conditional email field show/hide
  const reportRadios = document.querySelectorAll('input[name="final_receiveReport"]');
  const emailField = document.getElementById('emailField');
  const emailInfo = document.getElementById('emailInfo');
  function updateEmailVisibility(){
    const yesChecked = Array.from(reportRadios).some(r => r.value === 'Yes' && r.checked);
    // Show info always; only show email input when Yes
    if (emailInfo) emailInfo.hidden = false;
    emailField.hidden = !yesChecked;
    const emailInput = document.getElementById('email');
    if (!yesChecked && emailInput) {
      emailInput.value = '';
      emailInput.classList.remove('highlight-missing');
    }
  }
  reportRadios.forEach(r => r.addEventListener('change', updateEmailVisibility));
  updateEmailVisibility();

  // Department and Job Title "Other" handling for radio groups
  function wireRadioOther(groupName, otherFieldId, otherInputId){
    const radios = document.querySelectorAll(`input[name="${groupName}"]`);
    const otherField = document.getElementById(otherFieldId);
    const otherInput = document.getElementById(otherInputId);
    function update(){
      const otherSelected = Array.from(radios).some(r => r.checked && r.value === 'Other');
      if (otherField) otherField.hidden = !otherSelected;
      if (otherInput) {
        if (otherSelected) {
          otherInput.setAttribute('required', 'true');
        } else {
          otherInput.removeAttribute('required');
          otherInput.classList.remove('highlight-missing');
          otherInput.value = '';
        }
      }
    }
    radios.forEach(r => r.addEventListener('change', update));
    update();
  }

  wireRadioOther('general_department', 'departmentOtherField', 'departmentOther');
  wireRadioOther('general_jobTitle', 'jobTitleOtherField', 'jobTitleOther');

  // form validation
  const form = document.getElementById('surveyForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) {
      // expand any collapsed containers with missing answers
      document.querySelectorAll('.highlight-missing').forEach(el => {
        const section = findAncestor(el, '[data-section]');
        if (section) section.classList.remove('collapsed');
        const subsection = findAncestor(el, '[data-subsection]');
        if (subsection) subsection.classList.remove('collapsed');
      });
      // If only the email format is invalid and everything else is answered, show a specific message
      const emailInput = form.querySelector('#email');
      const emailErr = form.querySelector('[data-error-for="email"]');
      const otherErrors = Array.from(form.querySelectorAll('.error'))
        .filter(e => e.textContent && e.getAttribute('data-error-for') !== 'email');
      if (emailInput && emailInput.value && !isValidEmail(emailInput.value) && otherErrors.length === 0) {
        alert('There is an error in the email address. Please enter a valid email.');
      } else {
        alert('Please complete all required questions.');
      }
      return;
    }

    // Gather form data
    const formData = new FormData(form);
    const payload = {};
    for (const [key, value] of formData.entries()) {
      // Radios will override; that's fine
      payload[key] = value;
    }

    // Normalize
    if (payload.final_receiveReport !== 'Yes') payload.final_email = '';
    if (payload.general_department === 'Other' && payload.general_departmentOther) {
      payload.general_department = payload.general_departmentOther;
    }
    if (payload.general_jobTitle === 'Other' && payload.general_jobTitleOther) {
      payload.general_jobTitle = payload.general_jobTitleOther;
    }
    delete payload.general_departmentOther;
    delete payload.general_jobTitleOther;

    // Rename keys to sheet-friendly convention
    const renameMap = {
      wipl_q1: 'WIPL_1', wipl_q2: 'WIPL_2', wipl_q3: 'WIPL_3', wipl_q4: 'WIPL_4',
      pliw_q1: 'PLIW_1', pliw_q2: 'PLIW_2', pliw_q3: 'PLIW_3', pliw_q4: 'PLIW_4',
      wple_q1: 'WPLE_1', wple_q2: 'WPLE_2', wple_q3: 'WPLE_3', wple_q4: 'WPLE_4',
      modern_aiTools: 'MWE_1', modern_pressureSameTime: 'MWE_2', modern_comfortManager: 'MWE_3',
      modern_switchOff: 'MWE_4', modern_disconnected: 'MWE_5', modern_toolsCollaborate: 'MWE_6'
    };
    const renamed = {};
    Object.keys(payload).forEach(k => { renamed[renameMap[k] || k] = payload[k]; });

    if (!window.APPS_SCRIPT_URL) {
      alert('Submission endpoint is not configured. Please set APPS_SCRIPT_URL in public/config.js');
      return;
    }

    try {
      const res = await fetch(window.APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renamed)
      });
      // With no-cors we cannot read status; navigate optimistically
      window.location.href = 'thankyou.html';
    } catch (err) {
      console.error(err);
      alert('Failed to submit. Please try again later.');
    }
  });

  // live-clear errors and set answered states
  function clearErrorsAndMarkAnswered(target){
    const container = findAncestor(target, '.field') || findAncestor(target, 'fieldset');
    if (!container) return;
    // radios: clear group error when any is checked
    if (target.type === 'radio') {
      const group = document.querySelectorAll(`input[name="${target.name}"]`);
      if (Array.from(group).some(r => r.checked)) {
        const err = document.querySelector(`[data-error-for="${target.name}"]`);
        if (err) err.textContent = '';
        container.classList.remove('highlight-missing');
        container.classList.add('answered');
      }
    } else {
      if (target.value) {
        const forName = target.id || target.name;
        const err = document.querySelector(`[data-error-for="${forName}"]`);
        // Special handling for email format while typing
        if (target.id === 'email') {
          if (!isValidEmail(target.value)) {
            if (err) err.textContent = 'Please enter a valid email address.';
            target.classList.add('highlight-missing');
            container.classList.remove('answered');
            return;
          }
        }
        if (err) err.textContent = '';
        target.classList.remove('highlight-missing');
        container.classList.add('answered');
      }
    }
  }

  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', (e) => clearErrorsAndMarkAnswered(e.target));
    el.addEventListener('change', (e) => clearErrorsAndMarkAnswered(e.target));
  });
});


