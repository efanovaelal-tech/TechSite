(function () {
  const questions = [
    { id: 'role', title: 'Кто обращается?', type: 'radio', required: true, options: ['Собственник объекта', 'Главный инженер', 'Главный энергетик', 'Технический директор', 'Управляющая компания', 'Снабжение / закупки', 'Подрядчик', 'Другое'] },
    { id: 'objectType', title: 'Тип объекта', type: 'radio', required: true, options: ['Производственное предприятие', 'Склад / логистический комплекс', 'Торговый центр', 'Бизнес-центр', 'Медицинский объект', 'Социальный объект', 'Жилой комплекс / МКД', 'Муниципальный объект', 'Частный дом', 'Другое'] },
    { id: 'location', title: 'Регион и город', type: 'fields', required: true, fields: [{ name: 'region', label: 'Регион' }, { name: 'city', label: 'Город' }] },
    { id: 'power', title: 'Мощность котельной', type: 'radio', required: true, options: ['До 100 кВт', '100 кВт - 1 МВт', '1-5 МВт', '5-20 МВт', 'Более 20 МВт', 'Не знаю'] },
    { id: 'fuel', title: 'Вид топлива', type: 'radio', required: true, options: ['Газ', 'Дизель', 'Мазут', 'Уголь', 'Электричество', 'Комбинированная схема', 'Не знаю'] },
    { id: 'equipment', title: 'Состав оборудования', type: 'checkbox', required: true, options: ['Котлы', 'Горелки', 'Автоматика безопасности', 'Насосы', 'КИПиА', 'Узел учета', 'Газовое оборудование', 'Оборудование под давлением'] },
    { id: 'task', title: 'Какая задача сейчас главная?', type: 'radio', required: true, options: ['Регламентное ТО', 'Аварийные остановки', 'Подготовка к проверке', 'Подготовка к сезону', 'Смена обслуживающей организации', 'Снижение расхода топлива', 'Нужно КП для закупки'] },
    { id: 'contact', title: 'Контакты для связи', type: 'contact', required: true }
  ];

  const state = {
    step: 0,
    answers: {}
  };

  function getLeadStatus() {
    const lowPriorityTypes = ['Частный дом'];
    const lowPriorityPower = ['До 100 кВт'];
    if (lowPriorityTypes.includes(state.answers.objectType) || lowPriorityPower.includes(state.answers.power)) {
      trackEvent('low_priority_lead', state.answers);
      return 'low_priority';
    }
    return 'qualified_b2b';
  }

  function renderOption(question, option) {
    const value = option;
    const selected = question.type === 'checkbox'
      ? (state.answers[question.id] || []).includes(value)
      : state.answers[question.id] === value;
    return `
      <label class="option">
        <input type="${question.type}" name="${question.id}" value="${value}" ${selected ? 'checked' : ''}>
        <span>${option}</span>
      </label>
    `;
  }

  function renderFields(question) {
    return `<div class="field-grid">${question.fields.map((field) => `
      <div class="field">
        <label for="quiz-${field.name}">${field.label}</label>
        <input id="quiz-${field.name}" name="${field.name}" value="${state.answers[field.name] || ''}" required>
        <span class="field-error"></span>
      </div>
    `).join('')}</div>`;
  }

  function renderContact() {
    return `
      <div class="field-grid">
        <div class="field"><label for="quiz-name">Имя</label><input id="quiz-name" name="name" value="${state.answers.name || ''}" required><span class="field-error"></span></div>
        <div class="field"><label for="quiz-phone">Телефон</label><input id="quiz-phone" name="phone" type="tel" value="${state.answers.phone || ''}" required><span class="field-error"></span></div>
        <div class="field field-wide"><label for="quiz-email">Email</label><input id="quiz-email" name="email" type="email" value="${state.answers.email || ''}" required><span class="field-error"></span></div>
      </div>
      <label class="consent"><input name="consent" type="checkbox" required ${state.answers.consent ? 'checked' : ''}> Согласен на обработку персональных данных</label>
    `;
  }

  function renderQuestion() {
    const root = document.querySelector('[data-quiz]');
    if (!root) return;
    const question = questions[state.step];
    const body = root.querySelector('[data-quiz-body]');
    const progress = root.querySelector('[data-quiz-progress]');
    const stepNode = root.querySelector('[data-quiz-step]');
    const statusNode = root.querySelector('[data-quiz-status]');
    const back = root.querySelector('[data-quiz-back]');
    const next = root.querySelector('[data-quiz-next]');

    let controls = '';
    if (question.type === 'radio' || question.type === 'checkbox') {
      controls = `<div class="quiz-options">${question.options.map((option) => renderOption(question, option)).join('')}</div>`;
    } else if (question.type === 'fields') {
      controls = renderFields(question);
    } else {
      controls = renderContact();
    }

    body.innerHTML = `<h3>${question.title}</h3>${controls}`;
    progress.style.width = `${((state.step + 1) / questions.length) * 100}%`;
    stepNode.textContent = `Шаг ${state.step + 1} из ${questions.length}`;
    statusNode.textContent = state.step === questions.length - 1 ? 'Финальная форма' : '';
    back.disabled = state.step === 0;
    next.textContent = state.step === questions.length - 1 ? 'Отправить' : 'Далее';
  }

  function collectStep() {
    const question = questions[state.step];
    const root = document.querySelector('[data-quiz]');
    const inputs = Array.from(root.querySelectorAll('input'));

    if (question.type === 'checkbox') {
      state.answers[question.id] = inputs.filter((input) => input.checked).map((input) => input.value);
      return state.answers[question.id].length > 0;
    }

    if (question.type === 'radio') {
      const checked = inputs.find((input) => input.checked);
      state.answers[question.id] = checked?.value || '';
      return Boolean(checked);
    }

    inputs.forEach((input) => {
      state.answers[input.name] = input.type === 'checkbox' ? input.checked : input.value.trim();
    });

    return inputs.every((input) => {
      if (input.type === 'checkbox') return input.checked;
      if (input.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      if (input.type === 'tel') return input.value.replace(/\D/g, '').length >= 10;
      return input.value.trim();
    });
  }

  function showQuizMessage(text, type = 'error') {
    const message = document.querySelector('[data-quiz-message]');
    message.textContent = text;
    message.className = `quiz-message is-${type}`;
  }

  function submitQuiz() {
    const status = getLeadStatus();
    const payload = {
      formType: 'quiz',
      leadStatus: status,
      answers: { ...state.answers },
      utm: window.LeadForms.getUtm(),
      createdAt: new Date().toISOString()
    };

    window.LeadForms.sendLead(payload).then(() => {
      trackEvent('quiz_complete', payload);
      trackEvent('form_submit_quiz', payload);
      showQuizMessage(`Заявка отправлена со статусом ${status}.`, 'success');
    });
  }

  function initQuiz() {
    const root = document.querySelector('[data-quiz]');
    if (!root) return;
    renderQuestion();

    root.querySelector('[data-quiz-next]').addEventListener('click', () => {
      if (!collectStep()) {
        showQuizMessage('Выберите вариант или заполните обязательные поля.');
        return;
      }
      showQuizMessage('');

      if (state.step === questions.length - 1) {
        submitQuiz();
        return;
      }

      state.step += 1;
      trackEvent('quiz_step_next', { step: state.step + 1 });
      renderQuestion();
    });

    root.querySelector('[data-quiz-back]').addEventListener('click', () => {
      collectStep();
      if (state.step > 0) {
        state.step -= 1;
        trackEvent('quiz_step_back', { step: state.step + 1 });
        renderQuestion();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initQuiz);
})();
