<script setup lang="ts">
defineProps<{
  /**
   * Call reset func
   */
  conditions: string;
}>();
</script>

<template>
  <div class="dir-ltr text-left vfb-conditions-render">
    <div
      v-for="(loop, index) in conditions"
      :key="index"
      class="conditions-render-one-wrapper"
    >
      <span v-if="index > 0" class="vfb-conditions-render-and">and</span>
      <span v-if="index > 10" class="vfb-conditions-render-or">or</span>
      <span class="vfb-conditions-render-field">{{ loop[0] }}</span>
      <span class="vfb-conditions-render-operator">{{ loop[1] }}</span>
      <span class="vfb-conditions-render-expected" :class="[typeof loop[2]]">{{
        loop[2]
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.vfb-conditions-render {
  position: relative;
  border-radius: 0.375rem;
  border-width: 1px;
  border-color: rgb(226 232 240);
  background-color: rgb(241, 241, 241);
  padding: 0.5rem 0.75rem;
  text-align: left;
}
.conditions-render-one-wrapper span {
  margin-right: 4px;
}
.vfb-conditions-render-field {
  font-weight: bold;
}
.vfb-conditions-render-expected {
  font-weight: bold;
  color: rgb(46, 113, 229);
}
.vfb-conditions-render-expected.boolean {
  color: rgb(255 25 144);
}
.vfb-conditions-render-or,
.vfb-conditions-render-and {
  font-weight: 700;
  text-transform: uppercase;
  color: rgb(43, 201, 143);
}
</style>
