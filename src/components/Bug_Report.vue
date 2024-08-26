<template>
  <div class="container mt-5">
    <div class="container border rounded-5 p-5">
      <h3 class="mb-4">فرم گزارش باگ</h3>
      <form @submit.prevent="submitForm" class="mb-4">
        <div class="row">
          <div class="col-md-4 mb-3">
            <label for="reporterName" class="form-label">نام و نام خانوادگی گزارش‌دهنده</label>
            <input v-model="formData.reporterName" type="text" class="form-control" id="reporterName" required>
          </div>
          <div class="col-md-4 mb-3">
            <label for="projectName" class="form-label">نام پروژه</label>
            <select v-model="formData.projectName" class="form-select" id="projectName" required>
              <option value="">انتخاب پروژه</option>
              <option v-for="project in projects" :key="project.project_name" :value="project.project_name">{{ project.project_name }}</option>
            </select>
          </div>
          <div class="col-md-4 mb-3">
            <label for="severity" class="form-label">شدت باگ</label>
            <select v-model="formData.severity" class="form-select" id="severity" required>
              <option value="">انتخاب شدت</option>
              <option value="Normal">معمولی</option>
              <option value="Severe">شدید</option>
              <option value="Critical">بحرانی</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-3">
            <label for="appVersion" class="form-label">نسخه اپلیکیشن</label>
            <select v-model="formData.appVersion" class="form-select" id="appVersion" required>
              <option value="">انتخاب نسخه</option>
              <option v-for="version in appVersions" :key="version.version_name" :value="version.version_name">{{ version.version_name }}</option>
            </select>
          </div>
          <div class="col-md-8 mb-3">
            <label for="steps" class="form-label">مراحل ایجاد باگ</label>
            <input v-model="formData.steps" type="text" class="form-control" id="steps" required placeholder="لطفا مراحلی که طی کردید که به باگ برخورد کردین رو شرح دهید!">
          </div>
        </div>
        <div class="mb-3">
          <label for="errorMessage" class="form-label">پیام باگ</label>
          <input v-model="formData.errorMessage" type="text" class="form-control" id="errorMessage" required placeholder="لطفا متن error رو به صورت انگلیسی وارد کنید ">
        </div>
        <div class="mb-3">
          <label for="bugDescription" class="form-label">شرح باگ</label>
          <textarea v-model="formData.bugDescription" class="form-control" id="bugDescription" rows="3" required placeholder="لطفا باگ رو به صورت کامل شرح دهید "></textarea>
        </div>
        <div class="mb-3">
          <label for="bugFile" class="form-label">آپلود تصویر یا فایل</label>
          <input
              ref="fileInput"
              @change="handleFileUpload"
              type="file"
              class="form-control"
              id="bugFile"
              accept="image/*,.pdf,.docx"
          />
        </div>
        <button type="submit" class="btn btn-primary">ارسال</button>
      </form>

      <div v-if="isSubmitting" class="text-center">
        <p>در حال ثبت باگ...</p>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">در حال ثبت باگ...</span>
        </div>
      </div>
    </div>

    <div class="container mt-3 border rounded-5 p-5 table-responsive">
      <h3 class="mb-4">لیست گزارشات باگ</h3>

      <div v-if="loading" class="text-center">
        <p>در حال بارگذاری...</p>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <table v-if="!loading && !error && bugReports.length" class="table table-bordered table-striped">
        <thead class="table-light">
        <tr>
          <th>نام و نام خانوادگی گزارش‌دهنده</th>
          <th>نام پروژه</th>
          <th>شدت</th>
          <th>نسخه اپلیکیشن</th>
          <th>مراحل ایجاد باگ</th>
          <th>پیام ارور</th>
          <th>شرح باگ</th>
          <th>فایل</th>
          <th>تاریخ ثبت</th>
          <th>حذف</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="report in bugReports" :key="report.id">
          <td>{{ report.full_name }}</td>
          <td>{{ report.project_name }}</td>
          <td>{{ severityLabel(report.status )}}</td>
          <td>{{ report.version_app }}</td>
          <td>{{ report.steps }}</td>
          <td>{{ report.message_error }}</td>
          <td>{{ report.description_bug }}</td>
          <td>
            <a v-if="report.file_url" :href="report.file_url" target="_blank">مشاهده فایل</a>
          </td>
          <td>{{ report.created_at }}</td>
          <td>
            <button @click="deleteReport(report.id)" class="btn btn-danger btn-sm">
              <i class="bi bi-trash"></i>
            </button>
          </td>

        </tr>
        </tbody>
      </table>

      <div v-if="!loading && !error && !bugReports.length">
        <p>هیچ گزارشی یافت نشد.</p>
      </div>
    </div>
  </div>
