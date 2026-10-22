import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { AppState } from "react-native";

AppState.addEventListener("change", (s) =>
  focusManager.setFocused(s === "active"),
);
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((s) =>
    setOnline(s.isConnected !== false && s.isInternetReachable !== false),
  ),
);
