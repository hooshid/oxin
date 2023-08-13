<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { computed } from "vue";

const props = defineProps<{
  /**
   * Field structure
   */
  field: IFormBuilderField;
}>();

/**
 * Options
 */
const options = computed<{
  /**
   * Type of alert
   */
  type: "error" | "success" | "info" | "warning" | undefined;

  /**
   * Color of alert
   */
  color: string | undefined;

  /**
   * Icon of alert
   */
  icon: string | undefined;

  /**
   * Text of alert
   */
  text: string | undefined;

  /**
   * Variant of alert
   */
  variant:
    | "text"
    | "flat"
    | "elevated"
    | "tonal"
    | "outlined"
    | "plain"
    | undefined;

  /**
   * Border of alert
   */
  border: boolean | "end" | "start" | "top" | "bottom" | undefined;

  /**
   * Prominent
   */
  prominent: boolean;

  /**
   * Closable
   */
  closable: boolean;
}>(() => {
  return Object.assign(
    {
      type: undefined,
      color: undefined,
      icon: undefined,
      text: undefined,
      variant: undefined,
      border: undefined,
      prominent: false,
      closable: false,
    },
    props.field.options
  );
});
</script>

<template>
  <v-alert
    v-bind="options"
    :title="props.field.label"
    :class="props.field.class ? props.field.class : 'mb-4'"
  />
</template>
