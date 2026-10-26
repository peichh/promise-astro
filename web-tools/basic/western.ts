import * as Astronomy from 'astronomy-engine';
import { getCoords } from '../utils/provinceCoords';
export function calcWestern(dob:string,time:string,province:string){
  const {lat,lng}=getCoords(province);
  const date=new Date(`${dob}T${time}:00`);
  const t=Astronomy.MakeTime(date);
  const sun=Astronomy.SunPosition(t);
  const moon=Astronomy.EclipticGeoMoon(t);
  const lst=(Astronomy.SiderealTime(t)+lng/15)%24;
  return { system:'western_natal', sun_long:sun.elon, moon_long:moon.elon, asc:(lst*15)%360, moon_phase:Astronomy.MoonPhase(t), lat,lng }
}
