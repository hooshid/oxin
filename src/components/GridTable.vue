<script setup lang="ts">
import type IGridTable from "../types/IGridTable";
import type IGridTableHeader from "../types/IGridTableHeader";
import { ref, computed, onMounted, watch } from "vue";
import http from "@/plugins/http";
import FieldItem from "./grid-table/FieldItem.vue";
import Filters from "./grid-table/GridFilters.vue";

/**
 * Props
 */
const props = defineProps<{
  /**
   * Structure of grid table
   */
  structure: IGridTable;

  /**
   * Trigger for update table
   */
  update?: number | boolean;
}>();

/**
 * Emits events
 */
const emit = defineEmits<{
  (e: "click:row", value: object): void;
}>();

/**
 * Watch for change update trigger from props
 */
watch(
  () => props.update,
  () => {
    getData();
  }
);

/**
 * Options
 */
const options = computed<{
  /**
   * Handler URL of data
   */
  getUrl?: string | null | undefined;

  /**
   * Hide toolbar of table
   */
  hideToolbar?: boolean;

  /**
   * Hide footer of table
   */
  hideFooter?: boolean;

  /**
   * Fix height
   */
  fixHeight?: boolean;
}>(() => {
  return Object.assign(
    {
      getUrl: null,
      hideToolbar: false,
      hideFooter: false,
      fixHeight: true,
    },
    props.structure.options
  );
});

/**
 * Items list
 */
const items = ref([]);

/**
 * Total result
 */
const total = ref(0);

/**
 * Loading state
 */
const isLoading = ref(false);

/**
 * Table options
 */
const tableOptions = ref<{
  page: number;
  itemsPerPage: number;
}>({
  page: 1,
  itemsPerPage: 50,
});

/**
 * Paginate change event
 */
watch(
  () => tableOptions.value.page,
  () => {
    getData();
  }
);

/**
 * Get data from server
 */
function getData() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  http
    .get(options.value.getUrl as string, {
      params: {
        page: tableOptions.value.page,
        limit: tableOptions.value.itemsPerPage,
        // order: "title,desc",
        //sort: sort.value.col,
        //order: sort.value.order,
        order: sort.value.col ? sort.value.col + "," + sort.value.order : null,
        conditions: filters.value,
        // search: searchKeyword.value,
      },
    })
    .then(function (response) {
      items.value = response.data.data;
      if (response.data.paginate) {
        total.value = response.data.paginate.total as number;
      }
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
    });
}

/**
 * Grid table header
 */
const headers = ref<Array<IGridTableHeader>>([]);

/**
 * Create header obj structure
 */
function createHeader() {
  headers.value = props.structure.headers.map(function (i) {
    const o = Object.assign({}, i);

    if (typeof o.visible != "undefined") {
      o.visible = i.visible;
    } else {
      o.visible = true;
    }

    if (!o.field && (o.field && !o.field.mode)) {
      if (o.key.endsWith("_date")) {
        o.field = { mode: "shamsi_date" };
      } else if (o.key.endsWith("_datetime") || o.key.endsWith("_at")) {
        o.field = { mode: "shamsi_datetime", class: "dir-ltr" };
      }
    }

    return o;
  });
}

/**
 * Init grid table
 */
onMounted(() => {
  // Create table header
  createHeader();

  // Get data from server
  if (options.value.getUrl) {
    getData();
  } else {
    alert("آدرس دریافت اطلاعات وارد نشده است");
  }
});

/**
 * Filtered headers with visibility prop
 */
const filteredHeaders = computed(() => {
  return headers.value.filter((h) => h.visible);
});

/**
 * Table has search
 */
const hasSearch = computed(() => {
  return headers.value.filter((h) => h.searchType).length != 0;
});

/**
 * Table row click event handler
 * @param item
 */
function clickRow(item: object) {
  if (item) {
    emit("click:row", item);
  }
}

/**
 * Sort on table column
 */
const sort = ref({ col: "", order: "" });

/**
 * Set sort to column
 * @param col
 * @param sortable
 */
