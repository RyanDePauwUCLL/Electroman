import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getWorkorderById, saveRepairInfo } from "../../../../database/db.js";

type Workorder = {
  id: number;
  city: string;
  device: string;
  problemCode: string;
  customerName: string;
  processed: number;
  detailedProblemDescription?: string;
  repairInformation?: string;
};

export default function WorkorderDetail() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const workorderId = useMemo(() => {
    const rawId = params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    return id ? Number(id) : NaN;
  }, [params.id]);

  const [workorder, setWorkorder] = useState<Workorder | null>(null);
  const [repairInformation, setRepairInformation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [flow, setFlow] = useState<"list" | "readonly" | "reopen">("list");
  const [error, setError] = useState("");

  const loadWorkorder = () => {
    if (Number.isNaN(workorderId)) return;
    const current = getWorkorderById(workorderId) as Workorder | undefined;
    if (!current) return;

    setWorkorder(current);
    setRepairInformation(current.repairInformation ?? "");
    setIsEditing(!current.processed);
    setFlow(current.processed ? "readonly" : "list");
    setError("");
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Workorder detail" });
  }, [navigation]);

  useEffect(() => {
    loadWorkorder();
  }, [workorderId]);

  if (!workorder) {
    return (
      <View style={styles.screen}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarButtonText}>Loading...</Text>
        </View>
      </View>
    );
  }

  const isProcessed = Boolean(workorder.processed);
  const isReadOnly = isProcessed && !isEditing;

  const goBackToOverview = () => {
    router.back();
  };

  const goToReadOnlyMode = () => {
    setRepairInformation(workorder.repairInformation ?? repairInformation);
    setIsEditing(false);
    setFlow("readonly");
    setError("");
    const refreshed = getWorkorderById(workorderId) as Workorder | undefined;
    if (refreshed) {
      setWorkorder(refreshed);
      setRepairInformation(refreshed.repairInformation ?? repairInformation);
    }
  };

  const onSave = () => {
    const trimmed = repairInformation.trim();
    if (!trimmed) {
      setError("Not saved. No repair information was entered");
      return;
    }

    saveRepairInfo(workorder.id, trimmed);
    const refreshed = getWorkorderById(workorderId) as Workorder | undefined;
    if (refreshed) {
      setWorkorder(refreshed);
      setRepairInformation(refreshed.repairInformation ?? trimmed);
    }

    if (flow === "reopen") {
      goToReadOnlyMode();
      return;
    }

    goBackToOverview();
  };

  const onCancel = () => {
    if (flow === "reopen") {
      goToReadOnlyMode();
      return;
    }
    goBackToOverview();
  };

  const onReopen = () => {
    setIsEditing(true);
    setFlow("reopen");
    setError("");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarActions}>
          {isReadOnly ? (
            <Pressable style={styles.toolbarButton} onPress={onReopen}>
              <Text style={styles.toolbarButtonText}>Re-open</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={styles.toolbarButton} onPress={onSave}>
                <Text style={styles.toolbarButtonText}>Save</Text>
              </Pressable>
              <Pressable style={styles.toolbarButton} onPress={onCancel}>
                <Text style={styles.toolbarButtonText}>Cancel</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Detailed problem description:</Text>
          <Text style={styles.problemText}>
            {workorder.detailedProblemDescription ||
              "No description available."}
          </Text>

          <Text style={styles.sectionLabel}>Repair information:</Text>
          <TextInput
            style={[styles.textArea, isReadOnly && styles.textAreaReadOnly]}
            multiline
            numberOfLines={8}
            editable={!isReadOnly}
            value={repairInformation}
            onChangeText={setRepairInformation}
            placeholder="Repair information"
            textAlignVertical="top"
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
    backgroundColor: "#ffffff",
  },
  toolbarActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  toolbarButton: {
    backgroundColor: "#243042",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  toolbarButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionLabel: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 8,
  },
  problemText: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#cfd6df",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  textAreaReadOnly: {
    backgroundColor: "#f8fafc",
    color: "#374151",
  },
  errorText: {
    marginTop: 12,
    color: "#b91c1c",
    fontSize: 13,
  },
});
