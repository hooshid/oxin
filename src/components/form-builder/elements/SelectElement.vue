<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { ref, computed, onMounted } from "vue";
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
  itemTitle: string;

  /**
   * Value field for selected item
   */
  itemValue: string;

  /**
   * TTL for cache data to localStorage
   */
  cacheTime: number | null;
}>(() => {
  return Object.assign(
    {
      getUrl: null,
      itemTitle: "title",
      itemValue: "id",
      cacheTime: null,
    },
    props.field.options as never
  );
});

/**
 * Items for select list
 */
const items = ref<Array<object>>([]);

/**
 * Loading state
 */
const isLoading = ref(false);

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

  isLoading.value = true;

  http.get(options.value.getUrl).then(function (response) {
    items.value = response.data.data;

    // Store data to localStorage if cacheTime exist
    if (cacheTime) {
      localStore.set(cacheKey, JSON.stringify(response.data.data), cacheTime);
    }

    isLoading.value = false;
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
    items.value = props.field.items;
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
const { value, errors, handleChange } = useField(
  model,
  props.field.validation,
  {
    label: props.field.label,
  }
);
</script>

<template>
  <v-autocomplete
    v-model="value"
    v-bind="field"
    :items="items"
    :item-title="options.itemTitle"
    :item-value="options.itemValue"
    :loading="isLoading"
    :error-messages="errors"
    @update:model-value="handleChange"
  />
</template>
