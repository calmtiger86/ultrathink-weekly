const COUNTER_BASE = 'https://tallywire.cronpulse.workers.dev/hit/ultrathink-ai-work-fit-20260917';

export function calculateWorkFit(answers) {
  if (answers.length !== 6) throw new Error('응답은 여섯 개여야 합니다.');
  const total = answers.reduce((sum, answer) => sum + Math.max(0, Math.min(2, answer)), 0);
  const score = Math.round((total / 12) * 100);
  return { score, level: score >= 75 ? 'ready' : score >= 40 ? 'test' : 'assist' };
}

function count(event, unique = false) {
  const suffix = unique ? '?unique=1' : '';
  fetch(`${COUNTER_BASE}/${event}${suffix}`, { mode: 'cors', keepalive: true }).catch(() => {});
}

if (typeof document !== 'undefined') {
  const copy = {
    ready: ['지금 자동화해도 좋아요', '반복과 규칙이 뚜렷해 AI가 초안을 맡기 좋은 업무예요.', '최근 결과물 하나와 원하는 형식을 함께 주고, 초안부터 맡겨 보세요.'],
    test: ['작게 시험해 보면 좋아요', '전체보다 한 단계를 골라 AI에 맡길 때 효과를 확인하기 쉬워요.', '자료 정리, 요약, 초안 중 하나만 골라 3회 반복해 시간을 비교하세요.'],
    assist: ['자동화보다 보조 사용이 먼저예요', '예외와 사람의 판단이 많아 지금은 통째로 맡기기 어려운 업무예요.', '의사결정은 직접 하고, 아이디어 확장이나 체크리스트 작성에만 AI를 써 보세요.'],
  };
  const questions = [...document.querySelectorAll('.question')];
  const answers = Array(6).fill(null);
  const diagnose = document.querySelector('#diagnose');

  count('pageview', true);

  questions.forEach((question, index) => {
    question.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        question.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        answers[index] = Number(button.dataset.value);
        diagnose.disabled = answers.some((answer) => answer === null);
        document.querySelector('#result').hidden = true;
      });
    });
  });

  diagnose.addEventListener('click', () => {
    const result = calculateWorkFit(answers);
    const [title, summary, next] = copy[result.level];
    document.querySelector('#score').textContent = result.score;
    document.querySelector('#result-title').textContent = title;
    document.querySelector('#result-summary').textContent = summary;
    document.querySelector('#next-step').textContent = next;
    const panel = document.querySelector('#result');
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    count('completed', true);
  });

  document.querySelector('#subscribe').addEventListener('click', () => count('subscribe-click', true));
}
