<script setup lang="ts">
import draggable from "vuedraggable";

defineProps<{
  items: unknown[];
}>();

defineEmits<{
  (e: "clicked", payload: object): void;
}>();

function clone(obj: { value: object }) {
  return JSON.parse(JSON.stringify(obj.value));
}
</script>

<template>
  <v-card flat>
    <v-card-text>
      <v-container class="pa-0">
        <draggable
          class="list-group v-row v-row--dense"
          :list="items"
          :group="{ name: 'blocks', pull: 'clone', put: false }"
          :clone="clone"
          item-key="name"
          :sort="false"
          @mousedown="$emit('clicked')"
        >
          <template #item="{ element }">
            <v-col cols="12" sm="12">
              <v-card
                class="handle pa-0"
                density="compact"
                link
                variant="tonal"
                :title="element.controller"
                :subtitle="element.title"
                :prepend-icon="element.icon"
              />
            </v-col>
          </template>
        </draggable>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style>
.list-group .v-card-item {
  padding: 0.2rem 1rem;
}
</style>
