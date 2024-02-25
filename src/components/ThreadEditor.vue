<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="form.activeTitle"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.activeText"
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
      <button class="btn btn-blue" type="submit">{{ existing ? 'Update': 'Publish' }}</button>
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
      form: {
        activeTitle: this.title,
        activeText: this.text,
      }
    };
  },
  computed: {
    existing(){
      return !!this.title;
    }
  },
  methods: {
    save() {
      this.$emit("clean");
      this.$emit("save", { title: this.form.activeTitle , text: this.form.activeText });
    },
  },
  watch: {
    form: {
      handler(){
        if(this.form.activeTitle !== this.title || this.form.activeText !== this.text){
          this.$emit("dirty");
        } else {
          this.$emit("clean");
        }
      },      
      deep: true
    }
  }
};
</script>
