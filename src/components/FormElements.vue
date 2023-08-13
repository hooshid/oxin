<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import type IFormBuilderField from "../types/IFormBuilderField";
import { defineAsyncComponent } from "vue";
import TextElement from "./form-builder/elements/TextElement.vue";
import SwitchElement from "./form-builder/elements/SwitchElement.vue";
import SelectElement from "./form-builder/elements/SelectElement.vue";
import AutocompleteElement from "./form-builder/elements/AutocompleteElement.vue";
import DateTimePickerElement from "./form-builder/elements/DateTimePickerElement.vue";
import TimePickerElement from "./form-builder/elements/TimePickerElement.vue";
//import MediaPicker from './FormBuilder/MediaPicker';
import ChipGroupElement from "./form-builder/elements/ChipGroupElement.vue";
import UploadElement from "./form-builder/elements/UploadElement.vue";
import AlertMessageBlock from "./form-builder/blocks/AlertMessageBlock.vue";
import RepeatableBlock from "./form-builder/blocks/RepeatableBlock.vue";
const EditorElement = defineAsyncComponent(
  () => import("./form-builder/elements/EditorElement.vue")
);

defineProps<{
  /**
   * Form Builder Structure
   */
  schema?: Array<IFormBuilderField>;

  /**
   * Parent model name
   */
  parentModel?: string;

  /**
   * Data from FormBuilder
   */
  data?: object;
}>();
</script>

<template>
  <v-card-text>
    <!-- <pre>{{ Object.keys($slots) }}</pre> -->
    <v-row>
      <template v-for="(field, index) in schema" :key="index">
        <v-col
          v-if="field.type"
          v-show="!field.hide"
          :md="field.col"
          cols="12"
          :class="'form-col-' + field.model"
          class="py-0 px-1"
        >
          <slot :name="`${field.model}`" :field="field">
            <!-- Input & Textarea -->
            <TextElement
              v-if="field.type === 'input' || field.type === 'textarea'"
              :field="field"
              :parent-model="parentModel"
            >
              <template
                v-for="(_, name) in Object.keys($slots)
                  .filter((key) => key.includes(field.model + '.'))
                  .reduce((cur, key) => {
                    return Object.assign(cur, {
                      [key.replace(field.model + '.', '')]: $slots[key],
                    });
                  }, {})"
                #[name]="slotData"
              >
                <slot
                  :name="field.model + '.' + name"
                  v-bind="slotData || {}"
                />
              </template>
            </TextElement>

            <!-- Switch -->
            <SwitchElement
              v-else-if="field.type === 'switch'"
              :field="field"
              :parent-model="parentModel"
            />

            <!-- Select -->
            <SelectElement
              v-else-if="field.type === 'select'"
              :field="field"
              :parent-model="parentModel"
            />

            <!-- AutoComplete -->
            <AutocompleteElement
              v-else-if="field.type === 'autocomplete'"
              :field="field"
              :parent-model="parentModel"
              :data="data"
            />

            <!-- Date & DateTime Picker -->
            <DateTimePickerElement
              v-else-if="field.type === 'date' || field.type === 'datetime'"
              :field="field"
              :parent-model="parentModel"
            />

            <!-- Time Picker -->
            <TimePickerElement
              v-else-if="field.type === 'time'"
              :field="field"
              :parent-model="parentModel"
            />

            <!-- Upload File -->
            <UploadElement
              v-else-if="field.type === 'upload'"
              :field="field"
              :parent-model="parentModel"
            />

            <!-- Editor -->
            <EditorElement
              v-else-if="field.type === 'editor'"
              :field="field"
              :parent-model="parentModel"
            />

            <!-- Chip Group -->
            <ChipGroupElement
              v-else-if="field.type === 'chip-group'"
              :field="field"
              :parent-model="parentModel"
            />

            <!-- Media Picker -->
            <!--
          <template v-else-if="field.type==='media-picker'">
            <media-picker :field="field" v-model="fields[field.model]" :data="model" :key="removeCacheKey"/>
          </template>
          -->

            <!-- Alert Message -->
            <AlertMessageBlock
              v-else-if="field.type === 'alert'"
              :field="field"
            />

            <!-- Divider -->
            <v-divider
              v-else-if="field.type === 'divider'"
              class="mb-4"
              :class="field.class"
            />

            <!-- HTML -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div
              v-else-if="field.type === 'html'"
              :class="field.class ? field.class : ''"
              v-html="field.html"
            ></div>

            <!-- Container -->
            <FormElements
              v-else-if="field.type === 'container'"
              :schema="field.schema"
              :parent-model="parentModel"
            />

            <!-- Repeatable -->
            <RepeatableBlock
              v-else-if="field.type === 'repeatable'"
              :field="field"
              :parent-model="parentModel"
              :data="data"
            />

            <template v-else>{{ field.type }}</template>
          </slot>
        </v-col>
      </template>
    </v-row>
  </v-card-text>
</template>
