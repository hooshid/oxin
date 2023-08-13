<script setup lang="ts">
import { onMounted } from "vue";
import { useFieldArray } from "vee-validate";
import FormElements from "../../FormElements.vue";
import http from "@/plugins/http";

const props = defineProps<{
  /**
   * Form Builder Structure
   */
  field: any;

  /**
   * Parent model name
   */
  parentModel?: string;

  /**
   * Data from FormBuilder
   */
  data?: object;
}>();

const { remove, push, fields } = useFieldArray(props.field.model);

onMounted(() => {
  if(props.data && props.field.configs && props.field.configs.getUrl) {
    http.get(props.field.configs.getUrl + "&sort=id&order=asc", {
      params: {
        conditions: JSON.stringify([
          {
            key: props.field.configs.foreignPivotKey,
            comparison: "equal",
            value: props.data[props.field.configs.foreignKey],
          },
        ]),
      },
    }).then((response) =>{
      response.data.data.forEach(element => {
        push(element);
      });
    });
  }
});
</script>

<template>
  <v-toolbar density="compact" class="rounded">
    <v-toolbar-title>{{ field.label }}</v-toolbar-title>
    <v-spacer/>
    <v-btn variant="text" color="green" @click="push({})">
      افزودن
    </v-btn>
  </v-toolbar>

  <div
    v-for="(row, idx) in fields"
    :key="idx"
    class="mt-1 d-flex repeat-list"
  >
    <fieldset>
      <legend>{{ idx + 1 }}</legend>
      <FormElements
        :schema="field.schema"
        :parent-model="
          (parentModel ? parentModel : '') + '' + field.model + `[${idx}]`
        "
      />

      <v-btn variant="flat" color="red" size="x-small" icon>
        <v-icon>mdi-delete</v-icon>

        <v-menu activator="parent" origin="overlap">
          <v-card min-width="150">
            <v-card-text>آیا حذف شود؟</v-card-text>
            <v-divider/>

            <v-card-actions>
              <v-spacer/>

              <v-btn variant="text"> لغو </v-btn>
              <v-btn variant="text" color="red" @click="remove(idx)">
                حذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-btn>
    </fieldset>
  </div>
</template>

<style>
.repeat-list {
  position: relative;
}

.repeat-list fieldset {
  display: flex;
  width: 100%;
  border: 1px solid #ddd;
}

.repeat-list legend {
  background-color: #1e1e1e;
  color: #fff;
  padding: 0 6px;
  border-radius: 30px;
}

.repeat-list .v-btn.bg-red {
  position: absolute;
  left: 0px;
  top: 0px;
  --v-btn-height: 10px;
}
</style>
