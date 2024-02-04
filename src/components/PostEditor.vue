<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-input"
          v-model="text"
        />
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
    <component
      :src="`https://www.google.com/recaptcha/api.js?render=${sitekey}`"
      :is="'script'"
    ></component>
    <div class="form-group">
      <textarea name="" id="recaptcha" cols="30" rows="10" class="form-input" v-model="recaptchaToken" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { sitekey, secretkey } from "@/config/recaptcha"

export default {
  data() {
    return {
      text: "",
      recaptchaToken: "",
      sitekey,
    };
  },
  methods: {
    save() {
      const post = {
        text: this.text,
      };

      new Promise((resolve, reject) => {
        /* eslint-disable */
        grecaptcha.ready(function () {
          grecaptcha
            .execute(sitekey, {
              action: "feedback",
            })
            .then(function (token) {
              if (token) {
                axios
                  .post(
                    `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}`
                  )
                  .then((response) => {
                    const result = response.data;
                    if (result?.success && result?.score >= 0.9) {
                      console.log(result?.success, result?.score)
                      debugger;
                      resolve(token);
                    } else {
                      reject(alert("ERROR in Post data!!!"));
                    }
                  });
                // (async function (tokenValue) {
                //   debugger;
                //   const res = await fetch(
                //     `https://www.google.com/recaptcha/api/siteverify?secret=SECRETKEY&response=${tokenValue}`,
                //     {
                //       method: "POST",
                //       mode: "no-cors",
                //     }
                //   );
                //   console.log(res);
                //   document.getElementById("recaptcha").value = res.body;
                // })(token);
              }
            });
        });
      })
        .then((result) => {
            this.$emit("save", { post });
            this.text = "";
            this.recaptchaToken = result;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
