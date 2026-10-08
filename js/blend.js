/* Offline profile exchange and set-based taste matching. */
(function(g){'use strict';const key='obsidian-blend-profile';
 // Normalize artist and title so copied files still match across devices.
 function keyOf(song){const clean=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');return clean(song.artist)+'|'+clean(song.title);}
 // Export liked track identity and artist data as a portable profile file.
 function exportProfile(library,likes){const songs=[...likes].map(id=>library.get(id)).filter(Boolean);const blob=new Blob([JSON.stringify({version:1,songs:songs.map(s=>({id:s.id,title:s.title,artist:s.artist}))},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='obsidian-profile.json';a.click();URL.revokeObjectURL(a.href);}
 // Compare profiles with set intersection and union, then alternate unique picks.
 function compare(a,b){const amap=new Map((a.songs||[]).map(s=>[keyOf(s),s])),bmap=new Map((b.songs||[]).map(s=>[keyOf(s),s])),A=new Set(amap.keys()),B=new Set(bmap.keys()),shared=[...A].filter(x=>B.has(x)),union=new Set([...A,...B]);return{shared,union:[...union],match:union.size?Math.round(shared.length/union.size*100):0,artists:[...new Set(shared.map(k=>amap.get(k)?.artist).filter(Boolean))],mine:[...A].filter(k=>!B.has(k)).map(k=>amap.get(k)),friend:[...B].filter(k=>!A.has(k)).map(k=>bmap.get(k))};}
 g.ObsidianBlend={key,keyOf,exportProfile,compare};})(window);
