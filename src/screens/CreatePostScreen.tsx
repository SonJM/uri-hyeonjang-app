import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import apiClient from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreatePostScreen = ({ route, navigation }: Props) => {
  const { projectId } = route.params; // 파라미터로 projectId 받기
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreatePost = async () => {
    if (!content.trim() || !imageUrl.trim()) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    try {
      await apiClient.post(`/projects/${projectId}/posts`, { content, imageUrl });
      Alert.alert('성공', '새로운 게시물이 작성되었습니다.');
      navigation.goBack(); // 성공 시 이전 화면(게시물 목록)으로 돌아가기
    } catch (error) {
      Alert.alert('오류', '게시물 작성에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TextInput
          label="게시물 내용"
          value={content}
          onChangeText={setContent}
          style={styles.input}
          multiline
          numberOfLines={4}
        />
        <TextInput
          label="이미지 URL"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
          autoCapitalize="none"
          placeholder="https://..."
        />
        <Button mode="contained" onPress={handleCreatePost}>
          작성하기
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { padding: 16 },
  input: { marginBottom: 16 },
});

export default CreatePostScreen;