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
          v-model="localPost.text"
        />
      </div>
      <div class="form-actions">
        <button class="btn-blue">{{ localPost.id ? 'Edit post' : 'Submit post' }}</button>
      </div>
    </form>
    <!-- <component
      :src="`https://www.google.com/recaptcha/api.js?render=${sitekey}`"
      :is="'script'"
    ></component>
    <div class="form-group">
      <textarea
        name=""
        id="recaptcha"
        cols="30"
        rows="10"
        class="form-input"
        v-model="recaptchaToken"
      />
    </div> -->
  </div>
</template>

<script>
//import axios from "axios";
import { sitekey,/*  secretkey  */} from "@/config/recaptcha";

export default {
  props:{
    post: {
      type: Object,
      default: () => ({ text: null}),
    }
  },
  data() {
    return {
      recaptchaToken: "",
      sitekey,
      localPost: { ...this.post },
    };
  },
  methods: {
    save() {
      const post = {
        ...this.localPost
      };

      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
        /* eslint-disable */
        // grecaptcha.ready(function () {
        //   grecaptcha
        //     .execute(sitekey, {
        //       action: "feedback",
        //     })
        //     .then(function (token) {
        //       if (token) {
        //         axios
        //           .post(
        //             `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}`
        //           )
        //           .then((response) => {
        //             const result = response.data;
        //             if (result?.success && result?.score >= 0.9) {
        //               resolve(token);
        //             } else {
        //               reject(alert("ERROR in Post data!!!"));
        //             }
        //           }).catch((err)=> alert(err));
        //         // (async function (tokenValue) {
        //         //   debugger;
        //         //   const res = await fetch(
        //         //     `https://www.google.com/recaptcha/api/siteverify?secret=SECRETKEY&response=${tokenValue}`,
        //         //     {
        //         //       method: "POST",
        //         //       mode: "no-cors",
        //         //     }
        //         //   );
        //         //   console.log(res);
        //         //   document.getElementById("recaptcha").value = res.body;
        //         // })(token);
        //       }
        //     });
        // });
      })
        .then(() => {
          this.$emit("save", { post });
          this.localPost.text = "";
          this.recaptchaToken = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
