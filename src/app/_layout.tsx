import { initDB } from "@/database/db";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Login" }} />
    </Stack>
  );
}
