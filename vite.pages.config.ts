import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'pages',
  base: '/CTRL-GIRL/',
  publicDir: '../public',
  resolve: { alias: { '@': resolve(__dirname, '.') } },
  plugins: [react(), {
    name: 'pages-compatibility',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('/app/globals.css')) return code.replace("url('/hero.png')", "url('../public/hero.png')");
      if (id.endsWith('/app/page.tsx')) return code.replace('async function review(){', `async function review(){ const filled=draft.answers.map(a=>a.trim().length>=15); if(filled.filter(Boolean).length<2){setError('Add a little more to at least two sections before reviewing.');return;} const gaps=c.fields.filter((_,i)=>!filled[i]).map(x=>x.label); const first=c.fields[filled.findIndex(Boolean)].label; const feedback=['YOUR SELF-REVIEW','You have started '+first+'. Re-read it against the brief and explain why your choice fits '+c.audience+'.','BUILD ON IT',gaps.length?'Add more detail to: '+gaps.join(', ')+'. Use the hints above for a starting point.':'All four sections have a starting point. Check each one against the brief’s objective and constraints.','YOUR NEXT MOVE','Choose one decision and explain why it serves the objective: '+c.objective,'This checklist is based on completion and the brief, not AI analysis or a grade.'].join('\\n'); updateDraft({feedback,previous:draft.lastReviewed,lastReviewed:[...draft.answers]});setError('');setTimeout(()=>document.getElementById('feedback')?.scrollIntoView({behavior:'smooth',block:'start'}),100);return;`).replace('YOUR CREATIVE COACH','YOUR SELF-REVIEW').replace('Ready for a second set of eyes?','Ready to check your work?').replace('Get constructive, challenge-specific AI feedback. Your answers are sent to the AI service when you request a review. Feedback is guidance, not a grade.','Use a private checklist based on the brief and your completed sections. It runs on this device and does not evaluate the quality of your writing.').replace('GET CREATIVE FEEDBACK','CHECK MY WORK').replace('REVIEW MY REVISION','CHECK MY REVISION').replace('A NOTE FROM YOUR AI COACH','YOUR SELF-REVIEW').replace('AI can miss things. Question the feedback and use your own judgment.','This checklist is a starting point, not an assessment of your skills.');
    },
  }],
  build: { outDir: '../pages-dist', emptyOutDir: true },
});
