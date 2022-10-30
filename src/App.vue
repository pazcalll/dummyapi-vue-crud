<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary q-list--dark"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" href="#/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" href="#/add-user">
          <q-item-section avatar>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Add User</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <component :is="currentView" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import AddUser from './components/AddUser.vue'
import NotFound from './components/NotFound.vue'

export default {
  name: 'LayoutDefault',

  setup () {
    const routes = {
      '/': HelloWorld,
      '/add-user': AddUser
    }

    const currentPath = ref(window.location.hash)

    window.addEventListener('hashchange', () => {
      currentPath.value = window.location.hash
    })

    const currentView = computed(() => {
      return routes[currentPath.value.slice(1) || '/'] || NotFound
    })
    return {
      currentView,
      leftDrawerOpen: ref(false)
    }
  }
}
</script>
