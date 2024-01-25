<template>
  <div class="col-full">
      <form @submit.prevent="save" >
        <div class="form-group">
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            calss="form-input"
            v-model="text"
          />
        </div>
        <div class="form-actions">
          <button class="btn-blue">Submit post</button>
        </div>
      </form>
    </div>
</template>
<script>

export default {
  data() {
    return {
      text: "",
    };
  },
  methods: {
    save() {
      const post = {
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        userId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1'
      }

      this.$emit('save', { post })
      this.text = '';
    }
  },
};
</script>