<script setup lang="ts">
import type IGridTableHeader from "../../types/IGridTableHeader";
import { ref, computed, onMounted } from "vue";
import DatetimePicker from "vue3-persian-datetime-picker";
import localStore from "@hooshid/local-store";
import http from "@/plugins/http";
import { miladiToShamsiDate } from "../../utils/functions";
import moment from "moment-jalaali";

// TODO فیلترها رو باید ریفکتور کنم
// TODO فیلترهایی که پیشفرض هستند روی جدول اعمال نمیشن تا زمانی که دکمه اعمال فیلتر رو بزنیم
// TODO اگر بشه فیلترهای کاستوم و فیلتر گرید باهم ادغام بشه و با هم مدیریت بشن

interface IStructure {
  headers: Array<IGridTableHeader>;
  // TODO remove or change to extra filters ?
  filters?: Array<{
    type: "btn-toggle";
    value: string;
    items: Array<{
      text: string;
      value: string;
      isDefault?: boolean;
    }>;
  }>;
}

/**
 * Props
 */
const props = defineProps<{
  /**
   * Structure of grid table
   */
  structure: IStructure;
}>();

/**
 * Emits events
 */
const emit = defineEmits<{
  (e: "filters", value: string): void;
}>();

/**
 * Filtered headers with visibility & search prop
 */
const searchStructure = computed(() => {
  return props.structure.headers.filter(
    (val) => val.searchType != undefined && val.visible != false
  );
});

interface IFilterValueTypes {
  [key: string]: string | number | boolean | undefined | null;
}

interface IFilterSelectItemsTypes {
  [key: string]: string[];
}

/**
 * Items of select lists
 */
const filtersSelectItems = ref<IFilterSelectItemsTypes>({});

interface IFilterTypes {
  [key: string]: string;
}

/**
 * Comparison operations
 */
const filterMethods = ref<IFilterTypes>({});

/**
 * Filters values
 */
const filterValues = ref<IFilterValueTypes>({});

/**
 * Filter values for type date & datetime
 */
const filterValuesDateJalali = ref<IFilterValueTypes>({});

/**
 * Set default comparison methods
 */
function setDefaultComparisons() {
  props.structure.headers.map(function (o) {
    if (o.searchType == "string") {
      filterMethods.value[o.key] = "like_wildcard";
    } else if (o.searchType) {
      filterMethods.value[o.key] = "equal";
    }
  });
}

/**
 * Reset all filters
 */
function resetFilters() {
  filterValues.value = {};
  filterValuesDateJalali.value = {};
  setDefaultComparisons();
  saveFilter();
}

/**
 * Init
 */
onMounted(() => {
  setDefaultComparisons();

  props.structure.headers.forEach((item: IGridTableHeader) => {
    if (item.searchType == "select" && item.searchOptions?.getUrlItems) {
      getData(item);
    } else if (item.searchType == "select" && item.searchOptions?.searchItems) {
      filtersSelectItems.value[item.key] = item.searchOptions
        .searchItems as unknown as string[];
    }
  });

  // Make default filters
  if (props.structure.filters) {
    props.structure.filters.forEach((element) => {
      if (element.type == "btn-toggle" && element.value) {
        const defaultValue = element.items.filter((s) => s.isDefault == true);
        if (defaultValue) {
          filterMethods.value[element.value] = "equal";
          filterValues.value[element.value] = defaultValue[0].value;
        }
      }
    });
  }
});

/**
 * Get select list data
 * @param header
 */
function getData(header: IGridTableHeader) {
  // Check data exist in cache
  const cacheKey = "cache_" + header.searchOptions?.getUrlItems;
  const cacheTime = header.searchOptions?.cacheTime;
  if (cacheTime && localStore.has(cacheKey)) {
    filtersSelectItems.value[header.key] = JSON.parse(
      localStore.get(cacheKey) as string
    ).concat(header.searchOptions?.searchItems ?? []);
    return;
  }

  http
    .get(header.searchOptions?.getUrlItems as string)
    .then(function (response) {
      filtersSelectItems.value[header.key] = response.data.data.concat(
        header.searchOptions?.searchItems ?? []
      );

      // Store data to localStorage if cacheTime exist
      if (cacheTime) {
        localStore.set(cacheKey, JSON.stringify(response.data.data), cacheTime);
      }
    });
}

/**
 * Make filters and send event to parent
 */
function saveFilter() {
  emit("filters", JSON.stringify(makeFilters()));
}

/**
 * Create filters
 */
function makeFilters() {
  const filters = [];

  for (const key in filterMethods.value) {
    const comparison = filterMethods.value[key];
    let value = filterValues.value[key];
    const type = props.structure.headers.filter((h) => h.key == key)[0]
      ?.searchType;

    if (
      (comparison && value && value?.toString() != "") ||
      value === 0 ||
      comparison === "is_null" ||
      comparison === "is_not_null"
    ) {
      if (type == "select" && value && typeof value == "object") {
        value = (value as Array<string>).join("|");
      } else if (type == "date" && value && typeof value == "object") {
        value = (value as Array<string>).join("|");
      }

      filters.push({
        key,
        comparison,
        value,
        type,
      });
    }
  }

  return filters;
}

