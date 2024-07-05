<template>
  <div>
    <v-card class="mb-6">
      <v-card-title>Welcome to our logistics project!!</v-card-title>
      <v-card-text>All the best for your new project.</v-card-text>
      <v-card-text>
        Let's get into
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
        >
          our project
        </a>
        to start!
      </v-card-text>
    </v-card>

    <h1>Query 파라미터 값은? : {{ token }}</h1>
    <h1>로컬 스토리지에 저장된 Authorization 토큰 값은? : {{ localStorageToken }}</h1>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import VueCookies from 'vue-cookies';

export default defineComponent({
  data() {
    return {
      token: '',
      localStorageToken: '',
    };
  },
  mounted() {
    // 쿠키에서 Authorization 토큰을 가져옵니다.
    const token = VueCookies.get('Authorization');
    console.log('token', token)
    if (token) {
      // 토큰이 있으면 로컬 스토리지에 저장합니다.
      localStorage.setItem('token', token);
      this.token = token; // 토큰을 data에 설정합니다.
    }

    this.getLocalStorageToken(); // 로컬 스토리지에서 토큰 값을 가져옵니다.
  },
  methods: {
    getLocalStorageToken() {
      this.localStorageToken = localStorage.getItem('token');
    },
  },
});
</script>

<style scoped>
/* 컴포넌트에만 적용되는 CSS 스타일링 */
</style>
