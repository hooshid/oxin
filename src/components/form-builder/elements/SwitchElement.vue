<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
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
  <v-switch
    v-model="value"
    v-bind="field"
    :error-messages="errors"
    @update:model-value="handleChange"
  />
</template>
