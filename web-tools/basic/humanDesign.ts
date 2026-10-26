export function calcHumanDesign(dob:string,time:string){
  const birth=new Date(`${dob}T${time}:00`);
  const design=new Date(birth); design.setDate(birth.getDate()-88);
  const d=birth.getDate();
  const type=d%5===0?'Reflector':d%4===0?'Manifestor':d%3===0?'Projector':d%2===0?'Generator':'Manifesting Generator';
  return { system:'human_design', birth:birth.toISOString(), design_date:design.toISOString(), type, strategy:type==='Generator'?'Respond':'Wait for Invitation', authority:'Sacral', profile:'3/5' }
}
