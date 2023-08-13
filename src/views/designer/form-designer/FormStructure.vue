<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { ref } from "vue";
import draggable from "vuedraggable";

defineProps<{
  schema: Array<IFormBuilderField>;
}>();

defineEmits<{
  (e: "editBlock", payload: object): void;
  (e: "deleteBlock"): void;
}>();

const drag = ref(false);
</script>

<template>
  <draggable
    class="drag-area"
    tag="ul"
    :list="schema"
    :component-data="{
      tag: 'div',
      type: 'transition-group',
      name: !drag ? 'flip-list' : null,
    }"
    :animation="200"
    item-key="name"
    ghost-class="ghost"
    handle=".handle"
    group="blocks"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element }">
      <li>
        <v-row no-gutters>
          <v-col cols="1" class="d-flex justify-center align-center">
            <v-btn
              variant="text"
              size="small"
              icon="mdi-cursor-move"
              class="handle"
            />
          </v-col>

          <v-col cols="6" class="d-flex align-self-center align-center">
            {{ element.label || element.type || "hidden" }}
            <br />
            {{ element.model }}
          </v-col>

          <v-col cols="2" class="d-flex align-self-center align-center">
            {{ element.type }}
          </v-col>

          <!-- Actions btn -->
          <v-col cols="auto" class="ms-auto">
            <v-btn
              variant="text"
              size="small"
              icon="mdi-cog"
              @click="$emit('editBlock', element)"
            />

            <v-btn
              variant="text"
              size="small"
              icon="mdi-delete"
              @click="
                element.delete = true;
                $emit('deleteBlock');
              "
            />
          </v-col>
        </v-row>

        <!-- Nested blocks -->
        <FormStructure
          v-if="element.type == 'container' || element.type == 'repeatable'"
          :schema="element.schema"
          class="mt-1"
          @edit-block="$emit('editBlock', $event)"
          @delete-block="$emit('deleteBlock')"
        />
      </li>
    </template>
  </draggable>
</template>

<style scoped>
ul,
li {
  list-style: none;
  padding: 2px 0;
}

[name="flip-list"] li:not(.sortable-chosen):hover {
  background: rgb(255, 248, 207);
}

li li:hover {
  background: rgb(252, 202, 177);
}

li {
  border: 1px solid #ddd;
  margin: 4px;
  border-radius: 5px;
}

ul ul {
  border: 2px dashed;
  border-radius: 5px;
}

.drag-area {
  min-height: 50px;
  padding: 5px 0;
}
</style>
