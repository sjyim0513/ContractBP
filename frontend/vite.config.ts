import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      VITE_ALCHEMY_API_KEY: process.env.VITE_ALCHEMY_API_KEY,
      VITE_PRIVATE_KEY: process.env.VITE_PRIVATE_KEY,
    },
  },
});