</template>

<style>
.table th, .table td {
  max-width: 150px;
  word-wrap: break-word;
  white-space: normal;
}

.table {
  /*table-layout: fixed;*/
  /*width: 100%;*/
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  .table {
    width: 1000px;
  }
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: .3em;
}
</style>

<script>
import {supabase} from '../supabase';

export default {
  data() {
    return {
      isSubmitting: false,
      formData: {
        reporterName: '',
        projectName: '',
        severity: '',
        appVersion: '',
        steps: '',
        errorMessage: '',
        bugDescription: '',
        fileUrl: ''
      },
      bugReports: [],
      projects: [],
      appVersions: [],
      file: null,
      loading: false,
      error: null
    };
  },
  async created() {
    await this.fetchBugReports();
    await this.fetchVersionName();
    await this.fetchProjectName();
  },
  methods: {
    async fetchProjectName() {
      this.loading = true;
      this.error = null;
      try {
        const {data, error} = await supabase.from('project').select('*');
        if (error) throw error;
        this.projects = data;
      } catch (error) {
        this.error = 'خطا در دریافت پروژه‌ها';
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchVersionName() {
      this.loading = true;
      this.error = null;
      try {
        const {data, error} = await supabase.from('version').select('*');
        if (error) throw error;
        this.appVersions = data;
      } catch (error) {
        this.error = 'خطا در دریافت نسخه‌ها';
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchBugReports() {
      this.loading = true;
      this.error = null;
      try {
        const {data, error} = await supabase.from('bug_report').select('*');
        if (error) throw error;
        this.bugReports = data.reverse();
      } catch (error) {
        this.error = 'خطا در دریافت گزارشات باگ';
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      if (!this.file) {
        console.error('No file selected.');
        return null;
      }

      try {
        const uniqueFileName = `${Date.now()}_${this.file.name}`;
        const filePath = `public/${uniqueFileName}`;

        const { error} = await supabase
            .storage
            .from('bug_files')
            .upload(filePath, this.file);

        if (error) {
          console.error('Error uploading file:', error);
          return null;
        }

        const {data: publicUrlData} = supabase
            .storage
            .from('bug_files')
            .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Error getting public URL');
          return null;
        }

        return publicUrlData.publicUrl;
      } catch (err) {
        console.error('Unexpected error:', err);
        return null;
      }
    },
    async deleteReport(reportId) {
      try {
        const { error } = await supabase
            .from('bug_report')
            .delete()
            .eq('id', reportId);

        if (error) throw error;

        this.bugReports = this.bugReports.filter(report => report.id !== reportId);
        alert('گزارش با موفقیت حذف شد.');
      } catch (error) {
        this.error = 'خطا در حذف گزارش';
        console.error('Error deleting report:', error);
      }
    },
    async submitForm() {
      this.isSubmitting=true;
      this.error = null;
      try {
        const fileUrl = await this.uploadFile();
        this.formData.fileUrl = fileUrl ? fileUrl : null;

        const {error} = await supabase.from('bug_report').insert([
          {
            full_name: this.formData.reporterName,
            project_name: this.formData.projectName,
            status: this.formData.severity,
            version_app: this.formData.appVersion,
            steps: this.formData.steps,
            message_error: this.formData.errorMessage,
            description_bug: this.formData.bugDescription,
            file_url: this.formData.fileUrl
          }
        ]);

        if (error) throw error;

        this.formData = {
          reporterName: '',
          projectName: '',
          severity: '',
          appVersion: '',
          steps: '',
          errorMessage: '',
          bugDescription: '',
          fileUrl: ''
        };
        this.file = null;

        const fileInput = this.$refs.fileInput;
        if (fileInput) {
          fileInput.value = '';
        }

        await this.fetchBugReports();
        alert('گزارش باگ با موفقیت ارسال شد!');
      } catch (error) {
        this.error = 'خطا در ارسال گزارش باگ';
        console.error('Error submitting form:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    severityLabel(severity) {
      const severityMap = {
        Normal: 'معمولی',
        Severe: 'شدید',
        Critical: 'بحرانی'
      };
      return severityMap[severity] || 'نامشخص';
    },
  }
};
</script>
