# Obsidian

Obsidian is an offline-first playlist manager made with plain HTML, CSS, and JavaScript for a C++ and data-structures course. Its browser edition opens directly from `index.html`; the companion console exercise is in `cpp/playlist_manager.cpp`.

## Run it

1. Open `index.html` in a modern browser. There is no build step, server, or account.
2. In **My Music**, choose **Add files** or **Add folder**. Chromium browsers support the folder picker. The browser reads the selected files locally; it does not upload them.
3. For synced lyrics, keep an `.lrc` file beside its audio file with the same base filename, such as `Mira Sol - Sunroom.mp3` and `Mira Sol - Sunroom.lrc`.

The `music/` folder is provided as an optional place to organize your own files. Browsers do not automatically scan a folder next to the page, so use the Add folder picker to select it.

## Music sources

Local files work offline. Online discovery uses the public Audius trending/search endpoints and the iTunes Search API; Audius is tried first and iTunes previews are the fallback. Results are cached in memory for the current page session. iTunes provides 30-second previews. Network availability and browser CORS rules can affect online results.

## Data structures in the project

| Topic | File / class | Use |
|---|---|---|
| Doubly linked list | `js/ds.js`, `PlaylistList`; C++ `Playlist` | Ordered playlists and active play order, including next/previous wraparound |
| Stack | `js/ds.js`, `Stack`; C++ `std::stack` | Recent plays and Previous navigation |
| Queue | `js/ds.js`, `Queue`; C++ `std::queue` | Songs selected to play before normal order |
| Map | `js/app.js` library/playlists; `js/api.js` cache; C++ `std::map` | Stable lookup of tracks, playlists, and fetched responses |
| Set | likes and collections in `js/app.js`; Blend in `js/blend.js`; C++ `std::set` | Unique liked IDs and profile intersection/union |
| KMP | `js/ds.js`, `kmp`; C++ `kmp` | Literal local search without built-in substring matching |
| Wildcards | `js/ds.js`, `wildcardMatch` | `*` search, for example `lo*fi` |
| 2D arrays | `cardGrid`, rolling spectrogram in `js/audio.js`; C++ vector grid | Arrow-key card navigation and time-by-frequency visual samples |
| Binary search | `lyricSearch` in `js/ds.js` | Find the current timestamped lyric line efficiently |
| Regex | `js/app.js`, `js/lyrics.js` | Filename metadata parsing and LRC timestamp parsing |

## Limits

- Spatial Sound is a browser effect; it is not Dolby Atmos, a licensed format a browser cannot decode.
- Some online tracks may not spatialise because their source blocks Web Audio through CORS. They still play normally.
- iTunes previews are 30 seconds. Audius full-length availability depends on its public catalog and network access.
- `webkitdirectory` is supported by Chromium browsers; other browsers may offer file selection only.
- ID3 USLT extraction is a small best-effort ID3v2 reader. Sidecar and pasted LRC are the dependable lyric paths.
- Browser file handles and object URLs last for the current page session; reselect local files after reopening the page.
- The visualizer is a lightweight animated spectrum illustration rather than a scientific frequency analysis.

## Why use this instead of Spotify?

It plays files you already own, has no ads or account, keeps lyrics and Blend available offline, exports portable playlists, and makes the playlist/search logic easy to explain in a viva.

## Compile the C++ edition

```sh
g++ -std=c++17 -Wall -Wextra cpp/playlist_manager.cpp -o playlist_manager
```
