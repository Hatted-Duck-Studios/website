(() => {
  const C = window.HDS_CONTENT || {};

  const setText = (key, value) => {
    document.querySelectorAll(`[data-text="${key}"]`).forEach(el => {
      el.textContent = value ?? "";
    });
  };

  const setHtml = (key, value) => {
    document.querySelectorAll(`[data-html="${key}"]`).forEach(el => {
      el.innerHTML = value ?? "";
    });
  };

  Object.entries(C).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (key === 'heroTitle') setHtml(key, value);
      else setText(key, value);
    }
  });

  if (C.pageTitle) document.title = C.pageTitle;
  if (C.metaDescription) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', C.metaDescription);
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const valuesList = document.getElementById('values-list');
  if (valuesList && Array.isArray(C.values)) {
    valuesList.innerHTML = '';
    C.values.forEach((value, i) => {
      const div = document.createElement('div');
      div.className = 'value';
      div.innerHTML = `<strong>${String(i + 1).padStart(2, '0')}.</strong><span></span>`;
      div.querySelector('span').textContent = value;
      valuesList.appendChild(div);
    });
  }

  const socialGrid = document.getElementById('social-grid');
  if (socialGrid && C.socials) {
    socialGrid.innerHTML = '';
    Object.entries(C.socials).forEach(([key, item]) => {
      const a = document.createElement('a');
      a.className = 'link-card social-link';
      a.dataset.link = key;
      a.href = item.url || '#';
      a.innerHTML = `<span></span><small></small>`;
      a.querySelector('span').textContent = item.label || key;
      a.querySelector('small').textContent = item.note || '';
      if (item.url) {
        a.target = '_blank';
        a.rel = 'me noopener noreferrer';
      } else {
        a.dataset.disabled = 'true';
        a.setAttribute('aria-disabled', 'true');
        a.title = 'Add this URL in content.js';
        a.addEventListener('click', e => e.preventDefault());
      }
      socialGrid.appendChild(a);
    });
  }

  document.querySelectorAll('.social-link[data-link="youtube"]').forEach(el => {
    const yt = C.socials?.youtube?.url;
    if (yt) {
      el.href = yt;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else if (el.id !== 'youtube-hero') {
      el.addEventListener('click', e => e.preventDefault());
    }
  });

  const gamesList = document.getElementById('games-list');
  if (gamesList && Array.isArray(C.games)) {
    gamesList.innerHTML = '';
    C.games.forEach((game) => {
      const article = document.createElement('article');
      article.className = 'game-card coming-soon';

      const art = document.createElement('div');
      art.className = 'game-art placeholder-art';
      const img = document.createElement('img');
      img.src = game.image || 'assets/duck-head.png';
      img.alt = '';
      art.appendChild(img);

      const copy = document.createElement('div');
      copy.className = 'game-copy';

      const status = document.createElement('p');
      status.className = 'status';
      status.textContent = game.status || '';
      copy.appendChild(status);

      const title = document.createElement('h3');
      title.textContent = game.title || '';
      copy.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = game.description || '';
      copy.appendChild(desc);

      if (game.url) {
        const a = document.createElement('a');
        a.className = 'button primary';
        a.href = game.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = game.buttonText || 'View game';
        copy.appendChild(a);
      } else {
        const span = document.createElement('span');
        span.className = 'button disabled';
        span.setAttribute('aria-disabled', 'true');
        span.textContent = game.buttonText || 'Coming soon';
        copy.appendChild(span);
      }

      article.appendChild(art);
      article.appendChild(copy);
      gamesList.appendChild(article);
    });
  }
})();
