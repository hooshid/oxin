<script setup lang="ts">
import type IMenu from "../../../types/IMenu";

defineProps<{
  /**
   * Menus
   */
  menus: Array<IMenu>;

  /**
   * Base url -> set as prefix of url
   */
  baseUrl: string;

  /**
   * Menu level
   */
  level: number;
}>();
</script>

<template>
  <!-- Menu Loops -->
  <template v-for="item in menus" :key="item.id">
    <li>
      <RouterLink :to="baseUrl + '/' + item.url">
        <v-icon class="ml-2">{{ item.icon }}</v-icon>
        <span class="ml-auto">{{ item.title }}</span>
        <v-icon v-if="item.children && item.children.length">
          mdi-chevron-down
        </v-icon>
      </RouterLink>

      <ul
        v-if="item.children && item.children.length"
        :class="'menu menu-level-' + (level + 1)"
      >
        <NavigationList
          :menus="item.children"
          :base-url="baseUrl + '/' + item.url"
          :level="level + 1"
        />
      </ul>
    </li>
  </template>
</template>
