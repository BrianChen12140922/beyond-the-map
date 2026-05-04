/* ================================================================
   Beyond the Map — glossary.js
   Site-wide bilingual glossary tooltips (Traditional Chinese terms →
   English / Pinyin / Jyutping). Loaded after main.js.
================================================================ */

(function glossaryModule() {
  'use strict';

  /**
   * Keys use Traditional characters as displayed on the site.
   * Definitions are concise encyclopaedic glosses (~25–40 words).
   */
  const GLOSSARY = {
    風水: {
      term: '風水',
      pinyin: 'fēngshuǐ',
      jyutping: 'fung1 seoi2',
      english:
        'Classical Chinese geomancy aligning dwellings and graves with landform, water, and compass orientation. “Wind-water” describes moving qi along ridges and settling pools in basins; practitioners map dragon veins, court mountains, and bright halls so villages harmonise with terrain.',
      category: 'Feng shui',
    },
    龍脈: {
      term: '龍脈',
      pinyin: 'lóngmài',
      jyutping: 'lung4 mak6',
      english:
        'The mountain chain imagined as a dragon vein conducting qi from ancestor peaks toward plains. Strong veins stay continuous across watersheds; quarried summits read as severed pulse. Hong Kong’s country parks preserve long uninterrupted crest lines prized in landscape reading.',
      category: 'Feng shui',
    },
    龍脊: {
      term: '龍脊',
      pinyin: 'lóngjǐ',
      jyutping: 'lung4 zek3',
      english:
        'Literally “dragon’s spine,” the popular name for a Hong Kong Island coastal ridge whose rolling crest resembles a crouching dragon from seaward view. The label borrows feng shui animal imagery; hikers feel the metaphor along Shek O and Tai Tam skylines.',
      category: 'Geography · metaphor',
    },
    明堂: {
      term: '明堂',
      pinyin: 'míngtáng',
      jyutping: 'ming4 tong4',
      english:
        'The bright hall—open ground or water before a site where qi gathers and pauses. Temple forecourts, harbour fronts, and reservoir flats can each perform this role, framing the prospect like a stage rather than clutter.',
      category: 'Feng shui',
    },
    祖山: {
      term: '祖山',
      pinyin: 'zǔshān',
      jyutping: 'zou2 saan1',
      english:
        'Ancestor mountain at the head of a vein—the tallest summit whence ridges descend toward settlement. Tai Mo Shan often figures as regional ancestor for New Territories trails threading outward along branching spurs.',
      category: 'Feng shui',
    },
    朝山: {
      term: '朝山',
      pinyin: 'cháoshān',
      jyutping: 'ciu4 saan1',
      english:
        'Court-facing hills—middle-distance peaks that salute the siting axis between gate and distant ancestor peak. They lend layered depth to paintings and field manuals, validating alignment through staged silhouettes.',
      category: 'Feng shui',
    },
    砂: {
      term: '砂',
      pinyin: 'shā',
      jyutping: 'saa1',
      english:
        '“Sand” landforms flanking the bright hall—rolling hills, banks, or islets that embrace the site like arms. Each feature is judged by compass sector for shelter from wind or screening of unwelcome views.',
      category: 'Feng shui',
    },
    穴: {
      term: '穴',
      pinyin: 'xué',
      jyutping: 'jyut6',
      english:
        'The “lair” or acupuncture point where qi concentrates enough for tomb, temple, or house placement on a vein. The same character marks bodily acupoints—landscape and body share one metaphor in classical texts.',
      category: 'Feng shui',
    },
    氣: {
      term: '氣',
      pinyin: 'qì',
      jyutping: 'hei3',
      english:
        'Qi (chi): vital breath moving through terrain, weather, and bodies. Feng shui gathers benign qi in the mingtang while avoiding stagnant or rushing flows; the idea links Daoism, medicine, and martial arts.',
      category: 'Cosmology',
    },
    八仙: {
      term: '八仙',
      pinyin: 'bāxiān',
      jyutping: 'baat3 sin1',
      english:
        'Eight Daoist Immortals—eccentric transcendents each with emblem and story. Theatre and temple art made them iconic; Pat Sin Leng’s summits borrow their names so hikers read geology through myth.',
      category: 'Daoist legend',
    },
    仙姑: {
      term: '仙姑',
      pinyin: 'xiāngū',
      jyutping: 'sin1 gu1',
      english:
        'Immortal maiden; usually He Xiangu (何仙姑), sole woman among the Eight Immortals, tied to lotus and Hakka folk devotion. Her cult shows female saints beside patriarchal pantheons in Cantonese religion.',
      category: 'Daoist legend',
    },
    太極: {
      term: '太極',
      pinyin: 'tàijí',
      jyutping: 'taai3 gik6',
      english:
        'Supreme Ultimate—undivided source before yin-yang split in Song cosmology. The swirl diagram stresses mutual embedding, not static opposites; Taijiquan borrows the name for spiral redirection of force.',
      category: 'Cosmology',
    },
    五行: {
      term: '五行',
      pinyin: 'wǔxíng',
      jyutping: 'ng5 hang4',
      english:
        'Five Phases—wood, fire, earth, metal, water—modes that generate and overcome in cycles. They classify organs, seasons, colours, and trigrams in medicine and compass schools, emphasising relations over fixed “elements.”',
      category: 'Cosmology',
    },
    太歲: {
      term: '太歲',
      pinyin: 'tàisuì',
      jyutping: 'taai3 seoi3',
      english:
        'Grand Duke Jupiter—the yearly stellar deity whose zodiac sector should avoid noisy digging unless ritually pacified. Hong Kong almanacs print Tai Sui bearings; opposite sectors may carry matching cautions.',
      category: 'Folk religion',
    },
    觀音: {
      term: '觀音',
      pinyin: 'Guānyīn',
      jyutping: 'gun1 jam1',
      english:
        'Avalokiteśvara, bodhisattva of compassion, widely honoured in Chinese temples as the listener to every cry. Coastal shrines pair Guanyin with Daoist gods in everyday syncretic devotion.',
      category: 'Buddhism',
    },
    媽祖: {
      term: '媽祖',
      pinyin: 'Māzǔ',
      jyutping: 'maa5 zou2',
      english:
        'Mazu, Fujian-born goddess of seafarers, carried by migration to Cantonese harbours and Hong Kong islands. Festivals renew her patrol of the waves; families frame safe passage as reciprocity with the goddess.',
      category: 'Folk religion',
    },
    北帝: {
      term: '北帝',
      pinyin: 'Běidì',
      jyutping: 'bak1 dai3',
      english:
        'Northern Emperor (Xuanwu)—Daoist god of north and water with tortoise-snake imagery. Pak Tai temples guard harbours against flood and plague; Cheung Chau stages grand annual theatre for him.',
      category: 'Daoist religion',
    },
    黃大仙: {
      term: '黃大仙',
      pinyin: 'Huáng Dàxiān',
      jyutping: 'wong4 daai6 sin1',
      english:
        'Wong Tai Sin—the immortal Wong Cho Ping honoured at Sik Sik Yuen for healing and divination under the motto “requests answered.” The urban temple scales rural Daoist hospitality into mass pilgrimage.',
      category: 'Daoist religion',
    },
    /* ——— Extended entries for pages & compound phrases ——— */
    九龍: {
      term: '九龍',
      pinyin: 'Jiǔlóng',
      jyutping: 'gau2 lung4',
      english:
        'Kowloon—“Nine Dragons” from lore that a boy emperor counted eight peaks plus himself as the ninth dragon. Today it names the peninsula north of Victoria Harbour and echoes Lion Rock civic symbolism.',
      category: 'Place name · legend',
    },
    麥理浩徑: {
      term: '麥理浩徑',
      pinyin: 'Mài Lǐhào Jìng',
      jyutping: 'mak6 lei5 hou6 ging3',
      english:
        'MacLehose Trail—Hong Kong’s first long-distance path (1979), named for Governor MacLehose. Its ~100 km east–west route stitches Sai Kung coasts, reservoirs, and Tai Mo Shan into the city’s signature ridge trek.',
      category: 'Trail · heritage',
    },
    獅子山: {
      term: '獅子山',
      pinyin: 'Shīzishān',
      jyutping: 'si1 zi2 saan1',
      english:
        'Lion Rock ridge whose silhouette resembles a couchant lion above Kowloon. “Lion Rock Spirit” became civic shorthand for perseverance; geomancers read it as a guardian hill locking qi north of the tunnels.',
      category: 'Geography · symbol',
    },
    餓鬼: {
      term: '餓鬼',
      pinyin: 'èguǐ',
      jyutping: 'ngo6 gwai2',
      english:
        'Hungry ghosts—Buddhist pretas stuck in craving, honoured in lunar seventh month with opera and roadside offerings. Hong Kong neighbourhoods balance lavish ritual with modern street safety.',
      category: 'Buddhist festival',
    },
    長洲: {
      term: '長洲',
      pinyin: 'Chángzhōu',
      jyutping: 'coeng4 zau1',
      english:
        'Cheung Chau—compact southwest island famed for fishing craft and the Bun Festival. Pak Tai temple anchors harbour guild identity while narrow lanes intensify seasonal parade energy.',
      category: 'Place name',
    },
    大東山: {
      term: '大東山',
      pinyin: 'Dà Dōngshān',
      jyutping: 'daai6 dung1 saan1',
      english:
        'Sunset Peak (Tai Tung Shan)—Lantau’s windswept silvergrass plateau dotted with historic stone huts. Walkers often pair it mentally with nearby Lantau Peak’s Buddhist sunrise crowds.',
      category: 'Geography',
    },
    鳳凰山: {
      term: '鳳凰山',
      pinyin: 'Fènghuáng Shān',
      jyutping: 'fung6 wong4 saan1',
      english:
        'Lantau Peak (“Phoenix Mountain”)—the island’s highest summit above Ngong Ping and the airport corridor. Dawn hikers climb from Wisdom Path; winds and cloud seas dramatise the crest.',
      category: 'Geography',
    },
    八仙嶺: {
      term: '八仙嶺',
      pinyin: 'Bāxiān Lǐng',
      jyutping: 'baat3 sin1 leng5',
      english:
        'Pat Sin Leng—eight Immortal-named peaks rimming Plover Cove Reservoir, with a memorial at Hsien Ku Fung for wildfire casualties. The ridge rewards scramblers with sweeping water views.',
      category: 'Geography · Daoist legend',
    },
  };

  const KEYS_SORTED = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

  const POP_ID = 'glossary-pop';
  const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  let popEl = null;
  let activeTrigger = null;
  let trapHandler = null;
  let trapPopEl = null;
  let escHandler = null;
  let outsideHandler = null;
  let resizeHandler = null;
  let speaking = false;

  function isSkippableHost(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el.closest('svg')) return true;
    if (el.closest('.glossary-pop')) return true;
    if (el.closest('button:not(.glossary-term), a[href], [role="button"]')) return true;
    return false;
  }

  /** Split plain text into fragment of Text nodes + glossary buttons. */
  function fragmentFromChineseText(text) {
    const frag = document.createDocumentFragment();
    if (!text) return frag;
    let i = 0;
    while (i < text.length) {
      let matched = null;
      for (let k = 0; k < KEYS_SORTED.length; k++) {
        const key = KEYS_SORTED[k];
        if (text.startsWith(key, i)) {
          matched = key;
          break;
        }
      }
      if (matched) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'glossary-term';
        btn.dataset.term = matched;
        btn.setAttribute('aria-label', `Open glossary entry: ${matched}`);
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = matched;
        frag.appendChild(btn);
        i += matched.length;
      } else {
        frag.appendChild(document.createTextNode(text.charAt(i)));
        i += 1;
      }
    }
    return frag;
  }

  /**
   * Process a single host element (span/em/p with zh-Hant).
   */
  function processHost(el) {
    if (isSkippableHost(el)) return;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest('svg')) return NodeFilter.FILTER_REJECT;
        if (p.closest('.glossary-pop')) return NodeFilter.FILTER_REJECT;
        if (p.closest('button:not(.glossary-term), a[href], [role="button"]'))
          return NodeFilter.FILTER_REJECT;
        if (p.classList.contains('glossary-term')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const batch = [];
    let n;
    while ((n = walker.nextNode())) batch.push(n);

    for (const textNode of batch) {
      const raw = textNode.textContent;
      if (!raw) continue;

      let hit = false;
      for (let k = 0; k < KEYS_SORTED.length; k++) {
        if (raw.includes(KEYS_SORTED[k])) {
          hit = true;
          break;
        }
      }
      if (!hit) continue;

      const frag = fragmentFromChineseText(raw);
      /* Skip if fragment is identical single text node */
      if (
        frag.childNodes.length === 1 &&
        frag.firstChild.nodeType === Node.TEXT_NODE &&
        frag.firstChild.textContent === raw
      ) {
        continue;
      }

      textNode.parentNode.replaceChild(frag, textNode);
    }
  }

  function unwrapAllTerms() {
    document.querySelectorAll('button.glossary-term').forEach((btn) => {
      const t = document.createTextNode(btn.textContent);
      btn.replaceWith(t);
    });
    document.querySelectorAll('.glossary-wrap-root').forEach((el) => {
      el.classList.remove('glossary-wrap-root');
    });
  }

  function wrapAllTerms() {
    const hosts = document.querySelectorAll(
      'span[lang="zh-Hant"], em[lang="zh-Hant"], p.hero-title-chinese[lang="zh-Hant"]'
    );
    hosts.forEach((el) => {
      el.classList.add('glossary-wrap-root');
      processHost(el);
    });
    bindTermClicks();
  }

  function bindTermClicks() {
    document.querySelectorAll('button.glossary-term:not([data-glossary-bound])').forEach((btn) => {
      btn.dataset.glossaryBound = '1';
      btn.addEventListener('click', onTermClick);
    });
  }

  function ensurePop() {
    if (popEl && document.body.contains(popEl)) return popEl;

    const wrap = document.createElement('div');
    wrap.id = POP_ID;
    wrap.className = 'glossary-pop';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'false');
    wrap.setAttribute('aria-labelledby', 'glossary-pop-title');
    wrap.setAttribute('hidden', '');
    wrap.setAttribute('tabindex', '-1');

    wrap.innerHTML = `
      <div class="glossary-pop__backdrop" aria-hidden="true"></div>
      <div class="glossary-pop__card">
        <button type="button" class="glossary-pop__close" aria-label="Close glossary">&times;</button>
        <p class="glossary-pop__term" id="glossary-pop-title"></p>
        <p class="glossary-pop__roman">
          <span class="glossary-pop__pinyin" lang="zh-Latn"></span>
          <span class="glossary-pop__sep" aria-hidden="true"> · </span>
          <span class="glossary-pop__jyutping" lang="yue-Latn"></span>
        </p>
        <p class="eyebrow glossary-pop__category"></p>
        <p class="glossary-pop__english"></p>
        <div class="glossary-pop__actions">
          <button type="button" class="btn btn--text glossary-pop__listen" aria-pressed="false">
            <span class="glossary-pop__listen-icon" aria-hidden="true">▶</span>
            <span class="glossary-pop__listen-label">Listen</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);
    popEl = wrap;

    wrap.querySelector('.glossary-pop__backdrop').addEventListener('click', () => closePop(true));
    wrap.querySelector('.glossary-pop__close').addEventListener('click', () => closePop(false));
    wrap.querySelector('.glossary-pop__listen').addEventListener('click', toggleSpeak);

    return wrap;
  }

  function positionPop(trigger) {
    const pop = ensurePop();
    const card = pop.querySelector('.glossary-pop__card');
    if (!card) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 16;
    const gap = 8;
    const mobile = vw < 640;

    pop.classList.toggle('glossary-pop--mobile', mobile);

    if (mobile) {
      card.style.left = '';
      card.style.top = '';
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const cw = card.offsetWidth || 320;
    const ch = card.offsetHeight || 220;

    let left = rect.left + rect.width / 2 - cw / 2;
    let top = rect.bottom + gap;

    if (left + cw > vw - margin) left = vw - cw - margin;
    if (left < margin) left = margin;
    if (top + ch > vh - margin) {
      top = rect.top - ch - gap;
    }
    if (top < margin) top = margin;

    card.style.left = `${Math.round(left)}px`;
    card.style.top = `${Math.round(top)}px`;
  }

  function renderEntry(termKey) {
    const entry = GLOSSARY[termKey];
    const pop = ensurePop();
    pop.querySelector('.glossary-pop__term').textContent = entry.term;
    pop.querySelector('.glossary-pop__pinyin').textContent = entry.pinyin;
    pop.querySelector('.glossary-pop__jyutping').textContent = entry.jyutping;
    pop.querySelector('.glossary-pop__category').textContent = entry.category;
    pop.querySelector('.glossary-pop__english').textContent = entry.english;
  }

  function stopSpeech() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speaking = false;
    updateListenUi(false);
  }

  function pickZhVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return (
      voices.find((x) => /zh[-_]HK/i.test(x.lang)) ||
      voices.find((x) => /zh[-_]TW/i.test(x.lang)) ||
      voices.find((x) => /zh[-_]CN/i.test(x.lang)) ||
      voices.find((x) => /^zh/i.test(x.lang)) ||
      null
    );
  }

  function pickEnVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return (
      voices.find((x) => /^en[-_]GB/i.test(x.lang)) ||
      voices.find((x) => /^en[-_]US/i.test(x.lang)) ||
      voices.find((x) => /^en/i.test(x.lang)) ||
      null
    );
  }

  function toggleSpeak() {
    const pop = ensurePop();
    if (!window.speechSynthesis) return;

    if (speaking) {
      stopSpeech();
      return;
    }

    const term = pop.dataset.activeTerm;
    if (!term || !GLOSSARY[term]) return;

    window.speechSynthesis.cancel();
    const entry = GLOSSARY[term];

    const uZh = new SpeechSynthesisUtterance(entry.term);
    const zhV = pickZhVoice();
    if (zhV) {
      uZh.voice = zhV;
      uZh.lang = zhV.lang;
    } else {
      uZh.lang = 'zh-HK';
    }

    const uEn = new SpeechSynthesisUtterance(entry.english);
    const enV = pickEnVoice();
    if (enV) {
      uEn.voice = enV;
      uEn.lang = enV.lang;
    } else {
      uEn.lang = 'en-GB';
    }

    uZh.onerror = uEn.onerror = () => {
      speaking = false;
      updateListenUi(false);
    };

    uEn.onend = () => {
      speaking = false;
      updateListenUi(false);
    };

    uZh.onend = () => {
      try {
        window.speechSynthesis.speak(uEn);
      } catch (e) {
        speaking = false;
        updateListenUi(false);
      }
    };

    speaking = true;
    updateListenUi(true);
    window.speechSynthesis.speak(uZh);
  }

  function updateListenUi(playing) {
    const pop = ensurePop();
    const btn = pop.querySelector('.glossary-pop__listen');
    const icon = pop.querySelector('.glossary-pop__listen-icon');
    if (!btn || !icon) return;
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    icon.textContent = playing ? '⏸' : '▶';
  }

  function openPop(trigger, termKey) {
    activeTrigger = trigger;
    const pop = ensurePop();
    renderEntry(termKey);
    pop.dataset.activeTerm = termKey;

    pop.removeAttribute('hidden');
    pop.classList.add('is-open');
    pop.classList.remove('is-open-visible');

    requestAnimationFrame(() => {
      positionPop(trigger);
      requestAnimationFrame(() => {
        pop.classList.add('is-open-visible');
      });
    });

    document.querySelectorAll('.glossary-term').forEach((b) => {
      b.setAttribute('aria-expanded', b === trigger ? 'true' : 'false');
    });

    const closeBtn = pop.querySelector('.glossary-pop__close');
    if (closeBtn) closeBtn.focus();

    attachGlobalListeners();
    attachFocusTrap(pop);
  }

  function closePop(restoreFocus) {
    const pop = ensurePop();
    stopSpeech();

    pop.classList.remove('is-open-visible');
    const ms = REDUCED_MOTION ? 0 : 180;
    window.setTimeout(() => {
      pop.classList.remove('is-open');
      pop.setAttribute('hidden', '');
      pop.dataset.activeTerm = '';
    }, ms);

    document.querySelectorAll('.glossary-term').forEach((b) => {
      b.setAttribute('aria-expanded', 'false');
    });

    detachGlobalListeners();
    detachFocusTrap();

    if (restoreFocus !== false && activeTrigger) {
      try {
        activeTrigger.focus();
      } catch (e) {
        /* ignore */
      }
    }
    activeTrigger = null;
  }

  function attachFocusTrap(pop) {
    detachFocusTrap();

    const focusables = () =>
      Array.from(
        pop.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => pop.contains(el));

    trapHandler = (e) => {
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    trapPopEl = pop;
    pop.addEventListener('keydown', trapHandler);
  }

  function detachFocusTrap() {
    if (trapPopEl && trapHandler) trapPopEl.removeEventListener('keydown', trapHandler);
    trapHandler = null;
    trapPopEl = null;
  }

  function attachGlobalListeners() {
    escHandler = (e) => {
      if (e.key === 'Escape') closePop(true);
    };
    outsideHandler = (e) => {
      const pop = ensurePop();
      if (!pop.classList.contains('is-open-visible')) return;
      const t = e.target;
      const card = pop.querySelector('.glossary-pop__card');
      if (card && card.contains(t)) return;
      if (activeTrigger && activeTrigger.contains(t)) return;
      if (t.closest && t.closest('.glossary-term')) return;
      closePop(true);
    };
    resizeHandler = () => {
      const p = document.getElementById(POP_ID);
      if (activeTrigger && p && p.classList.contains('is-open')) {
        positionPop(activeTrigger);
      }
    };

    document.addEventListener('keydown', escHandler, true);
    document.addEventListener('mousedown', outsideHandler, true);
    window.addEventListener('resize', resizeHandler);
  }

  function detachGlobalListeners() {
    if (escHandler) document.removeEventListener('keydown', escHandler, true);
    if (outsideHandler) document.removeEventListener('mousedown', outsideHandler, true);
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    escHandler = null;
    outsideHandler = null;
    resizeHandler = null;
  }

  function onTermClick(e) {
    const btn = e.currentTarget;
    const term = btn.dataset.term;
    if (!term || !GLOSSARY[term]) return;

    const pop = document.getElementById(POP_ID);
    if (activeTrigger === btn && pop && pop.classList.contains('is-open-visible')) {
      closePop(true);
      return;
    }

    if (pop && pop.classList.contains('is-open')) {
      stopSpeech();
    }

    openPop(btn, term);
  }

  function refreshGlossary() {
    unwrapAllTerms();
    wrapAllTerms();
    /* Re-close popover if open — content may have changed */
    if (popEl && popEl.classList.contains('is-open')) {
      closePop(false);
    }
  }

  function boot() {
    ensurePop();
    wrapAllTerms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('btm:glossary-refresh', refreshGlossary);
})();
