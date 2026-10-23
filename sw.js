const V="v4";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(!k.endsWith(V))await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(u.hostname==="cdn.jsdelivr.net"){e.respondWith(cdn(r));return}
 if(u.origin===location.origin){
  if(r.mode==="navigate"){e.respondWith(netFirst(r,u.origin+u.pathname));return}
  e.respondWith(stale(r))}});
async function cdn(r){const c=await caches.open("cdn-"+V),m=await c.match(r.url);if(m)return m;try{const f=await fetch(r.url,{mode:"cors"});if(f.ok)c.put(r.url,f.clone());return f}catch(e){return fetch(r)}}
async function netFirst(r,k){const c=await caches.open("pg-"+V);try{const f=await fetch(r);if(f.ok)c.put(k,f.clone());return f}catch(e){return(await c.match(k))||Response.error()}}
async function stale(r){const c=await caches.open("pg-"+V),m=await c.match(r),n=fetch(r).then(f=>{if(f.ok)c.put(r,f.clone());return f}).catch(()=>null);return m||(await n)||Response.error()}
