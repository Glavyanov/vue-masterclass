<template>
  <VeeForm @submit="save">
    <AppFormField  v-model="form.activeTitle" label="Title" type="text" name="title" rules="required"/>
    <AppFormField as="textarea" v-model="form.activeText" label="Content" name="content" rules="required" rows="8" cols="140"/>
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
  </VeeForm>
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
