<script setup lang="ts">
import { useAppStore } from "../../stores/app";
</script>

<template>
  <v-snackbar
    v-model="useAppStore().$state.notification.show"
    v-bind="useAppStore().$state.notification"
  >
    {{ useAppStore().$state.notification.text }}

    <template #actions>
      <v-btn
        icon="mdi-close"
        @click="useAppStore().$state.notification.show = false"
      />
    </template>
  </v-snackbar>
</template>
