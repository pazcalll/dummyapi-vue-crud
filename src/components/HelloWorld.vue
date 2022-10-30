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
      <template #loading>
        <q-inner-loading
          showing
          color="primary"
        />
      </template>
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
        />
      </template>
      <!-- <template #body-cell-index="props">
        <q-td :props="props">
          {{ props.rowIndex + 1 }}
        </q-td>
      </template> -->
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
            class="btn-negative-light"
            @click="openModal(props, modalDelete = true)"
          />
          <q-btn
            label="Update" 
            class="btn-warning-light" 
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
        <q-input
          label="First Name"
          filled 
          v-model="toChange.firstName" 
          autofocus 
          disable
        />  
        <q-input
          label="Last Name"
          filled 
          v-model="toChange.lastName" 
          autofocus
          disable 
        />  
        <q-input
          label="Title"
          filled 
          v-model="toChange.title" 
          autofocus
          disable 
        />  
      </q-card-section>
      <hr>
      <q-card-section>
        <q-btn 
          label="Confirm Delete"  
          class="on-right btn-negative-light"
          @click="deleteData"
        />
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
        <q-input
          label="First Name"
          filled 
          v-model="toChange.firstName" 
          autofocus 
        />  
        <q-input
          label="Last Name"
          filled 
          v-model="toChange.lastName" 
          autofocus 
        />  
        <q-input
          label="Title"
          filled 
          v-model="toChange.title" 
          autofocus 
        />  
      </q-card-section>
      <hr>
      <q-card-section>
        <q-btn 
          label="Update Data" 
          color="warning" 
          class="on-right"
          @click="updateData"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
  @import "@/styles/quasar.scss";
  .btn-negative-light{
    background: $negative-light;
    color: $white-0;
  }
  .btn-warning-light{
    background: $warning-light;
    color: $white-0;
  }
  .q-btn:before{
    box-shadow: none;
  }
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
    const toChange = ref({})

    const $q = useQuasar()
    const loading = ref(true)
    const people = ref([])
    const pagination = ref({
      page: 1,
      rowsNumber: 0,
      rowsPerPage: 10
    })
    const _index = ref(0)
    const columns = [
      {name: 'index', label: '#', field: 'index', align:"left"},
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
      const content = [columns.map(col => col.name != "action" ? wrapCsvValue(col.label) : null)].concat(
        people.value.map(row => columns.map(col => wrapCsvValue(
          col.name != "action" && typeof col.field === 'function'
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
      toChange.value = props.row
    }

    const deleteData = () => {
      axios.delete('https://dummyapi.io/data/v1/user/'+toChange.value.id,
        {
          headers: {
            'app-id': '635bbbeef6fbc5a993514485'
          }
        }
      )
        .then(response => {
          if (response.status == 200) {
            fetchData(pagination.value.page, pagination.value.rowsPerPage)
            modalDelete.value = false
          }
        })
        .finally(() => {
          if (people.value.length < 1) {
            fetchData(pagination.value.page-1, pagination.value.rowsPerPage)
          }
        })
    }

    const updateData = () => {
      axios({
        method:'put',
        url:'https://dummyapi.io/data/v1/user/'+toChange.value.id,
        headers: {
          'app-id': '635bbbeef6fbc5a993514485'
        },
        data: {
          firstName: toChange.value.firstName,
          lastName: toChange.value.lastName,
          title: toChange.value.title
        }
      })
        .then(response => {
          if (response.status == 200) {
            fetchData(props.pagination.page, props.pagination.rowsPerPage)
            modalUpdate.value = false
          }
        })
    }

    const fetchData = (page = 0, limit = 10) => {
      loading.value = true
      axios.get('https://dummyapi.io/data/v1/user', {
        headers: {
          'app-id' : '635bbbeef6fbc5a993514485' 
        },
        params: {
          page: page-1 < 0 ? 0 : page-1,
          limit: limit
        }
      })
      .then(response => {
        people.value = response.data.data
        people.value.forEach((person, _index) => {
          person.index = _index + 1
        });

        pagination.value.rowsPerPage = response.data.limit
        pagination.value.page = response.data.page+1
        pagination.value.rowsNumber = response.data.total
      })
      .finally(() => {
        loading.value = false
      })
    }

    const onRequest = (props) => {
      fetchData(props.pagination.page, props.pagination.rowsPerPage)
    }

    fetchData()

    return {
      modalDelete,
      modalUpdate,
      openModal,

      deleteData,
      updateData,

      toChange,

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
