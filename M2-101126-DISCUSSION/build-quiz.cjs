// Build the phrases quiz: six multiple-choice slides, options shuffled from a
// seed so the key is not the author's choice, and a key file beside the deck.
//
//   node build-quiz.cjs [seed]
//
// The answer is shown by an arrow that appears beside the correct option on a
// click, and by that option turning maroon. No answer line: the arrow is the
// answer, so the class reads the option rather than a sentence about it.
//
// Writes: index.html (quiz sections inserted after the "Phrases you can use"
// divider, replacing any quiz slides already there) and the key JSON.

const fs = require('fs');
const path = require('path');

const deckDir = __dirname;
const indexPath = path.join(deckDir, 'index.html');
const keyPath = path.join(deckDir, '..', '..', 'JSONS', 'M2-101126-phrases-quiz-key.json');

const seed = process.argv[2] ? Number(process.argv[2]) : Math.floor(Math.random() * 1e9);

// mulberry32: small, reproducible, no dependencies.
function rngFrom(s) {
  let a = s >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = rngFrom(seed);

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const questions = [
  {
    job: 'Position',
    prompt: 'Your partner says nothing. You need to start.',
    correct: 'For me, the club does help.',
    wrong: ['Where did you read that?', 'So our answer is that they try.', 'But that is only one teacher, right?'],
  },
  {
    job: 'Reason',
    prompt: 'You have said what you think. Now you must say why.',
    correct: '\u2026because nobody goes to the guidance teacher.',
    wrong: ['Mm. Agreed.', 'I don\u2019t remember where I read it.', 'That is a good point.'],
  },
  {
    job: 'Evidence',
    prompt: 'Your partner does not believe you. You need to show how you know.',
    correct: 'My cousin told her teacher, and the teacher said to ignore it.',
    wrong: ['What do you think?', 'I see what you mean.', 'So we agree, then.'],
  },
  {
    job: 'Test',
    prompt: 'Your partner gives a number, and you are not sure about it.',
    correct: 'Where did you read that?',
    wrong: ['I think it too.', 'OK, that is true.', 'So our answer is\u2026'],
  },
  {
    job: 'Concede',
    prompt: 'Your partner says something you think is true.',
    correct: 'That is a good point.',
    wrong: ['I don\u2019t agree.', 'Do you know that, or do you think it?', 'I read that somewhere.'],
  },
  {
    job: 'Close',
    prompt: 'The two minutes are nearly over. You must finish together.',
    correct: 'So our answer is: they try, but they start too late.',
    wrong: ['Where did you read that?', 'My cousin told me.', 'Hmm, I don\u2019t agree.'],
  },
];

const letters = ['A', 'B', 'C', 'D'];
const key = [];
const sections = [];

questions.forEach((item, index) => {
  const options = shuffle([{ text: item.correct, ok: true }].concat(item.wrong.map((w) => ({ text: w, ok: false }))));
  const answerAt = options.findIndex((o) => o.ok);
  key.push({
    number: index + 1,
    move: item.job,
    prompt: item.prompt,
    answer: letters[answerAt],
    text: item.correct,
    options: options.map((o, i) => letters[i] + '. ' + o.text),
  });

  // Every row reserves the arrow column so nothing shifts when the answer
  // appears; only the correct row carries the arrow, and the arrow is the
  // fragment that the click reveals.
  const rows = options
    .map((o, i) => {
      const mark = o.ok
        ? '<span class="mark"><i class="fa-solid fa-arrow-right fragment"></i></span>'
        : '<span class="mark"></span>';
      return '            <p>' + mark + '<span class="letter">' + letters[i] + '</span>' + esc(o.text) + '</p>';
    })
    .join('\n');

  sections.push(
    [
      '      <section id="quiz-' + (index + 1) + '" class="future">',
      '        <p class="quiz-kicker">Question ' + (index + 1) + ' of 6 &middot; ' + item.job + '</p>',
      '        <h2>' + esc(item.prompt) + '</h2>',
      '        <div class="content">',
      '          <div class="options">',
      rows,
      '          </div>',
      '        </div>',
      '      </section>',
    ].join('\n')
  );
});

const html = fs.readFileSync(indexPath, 'utf8');
const sectionRe = /<section\b[\s\S]*?<\/section>/g;
const all = html.match(sectionRe);
if (!all) throw new Error('no sections found');

const anchor = 'divider-words';
let hasAnchor = false;
for (const s of all) {
  const m = s.match(/<section[^>]*\bid="([^"]+)"/);
  if (m && m[1] === anchor) hasAnchor = true;
}
if (!hasAnchor) throw new Error('no divider-words section');

const rebuilt = [];
for (const s of all) {
  const m = s.match(/<section[^>]*\bid="([^"]+)"/);
  const id = m ? m[1] : '';
  if (id.startsWith('quiz-')) continue; // replaced below
  rebuilt.push(s);
  if (id === anchor) rebuilt.push(sections.join('\n\n'));
}

const first = html.indexOf(all[0]);
const lastMatch = all[all.length - 1];
const last = html.indexOf(lastMatch) + lastMatch.length;
const out = html.slice(0, first) + rebuilt.join('\n\n') + html.slice(last);
fs.writeFileSync(indexPath, out, 'utf8');

fs.mkdirSync(path.dirname(keyPath), { recursive: true });
fs.writeFileSync(keyPath, JSON.stringify({ seed, generated: new Date().toISOString(), questions: key }, null, 2), 'utf8');

console.log('seed: ' + seed);
key.forEach((k) => console.log('  Q' + k.number + ' (' + k.move + ') answer ' + k.answer + '  ' + k.text));
console.log('slides now: ' + (out.match(/<section\b/g) || []).length);
console.log('key written: ' + keyPath);
