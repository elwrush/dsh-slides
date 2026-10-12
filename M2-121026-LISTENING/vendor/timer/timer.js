/* Countdown timer for reveal.js decks.
 *
 * First-party code, not a vendored third-party asset — see vendor/README.md.
 * No dependencies, no imports, no build step: a classic global script, so it
 * loads over file:// exactly like reveal.js itself.
 *
 * CONTRACT
 *
 * Put an element with class "timer" where the timer should appear. This script
 * fills it with a readout and two buttons:
 *
 *   <div class="timer" data-timer-seconds="120"></div>
 *
 * Attributes, all optional except data-timer-seconds:
 *
 *   data-timer-seconds    length of the countdown, in seconds        (default 60)
 *   data-timer-tick-from  tick once a second for the last N seconds  (default 10)
 *   data-timer-tick-src   tick sound, deck-relative                  (default audio/blip.mp3)
 *   data-timer-bell-src   bell at zero, deck-relative                (default audio/bell.mp3)
 *   data-timer-label      names this timer for assistive tech        (default "timer")
 *
 * THREE DELIBERATE BEHAVIOURS
 *
 * 1. It NEVER starts by itself. A slide that arrives already counting down has
 *    taken the decision away from the teacher, who is the only person who knows
 *    whether the room is ready. Nothing happens until a button is pressed.
 * 2. The sounds are created on first use, not at load, so a deck that never
 *    starts a timer never requests them — which keeps a deck's network profile
 *    (and the offline check's request log) free of two files nobody played.
 * 3. Leaving the slide stops and resets the timer, so a countdown cannot run on
 *    a slide nobody is looking at. This needs Reveal; without it the timer still
 *    works, it just does not auto-reset.
 *
 * The countdown is driven from a wall-clock deadline rather than by counting
 * intervals, because a 10-minute timer built on setInterval drifts and can lag
 * seconds behind by the end of a lesson.
 */

