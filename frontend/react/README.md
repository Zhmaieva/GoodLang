# GoodLang native wrapper

This Expo app embeds a self-contained production build of `../web` in a native WebView. It preserves the website's local storage, cookie-consent UI, Google Analytics, and Meta Pixel behavior.

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
