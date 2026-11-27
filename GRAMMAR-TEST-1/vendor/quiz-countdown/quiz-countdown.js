/* Quiz countdown for reveal.js quiz decks.
 *
 * First-party code, not a vendored third-party asset — see vendor/README.md.
 * A classic global script like reveal.js itself, so it loads over file://.
 *
 * WHY THIS IS NOT `timer/timer.js`
 *
 * The lesson timer in `timer/timer.js` deliberately never starts by itself and
 * never advances the deck (ADR-0021): a thinking clock is the teacher's to
 * start. A quiz countdown is the opposite object. It is a time LIMIT that runs
 * the same way on every paper, so it starts when its slide arrives and moves
 * the deck on when it reaches zero. Two different jobs, so two components —
 * see ADR-0031.
 *
 * It emits exactly the markup `timer/timer.js` emits — one `<p
 * class="timer-readout">` inside a `.timer` element — and it sets the same
 * `data-timer-state` / `data-timer-urgent` attributes. That is why it needs no
 * CSS of its own: `base-styles.css` already styles that readout at 100pt and
 * already colours it for running, urgent and finished.
 *
 * CONTRACT
 *
 *   <div class="quiz-countdown timer"
 *        data-quiz-seconds="30"
 *        data-quiz-beep-from="5"
 *        data-quiz-beep-src="audio/beep.wav"
 *        data-quiz-advance="1200"></div>
 *
 *   data-quiz-seconds     length of the countdown, in seconds       (default 30)
 *   data-quiz-beep-from   beep once a second for the last N seconds (default 5)
 *   data-quiz-beep-src    the beep, deck-relative                   (default audio/beep.wav)
 *   data-quiz-advance     ms to wait after zero before moving on    (default 1200)
 *   data-quiz-label       names the clock for assistive technology  (default "quiz countdown")
 *
 * BEHAVIOUR
 *
 * 1. It starts when its slide arrives and stops and resets when its slide is
 *    left, so a clock can never run on a slide nobody is looking at.
 * 2. It beeps once a second for the final `data-quiz-beep-from` seconds, and
 *    not at zero: zero is announced by the deck moving on.
 * 3. After zero it waits `data-quiz-advance` ms and calls Reveal.next().
 * 4. With `?export` in the URL it does not start. An exported PDF must not
 *    photograph a clock mid-count, and decktape would otherwise carry every
 *    question slide to the next one after 30 seconds.
 * 5. The count runs from a wall-clock deadline, not by counting intervals, so
 *    a paused tab does not leave the clock behind.
 *
 * The beep is created on first use, so a deck whose countdown never reaches
 * the final five seconds never requests the file.
 */

