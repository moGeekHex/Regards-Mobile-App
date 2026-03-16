import analytics from "@react-native-firebase/analytics";
import { Alert } from "react-native";

export const appEvents = async ({
    eventName = "",
    payload = {}
}) => {
    try {
        await analytics().logEvent(eventName, payload)
        console.log("event captured done")
    } catch (error) {
        Alert.alert("events not capture")
    }
}

export const setUserId = async (id) => {
    try {
        await analytics().setUserId(id ? String(id) : null);
        console.log("user id set done")
    } catch (error) {
        console.log("user id not set")
    }
}

export const setUserProperty = async (name, value) => {
    try {
        await analytics().setUserProperty(name, value ? String(value) : null);
        console.log("user property set done")
    } catch (error) {
        console.log("user property not set")
    }
}