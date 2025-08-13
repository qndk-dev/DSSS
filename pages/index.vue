<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <UCard class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-blue-400">Вход в панель управления</h1>
      <p class="text-center text-gray-400">Авторизуйтесь через Discord, чтобы получить доступ.</p>
      <div class="flex justify-center">
        <UButton
          icon="i-simple-icons-discord"
          size="xl"
          color="blue"
          variant="solid"
          label="Войти через Discord"
          :trailing="false"
          @click="loginWithDiscord"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const loginWithDiscord = () => {
  // Здесь будет логика перенаправления на Discord OAuth2
  console.log('Перенаправление на Discord OAuth2...');
  // Пример URL для авторизации (замените на свои CLIENT_ID и REDIRECT_URI)
  const CLIENT_ID = process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID;
  const REDIRECT_URI = process.env.NUXT_PUBLIC_DISCORD_REDIRECT_URI;
  const SCOPES = 'identify guilds'; // Запрошенные разрешения
  window.location.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`;
};
</script>

<style scoped>
/* Дополнительные стили, если нужны */
</style>
