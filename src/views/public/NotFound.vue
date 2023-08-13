<template>
  <v-row justify="center" align="center" align-content="center" no-gutters>
    <div class="ml-12 hidden-sm-and-down">
      <img src="../../assets/images/errors/404.svg" alt="Page Not Found" />
    </div>
    <div class="text-center">
      <h1 class="text-h1">404</h1>
      <h2 class="my-6">صفحه ای که شما به دنبال آن بودید یافت نشد!</h2>
      <div class="mt-6">
        <v-btn color="primary" :to="{ name: 'home' }">صفحه نخست</v-btn>
      </div>
    </div>
  </v-row>
</template>
