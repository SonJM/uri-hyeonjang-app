import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const baseURL = 'http://192.168.219.105:3000'; // expo go 어플로 테스트 진행 시 노트북 - 핸드폰 동일한 와이파이 환경에서 노트북 IP 주소로 설정

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터(검문소) 설정
apiClient.interceptors.request.use(
  (config) => {
    // 요청을 보내기 전에 Zustand 스토어에서 토큰을 가져옵니다.
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;