<script setup lang="ts">
import { useTheme } from "vuetify";
import { useAppStore } from "../../stores/app";
import { onMounted, computed } from "vue";

const theme = useTheme();

function setTheme(dark: boolean) {
  theme.global.name.value = dark ? "dark" : "light";
  setSetting("isDarkTheme", dark);
}

onMounted(() => {
  useAppStore().layout = Object.assign(useAppStore().layout, JSON.parse(localStorage.getItem("layout_settings")));
  if (useAppStore().layout.isDarkTheme) {
    setTheme(true);
  }
});

function setSetting(key, value) {
  useAppStore().layout[key] = value;
  localStorage.setItem("layout_settings", JSON.stringify(useAppStore().layout));
}

/**
 * Props
 */
const props = defineProps<{
  modelValue: false;
}>();

/**
 * Emits events
 */
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <v-navigation-drawer v-model="value" location="left" width="340" app temporary>
    <v-card flat>
      <v-card-item prepend-icon="mdi-cog-outline" title="تنظیمات">
        <template v-slot:append>
          <v-btn
              icon="mdi-close"
              density="comfortable"
              variant="plain"
              @click="emit('update:modelValue', false)"
          />
        </template>
      </v-card-item>

      <v-divider />
      <v-card-text>
        <div class="text-subtitle-1 mb-3">حالت تیره و روشن</div>
        <v-row>
          <v-col cols="6">
            <v-btn
                :color="!theme.global.current.value.dark ? 'primary' : ''"
                value="light"
                variant="tonal"
                block
                @click="setTheme(false)"
            >
              <v-icon class="ml-2">mdi-white-balance-sunny</v-icon>
              روشن
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
                :color="theme.global.current.value.dark ? 'primary' : ''"
                value="dark"
                variant="tonal"
                block
                @click="setTheme(true)"
            >
              <v-icon class="ml-2">mdi-weather-night</v-icon>
              تیره
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-3" />

        <div class="text-subtitle-1 mb-1">نحوه نمایش منو</div>
        <v-switch
            :model-value="useAppStore().layout.isSidebarDrawerTemporary"
            label="منو کناری در حالت موقتی باشد."
            hide-details
            @update:modelValue="setSetting('isSidebarDrawerTemporary', $event)"
        />
        <v-switch
            :model-value="useAppStore().layout.isHorizontalLayout"
            label="منو افقی فعال باشد."
            hide-details
            @update:modelValue="setSetting('isHorizontalLayout', $event)"
        />

        <v-divider class="my-3" />

        <div class="text-subtitle-1 mb-1">عرض صفحه</div>
        <v-switch
            :model-value="useAppStore().layout.isBoxed"
            label="تمام صفحه"
            :true-value="false"
            :false-value="true"
            hide-details
            @update:modelValue="setSetting('isBoxed', $event)"
        />

        <v-divider class="my-3" />

        <div class="text-subtitle-1 mb-1">حاشیه کارت ها</div>
        <v-radio-group
            :model-value="useAppStore().layout.cardType"
            column
            hide-details
            @update:modelValue="setSetting('cardType', $event)"
        >
          <v-radio label="سایه" value="shadow" />
          <v-radio label="فقط حاشیه" value="border" />
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>