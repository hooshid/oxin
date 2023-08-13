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
   * Is menu root or last child in own group?
   */
  root: boolean;
}>();
</script>

<template>
  <!-- Menu Loops -->
  <template v-for="item in menus">
    <template v-if="item.children && item.children.length">
      <template v-if="root">
        <v-list-group :key="item.id" v-model="item.active" no-action>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="item.title"
              :prepend-icon="item.icon"
            />
          </template>

          <NavigationList
            :menus="item.children"
            :base-url="baseUrl + '/' + item.url"
            :root="false"
          />
        </v-list-group>
      </template>

      <template v-else>
        <v-list-group :key="item.id" no-action sub-group>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="item.title"
              :prepend-icon="item.icon"
            />
          </template>

          <NavigationList
            :menus="item.children"
            :base-url="baseUrl + '/' + item.url"
            :root="false"
          />
        </v-list-group>
      </template>
    </template>

    <template v-else>
      <v-list-item
        :key="item.id"
        :title="item.title"
        :prepend-icon="item.icon"
        :to="{ path: baseUrl + '/' + item.url }"
      />
    </template>
  </template>
</template>
