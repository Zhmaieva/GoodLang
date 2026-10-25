# GoodLang native wrapper

This Expo app embeds a self-contained production build of `../web` in a native WebView. It preserves the website's local storage, cookie-consent UI, Google Analytics, and Meta Pixel behavior.

The mobile practice page owns a bounded exercise screen with separate prompt and answer scrollers. It sends `goodlang:practice-screen` messages to the wrapper: iOS keyboard avoidance resizes the WebView, the status-bar inset stays outside it, and native WebView scrolling is disabled for this screen to prevent focus from panning the whole page. The actual frame height is exposed as `--native-viewport-height`; other pages keep ordinary native scrolling.

Use the web `reloadApp()` service for document refreshes (including language changes). Its `goodlang:reload` message remounts the bundled HTML while restoring the current route, query, and hash. Calling `window.location.reload()` inside the HTML-backed WebView can load the hosted website instead. Retries and iOS content-process recovery also remount the bundle. Local storage and account cookies remain in the shared WebView data store.

Run the embedded reload regression checks with `node --test test/embeddedReload.test.mjs` from this directory.

It targets Expo SDK 57, matching the current Expo Go client, and requires Node.js 22.13 or newer.

On iOS, App Tracking Transparency is requested before the WebView loads. If tracking is denied, the embedded website will not initialize Meta Pixel. Its regular cookie-consent choice is still required before any web analytics initialize.

## Run

```sh
npm install
npm start
```

`npm start`, `npm run ios`, and `npm run android` rebuild `src/generated/webBundle.js` automatically. To refresh only the embedded website, run:

```sh
npm run sync:web
```

The native build targets `https://api.goodlang.app` for API requests. Override it for a test build with `GOODLANG_API_BASE_URL` when running `npm run sync:web`.

The bundle identifiers are `com.beampie.goodlang`. Add an EAS project ID to `app.json` after creating the GoodLang project in the Expo account.
