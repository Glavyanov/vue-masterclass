<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="activeTitle"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="activeText"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button
        @click.prevent="$emit('cancel')"
        type="button"
        class="btn btn-ghost"
      >
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">Publish</button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    title: {
      default: "",
      type: String,
    },
    text: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      activeTitle: this.title,
      activeText: this.text,
    };
  },
  methods: {
    save() {
      this.$emit("save", { title: this.activeTitle, text: this.activeText });
    },
  },
};
</script>