function sortCol(col: string, sortable: boolean | undefined) {
  if (sortable == false) {
    return;
  }

  let order = "desc";
  if (sort.value.col == col && sort.value.order == "asc") {
    order = "";
    col = "";
  } else if (sort.value.col == col && sort.value.order == "desc") {
    order = "asc";
  }
  sort.value = { col: col, order: order };

  tableOptions.value.page = 1;

  getData();
}

/**
 * Select number of rows
 * @param number
 */
function setTableLimit(number: number) {
  tableOptions.value.itemsPerPage = number;
  tableOptions.value.page = 1;
  getData();
}

/**
 * Enter page number in input
 * @param event
 */
function setPageNumberManually(event: Event) {
  const totalPage = Math.ceil(total.value / tableOptions.value.itemsPerPage);
  const page = parseInt((event.target as HTMLInputElement).value);

  if (totalPage < page) {
    tableOptions.value.page = totalPage;
    return;
  }

  if (page > 0) {
    tableOptions.value.page = page;
  } else {
    tableOptions.value.page = 1;
  }
}

/**
 * Raw filters (created from filter box)
 */
const filters = ref<string>("[]");

/**
 * Stat of showing filters box
 */
const showFilters = ref(false);

/**
 * Set filters
 * @param sendFilter
 */
function setFilters(sendFilter: string) {
  if (filters.value != sendFilter) {
    filters.value = sendFilter;
    tableOptions.value.page = 1;
    getData();
  }
}
</script>

