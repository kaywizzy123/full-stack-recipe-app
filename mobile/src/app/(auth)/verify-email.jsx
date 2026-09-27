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
import { useState } from "react";
import { useSignUp } from "@clerk/expo/legacy";
import { Image } from "expo-image";

import { authStyles } from "../../../assets/styles/auth.styles";
import { COLORS } from "../../../constants/colors";

const VerifyEmail = ({ email, onBack }) => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerification = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    if (!isLoaded) return;
    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Verification failed. Please try again");
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.message || "Verification failed");
      console.log(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) return;
    setResending(true);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Code sent", `A new code has been sent to ${email}`);
    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.message || "Failed to resend code");
      console.log(JSON.stringify(error, null, 2));
    } finally {
      setResending(false);
    }
  };

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
              source={require("../../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>
            We&apos;ve sent a verification code to {email}
          </Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>
            {/* Code Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                maxLength={6}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>

            {/* Resend Code */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={handleResend}
              disabled={resending}
            >
              <Text style={authStyles.linkText}>
                Didn&apos;t get a code?{" "}
                <Text style={authStyles.link}>
                  {resending ? "Sending..." : "Resend"}
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Back to Sign Up */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.link}>Back to Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
