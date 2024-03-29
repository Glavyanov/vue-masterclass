<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <AppFormField v-model="form.name" name="name" label="Full Name" type="text" rules="required" />
        <AppFormField v-model="form.username" name="username" label="Username" type="text" rules="required|unique:users,username" />
        <AppFormField v-model="form.email" name="email" label="Email" type="email" rules="required|email|unique:users,email" />
        <AppFormField v-model="form.password" name="password" label="Password" type="password" rules="required|min:6" />

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <VeeField name="avatar" v-model="form.avatar" id="avatar" type="text" class="form-input" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall" @click="registerWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  mixins:[asyncDataStatus],
  data () {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: ''
      }
    }
  },
  methods: {
    async register () {
      await this.$store.dispatch("registerUserWithEmailAndPassword", this.form);
      this.successRedirect();
    },
    async registerWithGoogle(){
      await this.$store.dispatch("signInWithGoogle");
      this.successRedirect();
    },
    successRedirect(){
      const path = this.$route.query.redirectTo || { name: "Home"};
      this.$router.push(path)
    },
  },
  created () {
    this.asyncDataStatus_fetched();
  }
}
</script>
