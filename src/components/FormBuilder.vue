<script setup lang="ts">
import type IFormBuilderField from "../types/IFormBuilderField";
import { onMounted, ref, watch, computed } from "vue";
import { useForm } from "vee-validate";
import { useAppStore } from "../stores/app";
import FormElements from "./FormElements.vue";
import http from "@/plugins/http";
import { watchDebounced } from "@vueuse/core";
import { conditionsMet } from "./form-builder/FormLogicConditionChecker";

interface ModelType {
  [key: string]:
    | Array<number | string | object>
    | string
    | number
    | boolean
    | null;
}

interface Structure {
  schema: Array<IFormBuilderField>;
  options?: { [key: string]: string | number };
}

const props = defineProps<{
  /**
   * Form Builder Structure -> have two object (schema, options)
   */
  structure: Structure;

  /**
   * Model of data
   */
  modelValue?: ModelType;

  /**
   * Call reset func
   */
  reset?: number | string | boolean;
}>();

/**
 * Emits events
 */
const emit = defineEmits<{
  (e: "update:modelValue", payload: object): void;
  (e: "outcomeResult", value: string): void;
}>();

/**
 * Watch reset changes from parent
 */
watch(
  () => props.reset,
  () => {
    resetForm();
  }
);

/**
 * Form Builder Options
 */
const options = computed<{
  saveUrl: string | null;
  deleteUrl: string | null;
  databaseTable: string | null;
  mode: string | null;
  defaultCol: number;
  onlyEditMode: boolean;
  getUrl: string | null;
  hideActions: boolean;
  disableOnEdit: boolean;
}>(() => {
  return Object.assign(
    {
      saveUrl: null,
      deleteUrl: null,
      databaseTable: null,
      mode: null,
      defaultCol: 6,
      onlyEditMode: false,
      getUrl: null,
      hideActions: false,
      disableOnEdit: false,
    },
    props.structure.options
  );
});

/**
 * Form Builder Schema
 */
const schema = ref(props.structure.schema);

/**
 * وضعیت ویرایش
 */
const editMode = ref(false);

/**
 * وضعیت زمانی که دکمه ذخیره را می زنیم
 */
const savingData = ref(false);

/**
 * Form fields
 */
const fields = ref<ModelType>({});

/**
 * Default fields
 */
const defaultFields = ref({});

// create model types
interface ObjectType {
  [key: string]:
    | Array<number | string | object>
    | string
    | number
    | boolean
    | null;
}

function created() {
  console.log("Mount FormBuilder");

  // create empty model
  const object: ObjectType = {};
  const defaultObject: ObjectType = {};
  let defaultValue:
    | Array<number | string | object>
    | string
    | number
    | boolean
    | null = null;

  schema.value.forEach(function (d: IFormBuilderField) {
    if (d.model) {
      if (d.type == "chip-group") {
        //defaultValue = typeof d.default !== "undefined" ? d.default : [];
        defaultValue = null;
      } else if (d.type === "select" && d.default) {
        // TODO fix for multiselect default
        defaultValue = parseInt(d.default.toString());
      } else if (d.type === "repeatable") {
        defaultValue = [];
      } else if (typeof d.default !== "undefined") {
        defaultValue = d.default;
      } else if (d.type === "switch") {
        defaultValue = false;
      } else if (d.type === "editor") {
        defaultValue = "";
      } else {
        defaultValue = null;
      }

      object[d.model] = defaultValue;
      defaultObject[d.model] = defaultValue;
    }
  });

  fields.value = object;
  defaultFields.value = defaultObject;

  //setValues(defaultObject);
  // handleReset(defaultObject);
  resetValidation({
    values: defaultObject,
  });
  /*
  if (options.value.onlyEditMode) {
    editMode.value = true;
  }
*/

  if (props.modelValue) {
    Object.keys(props.modelValue)
      .filter((key) => key in object)
      .forEach((key) => {
        if (typeof props.modelValue != "undefined") {
          object[key] = props.modelValue[key];
        }
      });
    setValues(object);
    editMode.value = true;
  }
  // Get data from server
  //else if (options.value.getUrl) {
  //getData();
  //}

  if ((props?.structure?.options as { [key: string]: number }).width <= 600 && props.structure.options?.defaultCol == undefined) {
    options.value.defaultCol = 12;
  }

  // formInit.value = true;
}

function prepareStructure(obj: IFormBuilderField[], parentModel?: string) {
  Object(obj).forEach(function (key: IFormBuilderField) {
    if (key.schema && typeof key.schema === "object") {
      prepareStructure(key.schema, key.model);
    } else if (parentModel) {
      key["parent_model"] = parentModel;
    }
  });
  return obj;
}

// Init FormBuilder
onMounted(() => {
  created();

  prepareStructure(props.structure.schema, "");

  schema.value = props.structure.schema.map(function (i) {
    const o = Object.assign({}, i);

    // console.log(o);

    if (o.disabledOnEdit == true && editMode.value == true) {
      o.disabled = true;
    }

    // if col not defined -> we set defaultCol
    if (typeof o.col == "undefined") {
      o.col = options.value.defaultCol;
    }

    return o;
  });
});