/**
 * Check object is null or not
 * @param obj
 */
function isEmpty(obj: object) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

/**
 * Icons list for selects in input
 */
const icons: IFilterTypes = {
  equal: "mdi-equal",
  unequal: "mdi-not-equal-variant",
  like_wildcard: "mdi-alphabetical-variant",
  unlike_wildcard: "mdi-alphabetical-variant-off",
  is_null: "mdi-circle-outline",
  is_not_null: "mdi-circle-off-outline",
  gte: "mdi-greater-than",
  lte: "mdi-less-than",
  between: "mdi-code-parentheses",
  in: "mdi-code-brackets",
};

/**
 * Filters for string type
 */
const stringFilters = [
  // { title: "مشابه", value: "like" },
  {
    title: "شامل",
    value: "like_wildcard",
    props: {
      prependIcon: "mdi-alphabetical-variant",
    },
  },
  // { title: "عدم تشابه", value: "unlike" },
  {
    title: "عدم شامل",
    value: "unlike_wildcard",
    props: {
      prependIcon: "mdi-alphabetical-variant-off",
    },
  },
  {
    title: "مساوی",
    value: "equal",
    props: {
      prependIcon: "mdi-equal",
    },
  },
  {
    title: "نامساوی",
    value: "unequal",
    props: {
      prependIcon: "mdi-not-equal-variant",
    },
  },
  /*
  TODO این 2 فیلتر هم مقدار value رو ست نمی کنه و مشکل داره
  {
    title: "فیلد خالی باشد",
    value: "is_null",
    props: {
      prependIcon: "mdi-circle-outline",
    },
  },
  {
    title: "فیلد خالی نباشد",
    value: "is_not_null",
    props: {
      prependIcon: "mdi-circle-off-outline",
    },
  },
  */
];

/**
 * Filters for numeric type
 */
const numericFilters = [
  {
    title: "مساوی",
    value: "equal",
    props: {
      prependIcon: "mdi-equal",
    },
  },
  {
    title: "نامساوی",
    value: "unequal",
    props: {
      prependIcon: "mdi-not-equal-variant",
    },
  },
  // { title: "بزرگتر >", value: "gt" },
  {
    title: "بزرگتر",
    value: "gte",
    props: {
      prependIcon: "mdi-greater-than",
    },
  },
  // { title: "کوچکتر <", value: "lt" },
  {
    title: "کوچکتر",
    value: "lte",
    props: {
      prependIcon: "mdi-less-than",
    },
  },
  /*
  TODO این 2 فیلتر با تاریخ مشکل داره و باید درست بشه
  {
    title: "بین محدوده",
    value: "between",
    props: {
      prependIcon: "mdi-code-parentheses",
    },
  },
  // { title: "خارج از محدوده not between", value: "not_between" },
  {
    title: "در محدوده",
    value: "in",
    props: {
      prependIcon: "mdi-code-brackets",
    },
  },
  */
  // { title: "not in خارج از محدوده", value: "not_in" },
  /*
  {
    title: "فیلد خالی باشد",
    value: "is_null",
    props: {
      prependIcon: "mdi-circle-outline",
    },
  },
  {
    title: "فیلد خالی نباشد",
    value: "is_not_null",
    props: {
      prependIcon: "mdi-circle-off-outline",
    },
  },
  */
];

/**
 * Convert Shamsi date to Miladi
 * @param key
 */
function convertShamsiToMiladi(key: string) {
  if (
    !filterValuesDateJalali.value[key] ||
    !moment(
      filterValuesDateJalali.value[key]?.toString().trim(),
      "jYYYY/jMM/jDD",
      true
    ).isValid()
  ) {
    filterValues.value[key] = null;
    return;
  }

  filterValues.value[key] = moment(
    filterValuesDateJalali.value[key]?.toString().trim(),
    "jYYYY/jMM/jDD",
    true
  ).format("YYYY-MM-DD");
}

/**
 * Convert Miladi to Shamsi date
 * @param key
 */
function convertMiladiToShamsi(key: string) {
  if (!filterValues.value[key]) {
    filterValuesDateJalali.value[key] = null;
    return;
  }

  filterValuesDateJalali.value[key] = miladiToShamsiDate(
    filterValues.value[key]
  );
}

/**
 * Set filter and save
 * @param key
 * @param val
 */
function setFilter(key: string, val: string | number) {
  filterMethods.value[key] = "equal";
  filterValues.value[key] = val;
  saveFilter();
}
</script>

