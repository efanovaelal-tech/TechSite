(function () {
  const FORM_EVENTS = {
    checklist: 'form_submit_checklist',
    offer: 'form_submit_offer',
    emergency: 'form_submit_emergency',
    quiz: 'form_submit_quiz'
  };

  function getUtm() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      if (params.has(key)) {
        result[key] = params.get(key);
      }
    });
    return result;
  }

  function clearErrors(form) {
    form.querySelectorAll('.field-error').forEach((node) => {
      node.textContent = '';
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
      field.removeAttribute('aria-invalid');
    });
  }

  function setError(field, message) {
    field.setAttribute('aria-invalid', 'true');
    const errorNode = field.closest('.field')?.querySelector('.field-error');
    if (errorNode) {
      errorNode.textContent = message;
    }
  }

  function validateForm(form) {
    clearErrors(form);
    let valid = true;

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      if (field.type === 'checkbox' && field.required && !field.checked) {
        valid = false;
        const message = 'Подтвердите согласие.';
        const messageNode = form.querySelector('.form-message') || form.querySelector('.quiz-message');
        if (messageNode) {
          messageNode.textContent = message;
          messageNode.className = `${messageNode.classList[0]} is-error`;
        }
        return;
      }

      if (field.required && !field.value.trim()) {
        valid = false;
        setError(field, 'Заполните поле.');
      }

      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        valid = false;
        setError(field, 'Введите корректный email.');
      }

      if (field.type === 'tel' && field.value && field.value.replace(/\D/g, '').length < 10) {
        valid = false;
        setError(field, 'Введите корректный телефон.');
      }
    });

    return valid;
  }

  function formToObject(form) {
    const data = new FormData(form);
    const result = {};
    data.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  function sendLead(payload) {
    console.log('Lead payload:', payload);
    return Promise.resolve({ ok: true, payload });
  }

  function showMessage(form, text, type) {
    const message = form.querySelector('.form-message');
    if (!message) return;
    message.textContent = text;
    message.className = `form-message is-${type}`;
  }

  function openFileAfterSubmit(form, data) {
    const directFile = form.dataset.file;
    const selectedFile = data.offerVersion;
    const file = directFile || selectedFile;
    if (file) {
      window.open(file, '_blank', 'noopener');
    }
  }

  function buildPayload(form, extra = {}) {
    const formType = form.dataset.form || 'unknown';
    return {
      formType,
      page: window.location.pathname,
      fields: formToObject(form),
      utm: getUtm(),
      createdAt: new Date().toISOString(),
      ...extra
    };
  }

  function initForms() {
    document.querySelectorAll('.lead-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formType = form.dataset.form;

        if (!validateForm(form)) {
          showMessage(form, 'Проверьте поля формы.', 'error');
          return;
        }

        const payload = buildPayload(form);
        sendLead(payload)
          .then(() => {
            trackEvent(FORM_EVENTS[formType] || 'form_submit', payload);
            showMessage(form, 'Заявка принята. Проверьте консоль для объекта отправки.', 'success');
            openFileAfterSubmit(form, payload.fields);
            form.reset();
          })
          .catch(() => {
            showMessage(form, 'Не удалось отправить заявку. Попробуйте еще раз.', 'error');
          });
      });
    });
  }

  window.LeadForms = {
    buildPayload,
    sendLead,
    validateForm,
    getUtm
  };

  document.addEventListener('DOMContentLoaded', initForms);
})();
