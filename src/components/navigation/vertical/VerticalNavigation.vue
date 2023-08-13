<script setup lang="ts">
import type IMenu from "../../../types/IMenu";
import { ref, watch, onMounted } from "vue";
import NavigationList from "./NavigationList.vue";

/**
 * Props
 */
const props = defineProps<{
  /**
   * Menus data
   */
  menus: Array<IMenu>;
  
  /**
   * Open|Close state
   */
  state: boolean;
  
  /**
   * Temporary state
   */
  temporary?: boolean;
}>();

/**
 * Emits events
 */
const emit = defineEmits<{
  (e: "status", value: boolean): void;
}>();

/**
 * Status open|close drawer
 */
const status = ref(true);

watch(status, (newStatus) => {
  emit("status", newStatus);
});

/**
 * Status from App & watch changes
 */
watch(
  () => props.state,
  (newStatus) => {
    status.value = newStatus;
  }
);

onMounted(() => {
  /**
   * Set state/status from parent App
   */
  status.value = props.state;
});
</script>

<template>
  <v-navigation-drawer v-model="status" :temporary="temporary" app clipped right width="270">
      <v-list
        class="vertical-navigation"
        density="compact"
        color="primary"
        link
      >
        <NavigationList :menus="menus" :root="true" base-url="" />
      </v-list>
  </v-navigation-drawer>
</template>
