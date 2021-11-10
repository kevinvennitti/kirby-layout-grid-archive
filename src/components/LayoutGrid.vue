<template>
  <div class="k-block-type-layout-grid" @dblclick="open">
    <k-layout-field
      :value="content.layoutgrid"
      v-bind="layoutgrid"
      :label="content.title"
      @input="update"
    />
  </div>
</template>

<script>
export default {
  computed: {
    layoutgrid() {
      return this.field("layoutgrid");
    },
  },
};
</script>
