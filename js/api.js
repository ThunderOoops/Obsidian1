/* Small no-key catalogs with a session cache; local playback remains independent. */
(function(g){'use strict';const cache=new Map();const timeout=8000;
 async function get(url){if(cache.has(url))return cache.get(url);if(!navigator.onLine)throw new Error('offline');const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),timeout);try{const r=await fetch(url,{signal:ctl.signal});if(!r.ok)throw new Error('Request failed');const data=await r.json();cache.set(url,data);return data;}finally{clearTimeout(timer);}}
 const esc=s=>encodeURIComponent(s);
 async function audius(path){const d=await get('https://api.audius.co/v1/'+path+(path.includes('?')?'&':'?')+'app_name=OBSIDIAN');return d.data||[];}
 function mapAudius(t){return{id:'audius:'+t.id,title:t.title||'Untitled',artist:t.user?.name||'Audius artist',art:t.artwork?.['480x480']||t.artwork?.['150x150']||'',duration:t.duration||0,source:'audius',remote:true,stream:'https://api.audius.co/v1/tracks/'+encodeURIComponent(t.id)+'/stream?app_name=OBSIDIAN',genre:t.genre||'Music'};}
 function mapITunes(t){return{id:'itunes:'+t.trackId,title:t.trackName||'Untitled',artist:t.artistName||'iTunes artist',art:(t.artworkUrl100||'').replace('100x100','600x600'),duration:Math.round((t.trackTimeMillis||0)/1000),source:'itunes',remote:true,stream:t.previewUrl||'',genre:t.primaryGenreName||'Music'};}
 async function search(q){try{const a=await audius('tracks/search?query='+esc(q));if(a.length)return a.map(mapAudius);}catch(e){}const d=await get('https://itunes.apple.com/search?term='+esc(q)+'&media=music&limit=25');return(d.results||[]).filter(x=>x.previewUrl).map(mapITunes);}
 async function trending(genre=''){try{const list=await audius('tracks/trending'+(genre?'?genre='+esc(genre):''));if(list.length)return list.map(mapAudius);}catch(e){}const d=await get('https://itunes.apple.com/search?term='+esc(genre||'popular music')+'&media=music&limit=25');return(d.results||[]).filter(x=>x.previewUrl).map(mapITunes);}
 g.ObsidianAPI={search,trending,cache};
})(window);
