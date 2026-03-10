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