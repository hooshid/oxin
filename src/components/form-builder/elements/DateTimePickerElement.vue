<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { ref, onMounted, watch } from "vue";
import { useField } from "vee-validate";
import DatetimePicker from "vue3-persian-datetime-picker";
import moment from "moment-jalaali";

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
 * Model
 */
const model = ref<string | null>(null);

/**
 * Display text input
 */
const display = ref<string | null>(null);

/**
 * DateTimePicker modal state
 */
const pickerDialog = ref(false);

/**
 * DateTime selected from picker
 */
function renderDisplay() {
  const date = model.value;

  // if date empty stop!
  if (!date) {
    return;
  }

  // datetime with sec
  if (
    date.length == 19 &&
    moment(date, "YYYY-MM-DDTHH:mm:ss", true).isValid()
  ) {
    display.value = moment(date, "YYYY-MM-DDTHH:mm:ss").format(shamsiFormat);
  }
  // datetime with sec
  else if (
    date.length == 19 &&
    moment(date, "YYYY-MM-DD HH:mm:ss", true).isValid()
  ) {
    display.value = moment(date, "YYYY-MM-DD HH:mm:ss").format(shamsiFormat);
  }
  // datetime
  else if (
    date.length == 16 &&
    moment(date, "YYYY-MM-DD HH:mm", true).isValid()
  ) {
    display.value = moment(date, "YYYY-MM-DD HH:mm").format(shamsiFormat);
  }
  // date
  else if (date.length == 10 && moment(date, "YYYY-MM-DD", true).isValid()) {
    display.value = moment(date, "YYYY-MM-DD").format(shamsiFormat);
  } else {
    display.value = date;
  }

  value.value = model.value;
}

/**
 * When input manually changed by user triggered
 */
function manuallyChanged() {
  if (!display.value || !display.value.trim()) {
    value.value = null;
    model.value = null;
    display.value = null;
    return;
  }

  if (!moment(display.value, shamsiFormat, true).isValid()) {
    value.value = display.value;
    return;
  }

  model.value = moment(display.value, shamsiFormat, true).format(
    gregorianFormat
  );
  value.value = model.value;
}

let shamsiFormat = "jYYYY/jMM/jDD";
let gregorianFormat = "YYYY-MM-DD";
// First init
onMounted(() => {
  /*
  if (props.modelValue) {
    model.value = props.modelValue.toString();
  }
  */

  if (props.field.type == "datetime") {
    shamsiFormat = "jYYYY/jMM/jDD HH:mm";
    gregorianFormat = "YYYY-MM-DD HH:mm";
  }

  renderDisplay();
});

const model_ = props.parentModel
  ? props.parentModel + "." + props.field.model
  : (props.field.model as string);

// Validation settings
const { value, errors } = useField(
  model_,
  props.field.validation
    ? props.field.validation + "|" + props.field.type
    : props.field.type,
  {
    label: props.field.label || props.field.model,
  }
);

/**
 * Watch modelValue changes from FormBuilder -> just for reset btn
 */
watch(value, (newVal: unknown) => {
  if (newVal) {
    model.value = newVal as string;
    renderDisplay();
    manuallyChanged();
  } else {
    model.value = null;
    display.value = null;
  }
});
</script>

<template>
  <!--
  {{ value }}
  <br />
  {{ model }}
  <br />
  {{ display }}
  <br />
-->
  <DatetimePicker
    v-model="model"
    :format="gregorianFormat"
    locale="fa,en"
    element="picker"
    :type="field.type"
    :show="pickerDialog"
    @close="pickerDialog = false"
    @change="renderDisplay()"
  />

  <v-text-field
    v-model="display"
    v-bind="field"
    :dir="field.inputType === 'number' ? 'right' : 'auto'"
    :type="field.inputType"
    :append-inner-icon="
      field.type == 'date' ? 'mdi-calendar' : 'mdi-calendar-clock'
    "
    :error-messages="errors"
    @update:model-value="manuallyChanged()"
    @click:append-inner="pickerDialog = !pickerDialog"
  >
    <!--
      <template #append>
        <v-btn color="success" variant="flat" class="mt-n2 mr-n2">
          اکنون
          <v-tooltip activator="parent" location="top">ثبت زمان فعلی</v-tooltip>
        </v-btn>
      </template>
    -->
  </v-text-field>
</template>
