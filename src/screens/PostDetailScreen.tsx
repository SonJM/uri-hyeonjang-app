import React from 'react';
import { ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

const PostDetailScreen = ({ route }: Props) => {
  const { post } = route.params; // 전달받은 post 객체

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card>
          <Card.Cover source={{ uri: post.imageUrl }} />
          <Card.Content style={styles.content}>
            <Text variant="bodyMedium">{post.content}</Text>
            <Text variant="bodySmall" style={styles.author}>
              작성자: {post.author.email}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 16,
  },
  author: {
    marginTop: 16,
    color: 'grey',
  },
});

export default PostDetailScreen;