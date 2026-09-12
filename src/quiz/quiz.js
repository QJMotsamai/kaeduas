// ==========================================================================
// KAEDUAS — Culture Quiz
// Mobile-first, accessible, no backend. Rounds sample from a 100+ bank.
// ==========================================================================

import { QUESTIONS, QUIZ_META } from './questions.js';

const STORAGE_KEY = 'kaeduas-quiz-best';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sampleRound(size, catFilter) {
  const pool = catFilter === 'all'
    ? QUESTIONS
    : QUESTIONS.filter((q) => q.cat === catFilter);
  return shuffle(pool).slice(0, Math.min(size, pool.length));
}

function rankFor(score, total) {
  const p = score / total;
  if (p >= 0.93) return { title: 'Scroll-stopper', line: 'Five seconds. Full attention. You get it.' };
  if (p >= 0.8) return { title: 'On brand', line: 'Sharp taste. The feed would hire you.' };
  if (p >= 0.65) return { title: 'In the cut', line: 'Solid craft instinct — keep testing variants.' };
  if (p >= 0.45) return { title: 'Rough cut', line: 'The bones are there. One more grade pass.' };
  return { title: 'Pre-production', line: 'Brief received. Time to build the moodboard.' };
}

function readBest() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeBest(score, total) {
  const prev = readBest();
  const next = { score, total, at: Date.now() };
  if (!prev || score / total > prev.score / prev.total || (score / total === prev.score / prev.total && score > prev.score)) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* private mode */ }
    return next;
  }
  return prev;
}

