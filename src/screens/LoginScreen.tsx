import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/client';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      const { accessToken } = response.data;
      login(accessToken);
    } catch (error: any) {
      console.log('Login Error Object:', JSON.stringify(error, null, 2));

      const message = error.response?.data?.message
                      || '서버에 연결할 수 없거나 로그인 정보가 올바르지 않습니다.';

      Alert.alert('로그인 실패', message);
    }
  };

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="이메일"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="비밀번호"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
      >
        로그인
      </Button>
      <Button
        mode="text"
        onPress={goToSignUp}
        style={styles.button}
      >
        회원가입
      </Button>
    </View>
  );
};

// styles는 이전과 동일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default LoginScreen;