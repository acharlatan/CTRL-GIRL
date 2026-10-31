import { useEffect, useState } from 'react';

const fields = [
  ['brand', 'Brand or project', 'A neighborhood bookshop'],
  ['offer', 'Product, offer, or idea', 'A monthly after-hours event'],
  ['audience', 'Audience and insight', 'Local readers looking for community'],
  ['objective', 'Objective', 'Increase event sign-ups'],
  ['timeframe', 'Timeframe', 'Four weeks'],
  ['budget', 'Budget and constraints', 'One person, limited budget'],
  ['channels', 'Channels', 'Instagram and email'],
  ['voice', 'Brand voice', 'Warm, thoughtful, playful'],
] as const;
type Key = typeof fields[number][0];
type Context = Record<Key, string>;
const empty = Object.fromEntries(fields.map(([k]) => [k, ''])) as Context;
const storageKey = 'ctrlgirl-campaign-builder-v1';

export default function CampaignBuilder() {
  const [context, setContext] = useState<Context>(empty);
  const [outline, setOutline] = useState('');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        const restored = { ...empty };
        fields.forEach(([key]) => { if (typeof data.context?.[key] === 'string') restored[key] = data.context[key]; });
        setContext(restored);
        if (typeof data.outline === 'string') setOutline(data.outline);
      }
    } catch { setMessage('Your saved campaign could not be loaded.'); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ context, outline })); }
    catch { setMessage('This browser could not save your work. Download a copy.'); }
  }, [context, outline, ready]);
  function makeOutline() {
    const v = (key: Key) => context[key].trim() || '[Add your thinking]';
    setOutline(`CAMPAIGN WORKING PLAN

PROJECT: ${v('brand')}
OFFER: ${v('offer')}
AUDIENCE AND INSIGHT: ${v('audience')}
OBJECTIVE: ${v('objective')}
TIMING: ${v('timeframe')}
BUDGET AND CONSTRAINTS: ${v('budget')}
CHANNELS: ${v('channels')}
VOICE: ${v('voice')}

CREATIVE DIRECTION
[What is the central idea? Why will this audience care?]

CHANNEL PLAN
[What will you create for each channel, and why?]

DELIVERABLES
[List the assets and who or what is needed to make them.]

MEASUREMENT
[Choose a measure tied to the objective and describe how you would track it.]

ASSUMPTIONS AND OPEN QUESTIONS
[Identify what you still need to verify.]`);
    setMessage('Your editable outline is ready. Add your own creative thinking.');
  }
  function download() {
    const href = URL.createObjectURL(new Blob([outline], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = href; link.download = 'ctrl-girl-campaign-plan.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(outline); setMessage('Campaign plan copied.'); }
    catch { setMessage('Copy is unavailable in this browser. Download your plan instead.'); }
  }
  return <section className="campaign-builder">
    <header><span>✦ THE AI TOOLKIT / CAMPAIGN BUILDER</span><h1>Make a plan worth making.</h1>
      <p>Turn your project context into an editable campaign outline. This guided template runs on your device and does not generate AI output.</p></header>
    <div className="campaign-layout"><div><h2>01 / Set the scene</h2>
      {fields.map(([key, label, placeholder]) => <label key={key}>{label}<input value={context[key]} maxLength={500} placeholder={placeholder} onChange={e => setContext({ ...context, [key]: e.target.value })} /></label>)}
      <button onClick={makeOutline}>Create my outline</button>
      <p>Creating a new outline replaces the current outline. Copy or download it first if you want to keep it.</p></div>
      <div><h2>02 / Make it yours</h2>
        <label htmlFor="campaign-outline">Your working plan</label>
        <textarea id="campaign-outline" value={outline} onChange={e => setOutline(e.target.value)} placeholder="Your editable outline will appear here." rows={22} />
        <button onClick={copy} disabled={!outline}>Copy plan</button><button onClick={download} disabled={!outline}>Download plan</button>
        <p role="status">{message}</p><p>Saved on this device. Clearing browser data removes it. No results are inferred or invented.</p>
      </div></div>
  </section>;
}
