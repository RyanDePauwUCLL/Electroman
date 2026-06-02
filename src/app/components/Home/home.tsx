import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { getUserByUsername } from "../../../../database/db";

export default function Home() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Login" });
  }, [navigation]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const onLogin = (data: any) => {
    // Zoek en neemt gebruiker op basis van username in de db
    const user = getUserByUsername(data.username);

    // als de ingevoerde wachtwoord niet matcht met de ww van de db --> bericht dat het niet correct is
    if (!user || user.password !== data.password) {
      setSuccess(false);
      setMessage("Username password incorrect!");
      return;
    }

    // als hij gevonden heeft "success op true" en een bericht dat het succesvoll was
    setSuccess(true);
    setMessage("Login successfull!");

    setTimeout(() => {
      router.replace({
        pathname: "/components/Workorders/workorder",
        params: { userId: user.id },
      });
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter username"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
        )}
      />

      {message && (
        <Text style={{ color: success ? "green" : "red", marginBottom: 12 }}>
          {message}
        </Text>
      )}

      <Button title="Login" onPress={handleSubmit(onLogin)} />
      <Text></Text>
      <Button
        title="Create account"
        onPress={() => router.push("/components/RegisterPage/register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    display: "flex",
    margin: 50,
  },
});
