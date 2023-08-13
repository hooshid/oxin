<script setup lang="ts">
import type IFormBuilderField from "../../types/IFormBuilderField";
import { computed, ref } from "vue";
import { watchDebounced } from "@vueuse/core";

import FormBuilder from "../../components/FormBuilder.vue";
import BlockElements from "./form-designer/BlockElements.vue";
import FormStructure from "./form-designer/FormStructure.vue";
import {
  layoutBlocks,
  inputBlocks,
  structureBlocks,
} from "./form-designer/BlockStructures";
import ConditionsViewer from "./ConditionsViewer.vue";

interface ISchemaDesigner {
  parent_model?: string;
  delete?: boolean;
}

interface IStructure {
  schema: Array<IFormBuilderField & ISchemaDesigner>;
  options: {
    databaseTable?: string;
    defaultCol?: number;
    width?: number;
    saveUrl?: string;
  };
}

const props = defineProps<{
  /**
   * Grid Table Structure
   */
  structure: IStructure;
}>();

/**
 * Table structure
 */
const structure = ref(props.structure);

/**
 * Selected row for edit
 */
const editRow = ref<IFormBuilderField>({});

/**
 * Refresh key
 */
const refreshKey = ref(0);

/**
 * Right tabs
 */
const settingTab = ref();

/**
 * Center tabs
 */
const designerTab = ref();

/**
 * Left tabs
 */
const addTab = ref();

/**
 * Cache times
 */
const cacheTimes = ["1h", "2h", "3h", "6h", "12h", "1d", "7d"];

/**
 * HTML pre defined
 */
const htmlItems = [
  {
    title: "H1 header",
    value: "<h1 class=&quot;text-h1&quot;>H1</h1>",
  },
  {
    title: "H2 header",
    value: "<h2 class=&quot;text-h2&quot;>H2</h2>",
  },
  {
    title: "H3 header",
    value: "<h3 class=&quot;text-h3&quot;>H3</h3>",
  },
  {
    title: "H4 header",
    value: "<h4 class=&quot;text-h4&quot;>H4</h4>",
  },
  {
    title: "Paragraph",
    value: "<p>پاراگراف</p>",
  },
  {
    title: "Quote",
    value: "<quote class=&quot;blockquote mb-3&quot;>نقل قول</quote>",
  },
  {
    title: "Image",
    value: "<img src=&quot;https://vueform.com/images/logo.svg&quot; />",
  },
  {
    title: "Link",
    value:
      "<a href=&quot;https://google.com&quot; target=&quot;_blank&quot;>Link</a>",
  },
];

interface IObject {
  [key: string]: string | IObject;
}

/**
 * Watch form changes
 */
watchDebounced(
  structure.value,
  () => {
    removeEmpty(structure.value as unknown as IObject);
    refreshKey.value++;
  },
  { debounce: 2500 }
);

/**
 * Remove empty & null & undefined keys
 * @param obj
 */
function removeEmpty(obj: IObject) {
  Object.keys(obj).forEach(function (key) {
    if (obj[key] && typeof obj[key] === "object") {
      removeEmpty(obj[key] as IObject);
    } else if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
      delete obj[key];
    }
  });

  return obj;
}

/**
 * Delete rows which has delete key
 * @param data
 */
function removeDeletedObjects(data: IStructure["schema"]) {
  data.forEach((o, i) => {
    if (o.delete && o.delete === true) {
      data.splice(i, 1);
      return true;
    } else if (o.schema) {
      removeDeletedObjects(o.schema);
    }
  });
}

/**
 * Delete selected row
 */
function deleteBlock() {
  removeDeletedObjects(structure.value.schema);
}

/**
 * Edit select row
 * @param e
 */
function editBlock(e: object) {
  editRow.value = e;
  settingTab.value = 1;
}
/**
 * Add condition to selected row
 */
function addCondition() {
  if (!editRow.value.conditions) {
    editRow.value.conditions = [];
  }

  (editRow.value.conditions as unknown as string[][]).push(["", "", "", ""]);
}

function allKeys(data: IStructure["schema"]) {
  const res: {
    title: string;
    value: string | undefined;
    type: string | undefined;
  }[] = [];

  data.forEach((o) => {
    if (o.schema) {
      allKeys(o.schema);
    }

    let title = "";
    if (o.model) {
      title = o.model;
    }
    if (o.label) {
      title += " - " + o.label;
    }
    res.push({ title, value: o.model, type: o.type });
  });

  return res;
}

const fields = computed(() => {
  return allKeys(structure.value.schema);
});
</script>