<template>
  <!-- Filters -->
  <Filters
    v-show="showFilters && hasSearch"
    :structure="structure"
    @filters="setFilters"
  />

  <div id="table">
    <!-- Toolbar -->
    <v-toolbar v-if="!options.hideToolbar" flat color="transparent">
      <v-toolbar-title></v-toolbar-title>

      <v-spacer />

      <div class="mr-4"></div>

      <!-- Filters -->
      <v-btn
        v-if="hasSearch"
        icon
        flat
        class="ml-1"
        @click="showFilters = !showFilters"
      >
        <v-icon>{{ showFilters ? "mdi-filter-off" : "mdi-filter" }}</v-icon>
        <v-tooltip activator="parent" location="top">{{
          showFilters ? "عدم نمایش فیلترها" : "نمایش فیلترها"
        }}</v-tooltip>
      </v-btn>

      <!-- Table Fields -->
      <v-btn icon flat class="ml-1">
        <v-icon>mdi-table-eye</v-icon>
        <v-tooltip activator="parent" location="top">فیلدهای جدول</v-tooltip>

        <v-menu activator="parent" :close-on-content-click="false">
          <v-card>
            <v-list density="comfortable" :width="300">
              <v-list-item
                v-for="item in headers"
                :key="item.key"
                link
                :class="item.visible ? 'bg-green-lighten-5' : ''"
                @click="item.visible = !item.visible"
              >
                <template #prepend>
                  <v-list-item-action start>
                    <v-checkbox-btn
                      :model-value="item.visible"
                      color="green"
                      readonly
                    />
                  </v-list-item-action>
                </template>

                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-btn>

      <!-- Print -->
      <!--
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            large
            v-on="on"
            @click="printTable"
            class="ml-2 d-none d-sm-inline"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </template>
        <span>چاپ</span>
      </v-tooltip>
      -->

      <!-- Download -->
      <!--
      <v-tooltip top>
          <template v-slot:activator="{ on }">
              <v-btn icon large v-on="on" class="ml-2">
                  <v-icon>mdi-download</v-icon>
              </v-btn>
          </template>
          <span>دانلود</span>
      </v-tooltip>
      -->

      <!-- Refresh -->
      <v-btn
        v-if="options.getUrl"
        icon
        flat
        class="ml-1 d-none d-sm-inline"
        @click.stop="getData()"
      >
        <v-icon>mdi-refresh</v-icon>
        <v-tooltip activator="parent" location="top">تازه سازی</v-tooltip>
      </v-btn>

      <!-- Auto Refresh -->
      <!--
      <v-tooltip top>
          <template v-slot:activator="{ on }">
              <v-btn @click.stop="getData()" v-model="tableIsFullScreen" icon large v-on="on" class="ml-2 d-none d-sm-inline" v-if="options.getUrl">
                  <v-icon>mdi-update</v-icon>
              </v-btn>
          </template>
          <span>تازه سازی خودکار</span>
      </v-tooltip>
      -->

      <!-- Search -->
      <!--
      <v-text-field
        v-model="searchKeyword"
        label="جستجو"
        append-inner-icon="mdi-magnify"
        clearable
        density="comfortable"
        variant="filled"
        hide-details
        rounded-
        single-line
        class="search-input mx-2"
        style="max-width: 400px"
        dir="auto"
      />
      -->
      <div class="ml-4"></div>
    </v-toolbar>

    <v-table
      :fixed-header="options.fixHeight"
      :heights="options.fixHeight ? 'calc(100vh - 300px) !important' : ''"
      :height="options.fixHeight && total != 0 ? '600px' : ''"
      hover
    >
      <thead>
        <!-- Title cols -->
        <tr>
          <th
            v-for="h in filteredHeaders"
            :key="h.key"
            :class="[
              { sortable: h.sortable != false },
              { active: sort.col == h.key },
              sort.order,
            ]"
            @click="sortCol(h.key, h.sortable)"
          >
            {{ h.title }}

            <v-icon icon="mdi-arrow-up" class="sort-icon" />
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Loading -->
        <tr>
          <td
            colspan="100000"
            style="padding: 0; margin: 0; height: 0; border: 0 !important"
          >
            <v-progress-linear
              :active="isLoading"
              :height="8"
              indeterminate
              color="green"
            />
          </td>
        </tr>

        <tr v-for="(item, index) in items" :key="index" @click="clickRow(item)">
          <td v-for="h in filteredHeaders" :key="h.key">
            <slot :name="`item.${h.key}`" :value="item[h.key]" :item="item">
              <FieldItem :value="item[h.key]" :structure="h.field" />
            </slot>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-alert v-show="total == 0 && !isLoading" type="error">
      هیچ نتیجه ای جهت نمایش وجود ندارد
    </v-alert>

    <v-divider v-if="!options.hideFooter" />

    <!-- Footer -->
    <div
      v-if="!options.hideFooter"
      class="text-body-2 px-4 py-2 d-flex table-footer"
    >
      <v-sheet class="d-flex">
        <v-sheet v-show="total > 1000" class="pa-1 align-self-center">
          <v-text-field
            :model-value="tableOptions.page"
            prefix="صفحه"
            variant="outlined"
            density="compact"
            hide-details
            @keyup.enter="setPageNumberManually"
          />
        </v-sheet>

        <v-sheet v-show="total > 0" class="pa-1 align-self-center">
          <div class="d-inline-block" style="max-width: 500px">
            <v-pagination
              v-model="tableOptions.page"
              :length="Math.ceil(total / tableOptions.itemsPerPage)"
              :total-visible="7"
              density="compact"
              show-first-last-page
              rounded
            />
          </div>
        </v-sheet>
      </v-sheet>

      <v-spacer />

      <v-sheet class="d-flex">
        <v-sheet class="pa-1 align-self-center">
          نمایش {{ (tableOptions.page - 1) * tableOptions.itemsPerPage + 1 }} تا
          {{
            total >
            (tableOptions.page - 1) * tableOptions.itemsPerPage +
              tableOptions.itemsPerPage
              ? (tableOptions.page - 1) * tableOptions.itemsPerPage +
                tableOptions.itemsPerPage
              : total
          }}
          از {{ total }} ردیف
        </v-sheet>

        <v-sheet class="pa-1 align-self-center total">
          <v-select
            :model-value="tableOptions.itemsPerPage"
            :items="[25, 50, 100, 200, 300]"
            variant="underlined"
            hide-details
            @update:model-value="setTableLimit"
          />
        </v-sheet>
      </v-sheet>
    </div>
  </div>
</template>
