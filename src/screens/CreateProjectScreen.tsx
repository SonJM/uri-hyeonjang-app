import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import apiClient from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProject'>;

const CreateProjectScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');

  const handleCreateProject = async () => {
    if (!name.trim()) {
      Alert.alert('오류', '작업방 이름을 입력해주세요.');
      return;
    }

    try {
      await apiClient.post('/projects', { name });
      Alert.alert('성공', '새로운 작업방이 생성되었습니다.');
      navigation.goBack(); // 성공 시 이전 화면(프로젝트 목록)으로 돌아가기
    } catch (error) {
      Alert.alert('오류', '작업방 생성에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TextInput
          label="작업방 이름"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleCreateProject}>
          생성하기
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default CreateProjectScreen;