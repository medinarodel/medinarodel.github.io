(() => {
  const form = document.querySelector('#composer-form');
  const input = document.querySelector('#question-input');
  const messages = document.querySelector('#messages');
  const conversation = document.querySelector('#conversation');
  const sidebar = document.querySelector('#sidebar');
  const menuToggle = document.querySelector('#menu-toggle');
  const overlay = document.querySelector('#mobile-overlay');
  const newChat = document.querySelector('#new-chat');
  const themeToggle = document.querySelector('#theme-toggle');
  const liveStatus = document.querySelector('#live-status');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;
  let pending = false;

  try {
    const storedTheme = localStorage.getItem('rodel-portfolio-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') savedTheme = storedTheme;
  } catch {}

  function applyTheme(theme, persist = false) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    themeToggle?.setAttribute('aria-pressed', String(dark));
    const label = `Switch to ${dark ? 'light' : 'dark'} theme`;
    themeToggle?.setAttribute('aria-label', label);
    themeToggle?.setAttribute('title', label);
    const hiddenLabel = themeToggle?.querySelector('.visually-hidden');
    if (hiddenLabel) hiddenLabel.textContent = label;
    const icon = themeToggle?.querySelector('.theme-icon');
    if (icon) icon.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none"><path d="M20.8 13A8.5 8.5 0 1 1 11 3.2 6.5 6.5 0 0 0 20.8 13Z"/></svg>';
    if (themeColor) themeColor.content = dark ? '#101319' : '#f7f8fa';
    if (persist) {
      savedTheme = dark ? 'dark' : 'light';
      try { localStorage.setItem('rodel-portfolio-theme', savedTheme); } catch {}
    }
  }

  applyTheme(savedTheme || (themePreference.matches ? 'dark' : 'light'));
  themeToggle?.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });
  themePreference.addEventListener?.('change', (event) => {
    if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  const projectKeys = ['neuroflow', 'xpl', 'gravywork', 'rover', 'reporting', 'field-network', 'geodata'];

  const markSvg = '<svg class="mark-svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M22 46V22" fill="none" stroke="currentColor" stroke-width="7"/><path d="M22 31.5C22 25 27 21.5 35.5 21.5" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><circle cx="41" cy="42.5" r="4.4" fill="var(--mark-dot)"/></svg>';
  const normalize = (value) => value.trim().toLowerCase();
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open portfolio navigation');
  }

  function appendUserQuestion(question) {
    const article = el('article', 'message user-message');
    const avatar = el('div', 'user-avatar', 'Y');
    avatar.setAttribute('aria-hidden', 'true');
    const body = el('div', 'message-body');
    body.append(el('p', 'message-label', 'YOU'), el('p', '', question));
    article.append(avatar, body);
    messages.append(article);
  }

  function appendTyping() {
    const article = el('article', 'message assistant-message typing-message');
    const avatar = el('div', 'assistant-avatar');
    avatar.innerHTML = markSvg;
    avatar.setAttribute('aria-hidden', 'true');
    const body = el('div', 'message-body');
    body.append(el('p', 'message-label', 'RODEL'));
    const dots = el('div', 'typing-indicator');
    dots.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 3; index += 1) dots.append(el('i'));
    body.append(dots);
    article.append(avatar, body);
    messages.append(article);
    scrollToLatest();
    return article;
  }

  function scrollToLatest() {
    requestAnimationFrame(() => { conversation.scrollTop = conversation.scrollHeight; });
  }

  function addProjectContent(body, key) {
    const source = document.querySelector(`#case-${key} .case-study`);
    if (!source) return;
    const copy = source.cloneNode(true);
    copy.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
    body.append(...copy.childNodes);
  }

  function addCareerContent(body) {
    body.append(el('h2', '', 'From agency and product teams to independent contract engineering.'));
    body.append(el('p', '', 'I spent my first twelve years at Sourcepad, which Microblink acquired in 2022. Since 2023 I’ve worked as an independent contract engineer, in long-term engagements with several clients. Most are direct; two come through AlphagenIT.'));
    body.append(el('p', '', 'Working across several products at once is a deliberate choice, and it shows in the work. Good solutions travel: patterns I build for one domain often become the starting point for another. Each engagement has clear ownership, written specs, and documented handoffs, so clients always know what was delivered and where it stands.'));
    const timeline = el('div', 'timeline-list');
    const entries = [
      ['2010 — 2022', 'Sourcepad', 'Full-stack applications for different clients, often in small autonomous teams. Extensive Ruby on Rails and React; Stripe payment integrations for several client projects; AWS and Heroku deployments.'],
      ['2022 — 2023', 'Microblink', 'Production applications for receipt processing, purchase validation, and data extraction, using Ruby on Rails and React, after Microblink acquired Sourcepad.'],
      ['2023 — present', 'Independent contract engineering', 'Long-term client engagements, directly and through AlphagenIT: workflow tooling, backend platforms, AI product features, data pipelines, and reporting systems.']
    ];
    entries.forEach(([date, employer, summary]) => {
      const item = el('div', 'timeline-item');
      item.append(el('time', '', date));
      const details = el('div');
      details.append(el('b', '', employer), el('p', '', summary));
      item.append(details);
      timeline.append(item);
    });
    body.append(timeline);
  }

  function addToolkitContent(body) {
    body.append(el('h2', '', 'A practical toolkit across product layers.'));
    body.append(el('p', '', 'The work spans backend systems, frontend applications, data, infrastructure, and delivery practices. AI-assisted engineering supports that foundation rather than replacing it.'));
    const groups = [
      ['BACKEND & DATA', 'Ruby on Rails', 'Laravel / PHP', 'PostgreSQL · PostGIS', 'MySQL · MariaDB', 'Redis · Elasticsearch', 'Sidekiq · Solid Queue · Delayed Job', 'REST · GraphQL · OpenAPI'],
      ['FRONTEND & MOBILE', 'React · Next.js', 'JavaScript · TypeScript', 'Vue 3', 'Redux Toolkit', 'React Flow / xyflow', 'React Native', 'Leaflet maps'],
      ['AI & INTEGRATIONS', 'LLM scoring', 'Whisper speech-to-text', 'ElevenLabs text-to-speech', 'Twilio voice · SMS', 'Stripe payments', 'Webhooks', 'Salesforce · Bullhorn · HubSpot'],
      ['DELIVERY', 'AWS · Heroku · Vercel', 'Cloudflare Workers · Docker', 'RSpec · Pest · Jest · Playwright', 'CI/CD · code review', 'Architecture · system design', 'AI-assisted development']
    ];
    groups.forEach(([heading, ...items]) => {
      body.append(el('p', 'answer-subhead', heading));
      const facts = el('div', 'answer-facts');
      items.forEach((item) => facts.append(el('span', '', item)));
      body.append(facts);
    });
  }

  function addSummaryContent(body) {
    body.append(el('h2', '', 'Software engineering since 2010.'));
    body.append(el('p', '', 'I’ve spent 16+ years building and evolving production applications: backend and data-heavy systems, interactive frontend products, integrations, and the engineering work that keeps them dependable.'));
    body.append(el('p', '', 'Since 2023 I’ve worked as an independent contract engineer with several long-term clients. Each project at the top of this conversation opens a short case study.'));
    const facts = el('div', 'answer-facts');
    ['PRODUCTION SYSTEMS', 'BACKEND + FRONTEND', 'AI-ASSISTED PRACTICE'].forEach((fact) => facts.append(el('span', '', fact)));
    body.append(facts);
  }

  function addContactContent(body) {
    body.append(el('h2', '', 'Get in touch.'));
    body.append(el('p', '', 'I’m based in the Philippines and work remotely with teams in other time zones. Email is the best way to reach me.'));
    const links = el('div', 'answer-links');
    const email = el('a', 'answer-anchor', 'medinarodelsamson@gmail.com ↗');
    email.href = 'mailto:medinarodelsamson@gmail.com';
    const resume = el('a', 'answer-anchor', 'Download résumé (PDF) ↓');
    resume.href = './rodel-medina-resume.pdf';
    resume.setAttribute('download', '');
    links.append(email, resume);
    body.append(links);
  }

  function findIntent(question) {
    const q = normalize(question);
    if (/neuro.?flow|workflow builder|xyflow/.test(q)) return 'neuroflow';
    if (/(^|\b)xpl(\b|$)/.test(q)) return 'xpl';
    if (/gravy.?work|worker interview/.test(q)) return 'gravywork';
    if (/field reporting|validat|report builder|reporting engine/.test(q)) return 'reporting';
    if (/field network|offline sync|form library/.test(q)) return 'field-network';
    if (/rover|job.?(board|market|ads)|scrap/.test(q)) return 'rover';
    if (/geographic|postgis|offline map|leaflet/.test(q)) return 'geodata';
    if (/career|experience|sourcepad|microblink|alphagen|timeline|contract|freelanc|consult|clients|hire|availab/.test(q)) return 'career';
    if (/tool|stack|technology|technical|skill|rails|ruby|react|next\.?js|laravel|php|postgres|sql|redis|sidekiq|vue|typescript|javascript|stripe|twilio|aws|heroku|docker|cloudflare|vercel/.test(q)) return 'toolkit';
    if (/contact|email|reach|resume|résumé|cv\b/.test(q)) return 'contact';
    if (/short|summary|about you|who are you/.test(q)) return 'summary';
    if (/work|project|portfolio/.test(q)) return 'work';
    return 'fallback';
  }

  function appendResponse(intent) {
    const article = el('article', 'message assistant-message');
    const avatar = el('div', 'assistant-avatar');
    avatar.innerHTML = markSvg;
    avatar.setAttribute('aria-hidden', 'true');
    const body = el('div', 'message-body');
    const answer = el('div', 'answer-copy');
    body.append(el('p', 'message-label', 'RODEL'));

    if (projectKeys.includes(intent)) addProjectContent(answer, intent);
    else if (intent === 'career') addCareerContent(answer);
    else if (intent === 'toolkit') addToolkitContent(answer);
    else if (intent === 'summary') addSummaryContent(answer);
    else if (intent === 'contact') addContactContent(answer);
    else if (intent === 'work') {
      answer.append(el('h2', '', 'My selected work is at the top of this conversation.'));
      answer.append(el('p', '', 'Open any project there for a short case study, or ask about NeuroFlow, XPL, GravyWork, Rover, the field reporting platform, the field network platform, or the geographic data platform here.'));
      const jump = el('a', 'answer-anchor', 'Jump to selected work ↑');
      jump.href = '#work';
      jump.addEventListener('click', () => setTimeout(() => { conversation.scrollTop = 0; }, 0));
      answer.append(jump);
    } else {
      answer.append(el('h2', '', 'Here is what I can tell you about.'));
      answer.append(el('p', '', 'Try asking about NeuroFlow, XPL, GravyWork, Rover, the field reporting platform, the field network platform, the geographic data platform, career history, or the engineering toolkit. These are prewritten answers, not a live AI chat.'));
    }
    body.append(answer);

    article.append(avatar, body);
    messages.append(article);
    if (liveStatus) liveStatus.textContent = `Answer added: ${answer.querySelector('h2')?.textContent || 'Rodel'}`;
    scrollToLatest();
  }

  function setSelectedThread(query) {
    const selected = query === 'toolkit' ? 'engineering toolkit' : query === 'summary' ? 'short version' : query;
    document.querySelectorAll('.side-link').forEach((item) => item.classList.toggle('selected', normalize(item.dataset.query || '') === normalize(selected)));
  }

  function ask(question) {
    const text = question.trim();
    if (!text || pending) return false;
    pending = true;
    if (liveStatus) liveStatus.textContent = 'Preparing a portfolio answer';
    closeSidebar();
    appendUserQuestion(text);
    const typing = appendTyping();
    const intent = findIntent(text);
    setSelectedThread(intent === 'toolkit' ? 'engineering toolkit' : intent);
    window.setTimeout(() => {
      typing.remove();
      appendResponse(intent);
      pending = false;
    }, 320);
    return true;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input || !ask(input.value)) return;
    input.value = '';
    input.style.height = 'auto';
  });
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  });
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  document.querySelectorAll('[data-query]').forEach((button) => {
    button.addEventListener('click', () => ask(button.dataset.query));
  });

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    sidebar.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close portfolio navigation' : 'Open portfolio navigation');
  });
  overlay?.addEventListener('click', closeSidebar);

  newChat?.addEventListener('click', () => {
    messages.querySelectorAll('.message:not(.user-message):not(#short-version), .message.user-message:not(:first-of-type)').forEach((message) => message.remove());
    document.querySelectorAll('.side-link').forEach((item) => item.classList.toggle('selected', item.dataset.query === 'short version'));
    closeSidebar();
    conversation.scrollTo({ top: 0, behavior: 'smooth' });
    input?.focus({ preventScroll: true });
  });

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = new URL(button.dataset.copy, window.location.href);
      try {
        await navigator.clipboard.writeText(url.href);
        button.textContent = '✓';
        window.setTimeout(() => { button.textContent = '↗'; }, 1200);
      } catch {
        window.location.hash = button.dataset.copy;
      }
    });
  });
})();
