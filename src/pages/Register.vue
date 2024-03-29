<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <VeeField
            name="name"
            v-model="form.name"
            id="name"
            type="text"
            class="form-input"
            label="Full Name"
            rules="required"
          />
          <VeeErrorMessage name="name" class="form-error"/>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <VeeField
            name="username"
            v-model="form.username"
            id="username"
            type="text"
            class="form-input"
            label="Username"
            rules="required"
          />
          <VeeErrorMessage name="username" class="form-error"/>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <VeeField
            name="email"
            v-model="form.email"
            id="email"
            type="email"
            class="form-input"
            rules="required|email"
            label="Email"
          />
          <VeeErrorMessage name="email" class="form-error"/>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <VeeField name="password" v-model="form.password" id="password" type="password" class="form-input" />
        </div>

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
