<script setup lang="ts">
import type IFormBuilderField from "../../../src/types/IFormBuilderField";
import { useField } from "vee-validate";

const props = defineProps<{
  /**
   * Field structure
   */
  field: IFormBuilderField;

  /**
   * Parent model name
   */
  parentModel?: string;
}>();

const model = props.parentModel
  ? props.parentModel + "." + props.field.model
  : (props.field.model as string);

// Validation settings
const { value, errors, handleChange } = useField(
  model,
  props.field.validation,
  {
    label: props.field.label,
  }
);
</script>

<template>
  <component
    :is="field.type == 'textarea' ? 'v-textarea' : 'v-text-field'"
    v-model="value"
    v-bind="field"
    :dir="field.inputType === 'number' ? 'right' : 'auto'"
    :type="field.inputType"
    :error-messages="errors"
    @update:model-value="handleChange"
  >
    <template #prepend-inner>
      <slot name="prepend-inner"></slot>
    </template>

    <template #append-inner>
      <slot name="append-inner"></slot>
    </template>
  </component>
</template>
