(function () {
  let activeModal = null;

  function closeModal() {
    if (!activeModal) return;
    activeModal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    activeModal = null;
  }

  function openModal(modal) {
    activeModal = modal;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    modal.querySelector('[data-modal-close]')?.focus();
    trackEvent('open_document', { modal: modal.id });
  }

  function setDocumentModal(trigger) {
    const title = trigger.dataset.docTitle || 'Документ';
    const url = trigger.dataset.docUrl || '#';
    const titleNode = document.getElementById('doc-modal-title');
    const linkNode = document.querySelector('[data-doc-link]');

    if (titleNode) {
      titleNode.textContent = title;
    }

    if (linkNode) {
      linkNode.href = url;
      linkNode.addEventListener('click', () => trackEvent('open_document', { url }), { once: true });
    }
  }

  function initModal() {
    document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const modal = document.getElementById(trigger.dataset.modalOpen);
        if (!modal) return;
        setDocumentModal(trigger);
        openModal(modal);
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    document.querySelectorAll('.modal').forEach((modal) => {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  }

  window.Modals = { openModal, closeModal };
  document.addEventListener('DOMContentLoaded', initModal);
})();
