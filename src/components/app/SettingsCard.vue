<script setup lang="ts">
import { useTheme } from "vuetify";
import { useAppStore } from "../../stores/app";

const theme = useTheme();

function setTheme(dark: boolean) {
  theme.global.name.value = dark ? "dark" : "light";
}
</script>

<template>
	<v-card flat prepend-icon="mdi-cog-outline" title="تنظیمات">
          <v-divider />
          <v-card-text>
            <div class="text-subtitle-1 mb-3">حالت تیره و روشن</div>
            <v-row>
              <v-col cols="6">
                <v-btn
                  :color="!theme.global.current.value.dark ? 'primary' : ''"
                  value="light"
                  variant="flat"
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
                  variant="flat"
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
              v-model="useAppStore().layout.isSidebarDrawerTemporary"
              label="منو کناری در حالت موقتی باشد."
              hide-details
            />
            <v-switch
              v-model="useAppStore().layout.isHorizontalLayout"
              label="منو افقی فعال باشد."
              hide-details
            />
            <v-divider class="my-3" />
            <div class="text-subtitle-1 mb-1">عرض صفحه</div>
            <v-switch
              v-model="useAppStore().layout.isBoxed"
              label="تمام صفحه"
              :true-value="false"
              :false-value="true"
              hide-details
            />
            <v-divider class="my-3" />
            <div class="text-subtitle-1 mb-1">حاشیه کارت ها</div>
            <v-radio-group v-model="useAppStore().layout.cardType" column hide-details>
              <v-radio label="سایه" value="shadow" />
              <v-radio label="فقط حاشیه" value="border" />
            </v-radio-group>
          </v-card-text>
        </v-card>
</template>