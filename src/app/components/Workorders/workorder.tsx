import Checkbox from "expo-checkbox";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getUserById, getWorkorders } from "../../../../database/db";

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

export default function Workorder() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Workorders" });
  }, [navigation]);

  const params = useLocalSearchParams<{ userId?: string | string[] }>();
  const [workorders, setWorkorders] = useState<Workorder[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const rawUserId = params.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
    if (userId) setUser(getUserById(Number(userId)));
    setWorkorders(getWorkorders());
  }, [params.userId]);

  useEffect(() => {
    const unsub = navigation.addListener?.("focus", () => {
      setWorkorders(getWorkorders());
    });
    return unsub;
  }, [navigation]);

  const displayName = useMemo(() => {
    const firstName = user?.firstName ?? "";
    const lastName = user?.lastName ?? "";
    return `${firstName} ${lastName}`.trim() || "Field worker";
  }, [user]);

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarActions}>
          <Pressable
            style={styles.toolbarButton}
            onPress={() => router.push("/components/Workorders/add-workorder")}
          >
            <Text style={styles.toolbarButtonText}>Add workorder</Text>
          </Pressable>
          <Pressable
            style={styles.toolbarButton}
            onPress={() => router.replace("/components/Home/home")}
          >
            <Text style={styles.toolbarButtonText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeName}>Welcome, {displayName}</Text>
        </View>

        <Text style={styles.sectionTitle}>Work order list</Text>
        <Text style={styles.sectionSubtitle}>
          No fixed order is applied. Choose the route that fits your day.
        </Text>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cityCell, styles.headerText]}>City</Text>
            <Text style={[styles.deviceCell, styles.headerText]}>Device</Text>
            <Text style={[styles.problemCell, styles.headerText]}>Code</Text>
            <Text style={[styles.nameCell, styles.headerText]}>Name</Text>
            <Text style={[styles.processedCell, styles.headerText]}>
              Processed
            </Text>
          </View>

          {workorders
            .filter(
              (item) => typeof item === "object" && item !== null && item.city,
            )
            .map((item, index) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.row,
                  index % 2 === 1 && styles.altRow,
                  pressed && styles.rowPressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/components/Workorders/detail-workorder",
                    params: { id: String(item.id) },
                  })
                }
              >
                <Text style={styles.cityCell}>{item.city}</Text>
                <Text style={styles.deviceCell}>{item.device}</Text>
                <Text style={styles.problemCell}>{item.problemCode}</Text>
                <Text style={styles.nameCell}>{item.customerName}</Text>
                <View style={styles.processedCell}>
                  <Checkbox value={Boolean(item.processed)} disabled />
                </View>
              </Pressable>
            ))}

          {workorders.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No work orders available.
              </Text>
            </View>
          )}
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
  },
  toolbarButton: {
    backgroundColor: "#243042",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  toolbarButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  content: { padding: 16, paddingBottom: 32 },
  welcomeCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  welcomeName: { color: "#111827", fontSize: 22, fontWeight: "800" },
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
  },
  sectionSubtitle: {
    color: "#6b7280",
    marginTop: 4,
    marginBottom: 12,
    fontSize: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: "#d6dae0",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 44,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  rowPressed: {
    backgroundColor: "#eef4ff",
  },
  headerRow: { backgroundColor: "#e9edf3" },
  altRow: { backgroundColor: "#fafafa" },
  headerText: {
    fontWeight: "800",
    color: "#374151",
    fontSize: 11,
    paddingVertical: 10,
  },
  cityCell: { flex: 1.2, fontSize: 11, color: "#111827", paddingHorizontal: 4 },
  deviceCell: {
    flex: 1.2,
    fontSize: 11,
    color: "#111827",
    paddingHorizontal: 4,
  },
  problemCell: {
    flex: 1,
    fontSize: 11,
    color: "#111827",
    paddingHorizontal: 4,
  },
  nameCell: { flex: 1.8, fontSize: 11, color: "#111827", paddingHorizontal: 4 },
  processedCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  emptyState: { padding: 20 },
  emptyStateText: { color: "#6b7280" },
});
