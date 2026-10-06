const KEY="myday-exact-v1";
let data=JSON.parse(localStorage.getItem(KEY)||"null")||{
habits:[
{id:1,n:"Фаджр",i:"🕌",t:"05:20",done:true},
{id:2,n:"Утренние зикры",i:"📿",t:"07:00",done:true},
{id:3,n:"Чтение книги",i:"📖",t:"21:00",done:false},
{id:4,n:"Повторение",i:"🔄",t:"",done:false},
{id:5,n:"Заучивание",i:"🧠",t:"",done:false},
{id:6,n:"Требование знаний",i:"🎓",t:"",done:true},
{id:7,n:"Тренировка",i:"🏋️",t:"",done:false}
],
cats:[
{id:1,n:"Чтение книги",i:"📖",m:35},{id:2,n:"Повторение",i:"🔄",m:20},
{id:3,n:"Заучивание",i:"🧠",m:45},{id:4,n:"Требование знаний",i:"🎓",m:30}
]};
let selectedIcon="📖";
const icons=["📖","🕌","📿","🔄","🧠","🎓","🏋️","💧","❤️","🌅","☀️","🌙","✍️","🎯"];

function render(){
 const done=data.habits.filter(h=>h.done).length, total=data.habits.length, p=Math.round(done/total*100);
 document.getElementById("percent").textContent=p+"%"; document.getElementById("progressBar").style.width=p+"%";
 document.getElementById("progressSub").textContent=`${done} из ${total} привычек`;
 document.getElementById("habitList").innerHTML=data.habits.map(h=>`
 <div class="habit-row ${h.done?"done":""}">
  <button class="check" onclick="toggleHabit(${h.id})">${h.done?"✓":""}</button>
  <div class="habit-icon">${h.i}</div>
  <div class="habit-name">${h.n}${h.t?`<div class="habit-time">${h.t}</div>`:""}</div>
  <button class="habit-action" onclick="editHabit(${h.id})">☼</button>
 </div>`).join("");
 const totalMin=data.cats.reduce((a,c)=>a+c.m,0);
 document.getElementById("totalTime").textContent=totalMin>=60?`${Math.floor(totalMin/60)} ч ${totalMin%60?totalMin%60+" мин":""}`:`${totalMin} мин`;
 document.getElementById("timeRows").innerHTML=data.cats.map(c=>{
  const q=totalMin?Math.round(c.m/totalMin*100):0;
  return `<div class="time-row"><div class="time-top"><span>${c.i} &nbsp;${c.n}</span><b>${c.m} мин</b></div><div class="time-bar"><i style="width:${q}%"></i></div></div>`
 }).join("");
 const next=data.habits.filter(h=>h.t&&!h.done).sort((a,b)=>a.t.localeCompare(b.t))[0];
 if(next){document.getElementById("nextName").textContent=next.n;document.getElementById("nextTime").textContent=next.t}
 document.getElementById("timeline").innerHTML=data.habits.slice(0,5).map((h,i)=>`<div class="node ${h.done?"done":i===2?"current":""}">${h.n.length>12?h.n.slice(0,12)+"…":h.n}</div>`).join("");
}
function toggleHabit(id){const h=data.habits.find(x=>x.id===id);h.done=!h.done;save();render();toast(h.done?"Привычка выполнена ✓":"Отметка снята")}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function toast(s){const e=document.getElementById("toast");e.textContent=s;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1500)}
function drawIcons(){document.getElementById("icons").innerHTML=icons.map(x=>`<button class="icon-pick ${x===selectedIcon?"sel":""}" onclick="selectedIcon='${x}';drawIcons()">${x}</button>`).join("")}
function openModal(){selectedIcon="📖";document.getElementById("habitName").value="";document.getElementById("habitTime").value="";drawIcons();document.getElementById("modal").classList.add("show")}
function editHabit(id){const h=data.habits.find(x=>x.id===id);selectedIcon=h.i;document.getElementById("habitName").value=h.n;document.getElementById("habitTime").value=h.t||"";drawIcons();document.getElementById("modal").classList.add("show")}
function closeModal(){document.getElementById("modal").classList.remove("show")}
document.getElementById("newHabit").onclick=openModal;document.getElementById("addHabit").onclick=openModal;
document.getElementById("close").onclick=closeModal;document.getElementById("cancel").onclick=closeModal;
document.getElementById("save").onclick=()=>{const n=document.getElementById("habitName").value.trim();if(!n)return;data.habits.push({id:Date.now(),n,i:selectedIcon,t:document.getElementById("habitTime").value,done:false});save();closeModal();render();toast("Привычка добавлена ✓")};
document.getElementById("addTime").onclick=()=>{document.getElementById("cat").innerHTML=data.cats.map(c=>`<option value="${c.id}">${c.i} ${c.n}</option>`).join("");document.getElementById("mins").value="";document.getElementById("timeModal").classList.add("show")};
document.getElementById("closeTime").onclick=()=>document.getElementById("timeModal").classList.remove("show");
document.getElementById("cancelTime").onclick=()=>document.getElementById("timeModal").classList.remove("show");
document.getElementById("saveTime").onclick=()=>{let id=+document.getElementById("cat").value,m=+document.getElementById("mins").value;if(!m)return;data.cats.find(c=>c.id===id).m+=m;save();document.getElementById("timeModal").classList.remove("show");render();toast("Время добавлено ✓")};
render();
