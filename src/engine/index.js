import corpus from './corpus.json' with { type: 'json' };
const slots=['trait','situation','opportunity','warning','closing'];
export function seededRandom(seed){let h=2166136261;for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const pick=(a,r)=>{if(!Array.isArray(a)||!a.length)throw Error('Corpus slot is empty');return a[Math.floor(r()*a.length)]};
export function createChapter({seed,category='self',context={}}){const source=corpus.categories[category];if(!source)throw Error('Unknown reading category');const r=seededRandom(seed);const block=Object.fromEntries(slots.map(k=>[k,pick(source[k],r)]));return{category,seed:String(seed),block,text:renderBlock(block,context)}}
export function renderBlock(block,context={}){const pronoun=context.pronoun_th||'คุณ',possessive=context.possessive||'ของคุณ',name=String(context.name||'').trim();let nameCount=0;const replace=s=>s.replace(/\\{name\\}/g,()=>name&&nameCount++===0?name:pronoun).replace(/\\{pronoun\\}/g,pronoun).replace(/\\{possessive\\}/g,possessive);return slots.map(k=>replace(block[k]||'')).filter(Boolean).join(' ')}
export function buildBook({birthSeed,context={}}){const categories=['self','work','love','wealth'];return categories.map(category=>createChapter({seed:`${birthSeed}:${category}`,category,context}))}
export const knowledge=corpus;
