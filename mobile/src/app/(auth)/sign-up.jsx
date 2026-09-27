import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSignUp } from "@clerk/expo/legacy";
import { Image } from "expo-image";

import { authStyles } from "../../../assets/styles/auth.styles";
import { COLORS } from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from "./verify-email";

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    if (!isLoaded) return;
    setLoading(true);

    try {
      await signUp.create({ emailAddress: email.trim(), password });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);

      // router.push({
      //   pathname: "/(auth)/verify-email",
      //   params: { email: email.trim() },
      // });
    } catch (error) {
      Alert.alert(
        "Error",
        error.errors?.[0]?.message || "Failed to create account",
      );
      console.log(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification)
    return (
      <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />
    );

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? undefined : "height"}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>
            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {/* Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Sign in Link  */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.back()}
            >
              <Text style={authStyles.linkText}>
                Already have an account?{" "}
                <Text style={authStyles.link}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
