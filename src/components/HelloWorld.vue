<template>
  <q-page class="flex flex-center bg-amber-1">
    <!-- <img alt="Quasar logo" src="../assets/logo.svg" style="width: 200px; height: 200px"> -->
    <q-table
      v-model:pagination="pagination"
      color="secondary"
      :loading="loading"
      :rows="people"
      :columns="columns"
      row-key="index"
      dense
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
      <template #body-cell-index="props">
        <q-td :props="props">
          {{ props.rowIndex + 1 }}
        </q-td>
      </template>
      <template #body-cell-picture="props">
        <q-td :props="props">
          <q-img 
            :src="props.value"
          />
        </q-td>
      </template>
      <template #body-cell-action="props">
        <!-- {{ props }} -->
        <q-td class="q-pa-md q-gutter-sm" :props="props">
          <q-btn
            label="Delete" 
            color="negative" 
            @click="openModal(props, modalDelete = true)"
          />
          <q-btn
            label="Update" 
            color="warning" 
            @click="openModal(props, modalUpdate = true)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
  <q-dialog v-model="modalDelete">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Delete Confirm</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="modalUpdate">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Update Form</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
      </q-card-section>
    </q-card>
  </q-dialog>
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
    const modalDelete = ref(false)
    const modalUpdate = ref(false)

    const $q = useQuasar()
    const loading = ref(true)
    const people = ref([])
    const pagination = ref({
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 10
    })
    const img = ref([])
    const columns = [
      {name: 'index', label: '#', field: "", align:"left"},
      {name: 'firstname', label: 'First Name', field: 'firstName', align: 'left'},
      {name: 'lastname', label: 'Last Name', field: 'lastName', align: 'left'},
      {name: 'title', label: 'Title', field: 'title', align: 'left'},
      {name: 'picture', label: 'Picture', field: 'picture', align: 'left'},
      {name: 'action', label: 'Action', field: "", align:"left"},
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

    const exportTable = () => {
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

    const openModal = (props, modalDelete = false, modalUpdate = false) => {
      console.log(props)
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
      modalDelete,
      modalUpdate,
      openModal,

      people, 
      pagination, 
      columns, 
      loading,

      onRequest,
      exportTable
    }
  }
})
</script>
