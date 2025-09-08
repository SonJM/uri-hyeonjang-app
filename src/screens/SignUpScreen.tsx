import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import apiClient from '../api/client';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // --- 클라이언트 측 유효성 검사 ---
    if (!email || !password || !confirmPassword) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await apiClient.post('/api/users/signup', {
        email,
        password,
      });

      Alert.alert('성공', '회원가입이 완료되었습니다. 로그인해주세요.');
      navigation.navigate('Login'); // 성공 시 로그인 화면으로 이동
    } catch (error: any) {
      if (error.response) {
        console.error('Server Error:', error.response.data);
        const message = error.response.data.message || '오류가 발생했습니다.';
        Alert.alert('회원가입 실패', message);
      } else if (error.request) {
        console.error('Network Error:', error.request);
        Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다. baseURL 설정을 확인해주세요.');
      } else {
        console.error('Error:', error.message);
        Alert.alert('오류', '요청 중 문제가 발생했습니다.');
      }
    }
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
      <TextInput
        label="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button 
        mode="contained" 
        onPress={handleSignUp} 
        style={styles.button}
      >
        가입하기
      </Button>
    </View>
  );
};

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

export default SignUpScreen;