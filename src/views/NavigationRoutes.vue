<script setup lang="ts">
import type IMenu from "../types/IMenu";
import { ref } from "vue";
import { useRoute } from "vue-router";

const routes = ref<IMenu>(useRoute().meta.module as IMenu);
</script>

<template>
  <v-container fluid>
    <h1>{{ useRoute().meta.title }}</h1>

    <v-row class="mt-4">
      <v-col
        v-for="i in routes.children"
        :key="i.id"
        lg="2"
        md="3"
        sm="4"
        cols="6"
      >
        <v-card
          rounded="lg"
          flat
          class="d-flex align-center justify-center text-center pa-2"
          :to="useRoute().path + '/' + i.url"
        >
          <div class="text-subtitle-1">
            <v-icon v-show="i.icon" :icon="i.icon" size="45" />
            <div class="text-subtitle-1 font-weight-bold mt-2">
              {{ i.title }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