(function () {
  'use strict';

  var DEFAULTS = {
    seconds: 60,
    tickFrom: 10,
    tickSrc: 'audio/blip.mp3',
    bellSrc: 'audio/bell.mp3',
    label: 'timer'
  };

  /* The label and icon the primary button carries in each state. */
  var BUTTONS = {
    idle:     { text: 'Start',   icon: 'fa-play' },
    running:  { text: 'Stop',    icon: 'fa-stop' },
    paused:   { text: 'Resume',  icon: 'fa-play' },
    finished: { text: 'Restart', icon: 'fa-rotate-right' }
  };

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

  /* m:ss — a lesson timer is never long enough to need an hours field. */
  function format(seconds) {
    var total = Math.max(0, seconds);
    var minutes = Math.floor(total / 60);
    var rest = total % 60;
    return minutes + ':' + (rest < 10 ? '0' : '') + rest;
  }

  function icon(name) {
    return '<i class="fa-solid ' + name + '" aria-hidden="true"></i> ';
  }

  function Timer(el) {
    this.el = el;
    this.total = attrNumber(el, 'data-timer-seconds', DEFAULTS.seconds);
    this.tickFrom = attrNumber(el, 'data-timer-tick-from', DEFAULTS.tickFrom);
    this.tickSrc = attrString(el, 'data-timer-tick-src', DEFAULTS.tickSrc);
    this.bellSrc = attrString(el, 'data-timer-bell-src', DEFAULTS.bellSrc);
    this.label = attrString(el, 'data-timer-label', DEFAULTS.label);

    this.remaining = this.total;
    this.endsAt = 0;
    this.handle = null;
    this.shown = null;      // last value painted, so a second is ticked once
    this.state = 'idle';
    this.sounds = {};

    this.build();
    this.render(this.total, 'idle');
  }

  Timer.prototype.build = function () {
    var self = this;

    this.el.setAttribute('role', 'group');
    this.el.setAttribute('aria-label', this.label + ' countdown');

    this.readout = document.createElement('p');
    this.readout.className = 'timer-readout';
    /* Announce the value politely rather than every second: an assertive live
       region reading out a countdown would talk over the teacher. */
    this.readout.setAttribute('aria-live', 'off');

    this.controls = document.createElement('p');
    this.controls.className = 'timer-controls';

    this.toggle = document.createElement('button');
    this.toggle.type = 'button';
    this.toggle.className = 'timer-btn timer-btn-primary';
    this.toggle.addEventListener('click', function () { self.toggleFromButton(); });

    this.replayButton = document.createElement('button');
    this.replayButton.type = 'button';
    this.replayButton.className = 'timer-btn';
    this.replayButton.innerHTML = icon('fa-rotate-left') + 'Replay';
    this.replayButton.addEventListener('click', function () { self.replay(); });

    this.controls.appendChild(this.toggle);
    this.controls.appendChild(this.replayButton);
    this.el.appendChild(this.readout);
    this.el.appendChild(this.controls);
  };

  Timer.prototype.render = function (value, state) {
    this.state = state;
    this.readout.textContent = format(value);
    this.el.setAttribute('data-timer-state', state);
    this.el.setAttribute(
      'data-timer-urgent',
      state === 'running' && value <= this.tickFrom ? 'true' : 'false'
    );

    var config = BUTTONS[state] || BUTTONS.idle;
    this.toggle.innerHTML = icon(config.icon) + config.text;
  };

  Timer.prototype.toggleFromButton = function () {
    if (this.state === 'running') {
      this.stop();
    } else if (this.state === 'finished') {
      this.replay();
    } else {
      this.run();
    }
  };

  Timer.prototype.run = function () {
    var self = this;
    if (this.handle) return;
    /* Pressing Start on a finished timer starts a fresh one rather than
       sitting at zero. */
    if (this.remaining <= 0) {
      this.remaining = this.total;
      this.shown = null;
    }
    this.endsAt = Date.now() + this.remaining * 1000;
    this.render(this.remaining, 'running');
    this.handle = window.setInterval(function () { self.step(); }, 200);
    this.step();
  };

  Timer.prototype.step = function () {
    var left = this.endsAt - Date.now();
    var shown = Math.max(0, Math.ceil(left / 1000));
    if (shown === this.shown) return;

    if (shown > 0 && shown <= this.tickFrom) this.play('tick');
    this.shown = shown;

    if (shown === 0) {
      this.finish();
    } else {
      this.render(shown, 'running');
    }
  };

  Timer.prototype.finish = function () {
    if (this.handle) {
      window.clearInterval(this.handle);
      this.handle = null;
    }
    this.remaining = 0;
    this.play('bell');
    this.render(0, 'finished');
  };

  Timer.prototype.stop = function () {
    if (!this.handle) return;
    window.clearInterval(this.handle);
    this.handle = null;
    this.remaining = Math.max(0, Math.ceil((this.endsAt - Date.now()) / 1000));
    this.render(this.remaining, this.remaining === 0 ? 'finished' : 'paused');
  };

  Timer.prototype.reset = function () {
    if (this.handle) {
      window.clearInterval(this.handle);
      this.handle = null;
    }
    this.remaining = this.total;
    this.shown = null;
    this.render(this.total, 'idle');
  };

  Timer.prototype.replay = function () {
    this.reset();
    this.run();
  };

  Timer.prototype.sound = function (which) {
    if (!this.sounds[which]) {
      var src = which === 'bell' ? this.bellSrc : this.tickSrc;
      if (!src) return null;
      var audio = new window.Audio(src);
      audio.preload = 'auto';
      this.sounds[which] = audio;
    }
    return this.sounds[which];
  };

  Timer.prototype.play = function (which) {
    var audio = this.sound(which);
    if (!audio) return;
    try {
      audio.currentTime = 0;
    } catch (e) {
      /* Not seekable until the file has metadata; playing from wherever it
         sits is fine for a sound this short. */
    }
    var promise = null;
    try {
      promise = audio.play();
    } catch (e) {
      return;
    }
    /* A blocked or interrupted play() rejects. Nothing is wrong with the
       deck when that happens, so it must not surface as an unhandled
       rejection in the console. */
    if (promise && typeof promise.catch === 'function') promise.catch(function () {});
  };

  function init() {
    var nodes = document.querySelectorAll('.timer');
    if (!nodes.length) return;

    var timers = [];
    for (var i = 0; i < nodes.length; i++) timers.push(new Timer(nodes[i]));

    if (window.Reveal && typeof window.Reveal.on === 'function') {
      try {
        window.Reveal.on('slidechanged', function (event) {
          for (var j = 0; j < timers.length; j++) {
            var timer = timers[j];
            if (timer.el.closest('section') !== event.currentSlide) timer.reset();
          }
        });
      } catch (e) {
        /* An older Reveal without .on: the timers still work, they just do not
           reset themselves when their slide is left. */
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
