<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { onMounted } from "vue";
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

// TODO از فرم بیلدر چک شود و دیتا ست نشود
// فایل اپلودی لازم نیست به داخل فایل پیکر تزریق بشه
onMounted(() => {
  setTimeout(() => {
      value.value = null;
  }, 500);
});
</script>

<template>
 <v-file-input
    :label="field.label"
    :chips="field.chips"
    show-size
    :counter="field.multiple"
    :multiple="field.multiple"
    :error-messages="errors"
    @update:model-value="handleChange"
  />
</template>
