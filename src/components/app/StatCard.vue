<script setup lang="ts">
defineProps<{
  label: string;
  value: number;
  icon: string;
  variant: string;
  link?: string;
  type?: string;
}>();
</script>

<template>
  <v-card
    v-if="type == 'column'"
    rounded="lg"
    flat
    class="d-flex align-center justify-center text-center pa-2 stat-cat"
    :class="'text-' + variant"
    :to="link"
  >
    <div class="text">
      <v-icon v-show="icon" :icon="icon" size="45" />
      <div class="text-subtitle-1 text-capitalize font-weight-bold mt-2">
        {{ label }}
      </div>
      <h4 class="text-h4 mt-2 font-weight-bold">
        {{ typeof value === "number" ? value.toLocaleString() : value }}
      </h4>
    </div>
  </v-card>
  <v-card
    v-else
    class="px-4 py-2"
    elevation="10"
    rounded="lg"
    :to="link"
  >
    <v-row no-gutters>
      <v-col>
        <div class="text-md-h6 text-body-1 text-sm-right text-center pl-2">
          <p class="mb-0 text-body font-weight-light">
            {{ label }}
          </p>
          <div class="text-subtitle-1">
            <div
              :class="[
                'mt-4- text-sm-right text-center text-md-h4 text-h4 font-weight-bold',
                'text-' + variant,
              ]"
            >
              {{ typeof value === "number" ? value.toLocaleString() : value }}
            </div>
          </div>
        </div>
      </v-col>

      <v-col
        v-show="icon"
        cols="auto"
        class="hidden-sm-and-down hidden-xs-only"
        style="opacity: 0.9"
      >
        <v-avatar rounded class="mt-1" :color="variant" size="x-large">
          <v-icon :icon="icon" size="x-large" />
        </v-avatar>
      </v-col>
    </v-row>
    <!--
    <v-divider class="mt-2 mx-0" />
    <v-card-actions class="px-0 text-caption text-grey">
      <v-icon size="20">mdi-calendar-range</v-icon>
      <div class="text-truncate mr-2">فیلم های تایید شده</div>
    </v-card-actions>
    -->
  </v-card>
</template>

<style>
.stat-cat {
  position: relative;
}
.stat-cat .text {
  z-index: 5;
  position: relative;
  color: currentColor;
}
.stat-cat::after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: currentColor;
  z-index: 0;
  opacity: 0.1;
}
</style>
