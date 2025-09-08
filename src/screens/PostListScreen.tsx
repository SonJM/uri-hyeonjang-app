import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, List, Button, Modal, Portal, PaperProvider, RadioButton, FAB } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import apiClient from '../api/client';
import { Post, Role } from '../types';
import * as Clipboard from 'expo-clipboard';

type Props = NativeStackScreenProps<RootStackParamList, 'PostList'>;

const PostListScreen = ({ route, navigation }: Props) => {
  const { projectId, projectName } = route.params; // 파라미터 받기
  const [userRole, setUserRole] = useState<Role | null>(null);
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.GUEST);
  const [error, setError] = useState<string | null>(null);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

    useEffect(() => {
    // 역할 정보를 가져오는 함수
    const fetchUserRole = async () => {
      try {
        const response = await apiClient.get(`/projects/${projectId}/memberships/me`);
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };
    fetchUserRole();
  }, [projectId]);

  // 화면 헤더 제목을 동적으로 설정
  useEffect(() => {
    navigation.setOptions({
      title: projectName,
      // userRole이 ADMIN일 때만 헤더 버튼을 렌더링
      headerRight: () => 
        userRole === Role.ADMIN ? (
          <Button onPress={showModal}>초대하기</Button>
        ) : null,
    });
  }, [navigation, projectName, userRole]); // userRole이 변경될 때마다 헤더를 다시 그림

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // projectId를 이용해 API 호출
      const response = await apiClient.get<Post[]>(`/projects/${projectId}/posts`);
      setPosts(response.data);
    } catch (err) {
      setError('게시물 목록을 불러오는 데 실패했습니다.');
      Alert.alert('오류', '게시물 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [projectId]);

  const handleGenerateInvite = async () => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/invitations`, {
        role: selectedRole,
      });
      const { code } = response.data;

    Alert.alert(
      '초대 코드 생성 완료',
      `생성된 코드: ${code}`,
      [
        {
          text: '클립보드에 복사',
          onPress: async () => {
            await Clipboard.setStringAsync(code);
            Alert.alert('복사 완료', '초대 코드가 클립보드에 복사되었습니다.');
          },
        },
        {
          text: '닫기',
          style: 'cancel',
        },
      ]
    );
    } catch (error) {
      Alert.alert('오류', '초대 코드 생성에 실패했습니다.');
    } finally {
      hideModal();
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
        <Button onPress={fetchPosts}>재시도</Button>ㄱ
      </View>
    );
  }


  return (
    <PaperProvider>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>어떤 역할로 초대할까요?</Text>
          <RadioButton.Group onValueChange={newValue => setSelectedRole(newValue as Role)} value={selectedRole}>
            <View style={styles.radioItem}>
              <RadioButton value={Role.GUEST} />
              <Text>작업자 (Guest)</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value={Role.ADMIN} />
              <Text>관리자 (Admin)</Text>
            </View>
          </RadioButton.Group>
          <Button mode="contained" onPress={handleGenerateInvite} style={{ marginTop: 20 }}>
            코드 생성하기
          </Button>
        </Modal>
      </Portal>

      <SafeAreaView style={styles.container}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.content}
              description={`작성자: ${item.author.email}`}
              left={(props) => <List.Icon {...props} icon="image" />}
              onPress={() => navigation.navigate('PostDetail', { post: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>작성된 게시물이 없습니다.</Text>
            </View>
          }
        />
        {userRole === Role.ADMIN && (
          <FAB
            style={[styles.fab, { bottom: insets.bottom }]}
            icon="plus"
            onPress={() => navigation.navigate('CreatePost', { projectId })}
          />
        )}
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    margin: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});

export default PostListScreen