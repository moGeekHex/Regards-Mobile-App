import { Platform } from "react-native";
import analytics from "@react-native-firebase/analytics";
import { MOBILE_ANALYTICS } from "./analyticsConfig";

/**
 * GA4 / Firebase rejects events that include null parameter values.
 * Strip null/undefined before logging so purchases are not silently dropped.
 */
const sanitizePayload = (payload = {}) => {
    const clean = {};
    Object.keys(payload || {}).forEach((key) => {
        const value = payload[key];
        if (value === null || value === undefined) return;
        if (Array.isArray(value)) {
            clean[key] = value
                .map((item) =>
                    item && typeof item === "object" ? sanitizePayload(item) : item
                )
                .filter((item) => item !== null && item !== undefined);
            return;
        }
        if (typeof value === "object") {
            clean[key] = sanitizePayload(value);
            return;
        }
        clean[key] = value;
    });
    return clean;
};

const withMobileContext = (payload = {}) =>
    sanitizePayload({
        ...payload,
        // Helps confirm all mobile events land in the iOS+Android property
        regards_analytics_surface: "mobile",
        regards_ga4_property: MOBILE_ANALYTICS.ga4PropertyName,
        regards_platform: Platform.OS,
    });

export const enableAnalyticsCollection = async () => {
    try {
        await analytics().setAnalyticsCollectionEnabled(true);
        await analytics().setDefaultEventParameters({
            regards_analytics_surface: "mobile",
            regards_ga4_property: MOBILE_ANALYTICS.ga4PropertyName,
            regards_firebase_project: MOBILE_ANALYTICS.firebaseProjectId,
        });
        console.log(
            "analytics collection enabled →",
            MOBILE_ANALYTICS.ga4PropertyName,
            MOBILE_ANALYTICS.firebaseProjectId
        );
    } catch (error) {
        console.log("analytics collection enable failed", error?.message || error);
    }
};

export const appEvents = async ({
    eventName = "",
    payload = {}
}) => {
    try {
        if (!eventName) return;
        await analytics().logEvent(eventName, withMobileContext(payload));
        console.log("event captured done", eventName);
    } catch (error) {
        // Never block checkout UX on analytics failures
        console.log("event not captured", eventName, error?.message || error);
    }
};

export const setUserId = async (id) => {
    try {
        await analytics().setUserId(id ? String(id) : null);
        console.log("user id set done");
    } catch (error) {
        console.log("user id not set");
    }
};

export const setUserProperty = async (name, value) => {
    try {
        if (value === null || value === undefined) return;
        await analytics().setUserProperty(name, String(value));
        console.log("user property set done");
    } catch (error) {
        console.log("user property not set");
    }
};
