<script setup lang="ts">
import type IGridTable from "../../types/IGridTable";
import { ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import GridTable from "../../components/GridTable.vue";
import draggable from "vuedraggable";

const props = defineProps<{
  /**
   * Grid Table Structure
   */
  structure: IGridTable;
}>();

/**
 * Table structure
 */
const structure = ref(props.structure);

/**
 * Drag state
 */
const dragState = ref(false);

/**
 * Show settings column
 */
const show = ref();

/**
 * Add new column to table
 */
function addNewColumn() {
  structure.value.headers.push({ title: "عنوان", key: "key" });
}

/**
 * Delete column by index
 * @param index
 */
function deleteColumn(index: number) {
  structure.value.headers.splice(index, 1);
}

/**
 * Edit column options
 * @param index
 */
function editColumn(index: number) {
  if (show.value == index) {
    show.value = null;
  } else {
    show.value = index;
  }
}

/**
 * Refresh key for GridTable changes
 */
const refreshKey = ref(0);

/**
 * Watch changes from setting panel
 */
watchDebounced(
  structure.value,
  () => {
    refreshKey.value++;
  },
  { debounce: 2500 }
);
</script>

<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <!-- Grid table -->
      <v-col cols="12" sm="8" class="py-4 px-2">
        <v-card>
          <GridTable :key="refreshKey" :structure="structure" />
        </v-card>
      </v-col>

      <v-col cols="12" sm="4" class="py-4 px-2">
        <v-expansion-panels variant="accordion" class="rounded-0">
          <!-- Structure & Settings -->
          <v-expansion-panel title="ساختار جدول">
            <v-expansion-panel-text>
              <div class="rounded border">
                <draggable
                  v-model="structure.headers"
                  class="list-group"
                  :component-data="{
                    tag: 'div',
                    type: 'transition-group',
                    name: !dragState ? 'flip-list' : null,
                  }"
                  :animation="200"
                  item-key="order"
                  ghost-class="ghost"
                  handle=".handle"
                  @start="
                    dragState = true;
                    show = null;
                  "
                  @end="dragState = false"
                >
                  <template #item="{ element, index }">
                    <v-row no-gutters class="py-2 border-b">
                      <!-- Handle draggable btn -->
                      <v-col
                        cols="1"
                        class="d-flex justify-center align-center"
                      >
                        <v-btn
                          variant="text"
                          size="small"
                          icon="mdi-cursor-move"
                          class="handle"
                        />
                      </v-col>

                      <!-- Title & Key -->
                      <v-col
                        cols="8"
                        class="d-flex align-self-center align-center"
                      >
                        {{ element.title }}
                        <br />
                        {{ element.key }}
                      </v-col>

                      <!-- Edit & Delete btn -->
                      <v-col cols="auto" class="ms-auto">
                        <v-btn
                          variant="text"
                          size="small"
                          icon="mdi-cog"
                          @click="editColumn(index)"
                        />

                        <v-btn
                          variant="text"
                          size="small"
                          icon="mdi-delete"
                          @click="deleteColumn(index)"
                        />
                      </v-col>

                      <!-- Edit panel of selected item -->
                      <v-expand-transition>
                        <div v-show="show == index" class="w-100">
                          <v-card-text>
                            <!-- Title -->
                            <v-text-field
                              v-model="element.title"
                              label="عنوان"
                              dir="auto"
                            />

                            <!-- Key -->
                            <v-text-field
                              v-model="element.key"
                              label="فیلد"
                              dir="auto"
                            />

                            <!-- Search type -->
                            <v-select
                              v-model="element.searchType"
                              :items="[
                                'string',
                                'numeric',
                                'date',
                                'boolean',
                                'select',
                              ]"
                              label="جستجو"
                              clearable
                            />

                            <!-- Select settings -->
                            <div v-if="element.searchType == 'select'">
                              <div
                                class="bg-grey-lighten-3- bg-green pa-2 rounded mb-4"
                              >
                                تنظیمات Select
                              </div>

                              <!-- JSON -->
                              <v-textarea
                                :model-value="
                                  element.searchOptions.searchItems
                                    ? JSON.stringify(
                                        element.searchOptions.searchItems
                                      )
                                    : undefined
                                "
                                label="JSON"
                                placeholder='[{"title":"...","value":"..."}]'
                                auto-grow
                                rows="2"
                                dir="auto"
                                clearable
                                @update:model-value="
                                  element.searchOptions.searchItems = $event
                                    ? JSON.parse($event)
                                    : undefined
                                "
                              />

                              <!-- URL -->
                              <v-textarea
                                v-model="element.searchOptions.getUrlItems"
                                label="دریافت از آدرس"
                                auto-grow
                                rows="2"
                                dir="auto"
                                clearable
                              />

                              <!-- Cache time -->
                              <v-select
                                v-show="element.searchOptions.getUrlItems"
                                v-model="element.searchOptions.cacheTime"
                                :items="[
                                  '1h',
                                  '2h',
                                  '3h',
                                  '6h',
                                  '12h',
                                  '1d',
                                  '7d',
                                ]"
                                label="مدت زمان کش"
                                clearable
                              />
                            </div>

                            <!-- Column visibility -->
                            <v-switch
                              v-model="element.visible"
                              label="مخفی کردن ستون"
                              :true-value="false"
                              :false-value="true"
                              hide-details
                              inset
                            />

                            <!-- Column sortable -->
                            <v-switch
                              v-model="element.sortable"
                              label="غیر فعال سازی سورت"
                              :true-value="false"
                              :false-value="true"
                              hide-details
                              inset
                            />
                          </v-card-text>
                        </div>
                      </v-expand-transition>
                    </v-row>
                  </template>
                </draggable>
              </div>

              <!-- Add new column btn -->
              <v-btn
                variant="flat"
                color="primary"
                class="mt-4"
                block
                prepend-icon="mdi-plus-circle"
                @click="addNewColumn()"
              >
                افزودن ستون جدید
              </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Options -->
          <v-expansion-panel title="تنظیمات جدول">
            <v-expansion-panel-text>
              <!-- Get url -->
              <v-textarea
                v-model="structure.options.getUrl"
                label="آدرس API"
                rows="1"
                dir="auto"
                auto-grow
              />

              <!-- Hide toolbar -->
              <v-switch
                v-model="structure.options.hideToolbar"
                label="مخفی کردن نوار ابزار (Toolbar)"
                hide-details
                inset
              />

              <!-- Hide footer -->
              <v-switch
                v-model="structure.options.hideFooter"
                label="مخفی کردن پاورقی (Footer)"
                hide-details
                inset
              />

              <!-- Fix height -->
              <v-switch
                :model-value="
                  typeof structure.options.fixHeight == 'undefined'
                    ? true
                    : structure.options.fixHeight
                "
                label="ارتفاع ثابت (Fix height)"
                hide-details
                inset
                @update:model-value="structure.options.fixHeight = $event"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Export json -->
          <v-expansion-panel title="خروجی">
            <v-expansion-panel-text>
              <v-textarea
                :model-value="JSON.stringify(structure)"
                label="JSON Output"
                rows="5"
                dir="auto"
              />

              <pre class="overflow-auto overflow-y-hidden">{{ structure }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>
