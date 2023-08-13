<script setup lang="ts">
import type IGridTable from "../../types/IGridTable";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useWindowSize } from "@vueuse/core";
import GridTable from "../../components/GridTable.vue";
import FormBuilder from "../../components/FormBuilder.vue";

interface ModuleType {
  table_structure: string;
  form_structure: string;
  title: string;
  dialog_title: string;
  icon: string;
}

defineProps<{
  modalClass?: string;
}>();

const module: ModuleType = useRoute().meta.module as ModuleType;
const tableStructure: IGridTable = module.table_structure
  ? JSON.parse(module.table_structure)[0]
  : null;
const formStructure = module.form_structure
  ? JSON.parse(module.form_structure)[0]
  : null;

interface ModelType {
  [key: string]: Array<number | string> | string | number | boolean | null;
}

/**
 * Model of FormBuilder data
 */
const model = ref<ModelType>();

/**
 * FormBuilder dialog state
 */
const dialog = ref(false);

/**
 * Tell to FormBuilder reset all models and validations
 */
const resetForm = ref(false);

watch(dialog, (value) => {
  if (value === false) {
    /*
    ریفکتور کدهای پایین
    setTimeout(
      function () {
        model.value = undefined;
        resetForm.value = !resetForm.value;
      },
      formMode.value == "sidebar" ? 0 : 400
    );
    */

    // in sidebar mode -> we reset form immediately
    if (formMode.value == "sidebar") {
      model.value = undefined;
      resetForm.value = !resetForm.value;
    } else {
      setTimeout(function () {
        model.value = undefined;
        resetForm.value = !resetForm.value;
      }, 400);
    }
  }

  emit("event", value ? "modal:opened" : "modal:closed");
});

/**
 * Item data
 * @param item
 */
function editItem(item: object) {
  if (formStructure) {
    model.value = item as ModelType;
    dialog.value = true;
  }
}

/**
 * Add item
 */
function addItem() {
  dialog.value = true;
}


/**
 * Close from
 */
 function closeForm() {
  dialog.value = false;
}

// Emits events
const emit = defineEmits<{
  (e: "event", value: string): void;
}>();

/**
 * Form title
 */
const formTitle = computed(() => {
  if (model.value) {
    return "ویرایش " + module.dialog_title;
  } else {
    return "ثبت " + module.dialog_title + " جدید";
  }
});

/**
 * FullScreen state -> for fullscreen btn inside dialog
 */
const fullScreen = ref<boolean>(false);

onMounted(() => {
  if (formStructure && options.value.mode === "fullscreen") {
    fullScreen.value = true;
  }
});

/**
 * Tell to GridTable update data
 */
const updateTable = ref(false);

/**
 * Event outcome from FormBuilder
 * @param value
 */
function formOutcome(value: string) {
  emit("event", value);
  dialog.value = false;
  // TODO change save word
  if (value === "save" || value === "update" || value === "delete") {
    updateTable.value = !updateTable.value;
  }
}

/**
 * Options of page
 */
const options = computed<{
  width: number;
  mode: string;
  addFrom: boolean;
}>(() => {
  return Object.assign(
    {
      width: 1500,
      mode: "dialog",
    },
    formStructure?.options
  );
});

/**
 * Form Mode
 */
const formMode = computed(() => {
  if (formStructure && formStructure.options) {
    if (useDisplay().smAndDown.value) {
      return "fullscreen";
    } else if (fullScreen.value) {
      return "fullscreen";
    } else if (options.value.mode === "sidebar") {
      return "sidebar";
    }
  }

  return "dialog";
});

/**
 * FormBuilder ref
 */
const FormBuilderRef = ref<InstanceType<typeof FormBuilder>>();

/**
 * Expose global functions -> can called from parent
 */
defineExpose({
  FormBuilderRef,
  model,
  addItem,
  editItem,
  closeForm,
  formOutcome,
});

const { width } = useWindowSize();
</script>

<template>
  <v-card rounded="0" flat>
    <!-- <pre>{{ Object.keys($slots) }}</pre> -->

    <!-- Title -->
    <v-card-title class="d-flex pt-4 page-title">
      <v-icon v-if="module.icon" class="ml-4">{{ module.icon }}</v-icon>
      {{ module.title }}

      <v-spacer />

      <v-btn
        v-if="
          formStructure &&
          tableStructure &&
          options.addFrom != false &&
          formMode != 'sidebar'
        "
        icon
        flat
        variant="tonal"
        color="green"
        @click.stop="dialog = true"
      >
        <v-icon>mdi-plus</v-icon>
        <v-tooltip activator="parent" location="top">
          ثبت {{ module.dialog_title }} جدید
        </v-tooltip>
      </v-btn>
    </v-card-title>

    <!-- Grid Table -->
    <div
      v-if="tableStructure"
      style="
        overflow-y: auto !important;
        margin: auto !important;
        display: block;
        align-content: center;
        z-index: 1;
      "
    >
      <GridTable
        :structure="tableStructure"
        :update="updateTable"
        @click:row="editItem"
      >
        <template
          v-for="header in tableStructure.headers"
          #[`item.${header.key}`]="{ value, item }"
        >
          <slot
            :name="`table.item.${header.key}`"
            :value="value"
            :item="item"
          />
        </template>
      </GridTable>
    </div>

    <!-- Dialog Form & FormBuilder -->
    <v-dialog
      v-model="dialog"
      :fullscreen="formMode == 'fullscreen'"
      :transition="
        formMode == 'fullscreen'
          ? 'dialog-bottom-transition'
          : dialog
          ? 'slide-x-reverse-transition'
          : 'slide-x-transition'
      "
      :max-width="formMode == 'fullscreen' ? '100%' : options.width"
      :retain-focus="false"
      persistent
    >
      <v-card :max-width="options.width" :width="width" :class="modalClass">
        <v-card-title class="bg-grey_ bg-grey-lighten-3_ mb-3- pa-4 d-flex">
          {{ formTitle }}
          <v-spacer />

          <v-btn
            v-if="options.width > 600"
            flat
            icon
            color="transparent"
            class="hidden-sm-and-down mt-n2"
            @click="fullScreen = !fullScreen"
          >
            <v-icon>
              {{ fullScreen ? "mdi-window-restore" : "mdi-window-maximize" }}
            </v-icon>
          </v-btn>

          <v-btn
            flat
            icon
            color="transparent"
            class="mr-2 mt-n2"
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <div class="pa-2 pa-md-0">
          <slot name="FormBuilderTop" :model="model"></slot>

          <FormBuilder
            ref="FormBuilderRef"
            v-model="model"
            :structure="formStructure"
            :reset="resetForm"
            @outcome-result="formOutcome"
          >
            <template
              v-for="(_, name) in Object.keys($slots)
                .filter((key) => key.includes('form.'))
                .reduce((cur, key) => {
                  return Object.assign(cur, {
                    [key.replace('form.', '')]: $slots[key],
                  });
                }, {})"
              #[name]="slotData"
            >
              <slot :name="'form.' + name" v-bind="slotData || {}" />
            </template>

            <!--
                <template
                  v-for="loop in formStructure.schema"
                  #[`field.${loop.model}`]="{ field, data, setData }"
                >
                  <slot
                    :name="`form.field.${loop.model}`"
                    :field="field"
                    :data="data"
                    :set-data="setData"
                  >
                  </slot>
                </template>
              -->
          </FormBuilder>

          <slot name="FormBuilderBottom" :model="model"></slot>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>
