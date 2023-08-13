<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { ref, computed, onMounted } from "vue";
import { useField } from "vee-validate";
import { watchDebounced } from "@vueuse/core";
import http from "@/plugins/http";

interface IObject {
  [key: string]: string;
}

const props = defineProps<{
  /**
   * Field structure
   */
  field: IFormBuilderField;

  /**
   * Parent model name
   */
  parentModel?: string;

  // data from FormBuilder
  data?: object;
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
   * Title for show in select list
   */
  itemTitle: string;

  /**
   * SubTitle for show in select list
   */
  itemSubtitle: string;

  /**
   * Value for selected item
   */
  itemValue: string;

  /**
   * Prepend icon in select list
   */
  prependIcon: string;

  /**
   * Prepend avatar in select list
   */
  prependAvatar: string;

  /**
   * Return full object of selected item
   */
  returnObject: boolean;

  /**
   * No Filter?
   */
  noFilter: boolean;

  /**
   * Hide no data text
   */
  hideNoData: boolean;

  /**
   * Inject fields
   */
  injectFields: { [key: string]: string };

  /**
   * Field name in DataBase for search
   */
  searchField: string;

  /**
   * Search Comparison method
   */
  comparisonField: string;
}>(() => {
  return Object.assign(
    {
      getUrl: null,
      itemTitle: "title",
      itemSubtitle: null,
      itemValue: "id",
      prependIcon: null,
      prependAvatar: null,
      returnObject: false,
      noFilter: true,
      hideNoData: true,
      injectFields: {},
      searchField: null,
      comparisonField: "like_wildcard",
    },
    props.field.options as never
  );
});

/**
 * Search model
 */
const search = ref<string | undefined>();

/**
 * Watch changes from search model
 */
watchDebounced(
  search,
  (value) => {
    if (value) {
      autocompleteSearch(value);
    }
  },
  { debounce: 1400 }
);

/**
 * Items for autocomplete
 */
//const items = ref<Array<object>>([]);
const items = ref<Array<IObject>>([]);

/**
 * Loading state
 */
const isLoading = ref(false);

/**
 * Selected item
 */
const selected = ref<string | null>(null);

/**
 * isReady state
 */
const isReady = ref(false);

/**
 * When search is activate
 */
const searchIsActive = ref(true);

/**
 * Run search api to get list of items
 * @param search
 */
function autocompleteSearch(search: string) {
  // isReady must true OR searchIsActive must true
  if (isReady.value === false || searchIsActive.value === false) {
    return;
  }

  //  if model have data and search text is equal to selected item
  if (value && search == selected.value) {
    return;
  }

  // if getUrl not provided we can't search
  if (!options.value.getUrl) {
    return;
  }

  const filters = [
    {
      key: options.value.searchField
        ? options.value.searchField
        : options.value.itemTitle,
      comparison: options.value.comparisonField,
      value: search,
    },
  ];

  isLoading.value = true;
  http
    .get(options.value.getUrl, {
      params: {
        conditions: JSON.stringify(filters),
      },
    })
    .then(function (response) {
      items.value = response.data.data;
      isLoading.value = false;

      if (selectedItems.value.length) {
        items.value = items.value.concat(selectedItems.value);
      }
    });
}

/**
 * Preparation form
 */
function preparation() {
  if (selected.value) {
    return;
  }

  isReady.value = false;

  const data = props.data as { [key: string]: string };

  if (data && typeof data == "object" && data[props.field.model as string]) {
    // model.value = data[props.field.model as string];
    items.value = [];

    /*
    if (!this.options.injectFields) {
      vm.loading = true;
      vm.deactivateSearch();
      vm.$http
        .get(vm.field.options.searchUrl, {
          params: {
            search_by_id: vm.model,
          },
        })
        .then(function (response) {
          vm.items = response.data.data;
        })
        .finally(function () {
          vm.loading = false;
        });
    } else
    */

    if (options.value.injectFields) {
      const obj: { [key: string]: string } = {};

      if (options.value.injectFields.itemValue) {
        obj[options.value.itemValue] = data[options.value.injectFields.itemValue];
      } else {
        obj[options.value.itemValue] = data[props.field.model as string];
      }

      if (options.value.injectFields.itemTitle) {
        obj[options.value.itemTitle] = data[options.value.injectFields.itemTitle];
        // in init we put the title in selected for prevent to request to server
        selected.value = obj[options.value.itemTitle];
      }

      if (options.value.injectFields.itemSubtitle) {
        obj[options.value.itemSubtitle] = data[options.value.injectFields.itemSubtitle];
      }

      if (options.value.injectFields.prependAvatar) {
        obj[options.value.prependAvatar] =
          data[options.value.injectFields.prependAvatar];
      }

      items.value.push(obj);
    }
  } else {
    resetForm();
  }

  setTimeout(function () {
    isReady.value = true;
  }, 2000);
}

/**
 * Reset form
 */
function resetForm() {
  // console.log("resetForm");
  /*
  model.value = null;
  items.value = [];
  isLoading.value = false;
  search.value = null;
  selected.value = null;
  */
}

const selectedItems = ref<Array<IObject>>([]);
/**
 * Select item in autocomplete select list
 * @param select
 */
function selectItem(select: unknown) {
  selected.value = (select as { raw: IObject }).raw[options.value.itemTitle];
  deactivateSearch();

  if (!props.field.multiple) {
    selectedItems.value = [];
  }
  selectedItems.value.push((select as { raw: IObject }).raw);
}

/**
 * Disable search for 1.5 sec
 */
function deactivateSearch() {
  searchIsActive.value = false;

  setTimeout(function () {
    searchIsActive.value = true;
  }, 1500);
}

/**
 * First init
 */
onMounted(() => {
  // set default value if not provided
  if (typeof props.field.options?.injectFields == "undefined") {
    options.value.injectFields.itemTitle = options.value.itemTitle;
    options.value.injectFields.itemSubtitle = options.value.itemSubtitle;
    options.value.injectFields.prependAvatar = options.value.prependAvatar;
  }

  preparation();
});

const model = props.parentModel
  ? props.parentModel + "." + props.field.model
  : (props.field.model as string);

// Validation settings
const { value, errors, handleChange } = useField(
  model,
  props.field.validation,
  {
    label: props.field.label || props.field.model,
  }
);
</script>

<template>
  <v-autocomplete
    v-model="value"
    v-model:search="search"
    v-bind="field"
    :items="items"
    :item-title="options.itemTitle"
    :item-value="options.itemValue"
    :loading="isLoading"
    :return-object="options.returnObject"
    :no-filter="options.noFilter"
    :hide-no-data="options.hideNoData"
    :error-messages="errors"
    @update:model-value="handleChange"
    @click:clear="selectedItems = []"
  >
    <template #item="{ props: autocompleteProps, item }">
      <v-list-item
        v-bind="autocompleteProps"
        :subtitle="item.raw[options.itemSubtitle]"
        :prepend-icon="options.prependIcon"
        :prepend-avatar="options.prependAvatar"
        @click="selectItem(item)"
      />
    </template>
  </v-autocomplete>
</template>