const {
  handleSubmit,
  resetForm: resetValidation,
  errors,
  meta,
  values,
  setValues,
  setFieldValue,
} = useForm();

watchDebounced(
  values,
  () => {
    updateValues();
  },
  { debounce: 250 }
);

const disableForm = ref(false);
const readonlyForm = ref(false);

function updateValues() {
  schema.value = schema.value.map(function (i) {
    const o = Object.assign({}, i);

    if (typeof o.conditions == "object") {
      let isValid = true;
      o.conditions.forEach((item: Array<string>) => {
        const key = item[0];
        const operator = item[1];
        const value = item[2];
        const actions = item[3];
        const fieldValue = values[item[0]] ? values[item[0]] : null;

        console.log(
          "key: " +
            key +
            " - operator:" +
            operator +
            " - value:" +
            value +
            " - actions:" +
            actions +
            " - fieldValue" +
            fieldValue
        );

        const res = conditionsMet(o.conditions, values);

        if (res == true && o.conditions[0][3].includes("hide")) {
          o.hide = true;
        } else {
          o.hide = false;
        }

        if (res == true && o.conditions[0][3].includes("disable")) {
          o.disabled = true;
        } else {
          o.disabled = false;
        }

        if (res == true && o.conditions[0][3].includes("disableForm")) {
          disableForm.value = true;
        } else {
          disableForm.value = false;
        }

        if (res == true && o.conditions[0][3].includes("readonly")) {
          o.readonly = true;
        } else {
          o.readonly = false;
        }

        //console.log(item);
        //console.log(formData[item[0]]);
        //isvalid = propertyConditionMet(item, fieldValue);
        //return propertyConditionMet(item, fieldValue);
      });
    }

    return o;
  });
}

const onSubmit = handleSubmit((values) => {
  //alert(JSON.stringify(values, null, 2));
  saveData();
}, onInvalidSubmit);

function onInvalidSubmit() {
  useAppStore().notification({
    color: "red",
    message: "خطایی در تکمیل فرم رخ داده است!",
  });
}

/**
 * Cancel btn -> reset from data & validations and send event to Parent component
 */
function cancel() {
  resetForm();
  emit("outcomeResult", "cancel");
}

/**
 * Reset form data models and validations
 */
function resetForm() {
  // console.log("**************** resetForm ************");
  editMode.value = false;
  // resetValidation();
  // vm.model = [];
  // console.log(fields.value);
  // console.log(defaultFields.value);

  fields.value = defaultFields.value;
  // fields.value = Object.assign({}, defaultFields.value);

  setTimeout(resetValidation, 1);
}

function getTypeByValue(value: unknown) {
  let type = "string";

  // switch
  if (typeof value === "boolean") {
    type = "boolean";
  } else if (typeof value === "number") {
    type = "int";
  }

  return type;
}

function saveData() {
  savingData.value = true;
  const jsonArr: Array<object> = [];
  let hasUploadForm = false;

  schema.value.forEach(function (field) {
    if (field.model && !field.disabled) {
      /**
       * Value of field
       */
      let value = values[field.model];

      /**
       * Type of field
       */
      let type = getTypeByValue(value);

      // Any types here can be null
      if (!value && value != 0) {
        value = "null";
      }

      if(field.type == "repeatable") {
        const jsonArr_: Array<object> = [];
         
          value.forEach(element => {
            if(field.schema) {
              const jsonArr_inter: Array<object> = [];
              field.schema.forEach(function (field_) {
                if (field_.model && !field_.disabled) {
                  /**
                  * Value of field
                  */
                  let value_ = element[field_.model];

                  /**
                  * Type of field
                  */
                  let type_ = getTypeByValue(value_);

                  jsonArr_inter.push({
                    key: field_.model,
                    value: value_?.toString(),
                    type: type_,
                  });
                }
              });

            jsonArr_.push(jsonArr_inter);
          }
        });

        const rel = {
          configs: field.configs,
          values: JSON.stringify(jsonArr_)
        }

        jsonArr.push({
          key: field.model,
          value: rel,
          type: "repeatable",
        });
      } else if(field.type == "upload") {
        hasUploadForm = true;
      } else if(!field.disabled && !field.readonly) {
        jsonArr.push({
          key: field.model,
          value: value?.toString(),
          type: type,
        });
      }
    }
  });


  const data = JSON.stringify(jsonArr);
  // const data = jsonArr;
  // console.log("saveData()");
  // console.log(data);

  const saveUrlEndPoint = options.value.saveUrl ? options.value.saveUrl : import.meta.env.VITE_OXIN_FORM_BUILDER_SAVE_URL_END_POINT;

  const formData = new FormData();
  formData.append('data', data);
  formData.append('database_table', options.value.databaseTable || "empty");

  if(hasUploadForm) {
    schema.value.forEach(function (field) {
      if (field.model && !field.disabled && field.type == "upload") {
        if(values[field.model]){
          formData.append(field.model, values[field.model]);
        }
      }
    });
  }

  http
    .post(saveUrlEndPoint, formData, {
        headers: {
          'Content-Type': hasUploadForm ? 'multipart/form-data' : 'application/json'
        }
      }
    )
    .then(response => {
      // console.log(response);
      if (response.status != 200 || response.data.succeed == false) {
        useAppStore().notification({
          color: "red",
          message: "خطایی در ثبت اطلاعات رخ داده است، مجدد تلاش کنید.",
        });
        return;
      }

      if (editMode.value) {
        useAppStore().notification({
          color: "green",
          message: "آیتم با موفقیت ویرایش شد.",
        });

        emit("outcomeResult", "update");
      } else {
        useAppStore().notification({
          color: "green",
          message: "آیتم جدید با موفقیت ثبت شد.",
        });

        // TODO change save word
        emit("outcomeResult", "save");
      }

      savingData.value = false;
      /*
      if (vm.options.onlyEditMode !== true) {
        vm.resetForm();
      }
      */
    })
    .catch(() => {
      savingData.value = false;
    });
}

