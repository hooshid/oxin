<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { onMounted, computed, ref } from "vue";
import { useField } from "vee-validate";
import http from "@/plugins/http";
import localStore from "@hooshid/local-store";

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
 * Options
 */
const options = computed<{
  /**
   * URL for get data from server
   */
  getUrl: string;

  /**
   * Title field for show in select list
   */
  title: string;

  /**
   * Value field for selected item
   */
  value: string;

  /**
   * TTL for cache data to localStorage
   */
  cacheTime: number | null;
}>(() => {
  return Object.assign(
    {
      getUrl: null,
      title: "title",
      value: "id",
      cacheTime: null,
    },
    props.field.options as never
  );
});

/**
 * Chips items
 */
interface ItemType {
  [key: string]: string | number | null;
}

const items = ref<Array<ItemType>>([]);

/**
 * Get data from server
 */
function getData() {
  // Check data exist in cache
  const cacheKey = "cache_" + options.value.getUrl;
  const cacheTime = options.value.cacheTime;
  if (cacheTime && localStore.has(cacheKey)) {
    items.value = JSON.parse(localStore.get(cacheKey) as string);
    return;
  }

  http.get(options.value.getUrl).then(function (response) {
    items.value = response.data.data;

    // Store data to localStorage if cacheTime exist
    if (cacheTime) {
      localStore.set(cacheKey, JSON.stringify(response.data.data), cacheTime);
    }
  });
}

/**
 * Set data from FormBuilder
 */
function injectItems() {
  if (
    typeof props.field.items == "object" &&
    (typeof props.field.items[0] == "object" ||
      typeof props.field.items[0] == "string")
  ) {
    items.value = props.field.items as ItemType[];
  }
}

/**
 * Set data or get data from server
 */
onMounted(() => {
  // Inject items from FormBuilder
  if (typeof props.field.items === "object") {
    injectItems();
  }
  // Get data from server
  else if (options.value.getUrl) {
    getData();
  }
});

const model = props.parentModel
  ? props.parentModel + "." + props.field.model
  : (props.field.model as string);

// Validation settings
const { value, errorMessage, handleChange } = useField(
  model,
  props.field.validation,
  {
    label: props.field.label,
  }
);

function updateModel(e: unknown) {
  if (e == undefined || typeof e == "undefined") {
    handleChange(null, true);
  } else {
    handleChange(e, true);
  }
}
</script>

<template>
  <div class="d-flex flex-row align-center">
    <div v-if="field.label" class="ml-2">
      {{ field.label }}
    </div>

    <div class="mr-1">
      <v-chip-group
        v-model="value"
        v-bind="field"
        column
        @update:model-value="updateModel"
      >
        <v-chip
          v-for="(item, index) in items"
          :key="index"
          :value="item[options.value]"
        >
          {{ item[options.title] }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>

  <div class="v-messages" style="--v-medium-emphasis-opacity: 1">
    <div
      style="color: rgb(var(--v-theme-error)); min-height: 16px"
      class="mb-2 v-messages__message"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
