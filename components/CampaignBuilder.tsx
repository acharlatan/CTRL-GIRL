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
    if (outline.trim() && !window.confirm('Replace the current outline? Download or copy it first if you want to keep it.')) return;
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
  const filled = fields.filter(([key]) => context[key].trim()).length;
  return <section className="campaign-builder">
    <header className="campaign-cover"><div className="campaign-cover-copy"><span>THE TOOLKIT / CREATIVE FILE 001</span><h1>GOOD IDEAS<br/><em>NEED A</em><br/>PLAN.</h1><p>A little structure for the big idea in your head. Make a working campaign plan, your way.</p><div className="campaign-cover-bottom">GUIDED TEMPLATE <b>✳</b> SAVED ON THIS DEVICE</div></div><div className="campaign-cover-art" aria-hidden="true"><div className="campaign-paper"><small>THE CAMPAIGN FILE / 001</small><strong>THE<br/><em>BIG</em><br/>IDEA.</strong><span>FROM THOUGHT TO THING ↗</span></div><span className="campaign-sticker">YOU'VE GOT<br/>THIS ♡</span></div></header>
    <div className="campaign-guide"><span>YOUR CREATIVE WORKSPACE</span><p>Fill in what you know, create your outline, then shape it into something unmistakably yours.</p><b>01 / CONTEXT &nbsp; → &nbsp; 02 / YOUR PLAN</b></div>
    <div className="campaign-layout"><div className="campaign-form"><div className="campaign-step"><span>01 / THE CONTEXT</span><b>{filled} / {fields.length} FILLED</b></div><h2>Set the scene<span>✳</span></h2><p>Start anywhere. Leave a blank if you're still working it out.</p>
      {fields.map(([key, label, placeholder],i) => <label key={key}><span className="campaign-label-num">{String(i+1).padStart(2,'0')}</span><span>{label}</span><input value={context[key]} maxLength={500} placeholder={placeholder} onChange={e => setContext({ ...context, [key]: e.target.value })} /></label>)}
      <button className="campaign-create" onClick={makeOutline}>CREATE MY OUTLINE <span>↗</span></button>
      <p className="campaign-small">This is a guided template, not AI generation. Creating a new outline replaces the current one.</p></div>
      <div className="campaign-result"><div className="campaign-step"><span>02 / THE FINISHED FILE</span><b>YOURS TO EDIT ✳</b></div><h2>Make it yours<span>↗</span></h2><p>This is your starting point. Edit, rearrange, and bring your own ideas.</p>
        <label htmlFor="campaign-outline">YOUR CAMPAIGN WORKING PLAN</label>
        <textarea id="campaign-outline" value={outline} onChange={e => setOutline(e.target.value)} placeholder="Your editable outline will appear here. No blank-page panic, promise." rows={22} />
        <div className="campaign-actions"><button onClick={copy} disabled={!outline}>COPY PLAN ↗</button><button onClick={download} disabled={!outline}>DOWNLOAD ↓</button></div>
        <p role="status">{message}</p><div className="campaign-privacy"><b>A LITTLE NOTE ♡</b><p>Saved on this device. Clearing browser data removes it, so download a copy when you're done.</p></div>
      </div></div>
  </section>;
}
