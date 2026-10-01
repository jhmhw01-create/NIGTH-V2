import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {eventRoutes, personalRoutes, reactRoutes} from '../src/react/routes.mjs';
import {syncHubPage} from '../scripts/hub-sync.mjs';

const root = new URL('../', import.meta.url);
const workflows = ['.github/workflows/ci.yml', '.github/workflows/deploy-pages.yml'];
const schedules = [
  ['member-doha.html', 'doha-play-on.html'],
  ['member-woohyun.html', 'woohyun-night-off.html'],
  ['member-jiwoo.html', 'jiwoo-acting.html'],
  ['member-ihwan.html', 'ihwan-musical.html'],
  ['member-taehoon.html', 'taehoon-camera-on-off.html'],
];

test('CI treats committed media and legacy audit manifests as immutable gates', async () => {
  for (const path of workflows) {
    const workflow = await readFile(new URL(path, root), 'utf8');
    assert.doesNotMatch(workflow, /audit:media:update/, `${path} must not refresh media manifests`);
    assert.doesNotMatch(workflow, /UPDATE_LEGACY_ASSET_AUDIT\s*=\s*1/, `${path} must not rewrite the legacy audit`);
    assert.match(workflow, /run: npm ci/);
    assert.match(workflow, /run: npm test/);
    assert.match(workflow, /run: npm run audit:media/);
    assert.match(workflow, /run: npm run build/);
    assert.match(workflow, /run: npm run verify:dist/);
    const commands = ['npm test', 'npm run audit:media', 'npm run build', 'npm run verify:dist'];
    const offsets = commands.map((command) => workflow.indexOf(command));
    assert.deepEqual(offsets, [...offsets].sort((a, b) => a - b), `${path} validation gates are out of order`);
  }
});

test('all five personal schedules are canonical routes linked by their member pages', async () => {
  for (const [memberRoute, scheduleRoute] of schedules) {
    assert.ok(reactRoutes.includes(memberRoute));
    assert.ok(reactRoutes.includes(scheduleRoute));
    assert.ok(personalRoutes.includes(scheduleRoute) || eventRoutes.includes(scheduleRoute));
    const member = JSON.parse(await readFile(new URL(`src/pages/${memberRoute.replace('.html', '.json')}`, root), 'utf8'));
    const rendered = syncHubPage(member);
    assert.match(rendered.contentHtml, new RegExp(`href=["']${scheduleRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`));
  }
});
