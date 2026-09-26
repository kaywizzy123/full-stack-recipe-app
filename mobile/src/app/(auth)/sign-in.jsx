import { View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSignIn } from "@clerk/expo/legacy";

const SignInScreen = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Sign in failed. Please try again");
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.message || "Sign in failed");
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>SignInScreen</Text>
    </View>
  );
};

export default SignInScreen;