<template>
  <v-sheet class="pa-1 filter-box bg-grey-lighten-3 pa-2 rounded mx-4 border">
    <!--
    <div class="text-left">
      {{ filterMethods }}
      <br />
      {{ filterValues }}
    </div>
    -->

    <v-form autocomplete="off" @submit.prevent="saveFilter()">
      <v-container fluid>
        <v-row>
          <v-col
            v-for="(item, index) in props.structure.filters"
            :key="index"
            lg="auto"
            md="auto"
            sm="6"
            cols="12"
            class="pa-1"
          >
            <div v-if="(item.type = 'btn-toggle')">
              <v-btn-toggle
                v-model="filterValues[item.value]"
                color="primary"
                mandatory
                density="comfortable"
                variant="outlined"
                class="transparent"
                divided
                style="--v-border-opacity: 0.4"
              >
                <v-btn
                  v-for="(i, idx) in item.items"
                  :key="idx"
                  :value="i.value"
                  style="--v-border-opacity: 0.4"
                  @click="setFilter(item.value, i.value)"
                >
                  {{ i.text }}
                </v-btn>
              </v-btn-toggle>
            </div>
          </v-col>

          <v-col
            v-for="h in searchStructure"
            :key="h.key"
            :lg="h.searchType == 'boolean' ? 'auto' : 2"
            :md="h.searchType == 'boolean' ? 'auto' : 3"
            sm="6"
            cols="12"
            class="pa-1"
          >
            <template
              v-if="h.searchType == 'string' || h.searchType == 'numeric'"
            >
              <v-text-field
                v-model="filterValues[h.key]"
                :label="h.title"
                hide-details
                clearable
              >
                <template #prepend-inner>
                  <v-btn variant="text" size="small" icon>
                    <v-icon :icon="icons[filterMethods[h.key]]" />

                    <v-menu activator="parent">
                      <v-list
                        :items="
                          h.searchType == 'numeric'
                            ? numericFilters
                            : stringFilters
                        "
                        :model-value="filterMethods[h.key]"
                        @update:selected="
                          filterMethods[h.key] = $event.toString()
                        "
                      />
                    </v-menu>
                  </v-btn>
                </template>
              </v-text-field>
            </template>

            <template v-else-if="h.searchType == 'date'">
              <v-text-field
                v-model="filterValuesDateJalali[h.key]"
                :label="h.title"
                hide-details
                clearable
                @update:model-value="convertShamsiToMiladi(h.key)"
                @click:clear="filterValues[h.key] = null"
              >
                <template #prepend-inner>
                  <v-btn variant="text" size="small" icon>
                    <v-icon :icon="icons[filterMethods[h.key]]" />

                    <v-menu activator="parent">
                      <v-list
                        :items="numericFilters"
                        :model-value="filterMethods[h.key]"
                        density="compact"
                        @update:selected="
                          filterMethods[h.key] = $event.toString()
                        "
                      >
                      </v-list>
                    </v-menu>
                  </v-btn>
                </template>

                <template #append-inner>
                  <v-btn variant="text" size="small" icon>
                    <v-icon icon="mdi-calendar" />

                    <v-menu
                      activator="parent"
                      location="bottom end"
                      :close-on-content-click="false"
                    >
                      <v-card>
                        <DatetimePicker
                          v-model="filterValues[h.key]"
                          format="YYYY-MM-DD"
                          element="picker"
                          inline
                          simple
                          auto-submit
                          :range="filterMethods[h.key] == 'between'"
                          :multiple="filterMethods[h.key] == 'in'"
                          @change="convertMiladiToShamsi(h.key)"
                        />
                      </v-card>
                    </v-menu>
                  </v-btn>
                </template>
              </v-text-field>
            </template>

            <template v-else-if="h.searchType == 'select'">
              <v-select
                v-model="filterValues[h.key]"
                :items="filtersSelectItems[h.key]"
                :label="h.title"
                hide-details
                clearable
                multiple
              >
                <template #prepend-inner>
                  <v-btn variant="text" size="small" icon>
                    <v-icon
                      :icon="
                        filterMethods[h.key]
                          ? icons[filterMethods[h.key]]
                          : 'mdi-form-select'
                      "
                    />

                    <v-menu activator="parent">
                      <v-list
                        :items="stringFilters"
                        :model-value="filterMethods[h.key]"
                        density="compact"
                        @update:selected="
                          filterMethods[h.key] = $event.toString()
                        "
                      >
                      </v-list>
                    </v-menu>
                  </v-btn>
                </template>
              </v-select>
            </template>

            <template v-else-if="h.searchType == 'boolean'">
              {{ h.title }}
              <v-btn-toggle
                v-model="filterValues[h.key]"
                density="comfortable"
                variant="outlined"
                divided
                style="--v-border-opacity: 0.4"
              >
                <v-btn :value="1" color="green" style="--v-border-opacity: 0.4">
                  <v-icon>mdi-check</v-icon>
                </v-btn>

                <v-btn :value="0" color="red">
                  <v-icon>mdi-window-close</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-col>

          <!-- Actions btn -->
          <v-col cols="auto" class="pa-0 pl-1 d-flex mr-auto">
            <v-spacer />

            <v-btn
              v-show="!isEmpty(filterValues)"
              color="red"
              variant="outlined"
              class="mt-1 ml-2"
              @click.stop="resetFilters()"
            >
              حذف فیلترها
            </v-btn>

            <v-btn
              type="submit"
              color="green"
              variant="flat"
              class="mt-1"
              :disabled="isEmpty(filterValues)"
            >
              اعمال فیلترها
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-sheet>
</template>
