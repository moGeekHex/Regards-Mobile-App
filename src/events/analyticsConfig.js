/**
 * Mobile analytics destination (single source of truth).
 *
 * All iOS + Android Firebase Analytics traffic MUST go to Firebase project
 * `regards-971d6`, which is linked in Google to GA4 property:
 *   "Regards iOS and Android" (property id 350206937)
 *
 * Do NOT send mobile events to web Measurement IDs:
 *   - G-P86C8EVWMN  → www.regards.sa (web only)
 *   - G-YF048C5RPN  → Firebase web app stream (not the mobile apps)
 *
 * Native RN Firebase uses GoogleService-Info.plist / google-services.json
 * (GOOGLE_APP_ID) — there is intentionally no web gtag Measurement ID here.
 */
export const MOBILE_ANALYTICS = Object.freeze({
  firebaseProjectId: 'regards-971d6',
  ga4PropertyName: 'Regards iOS and Android',
  ga4PropertyId: '350206937',
  iosAppId: '1:283895874170:ios:cf1e9e9aaa07110d30f1c3',
  androidAppId: '1:283895874170:android:3916d60de41f2d8030f1c3',
  androidPackageName: 'com.regards',
  iosBundleId: 'com.regards',
  // Explicit denylist — never configure these in the mobile app
  webOnlyMeasurementIds: Object.freeze(['G-P86C8EVWMN', 'G-YF048C5RPN']),
});
