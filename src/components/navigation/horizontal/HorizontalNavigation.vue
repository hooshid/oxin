<script setup lang="ts">
import type IMenu from "../../../types/IMenu";
import NavigationList from "./NavigationList.vue";

/**
 * Props
 */
defineProps<{
  /**
   * Menus data
   */
  menus: Array<IMenu>;
}>();
</script>

<template>
  <div class="horizontal-menu">
    <v-container fluid class="pa-0 max-width-in-boxed-mode">
      <ul class="horizontal-navigation">
        <NavigationList :menus="menus" :level="0" base-url="" />
      </ul>
    </v-container>
  </div>
</template>
