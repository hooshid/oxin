<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  /**
   * Src of image
   */
  src: string;

  /**
   * Properties of field
   */
  properties: object | string | null;
}>();

/**
 * Structure of field
 */
const options = computed<{
  /**
   * Class for image
   */
  class: string;

  /**
   * Width of image
   */
  width: string;

  /**
   * Height of image
   */
  height: string;

  /**
   * Prepend to url
   */
  prependUrl: string;

  /**
   * Append to url
   */
  appendUrl: string;
}>(() => {
  return Object.assign(
    {
      class: "bg-grey-lighten-2",
      width: "70px",
      height: "108px",
      prependUrl: "",
      appendUrl: "",
    },
    props.properties
  );
});
</script>

<template>
  <v-img
    :src="src ? options.prependUrl + src + options.appendUrl : ''"
    :class="options.class"
    :width="options.width"
    :height="options.height"
  >
    <template #placeholder>
      <v-row
        align="center"
        class="fill-height"
        justify="center"
        style="margin: 0"
      >
        <v-icon size="30">mdi-folder-image</v-icon>
      </v-row>
    </template>
  </v-img>
</template>
