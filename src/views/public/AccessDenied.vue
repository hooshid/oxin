<template>
  <v-row justify="center" align="center" align-content="center" no-gutters>
    <div class="ml-12 hidden-sm-and-down">
      <img src="../../assets/images/errors/403.svg" alt="Access Denied" />
    </div>
    <div class="text-center">
      <h1 class="text-h1">403</h1>
      <h2 class="my-6">متاسفانه شما حق دسترسی به این صفحه را ندارید!</h2>
      <div class="mt-6">
        <v-btn color="primary" :to="{ name: 'home' }">صفحه نخست</v-btn>
      </div>
    </div>
  </v-row>
</template>
