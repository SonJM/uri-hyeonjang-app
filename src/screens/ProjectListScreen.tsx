import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { 
  ActivityIndicator, 
  Text, 
  List, 
  Button, 
  FAB,
  TextInput,
  Card,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { Project } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ProjectList'>;

const ProjectListScreen = ({ navigation }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets(); // 훅을 호출하여 안전 영역 값을 가져온다
  const [inviteCode, setInviteCode] = useState(''); // 초대 코드 입력을 위한 state
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<Project[]>('/projects');
      setProjects(response.data);
    } catch (err: any) {
      setError('프로젝트 목록을 불러오는 데 실패했습니다.');
      Alert.alert('오류', '프로젝트 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 화면이 처음 렌더링될 때 프로젝트 목록을 불러옵니다.
  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects])
  );

    const handleJoinProject = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('오류', '초대 코드를 입력해주세요.');
      return;
    }
    try {
      await apiClient.post('/invitations/join', { code: inviteCode });
      Alert.alert('성공', '작업방에 성공적으로 참여했습니다!');
      setInviteCode(''); // 입력창 비우기
      fetchProjects(); // 목록 새로고침
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        '작업방 참여에 실패했습니다. 코드를 확인해주세요.';
      Alert.alert('오류', message);
    }
  };

  // 로딩 중일 때 로딩 스피너를 보여줍니다.
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 에러가 발생했을 때 에러 메시지와 재시도 버튼을 보여줍니다.
  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <Button onPress={fetchProjects}>재시도</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="초대 코드 입력"
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="none"
          />
          <Button
            mode="contained"
            onPress={handleJoinProject}
            style={{ marginTop: 10 }}
          >
            작업방 참여하기
          </Button>
        </Card.Content>
      </Card>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            left={(props) => <List.Icon {...props} icon="folder" />}
            onPress={() => 
              navigation.navigate('PostList', {
                projectId: item.id,
                projectName: item.name,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>참여 중인 작업방이 없습니다.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      />
      <FAB
        style={[styles.fab, { bottom: insets.bottom }]}
        icon="plus"
        onPress={() => navigation.navigate('CreateProject')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});

export default ProjectListScreen;