<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <!-- Settings panel -->
      <v-col cols="12" sm="3" class="pa-2">
        <v-card>
          <v-tabs v-model="settingTab" bg-color="primary" align-tabs="center">
            <v-tab :value="1">تنظیمات بلاک</v-tab>
            <v-tab :value="2">تنظیمات فرم</v-tab>
          </v-tabs>

          <v-window v-model="settingTab">
            <v-window-item :value="1" class="pa-2">
              <v-alert v-show="JSON.stringify(editRow) == '{}'" type="info">
                یک ردیف جهت ویرایش انتخاب کنید!
              </v-alert>

              <v-container
                v-show="JSON.stringify(editRow) != '{}'"
                class="pa-0 mt-4"
              >
                <v-row>
                  <v-col cols="12">
                    <div class="bg-grey-lighten-3 pa-2 rounded">
                      تنظیمات عمومی
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="editRow.col"
                      label="عرض ستون"
                      :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                      clearable
                      hide-details
                    />
                  </v-col>

                  <v-col v-if="editRow.type != 'divider'" cols="12">
                    <v-text-field
                      v-model="editRow.label"
                      label="عنوان (label)"
                      hide-details
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="editRow.model"
                      label="مدل (model)"
                      dir="auto"
                      clearable
                      hide-details
                    />
                  </v-col>

                  <v-col
                    v-if="
                      editRow.type != 'alert' &&
                      editRow.type != 'divider' &&
                      editRow.type != 'html' &&
                      editRow.type != 'repeatable' &&
                      editRow.type != 'container'
                    "
                    cols="12"
                  >
                    <v-text-field
                      v-model="editRow.validation"
                      label="اعتبارسنجی (validation)"
                      dir="auto"
                      clearable
                      hide-details
                    />
                  </v-col>

                  <v-col
                    v-if="
                      editRow.type == 'input' ||
                      editRow.type == 'textarea' ||
                      editRow.type == 'select' ||
                      editRow.type == 'autocomplete'
                    "
                    cols="12"
                  >
                    <v-text-field
                      v-model="editRow.placeholder"
                      label="placeholder"
                      dir="auto"
                      clearable
                      hide-details
                    />
                  </v-col>

                  <v-col
                    v-if="
                      editRow.type == 'input' ||
                      editRow.type == 'textarea' ||
                      editRow.type == 'select' ||
                      editRow.type == 'autocomplete'
                    "
                    cols="12"
                  >
                    <v-text-field
                      v-model="editRow.hint"
                      label="راهنما (hint)"
                      dir="auto"
                      clearable
                      hide-details
                    />
                  </v-col>

                  <v-col
                    v-if="
                      editRow.type == 'input' ||
                      editRow.type == 'textarea' ||
                      editRow.type == 'select' ||
                      editRow.type == 'autocomplete'
                    "
                    cols="12"
                  >
                    <v-text-field
                      v-model="editRow.default"
                      label="مقدار پیش فرض (default)"
                      dir="auto"
                      clearable
                      hide-details
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="editRow.class"
                      label="css class"
                      dir="auto"
                      clearable
                      hide-details
                    />
                  </v-col>

                  <v-col
                    v-if="
                      editRow.type != 'alert' &&
                      editRow.type != 'divider' &&
                      editRow.type != 'html' &&
                      editRow.type != 'repeatable' &&
                      editRow.type != 'container'
                    "
                    cols="12"
                    class="py-0"
                  >
                    <v-switch
                      v-model="editRow.disabled"
                      label="غیرفعال (disabled)"
                      hide-details
                    />
                  </v-col>

                  <v-col
                    v-if="
                      editRow.type == 'input' ||
                      editRow.type == 'textarea' ||
                      editRow.type == 'select' ||
                      editRow.type == 'autocomplete' ||
                      editRow.type == 'switch' ||
                      editRow.type == 'date' ||
                      editRow.type == 'time' ||
                      editRow.type == 'datetime'
                    "
                    cols="12"
                    class="py-0"
                  >
                    <v-switch
                      v-model="editRow.readonly"
                      label="فقط خواندنی (readonly)"
                      hide-details
                    />
                  </v-col>

                  <v-col
                    v-if="
                      editRow.type == 'input' ||
                      editRow.type == 'textarea' ||
                      editRow.type == 'select' ||
                      editRow.type == 'autocomplete' ||
                      editRow.type == 'date' ||
                      editRow.type == 'time' ||
                      editRow.type == 'datetime'
                    "
                    cols="12"
                    class="py-0"
                  >
                    <v-switch
                      v-model="editRow.clearable"
                      label="قابلیت پاکسازی (clearable)"
                      hide-details
                    />
                  </v-col>

                  <!-- Icons Panel -->
                  <template
                    v-if="editRow.type == 'input' || editRow.type == 'textarea' || editRow.type == 'select' || editRow.type == 'autocomplete'
                     || editRow.type == 'datetime'  || editRow.type == 'date'  || editRow.type == 'time'  || editRow.type == 'upload'
                    "
                  >
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات آیکون
                      </div>
                    </v-col>

                     <!-- prepend-icon -->
                     <v-col sm="6" cols="12">
                      <v-text-field
                        v-model="editRow.prependIcon"
                        label="Prepend"
                        prepend-icon="mdi-pan-left"
                        clearable
                        hide-details
                      />
                    </v-col>

                     <!-- prepend-inner-icon -->
                     <v-col sm="6" cols="12">
                      <v-text-field
                        v-model="editRow.prependInnerIcon"
                        label="Prepend inner"
                        prepend-inner-icon="mdi-pan-left"
                        clearable
                        hide-details
                      />
                    </v-col>

                     <!-- append-icon -->
                     <v-col sm="6" cols="12">
                      <v-text-field
                        v-model="editRow.appendIcon"
                        label="Append"
                        append-icon="mdi-pan-right"
                        clearable
                        hide-details
                      />
                    </v-col>

                     <!-- append-inner-icon -->
                     <v-col sm="6" cols="12">
                      <v-text-field
                        v-model="editRow.appendInnerIcon"
                        label="Append inner"
                        append-inner-icon="mdi-pan-right"
                        clearable
                        hide-details
                      />
                    </v-col>
                  </template>

                  <!-- Input & Textarea Panel -->
                  <template
                    v-if="editRow.type == 'input' || editRow.type == 'textarea'"
                  >
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات {{ editRow.type }}
                      </div>
                    </v-col>

                    <!-- Convert type -->
                    <v-col cols="12">
                      <v-select
                        v-model="editRow.type"
                        label="نوع کنترلر (type)"
                        :items="['input', 'textarea']"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <!-- input -->
                    <v-col v-if="editRow.type == 'input'" cols="12">
                      <v-select
                        v-model="editRow.inputType"
                        label="نوع داده (data type)"
                        :items="['text', 'number', 'password', 'color']"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <!-- textarea -->
                    <v-col v-if="editRow.type == 'textarea'" cols="12">
                      <v-text-field
                        v-model="editRow.rows"
                        label="rows"
                        clearable
                        hide-details
                      />
                    </v-col>
                  </template>

                  <!-- Select & Autocomplete Panel -->
                  <template
                    v-if="
                      editRow.type == 'select' || editRow.type == 'autocomplete'
                    "
                  >
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات {{ editRow.type }}
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="editRow.options.cacheTime"
                        label="مدت زمان کش"
                        :items="cacheTimes"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="editRow.options.getUrl"
                        label="آدرس دیتا"
                        dir="auto"
                        rows="1"
                        auto-grow
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="editRow.options.itemTitle"
                        label="فیلد عنوان (title)"
                        dir="auto"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="editRow.options.itemValue"
                        label="فیلد مقدار (id)"
                        dir="auto"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.multiple"
                        label="انتخاب چندتایی (multiple)"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.chips"
                        label="نمایش دکمه ای (chips)"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.closableChips"
                        :disabled="!editRow.chips"
                        label="امکان حذف داخل دکمه (closable-chips)"
                        hide-details
                      />
                    </v-col>
                  </template>

                  <!-- Switch Panel -->
                  <template v-if="editRow.type == 'switch'">
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات switch
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-switch
                        v-model="editRow.default"
                        label="پیش فرض فعال باشد (true)"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="editRow.color"
                        label="رنگ"
                        dir="auto"
                        clearable
                        hide-details
                      />
                    </v-col>
                  </template>

                  <!-- Chip Group Panel -->
                  <template v-if="editRow.type == 'chip-group'">
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات chip group
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="editRow.options.cacheTime"
                        label="مدت زمان کش"
                        :items="cacheTimes"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="editRow.options.getUrl"
                        label="آدرس دیتا"
                        dir="auto"
                        rows="1"
                        auto-grow
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.filter"
                        label="حالت فیلتر (filter)"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.multiple"
                        label="انتخاب چندتایی (multiple)"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.mandatory"
                        label="اجبار انتخاب حداقل یک آیتم (mandatory)"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="editRow.variant"
                        label="نوع نمایش (variant)"
                        :items="[
                          'flat',
                          'text',
                          'elevated',
                          'tonal',
                          'outlined',
                          'plain',
                        ]"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="editRow.color"
                        label="رنگ"
                        dir="auto"
                        clearable
                        hide-details
                      />
                    </v-col>
                  </template>

                  <!-- Date & Time & DateTime Panel -->
                  <template
                    v-if="
                      editRow.type == 'date' ||
                      editRow.type == 'time' ||
                      editRow.type == 'datetime'
                    "
                  >
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات {{ editRow.type }}
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="editRow.type"
                        label="نوع ورودی"
                        :items="['date', 'time', 'datetime']"
                        clearable
                        hide-details
                      />
                    </v-col>
                  </template>

                  <!-- Upload Panel -->
                  <template v-if="editRow.type == 'upload'">
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات upload
                      </div>
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.multiple"
                        label="انتخاب چندتایی (multiple)"
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.chips"
                        label="نمایش دکمه ای (chips)"
                        hide-details
                      />
                    </v-col>
                  </template>

                  <!-- Alert Panel -->
                  <template v-if="editRow.type == 'alert'">
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات alert
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="editRow.options.text"
                        label="متن"
                        dir="auto"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="editRow.options.type"
                        label="نوع"
                        :items="['success', 'info', 'warning', 'error']"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="editRow.options.variant"
                        label="نوع نمایش"
                        :items="[
                          'flat',
                          'elevated',
                          'tonal',
                          'outlined',
                          'text',
                          'plain',
                        ]"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-model="editRow.options.border"
                        label="border"
                        :items="['start', 'end', 'bottom', 'top']"
                        clearable
                        hide-details
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.options.prominent"
                        label="برجسته"
                        hide-details
                        inset
                      />
                    </v-col>

                    <v-col cols="12" class="py-0">
                      <v-switch
                        v-model="editRow.options.closable"
                        label="قابلیت بستن (closable)"
                        hide-details
                        inset
                      />
                    </v-col>
                  </template>

                  <!-- HTML Panel -->
                  <template v-if="editRow.type == 'html'">
                    <v-col cols="12">
                      <div class="bg-grey-lighten-3 pa-2 rounded">
                        تنظیمات HTML
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="editRow.html"
                        label="html"
                        dir="auto"
                        hide-details
                      ></v-textarea>
                    </v-col>

                    <v-col cols="12">
                      <div
                        v-for="i in htmlItems"
                        :key="i.title"
                        class="bg-grey-lighten-3 rounded text-left v-code pa-2 mb-1"
                        @click="editRow.html = i.value"
                      >
                        {{ i.title }}
                      </div>
                    </v-col>
                  </template>

                  <!-- Conditions -->
                  <v-col cols="12">
                    <div class="bg-grey-lighten-3 pa-2 rounded">شرط ها</div>
                  </v-col>

                  <v-col cols="12">
                    <ConditionsViewer :conditions="editRow.conditions" />
                    <pre>{{ editRow.conditions }}</pre>
                    <br /><br />
                  </v-col>

                  <v-btn @click="addCondition()" color="green"
                    >افزودن شرط</v-btn
                  >

                  <v-col cols="12" v-if="editRow.conditions">
                    <div
                      v-for="(row, index) in editRow.conditions"
                      :key="index"
                    >
                      <v-select
                        v-model="row[0]"
                        label="فیلد مرجع"
                        :items="fields"
                        clearable
                        hide-details
                        class="mb-2"
                      />

                      <v-select
                        v-model="row[1]"
                        label="نوع"
                        :items="[
                          { title: 'مساوی', value: 'equals' },
                          { title: 'نامساوی', value: 'does_not_equal' },
                          { title: 'شامل', value: 'contains' },
                          { title: 'عدم شامل', value: 'does_not_contain' },
                          { title: 'شروع شود با', value: 'starts_with' },
                          { title: 'تمام شود با', value: 'ends_with' },
                          { title: 'خالی باشد', value: 'is_empty' },
                          { title: 'خالی نباشد', value: 'is_not_empty' },
                          {
                            title: 'طول متن مساوی باشد',
                            value: 'content_length_equals',
                          },
                          {
                            title: 'طول متن مساوی نباشد',
                            value: 'content_length_does_not_equal',
                          },
                          {
                            title: 'طول متن بزرگتر باشد',
                            value: 'content_length_greater_than',
                          },
                          {
                            title: 'طول متن بزرگتر و مساوی باشد',
                            value: 'content_length_greater_than_or_equal_to',
                          },
                          {
                            title: 'طول متن کوچکتر باشد',
                            value: 'content_length_less_than',
                          },
                          {
                            title: 'طول متن کوچکتر و مساوی باشد',
                            value: 'content_length_less_than_or_equal_to',
                          },
                          {
                            title: 'بزرگتر باشد',
                            value: 'greater_than',
                          },
                          {
                            title: 'بزرگتر و مساوی باشد',
                            value: 'greater_than_or_equal_to',
                          },
                          {
                            title: 'کوچکتر باشد',
                            value: 'less_than',
                          },
                          {
                            title: 'کوچکتر و مساوی باشد',
                            value: 'less_than_or_equal_to',
                          },
                        ]"
                        clearable
                        hide-details
                        class="mb-2"
                      />

                      <div v-for="(f, idx) in fields" :key="idx">
                        <div v-if="f.value == row[0] && f.type == 'switch'">
                          <v-switch
                            v-model="row[2]"
                            label="شرط boolean"
                            dir="auto"
                            hide-details
                            class="mb-2"
                          />
                        </div>
                      </div>

                      <v-text-field
                        v-if="row[1] != 'is_empty' && row[1] != 'is_not_empty'"
                        v-model="row[2]"
                        label="متن شرط"
                        dir="auto"
                        clearable
                        hide-details
                        class="mb-2"
                      />

                      <v-text-field
                        v-model="row[3]"
                        label="عملیات (action)"
                        dir="auto"
                        clearable
                        hide-details
                        class="mb-2"
                      />

                      <v-btn
                        color="red"
                        @click="editRow.conditions.splice(index, 1)"
                        >حذف</v-btn
                      >
                      <br />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <!-- Options -->
            <v-window-item :value="2" class="pa-2">
              <v-text-field
                v-model="structure.options.databaseTable"
                label="جدول دیتابیس"
                dir="ltr"
                clearable
              />

              <v-select
                v-model="structure.options.defaultCol"
                label="عرض پیش فرض ستون ها"
                :items="[
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                ]"
                clearable
              />

              <v-text-field
                v-model.number="structure.options.width"
                label="عرض مودال"
                type="number"
                clearable
              />

              <v-text-field
                v-model="structure.options.saveUrl"
                label="Save Url EndPoint"
                dir="ltr"
                clearable
              />

            </v-window-item>
          </v-window>
        </v-card>
      </v-col>

      <!-- Main panels -->
      <v-col cols="12" sm="6" class="pa-2">
        <v-card>
          <v-tabs v-model="designerTab" bg-color="primary" align-tabs="center">
            <v-tab :value="1">دیزاینر</v-tab>
            <v-tab :value="2">پیش نمایش</v-tab>
            <v-tab :value="3">خروجی</v-tab>
          </v-tabs>

          <v-window v-model="designerTab">
            <!-- Structure designer -->
            <v-window-item :value="1" class="pa-2">
              <FormStructure
                :key="refreshKey"
                :schema="structure.schema"
                @edit-block="editBlock"
                @delete-block="deleteBlock()"
              />
            </v-window-item>

            <!-- From Builder Preview -->
            <v-window-item :value="2" class="pa-2">
              <FormBuilder :key="refreshKey" :structure="structure" />
            </v-window-item>

            <!-- Export json -->
            <v-window-item :value="3" class="pa-4">
              <v-textarea
                :model-value="JSON.stringify(structure)"
                label="JSON Output"
                rows="5"
                dir="auto"
              />

              <pre class="overflow-auto overflow-y-hidden">{{ structure }}</pre>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>

      <!-- Block panels -->
      <v-col cols="12" sm="3" class="pa-2">
        <v-card>
          <v-tabs v-model="addTab" bg-color="primary" align-tabs="center">
            <v-tab :value="1">کنترلرها</v-tab>
            <v-tab :value="2">بلاک های نمایشی</v-tab>
            <v-tab :value="3">ساختار</v-tab>
          </v-tabs>

          <v-window v-model="addTab">
            <v-window-item :value="1">
              <BlockElements :items="inputBlocks" @clicked="designerTab = 1" />
            </v-window-item>

            <v-window-item :value="2">
              <BlockElements :items="layoutBlocks" @clicked="designerTab = 1" />
            </v-window-item>

            <v-window-item :value="3">
              <BlockElements
                :items="structureBlocks"
                @clicked="designerTab = 1"
              />
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.form-blocks .sortable-chosen {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  opacity: 1;
  background: #0d67bb;
  color: white;
}
</style>