(function () {
  'use strict';

  var DEFAULTS = {
    seconds: 30,
    beepFrom: 5,
    beepSrc: 'audio/beep.wav',
    advance: 1200,
    label: 'quiz countdown'
  };

  /* An exported PDF is a still picture of each slide, never a run of them. */
  var EXPORTING = /[?&]export(?:[=&]|$)/.test(window.location.search);

  function attrNumber(el, name, fallback) {
    var raw = el.getAttribute(name);
    if (raw === null || raw === '') return fallback;
    var value = parseInt(raw, 10);
    return isNaN(value) || value < 0 ? fallback : value;
  }

  function attrString(el, name, fallback) {
    var raw = el.getAttribute(name);
    return raw === null || raw === '' ? fallback : raw;
  }

  /* m:ss — a quiz clock is never long enough to need an hours field. */
  function format(seconds) {
    var total = Math.max(0, seconds);
    var minutes = Math.floor(total / 60);
    var rest = total % 60;
    return minutes + ':' + (rest < 10 ? '0' : '') + rest;
  }

  function QuizCountdown(el) {
    this.el = el;
    this.total = attrNumber(el, 'data-quiz-seconds', DEFAULTS.seconds);
    this.beepFrom = attrNumber(el, 'data-quiz-beep-from', DEFAULTS.beepFrom);
    this.beepSrc = attrString(el, 'data-quiz-beep-src', DEFAULTS.beepSrc);
    this.advance = attrNumber(el, 'data-quiz-advance', DEFAULTS.advance);
    this.label = attrString(el, 'data-quiz-label', DEFAULTS.label);

    this.remaining = this.total;
    this.endsAt = 0;
    this.handle = null;
    this.shown = null;      /* last second painted, so each is announced once */
    this.audio = null;
    this.advanced = false;
    this.slide = el.closest ? el.closest('section') : null;

    this.build();
    this.render(this.total, 'idle');
  }

  QuizCountdown.prototype.build = function () {
    this.el.setAttribute('role', 'timer');
    this.el.setAttribute('aria-label', this.label + ': ' + this.total + ' seconds');

    this.readout = document.createElement('p');
    this.readout.className = 'timer-readout';
    /* Off, not assertive: a screen reader reading out every second would talk
       over the teacher, and the number is not what the class acts on. */
    this.readout.setAttribute('aria-live', 'off');

    this.el.appendChild(this.readout);
  };

  QuizCountdown.prototype.render = function (value, state) {
    this.readout.textContent = format(value);
    this.el.setAttribute('data-timer-state', state);
    this.el.setAttribute(
      'data-timer-urgent',
      state === 'running' && value <= this.beepFrom ? 'true' : 'false'
    );
  };

  QuizCountdown.prototype.start = function () {
    if (this.handle) return;
    this.advanced = false;
    this.remaining = this.total;
    this.shown = null;
    this.endsAt = Date.now() + this.remaining * 1000;
    this.render(this.remaining, 'running');
    var self = this;
    this.handle = window.setInterval(function () { self.step(); }, 200);
  };

  QuizCountdown.prototype.step = function () {
    var left = this.endsAt - Date.now();
    var shown = Math.max(0, Math.ceil(left / 1000));
    if (shown === this.shown) return;

    if (shown > 0 && shown <= this.beepFrom) this.beep();
    this.shown = shown;

    if (shown === 0) {
      this.finish();
    } else {
      this.render(shown, 'running');
    }
  };

  QuizCountdown.prototype.finish = function () {
    if (this.handle) {
      window.clearInterval(this.handle);
      this.handle = null;
    }
    this.remaining = 0;
    this.render(0, 'finished');
    this.advanceDeck();
  };

  QuizCountdown.prototype.advanceDeck = function () {
    if (this.advanced || EXPORTING) return;
    this.advanced = true;
    var wait = this.advance;
    window.setTimeout(function () {
      if (window.Reveal && typeof window.Reveal.next === 'function') {
        try {
          window.Reveal.next();
        } catch (e) {
          /* The last slide has nowhere to go; the class has finished. */
        }
      }
    }, wait);
  };

  QuizCountdown.prototype.stop = function () {
    if (this.handle) {
      window.clearInterval(this.handle);
      this.handle = null;
    }
    this.remaining = this.total;
    this.shown = null;
    this.advanced = false;
    this.render(this.total, 'idle');
  };

  QuizCountdown.prototype.beep = function () {
    if (!this.beepSrc) return;
    if (!this.audio) {
      try {
        this.audio = new window.Audio(this.beepSrc);
        this.audio.preload = 'auto';
      } catch (e) {
        return;
      }
    }
    var audio = this.audio;
    try {
      audio.currentTime = 0;
    } catch (e) {
      /* Not seekable until metadata arrives; playing from wherever it sits is
         fine for a sound this short. */
    }
    var promise = null;
    try {
      promise = audio.play();
    } catch (e) {
      return;
    }
    /* A blocked or interrupted play() rejects — usually the browser's autoplay
       policy on a deck that has had no click yet. That is not a fault in the
       deck, so it must not surface as an unhandled rejection. */
    if (promise && typeof promise.catch === 'function') promise.catch(function () {});
  };

  function init() {
    var nodes = document.querySelectorAll('.quiz-countdown');
    if (!nodes.length) return;

    var clocks = [];
    for (var i = 0; i < nodes.length; i++) clocks.push(new QuizCountdown(nodes[i]));

    if (window.Reveal && typeof window.Reveal.on === 'function') {
      var sync = function () {
        var current = null;
        try {
          current = window.Reveal.getCurrentSlide();
        } catch (e) {
          current = null;
        }
        for (var j = 0; j < clocks.length; j++) {
          var clock = clocks[j];
          var mine = clock.slide === current;
          if (!mine) {
            clock.stop();
          } else if (!clock.handle && !EXPORTING) {
            clock.start();
          }
        }
      };
      window.Reveal.on('ready', sync);
      window.Reveal.on('slidechanged', sync);
      /* Reveal may already have fired `ready` before this script first ran —
         the deck's init call sits above this one. Syncing once here covers
         both orders without double-starting (start() is guarded). */
      sync();
    } else if (!EXPORTING) {
      /* No Reveal (opened as a fragment): run the clock, but there is no deck
         to advance, so it simply stops at zero. */
      clocks[0].start();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
