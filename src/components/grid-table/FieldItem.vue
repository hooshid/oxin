<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import {
  miladiToShamsiDate,
  miladiToShamsiDateTime,
} from "../../utils/functions";
const PictureViewer = defineAsyncComponent(() => import("./PictureViewer.vue"));

type TypeValue = string | number | boolean | null | undefined;

const props = defineProps<{
  /**
   * Data
   */
  value?: TypeValue;

  /**
   * Structure of field
   */
  structure?: object;
}>();

/**
 * Structure of field
 */
const structure = computed<{
  /**
   * custom class of field
   */
  class: string | null;

  /**
   * Display mode
   */
  mode: string | null;

  /**
   * Picture options
   */
  picture: string | null;

  /**
   * options
   */
  options: string | Array<object> | null;
}>(() => {
  return Object.assign(
    {
      class: null,
      mode: null,
      picture: null,
      options: null,
    },
    props.structure
  );
});

function findChip(value: TypeValue){
  return (structure.value.options as Array<any>).filter((s) => s.value == value)[0];
}
</script>

<template>
  <div :class="structure.class">
    <!-- Picture -->
    <template v-if="structure.mode === 'picture' && typeof value == 'string'">
      <PictureViewer :src="value" :properties="structure.picture" />
    </template>

    <!-- Chip -->
    <template v-else-if="structure.mode === 'chip'">
      <v-chip
        :color="findChip(value).color"
        :prepend-icon="findChip(value).icon"
        variant="flat"
      >
        {{ findChip(value).title }}
      </v-chip>
    </template>

    <!-- HTML -->
    <template v-else-if="structure.mode === 'html'">
      <!-- eslint-disable-next-line vue/no-v-html-->
      <span v-html="(value as string)"></span>
    </template>

    <!-- Text -->
    <template v-else-if="structure.mode === 'text'">
      {{ value }}
    </template>

    <!-- Shamsi Date -->
    <template v-else-if="structure.mode === 'shamsi_date'">
      {{ miladiToShamsiDate(value) || '-' }}
    </template>

    <!-- Shamsi Datetime -->
    <template v-else-if="structure.mode === 'shamsi_datetime'">
      {{ miladiToShamsiDateTime(value) || '-' }}
    </template>

    <!-- Number-->
    <template
      v-else-if="
        value && (typeof value === 'number' || structure.mode === 'number')
      "
    >
      <span v-text="value.toLocaleString()"></span>
    </template>

    <!-- Boolean with check icon -->
    <template
      v-else-if="typeof value === 'boolean' || structure.mode === 'boolean'"
    >
      <template v-if="value">
        <v-icon size="25px">mdi-check</v-icon>
      </template>

      <template v-else>
        <v-icon size="25px">mdi-window-close</v-icon>
      </template>
    </template>

    <!-- Other types -->
    <template v-else-if="value || value === 0">
      {{ value }}
    </template>

    <!-- Null or Undefined -->
    <template v-else> - </template>
  </div>
</template>
