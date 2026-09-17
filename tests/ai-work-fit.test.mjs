import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWorkFit } from '../docs/ai-work-fit/app.js';

test('반복적이고 규칙적인 업무는 자동화 후보로 판정한다', () => {
  assert.deepEqual(calculateWorkFit([2, 2, 2, 2, 2, 2]), { score: 100, level: 'ready' });
});

test('절반 수준의 업무는 작은 실험 대상으로 판정한다', () => {
  assert.deepEqual(calculateWorkFit([2, 1, 1, 1, 1, 1]), { score: 58, level: 'test' });
});

test('예외가 많은 업무는 보조 사용 대상으로 판정한다', () => {
  assert.deepEqual(calculateWorkFit([0, 0, 0, 0, 0, 0]), { score: 0, level: 'assist' });
});
