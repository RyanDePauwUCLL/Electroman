import { zodResolver } from "@hookform/resolvers/zod";
import { router, Stack } from "expo-router";
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
import { z } from "zod";
import { createUser } from "../../../../database/db.js";

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  dob: z.string().trim().min(1, "Date of birth is required"),
  municipality: z.string().trim().min(1, "Municipality is required"),
  postalcode: z.string().trim().min(1, "Postalcode is required"),
  street: z.string().trim().min(1, "Street is required"),
  housenr: z.string().trim().min(1, "Housenr is required"),
  box: z.string().trim().min(1, "Box is required"),
  username: z.string().trim().min(5, "Username must be at least 5 characters"),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
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
    resolver: zodResolver(registerSchema),
  });

  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = (data: any) => {
    if (!agree) {
      setMessage("Please agree to the terms");
      return;
    }
    try {
      setMessage("");
      createUser(
        data.firstName,
        data.lastName,
        data.username,
        data.password,
        data.dob,
        data.municipality,
        data.postalcode,
        data.street,
        data.housenr,
        data.box,
      );

      console.log("Register data:", { ...data, agree });
      router.replace("/components/Home/home");
    } catch (e) {
      setMessage("Username already exists.");
    }
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
      {errors.firstName && (
        <Text style={styles.error}>{errors.firstName.message}</Text>
      )}

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
      {errors.lastName && (
        <Text style={styles.error}>{errors.lastName.message}</Text>
      )}

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
      {errors.dob && <Text style={styles.error}>{errors.dob.message}</Text>}

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
      {errors.municipality && (
        <Text style={styles.error}>{errors.municipality.message}</Text>
      )}

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
      {errors.postalcode && (
        <Text style={styles.error}>{errors.postalcode.message}</Text>
      )}

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
      {errors.street && (
        <Text style={styles.error}>{errors.street.message}</Text>
      )}

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
          {errors.housenr && (
            <Text style={styles.error}>{errors.housenr.message}</Text>
          )}
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
          {errors.box && <Text style={styles.error}>{errors.box.message}</Text>}
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
      {errors.username && (
        <Text style={styles.error}>{errors.username.message}</Text>
      )}

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
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

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

      <Text style={{ color: "red", marginTop: 10 }}>{message}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  field: {
    marginBottom: 6,
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
  error: {
    color: "#d00",
    marginTop: 2,
    marginBottom: 6,
    fontSize: 12,
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
