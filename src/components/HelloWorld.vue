<template>
  <q-page class="flex flex-center bg-amber-1">
    <!-- <img alt="Quasar logo" src="../assets/logo.svg" style="width: 200px; height: 200px"> -->
    <q-table
      v-model:pagination="pagination"
      color="secondary"
      :loading="loading"
      :rows="people"
      :columns="columns"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
        />
      </template>
    </q-table>
  </q-page>
</template>

<style>
</style>

<script>
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import {exportFile, useQuasar} from 'quasar'

export default defineComponent({
  name: 'TableWithAxios',
  setup() {
    const $q = useQuasar()
    const loading = ref(true)
    const people = ref([])
    const pagination = ref({
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 10
    })
    const columns = [
      {name: 'firstname', label: 'First Name', field: 'firstName', align: 'left'},
      {name: 'lastname', label: 'Last Name', field: 'lastName', align: 'center'},
      {name: 'title', label: 'Title', field: 'title', align: 'left'}
    ]

    const wrapCsvValue = (val, formatFn, row) => {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    }

    const fetchData = (page = 0, limit = 10) => {
      axios.get('https://dummyapi.io/data/v1/user', {
        headers: {
          'app-id' : '635bbbeef6fbc5a993514485' 
        },
        params: {
          page: page-1,
          limit: limit
        }
      })
      .then(response => {
        // console.log(response.data)
        people.value = response.data.data

        pagination.value.rowsPerPage = response.data.limit
        pagination.value.page = response.data.page+1
        pagination.value.rowsNumber = response.data.total
      })
      .finally(() => {
        loading.value = false
      })
    }

    const onRequest = (props) => {
      // console.log(props)
      fetchData(props.pagination.page, props.pagination.rowsPerPage)
    }

    fetchData()

    return {
      people, 
      pagination, 
      columns, 
      loading,

      onRequest,

      exportTable () {
        // naive encoding to csv format
        const content = [columns.map(col => wrapCsvValue(col.label))].concat(
          people.value.map(row => columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[ col.field === void 0 ? col.name : col.field ],
            col.format,
            row
          )).join(','))
        ).join('\r\n')

        const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        )

        if (status !== true) {
          $q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
      }
    }
  }
})
</script>