export function initQuiz() {
  const root = document.getElementById('quiz-app');
  if (!root) return;

  const state = {
    view: 'intro', // intro | play | result
    cat: 'all',
    size: QUIZ_META.roundSize,
    deck: [],
    i: 0,
    score: 0,
    locked: false,
    answers: []
  };

  const el = {
    live: root.querySelector('[data-quiz-live]'),
    stage: root.querySelector('[data-quiz-stage]')
  };

  function announce(msg) {
    if (el.live) el.live.textContent = msg;
  }

  function render() {
    if (state.view === 'intro') renderIntro();
    else if (state.view === 'play') renderPlay();
    else renderResult();
  }

  function renderIntro() {
    const best = readBest();
    const cats = Object.entries(QUIZ_META.cats)
      .map(([id, label]) => `<option value="${id}">${label}</option>`)
      .join('');

    el.stage.innerHTML = `
      <div class="quiz-panel quiz-intro">
        <p class="mono quiz-kicker"><span class="ember-dot" aria-hidden="true"></span>${QUIZ_META.total} questions in the vault</p>
        <h3 class="quiz-heading">How sharp is your entertainment IQ?</h3>
        <p class="quiz-lede">SA music and film, creative craft, media strategy, AI entertainment and the Kaeduas studio itself. Pick a lane — or take the mixed round.</p>

        <div class="quiz-controls">
          <label class="quiz-field">
            <span class="mono quiz-field-key">Category</span>
            <select data-quiz-cat aria-label="Quiz category">
              <option value="all" selected>Mixed (all categories)</option>
              ${cats}
            </select>
          </label>
          <label class="quiz-field">
            <span class="mono quiz-field-key">Round length</span>
            <select data-quiz-size aria-label="Questions per round">
              <option value="10">10 questions · quick</option>
              <option value="15" selected>15 questions · standard</option>
              <option value="25">25 questions · deep cut</option>
              <option value="50">50 questions · director's cut</option>
            </select>
          </label>
        </div>

        <div class="quiz-intro-actions">
          <button type="button" class="btn btn-ember magnetic" data-quiz-start>
            <span>Start the round</span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          ${best ? `<p class="mono quiz-best">Best run · ${best.score}/${best.total}</p>` : `<p class="mono quiz-best">No score saved yet</p>`}
        </div>

        <ul class="quiz-cat-pills" aria-label="Categories in the bank">
          ${Object.entries(QUIZ_META.cats).map(([id, label]) => {
            const n = QUESTIONS.filter((q) => q.cat === id).length;
            return `<li><span class="mono">${String(n).padStart(2, '0')}</span>${label}</li>`;
          }).join('')}
        </ul>
      </div>
    `;

    el.stage.querySelector('[data-quiz-start]').addEventListener('click', () => {
      state.cat = el.stage.querySelector('[data-quiz-cat]').value;
      state.size = parseInt(el.stage.querySelector('[data-quiz-size]').value, 10) || 15;
      startRound();
    });
  }

  function startRound() {
    state.deck = sampleRound(state.size, state.cat);
    if (!state.deck.length) {
      announce('No questions in that category.');
      return;
    }
    state.i = 0;
    state.score = 0;
    state.locked = false;
    state.answers = [];
    state.view = 'play';
    render();
    announce(`Round started. ${state.deck.length} questions.`);
  }

  function renderPlay() {
    const q = state.deck[state.i];
    const n = state.i + 1;
    const total = state.deck.length;
    const pct = Math.round((state.i / total) * 100);
    const catLabel = QUIZ_META.cats[q.cat] || q.cat;
    const letters = ['A', 'B', 'C', 'D'];

    el.stage.innerHTML = `
      <div class="quiz-panel quiz-play" data-quiz-play>
        <div class="quiz-progress" aria-hidden="true">
          <div class="quiz-progress-bar" style="width:${pct}%"></div>
        </div>
        <div class="quiz-play-meta">
          <p class="mono quiz-kicker"><span class="label-index">${String(n).padStart(2, '0')}</span> / ${String(total).padStart(2, '0')} · ${catLabel}</p>
          <p class="mono quiz-score-live">Score ${state.score}</p>
        </div>
        <h3 class="quiz-question" id="quiz-q">${escapeHtml(q.q)}</h3>
        <div class="quiz-choices" role="group" aria-labelledby="quiz-q">
          ${q.c.map((choice, idx) => `
            <button type="button" class="quiz-choice" data-idx="${idx}" aria-describedby="quiz-q">
              <span class="mono quiz-choice-letter">${letters[idx]}</span>
              <span class="quiz-choice-text">${escapeHtml(choice)}</span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback" data-quiz-feedback hidden></div>
        <div class="quiz-play-nav">
          <button type="button" class="btn btn-ghost" data-quiz-quit>Quit</button>
          <button type="button" class="btn btn-ember" data-quiz-next hidden disabled>
            <span>${n === total ? 'See results' : 'Next question'}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    `;

    const feedback = el.stage.querySelector('[data-quiz-feedback]');
    const nextBtn = el.stage.querySelector('[data-quiz-next]');
    const choices = [...el.stage.querySelectorAll('.quiz-choice')];

    el.stage.querySelector('[data-quiz-quit]').addEventListener('click', () => {
      state.view = 'intro';
      render();
      announce('Round quit. Back to start.');
    });

    choices.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (state.locked) return;
        state.locked = true;
        const idx = parseInt(btn.dataset.idx, 10);
        const correct = idx === q.a;
        if (correct) state.score += 1;
        state.answers.push({ i: state.i, pick: idx, correct });

        choices.forEach((c) => {
          const ci = parseInt(c.dataset.idx, 10);
          c.disabled = true;
          if (ci === q.a) c.classList.add('is-correct');
          if (ci === idx && !correct) c.classList.add('is-wrong');
          if (ci === idx) c.classList.add('is-picked');
        });

        feedback.hidden = false;
        feedback.className = `quiz-feedback ${correct ? 'is-yes' : 'is-no'}`;
        const tip = q.tip ? `<span class="quiz-tip">${escapeHtml(q.tip)}</span>` : '';
        feedback.innerHTML = correct
          ? `<span class="mono">Correct</span>${tip}`
          : `<span class="mono">Not quite</span><span class="quiz-tip">Answer: ${escapeHtml(q.c[q.a])}</span>${tip}`;

        nextBtn.hidden = false;
        nextBtn.disabled = false;
        announce(correct ? 'Correct.' : `Incorrect. The answer is ${q.c[q.a]}.`);
        nextBtn.focus();
      });
    });

    nextBtn.addEventListener('click', () => {
      if (state.i >= state.deck.length - 1) {
        state.view = 'result';
        writeBest(state.score, state.deck.length);
        render();
        announce(`Round complete. Score ${state.score} out of ${state.deck.length}.`);
      } else {
        state.i += 1;
        state.locked = false;
        render();
      }
    });

    // Keyboard: 1-4 / A-D
    const onKey = (e) => {
      if (state.view !== 'play' || state.locked) return;
      const map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
      const key = e.key.toLowerCase();
      if (key in map) {
        const btn = choices[map[key]];
        if (btn && !btn.disabled) btn.click();
      }
    };
    // Replace previous handler by cloning stage... use one-shot via property
    el.stage.onkeydown = onKey;
    el.stage.tabIndex = -1;
  }

  function renderResult() {
    const total = state.deck.length;
    const score = state.score;
    const rank = rankFor(score, total);
    const pct = Math.round((score / total) * 100);
    const best = readBest();
    const missed = state.answers.filter((a) => !a.correct).slice(0, 5);

    el.stage.innerHTML = `
      <div class="quiz-panel quiz-result">
        <p class="mono quiz-kicker"><span class="ember-dot" aria-hidden="true"></span>Round complete</p>
        <p class="quiz-score-big"><span class="quiz-score-num">${score}</span><span class="quiz-score-den">/${total}</span></p>
        <p class="mono quiz-pct">${pct}% · ${rank.title}</p>
        <h3 class="quiz-heading">${escapeHtml(rank.line)}</h3>
        ${best ? `<p class="mono quiz-best">Personal best · ${best.score}/${best.total}</p>` : ''}

        ${missed.length ? `
          <div class="quiz-missed">
            <p class="mono quiz-field-key">Missed this round</p>
            <ul>
              ${missed.map((m) => {
                const q = state.deck[m.i];
                return `<li><span class="quiz-missed-q">${escapeHtml(q.q)}</span><span class="quiz-missed-a mono">→ ${escapeHtml(q.c[q.a])}</span></li>`;
              }).join('')}
            </ul>
          </div>
        ` : `<p class="quiz-perfect mono">Clean sheet. Every answer landed.</p>`}

        <div class="quiz-intro-actions">
          <button type="button" class="btn btn-ember magnetic" data-quiz-again>
            <span>Play another round</span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" class="btn btn-ghost" data-quiz-home>Change settings</button>
          <button type="button" class="btn btn-ghost" data-quiz-share>Share score</button>
        </div>
      </div>
    `;

    el.stage.querySelector('[data-quiz-again]').addEventListener('click', () => startRound());
    el.stage.querySelector('[data-quiz-home]').addEventListener('click', () => {
      state.view = 'intro';
      render();
    });
    el.stage.querySelector('[data-quiz-share]').addEventListener('click', async () => {
      const text = `I scored ${score}/${total} (${pct}%) on the Kaeduas Culture Quiz — ${rank.title}. ${typeof location !== 'undefined' ? location.origin + location.pathname + '#quiz' : 'kaeduas.is-a.bot/#quiz'}`;
      try {
        if (navigator.share) {
          await navigator.share({ title: 'Kaeduas Culture Quiz', text });
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          announce('Score copied to clipboard.');
        } else {
          announce(text);
        }
      } catch {
        /* user cancelled share */
      }
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  render();
}
