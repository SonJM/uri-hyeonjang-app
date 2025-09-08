import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { Post } from '../types';

import PostDetailScreen from '../screens/PostDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProjectListScreen from '../screens/ProjectListScreen';
import PostListScreen from '../screens/PostListScreen';
import CreateProjectScreen from '../screens/CreateProjectScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

// TypeScript를 위한 타입 정의
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ProjectList: undefined;
  PostList: { projectId: number, projectName: string };
  PostDetail: { post: Post }; // PostDetail 스크린과 전달할 파라미터 타입 정의
  CreateProject: undefined; // 파라미터가 필요 없으므로 undefined
  CreatePost: { projectId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthenticated ? (
            <>
              <Stack.Screen 
                name="ProjectList" 
                component={ProjectListScreen} 
                options={{ title: '내 작업방' }} 
              />
              <Stack.Screen 
                name="PostList" 
                component={PostListScreen} 
              />
              <Stack.Screen 
                name="PostDetail" 
                component={PostDetailScreen} 
                options={{ title: '게시물 상세' }} // 헤더 제목 설정 
              />
              <Stack.Screen 
                name="CreateProject"
                component={CreateProjectScreen}
                options={{ title: '새 작업방 생성' }}
              />
              <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={{ title: '새 게시물 작성' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ title: '로그인' }} 
              />
              <Stack.Screen 
                name="SignUp" 
                component={SignUpScreen} 
                options={{ title: '회원가입' }} 
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;