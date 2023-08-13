<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { ref } from "vue";
import { useField } from "vee-validate";
import DatetimePicker from "vue3-persian-datetime-picker";

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

/**
 * TimePicker modal state
 */
const pickerDialog = ref(false);

const model = props.parentModel
  ? props.parentModel + "." + props.field.model
  : (props.field.model as string);

// Validation settings
const { value, errors, handleChange } = useField(
  model,
  props.field.validation ? props.field.validation + "|time" : "time",
  {
    label: props.field.label,
  }
);
</script>

<template>
  <DatetimePicker
    v-model="value"
    simple
    type="time"
    element="picker"
    :show="pickerDialog"
    @close="pickerDialog = false"
  />

  <v-text-field
    v-model="value"
    v-bind="field"
    :dir="field.inputType === 'number' ? 'right' : 'auto'"
    :type="field.inputType"
    :error-messages="errors"
    append-inner-icon="mdi-clock-time-eight-outline"
    @click:append-inner="pickerDialog = !pickerDialog"
    @update:model-value="handleChange"
  />
</template>
