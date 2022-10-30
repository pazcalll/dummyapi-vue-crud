<template>
  <div class="flex flex-center">
    <q-form
      @submit="onSubmit"
      class="q-gutter-md q-pt-lg"
      style="width: 400px"
    >
      <span style="color: red">
        <ul>
          <li v-for="error in error_msg" :key="error">{{ error }}</li>
        </ul>
      </span>
      <q-input
        filled
        ref="firstName"
        v-model="firstName"
        label="First Name"
        hint="Name without last name"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type your first name']"
      />
      <q-input
        filled
        ref="lastName"
        v-model="lastName"
        label="Last Name"
        hint="Name without first name"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type your last name']"
      />
      <q-input
        filled
        ref="email"
        v-model="email"
        label="Email"
        hint="Your email"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type your email']"
      />
      <q-input
        filled
        ref="title"
        v-model="title"
        label="Title"
        hint="Your title"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type your title']"
      />
      <div class="mdi-format-float-center">
        <q-btn label="Submit" type="submit" style="width: 100%;" class="btn-submit"/>
        <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
      </div>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="100px" color="primary" />
      </q-inner-loading>
    </q-form>
  </div>
</template>

<style lang="scss">
  @import "@/styles/quasar.scss";
  .btn-submit {
    background: $primary-light;
    color: $white-0;
  }
</style>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      loading: false,

      error_msg: [],

      firstName: '',
      lastName: '',
      email: '',
      title: ''
    }
  },
  methods: {
    onSubmit(e) {
      this.loading = true
      axios({
        url: 'https://dummyapi.io/data/v1/user/create',
        method: "POST",
        headers: {
          'app-id': '635bbbeef6fbc5a993514485'
        },
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          title: this.title
        }
      })
        .then(response => {
          if (response.status == 200) {
            this.loading = false
            this.error_msg = []
          }
        })
        .finally(()=>{
          this.firstName = null
          this.lastName = null
          this.email = null
          this.title = null

          this.$refs.firstName.resetValidation()
          this.$refs.lastName.resetValidation()
          this.$refs.email.resetValidation()
          this.$refs.title.resetValidation()
        })
        .catch((error) => {
          for (const [key, value] of Object.entries(error.response.data.data)) {
            this.error_msg.push(value)
          }
          this.loading = false
        })
    }
  }
}
</script>