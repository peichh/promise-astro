export type ReadingCategory='work'|'love'|'wealth'|'self';
export interface ReadingContext{name?:string;birth_gender?:string;current_gender?:string;pronoun_th?:'เขา'|'เธอ'|'คุณ'|'น้อง';sexual_orientation?:string;relationship_status?:string;lgbtq_role?:string;}
export interface ReadingBlock{trait:string;situation:string;opportunity:string;warning:string;closing:string;}
export interface Corpus{traits:string[];situations:string[];opportunities:string[];warnings:string[];closings:string[];}
const banned=['และนั่นแหละคือจุดที่'];
export function seededRandom(seed:string|number){let h=2166136261;for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function pick<T>(a:T[],r:()=>number):T{if(!a.length)throw new Error('Corpus section must not be empty');return a[Math.floor(r()*a.length)]}
export function buildBlock(c:Corpus,random:()=>number):ReadingBlock{return{trait:pick(c.traits,random),situation:pick(c.situations,random),opportunity:pick(c.opportunities,random),warning:pick(c.warnings,random),closing:pick(c.closings,random)}}
export function renderBlock(block:ReadingBlock,context:ReadingContext={}):string{const pronoun=context.pronoun_th||'คุณ';const name=(context.name||'').trim();let used=false;const normalize=(s:string)=>{for(const phrase of banned)s=s.split(phrase).join('อย่างไรก็ตาม');return s.replace(/\\{pronoun\\}/g,pronoun).replace(/\\{name\\}/g,()=>{if(!name||used)return pronoun;used=true;return name})};return [block.trait,block.situation,block.opportunity,block.warning,block.closing].map(normalize).join(' ')}
export function createReading(corpus:Corpus,seed:string|number,_context:ReadingContext={}):ReadingBlock{return buildBlock(corpus,seededRandom(seed))}