/**
 * دریافت اطلاعات از سمت سرور
 */
function getData() {
  /*
  let vm = this;
  vm.loading = true;
  vm.$http
    .get(vm.options.getUrl)
    .then(function (response) {
      vm.fields = response.data.data;
    })
    .finally(function () {
      vm.loading = false;
    });
    */
}

// TODO this need to fix
function deleteData() {
  if (!fields.value.id || !options.value.deleteUrl) {
    useAppStore().notification({
      color: "red",
      message: "id شناسایی نشده است.",
    });
    return;
  }

  let result = confirm("آیا از حذف این ایتم مطمئن هستید؟");
  if (result == false) {
    return;
  }
  
  http
    .post(options.value.deleteUrl, {
      id: fields.value.id?.toString(),
    })
    .then(function () {
      useAppStore().notification({
        color: "orange-darken-3",
        message: "آیتم حذف شد.",
      });

      emit("outcomeResult", "delete");

      savingData.value = false;
    })
    .catch(function () {
      savingData.value = false;
    });
}

/**
 * Expose global functions -> can called from parent
 */
defineExpose({
  setFieldValue,
  resetForm,
});
</script>

<template>
  <v-alert v-if="Object.keys(errors).length != 0" type="error" class="d-none ma-2">
    <div v-for="error in errors" :key="error">{{ error }}</div>
  </v-alert>

  <!--
  <pre>{{ Object.keys($slots) }}</pre>
  -->
  <v-form
    :disabled="disableForm"
    :readonly="readonlyForm"
    @submit.prevent="onSubmit"
    :class="[editMode ? 'form-mode-is-edit' : 'form-mode-is-add']"
  >
    <slot name="prepend" />
    
    <FormElements :schema="schema" :data="modelValue">
      <template
        v-for="(_, name) in Object.keys($slots)
          .filter((key) => key.includes('field.'))
          .reduce((cur, key) => {
            return Object.assign(cur, {
              [key.replace('field.', '')]: $slots[key],
            });
          }, {})"
        #[name]="slotData"
      >
        <slot
          :name="'field.' + name"
          v-bind="slotData || {}"
          :set-field-value="setFieldValue"
          :value="values[name]"
          :values="values"
        />
      </template>
    </FormElements>

    <slot name="append" />
    
    <v-divider v-if="!options.hideActions" />

    <v-card-actions v-if="!options.hideActions" class="pa-4">
      <slot name="footer.prepend" />

      <v-btn
        v-if="editMode == true && options.disableOnEdit != true"
        type="submit"
        color="success"
        variant="flat"
        :disabled="savingData"
        :loading="savingData"
      >
        ذخیره تغییرات
      </v-btn>

      <v-btn
        v-if="editMode == false"
        type="submit"
        color="success"
        variant="flat"
        :disabled="savingData"
        :loading="savingData"
        loadings
      >
        افزودن
      </v-btn>

      <v-btn
        v-if="editMode && !options.onlyEditMode && options.deleteUrl"
        color="error"
        variant="tonal"
        :disabled="savingData"
        @click="deleteData()"
      >
        حذف
      </v-btn>

      <v-btn
        v-show="!options.onlyEditMode"
        variant="tonal"
        :disabled="savingData"
        @click="cancel()"
      >
        لغو
      </v-btn>

      <slot name="footer.append" />
    </v-card-actions>
  </v-form>

  <pre class="d-none">modelValue: {{ modelValue }}</pre>
  <pre class="d-none">values: {{ values }}</pre>
  <pre class="d-none">defaultFields: {{ defaultFields }}</pre>
  <pre class="d-none">fields: {{ fields }}</pre>
  <pre class="d-none">{{ meta }}</pre>
</template>
