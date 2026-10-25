// anti-copy.js - loaded on book page
(function(){
  // Disable selection
  document.addEventListener('selectstart', e=>e.preventDefault());
  // Detect devtools (basic)
  let devtoolsOpen=false;
  setInterval(()=>{
    if(window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
      if(!devtoolsOpen){ document.body.innerHTML='<div style=\'color:white;background:black;height:100vh;display:flex;align-items:center;justify-content:center\'>ตรวจพบการเปิด DevTools - หน้านี้ล็อคสำหรับ Member</div>'; devtoolsOpen=true; }
    }
  },1000);
})();