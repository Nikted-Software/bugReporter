<template>
  <div class="container mt-5">
    <h1 class="mb-4">User Information Form</h1>

    <!-- فرم اطلاعات کاربر -->
    <form @submit.prevent="submitForm" class="mb-4">
      <div class="mb-3">
        <label for="firstName" class="form-label">First Name</label>
        <input v-model="formData.firstName" type="text" class="form-control" id="firstName" required>
      </div>

      <div class="mb-3">
        <label for="lastName" class="form-label">Last Name</label>
        <input v-model="formData.lastName" type="text" class="form-control" id="lastName" required>
      </div>

      <div class="mb-3">
        <label for="age" class="form-label">Age</label>
        <input v-model="formData.age" type="number" class="form-control" id="age" required>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

    <!-- جدول نمایش اطلاعات کاربر -->
    <h2 class="mb-4">Users List</h2>
    <table class="table table-bordered">
      <thead class="table-light">
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Age</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.lastname }}</td>
        <td>{{ user.age }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {supabase} from '../supabase'

export default {
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        age: null
      },
      users: []
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const {data, error} = await supabase
          .from('logger')
          .select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        this.users = data;
      }
    },
    async submitForm() {
      const {error} = await supabase
          .from('logger')
          .insert([{ name: this.formData.firstName, last_name: this.formData.lastName, age: this.formData.age }]);


      if (error) {
        console.error('Error inserting data:', error);
      } else {
        await this.fetchUsers()
        this.formData.firstName = '';
        this.formData.lastName = '';
        this.formData.age = null;
      }
    }
  }
}
</script>

<style>
/* استایل سفارشی (اختیاری) */
</style>
