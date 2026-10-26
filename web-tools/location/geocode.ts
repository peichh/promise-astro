import { THAI_PROVINCES, getCoords } from '../utils/provinceCoords';
export function geocodeProvince(province:string){
  const c=getCoords(province);
  return { province, ...c, source:"internal THAI_PROVINCES" }
}
export function searchProvince(query:string){
  return Object.keys(THAI_PROVINCES).filter(p=>p.includes(query)).map(p=>({province:p,...THAI_PROVINCES[p]}));
}
export function getAllProvinces(){ return THAI_PROVINCES; }
