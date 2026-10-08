/* DSA map: PlaylistList powers playlist editing and play order; Stack powers recently played/Previous; Queue powers Up Next; cardGrid maps focusable card layouts; spectrogram stores time x frequency samples; kmp/wildcard power local search; lyricSearch locates the active lyric line. */
(function(global){'use strict';
  class Node {
    // Keep both neighbors so insertions and removals stay bidirectional.
    constructor(value){this.value=value;this.prev=null;this.next=null;}
  }
  class PlaylistList {
    // Build a linked playlist once from saved or newly supplied tracks.
    constructor(items=[]){this.head=null;this.tail=null;this.current=null;this.length=0;items.forEach(x=>this.add(x));}
    // Append so playlist order stays predictable when songs are added.
    add(value){const n=new Node(value);if(!this.head)this.head=this.tail=n;else{n.prev=this.tail;this.tail.next=n;this.tail=n;}this.length++;if(!this.current)this.current=n;return n;}
    // Remove by stable song id so duplicate titles remain distinct.
    remove(id){let n=this.head;while(n){if(n.value.id===id){if(n.prev)n.prev.next=n.next;else this.head=n.next;if(n.next)n.next.prev=n.prev;else this.tail=n.prev;if(this.current===n)this.current=n.next||n.prev||null;this.length--;return n.value;}n=n.next;}return null;}
    // Find a node without copying the playlist.
    find(id){let n=this.head;while(n){if(n.value.id===id)return n;n=n.next;}return null;}
    // Set playback position by id and return the chosen node.
    setCurrent(id){this.current=this.find(id)||this.current;return this.current;}
    // Move through the list with wrap-around for continuous playback.
    step(direction){if(!this.current)this.current=this.head;else this.current=direction>0?(this.current.next||this.head):(this.current.prev||this.tail);return this.current;}
    // Convert nodes into a plain array for rendering and persistence.
    toArray(){const a=[];let n=this.head;while(n){a.push(n.value);n=n.next;}return a;}
  }
  class Stack{
    // Start an empty history stack so new plays define Previous navigation.
    constructor(){this.items=[];}
    push(v){this.items.push(v);}
    // Pop the most recent item so history can drive backward playback.
    pop(){return this.items.pop()||null;}
    // Return latest-first history without changing it.
    toArray(){return this.items.slice().reverse();}}
  class Queue{
    // Start empty so requested tracks are consumed in the order enqueued.
    constructor(){this.items=[];}
    enqueue(v){this.items.push(v);}
    // Dequeue the next requested song before normal play order resumes.
    dequeue(){return this.items.shift()||null;}
    // Remove a queued song by id for queue management.
    remove(id){this.items=this.items.filter(x=>x.id!==id);}
    // Clear pending tracks when starting a fresh play selection.
    clear(){this.items=[];}
    // Return a safe copy for queue rendering.
    toArray(){return this.items.slice();}}
  function kmp(text,pattern){text=String(text).toLowerCase();pattern=String(pattern).toLowerCase();if(!pattern)return 0;const lps=new Array(pattern.length).fill(0);for(let i=1,len=0;i<pattern.length;){if(pattern[i]===pattern[len])lps[i++]=++len;else if(len)len=lps[len-1];else lps[i++]=0;}for(let i=0,j=0;i<text.length;){if(text[i]===pattern[j]){i++;j++;if(j===pattern.length)return i-j;}else if(j)j=lps[j-1];else i++;}return -1;}
  // Expand * wildcards safely before using the regular-expression matcher.
  function wildcardMatch(text,query){const esc=String(query).toLowerCase().replace(/[.+?^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*');return new RegExp(esc).test(String(text).toLowerCase());}
  // Use KMP for literal queries and the wildcard matcher only when needed.
  function searchMatch(text,q){return q.includes('*')?wildcardMatch(text,q):kmp(text,q)>=0;}
  // Build rows x columns so keyboard arrows can move within visible card grids.
  function cardGrid(cards,cols){const rows=[];for(let i=0;i<cards.length;i+=cols)rows.push(cards.slice(i,i+cols));return rows;}
  // Shift time samples into a fixed rolling time x frequency matrix.
  function rollSpectrogram(matrix,sample,maxRows=32){matrix.push(sample);while(matrix.length>maxRows)matrix.shift();return matrix;}
  // Binary search sorted lyric timestamps for the last line at or before time.
  function lyricSearch(lines,time){let lo=0,hi=lines.length-1,ans=-1;while(lo<=hi){const mid=(lo+hi)>>1;if(lines[mid].time<=time){ans=mid;lo=mid+1;}else hi=mid-1;}return ans;}
  global.ObsidianDS={PlaylistList,Stack,Queue,kmp,wildcardMatch,searchMatch,cardGrid,rollSpectrogram,lyricSearch};
})(window);
