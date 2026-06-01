import { Stack } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      municipality: "",
      postalcode: "",
      street: "",
      housenr: "",
      box: "",
      username: "",
      password: "",
    },
  });

  const [agree, setAgree] = useState(false);

  const onSubmit = (data: any) => {
    if (!agree) {
      console.log("Please agree to the terms");
      return;
    }
    console.log("Register data:", { ...data, agree });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "Create an account" }} />

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="ex. Dylan"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="ex. Laeren"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="dob"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Date of birth</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="ex 2005-11-6"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="municipality"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Municipality</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="ex. Leuven"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="postalcode"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Postalcode</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="ex. 3000"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="street"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Street</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="ex. Naamsestraat"
            />
          </View>
        )}
      />

      <View style={[styles.row, { marginBottom: 16 }]}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Controller
            control={control}
            name="housenr"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text style={styles.label}>Housenr</Text>
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="ex. 171"
                />
              </View>
            )}
          />
        </View>
        <View style={{ width: 100 }}>
          <Controller
            control={control}
            name="box"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text style={styles.label}>Box</Text>
                <TextInput
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="ex. 0307"
                />
              </View>
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
              autoCapitalize="none"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              secureTextEntry
            />
          </View>
        )}
      />

      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[styles.checkbox, agree && styles.checkboxChecked]}
          onPress={() => setAgree((v) => !v)}
        />
        <Text style={styles.checkboxLabel}>
          I agree to the terms and conditions
        </Text>
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>Create account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#666",
    marginRight: 10,
    borderRadius: 3,
  },
  checkboxChecked: {
    backgroundColor: "#007BFF",
  },
  checkboxLabel: {
    flex: 1,
  },
  submit: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  submitText: {
    color: "#000",
    fontWeight: "600",
  },
});
