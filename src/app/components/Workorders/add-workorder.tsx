import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { addWorkorder, getWorkorders } from "../../../../database/db";

export default function AddWorkorder() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Add workorder" });
  }, [navigation]);

  const [city, setCity] = useState("");
  const [device, setDevice] = useState("");
  const [problemCode, setProblemCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onSave = () => {
    setError("");
    if (!city.trim() || !device.trim() || !name.trim()) {
      setError("Please fill City, Device and Name.");
      return;
    }

    const existing = getWorkorders().find((w: any) => {
      return (
        w.city?.trim().toLowerCase() === city.trim().toLowerCase() &&
        w.device?.trim().toLowerCase() === device.trim().toLowerCase() &&
        w.customerName?.trim().toLowerCase() === name.trim().toLowerCase()
      );
    });

    if (existing) {
      setError(`Not saved: ${device} already added for ${name}`);
      return;
    }

    addWorkorder(
      city.trim(),
      device.trim(),
      problemCode.trim(),
      name.trim(),
      "",
    );

    router.back();
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarActions}>
          <Pressable style={styles.toolbarButton} onPress={onSave}>
            <Text style={styles.toolbarButtonText}>V Save</Text>
          </Pressable>
          <Pressable style={styles.toolbarButton} onPress={onCancel}>
            <Text style={styles.toolbarButtonText}>X Cancel</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Device"
            value={device}
            onChangeText={setDevice}
          />
          <TextInput
            style={styles.input}
            placeholder="Problem code"
            value={problemCode}
            onChangeText={setProblemCode}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f6f8" },
  toolbar: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#fffff",
  },
  toolbarActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toolbarButton: {
    backgroundColor: "#243042",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  toolbarButtonText: { color: "#fff", fontWeight: "700" },
  content: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorText: { color: "#b91c1c", marginTop: 8 },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
});
