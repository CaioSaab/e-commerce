<template>
  <div class="flex mt-10 flex-col md:flex-row gap-6 p-4 bg-gray-900 text-white min-h-screen pt-10 md:pt-0">
    <!-- Abrir filtro mobile -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="md:hidden mb-4 text-white bg-indigo-600 px-4 py-2 rounded focus:outline-none">
      {{ sidebarOpen ? 'Fechar Filtros' : 'Mostrar Filtros' }}
    </button>
    <!-- Sidebar -->
    <aside
  :class="[
    'w-full md:w-64 bg-gray-800 rounded shadow p-4 border border-indigo-600 transition-all duration-300',
    sidebarOpen ? 'block' : 'hidden md:block'
  ]">
      <!-- Buscar -->
      <div class="mb-6">
        <label for="search" class="block font-semibold mb-2 text-indigo-400">Buscar</label>
        <input
          id="search"
          v-model="searchTerm"
          type="text"
          placeholder="Buscar produtos..."
          class="bg-gray-700 text-white border border-indigo-500 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
      </div>
      <!-- Ordenar -->
      <div class="mb-6">
        <label for="sort" class="block font-semibold mb-2 text-indigo-400">Ordenar por</label>
        <select
          id="sort"
          v-model="sortKey"
          class="bg-gray-700 text-white border border-indigo-500 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400">
          <option value="">Padrão</option>
          <option value="price-asc">Preço Crescente</option>
          <option value="price-desc">Preço Decrescente</option>
          <option value="name-asc">Nome A-Z</option>
          <option value="name-desc">Nome Z-A</option>
        </select>
      </div>
      <!-- Botão Todas -->
      <div class="mb-4">
        <button @click="selectCategory(null)" lass="w-full text-left px-3 py-2 rounded bg-indigo-600 hover:bg-cyan-500 transition duration-300 text-white font-semibold">
          Todas
        </button>
      </div>

      <!-- Lista de Categorias -->
      <ul>
        <li
          v-for="cat in categories"
          :key="cat.slug"
          @click="selectCategory(cat.slug)"
          :class="[
            'cursor-pointer py-2 px-3 rounded mb-1 select-none transition duration-200',
            selectedCategory === cat.slug
              ? 'bg-indigo-600 text-white'
              : 'hover:bg-gray-700 text-indigo-300'
          ]">
          {{ cat.name }}
        </li>
      </ul>
    </aside>

    <!-- Produtos -->
    <section class="flex-grow grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      <ProductComponent
        v-for="product in products"
        :key="product.id"
        :product="product"/>
    </section>
  </div>
  <!-- Paginação -->
  <nav class="flex justify-start md:justify-center mt-6 space-x-2 overflow-x-auto px-2 scroll-snap-x mandatory">
  <button
    class="scroll-snap-start shrink-0 px-4 py-2 rounded border border-indigo-500 bg-gray-800 text-white hover:bg-indigo-600 transition disabled:opacity-50"
    :disabled="currentPage === 1"
    @click="changePage(currentPage - 1)">
    Anterior
  </button>
  <button
    v-for="page in totalPages"
    :key="page"
    @click="changePage(page)"
    :class="[
      'shrink-0 px-4 py-2 rounded border transition scroll-snap-start',
      currentPage === page
        ? 'bg-indigo-600 text-white border-indigo-600'
        : 'border-gray-600 text-indigo-300 hover:bg-gray-700'
    ]">
    {{ page }}
  </button>
  <button
    class="scroll-snap-start shrink-0 px-4 py-2 rounded border border-indigo-500 bg-gray-800 text-white hover:bg-indigo-600 transition disabled:opacity-50"
    :disabled="currentPage === totalPages"
    @click="changePage(currentPage + 1)">
    Próximo
  </button>
</nav>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import ProductComponent from '../components/ProductComponent.vue'

const products = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const searchTerm = ref('')
const sortKey = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 12
const totalProducts = ref(0)
const sidebarOpen = ref(false)

async function loadCategories() {
  try {
    const { data } = await axios.get('https://dummyjson.com/products/categories')
    if (typeof data[0] === 'string') {
      categories.value = data.map(catSlug => ({ slug: catSlug, name: catSlug }))
    } else {
      categories.value = data
    }
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }
}

async function loadProducts() {
  try {
    const skip = (currentPage.value - 1) * pageSize
    let response

    if (searchTerm.value) {
      const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm.value)}&limit=${pageSize}&skip=${skip}`
      response = await axios.get(url)
    } else if (selectedCategory.value) {
      const url = `https://dummyjson.com/products/category/${selectedCategory.value}?limit=${pageSize}&skip=${skip}`
      response = await axios.get(url)
    } else {
      const url = `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`
      response = await axios.get(url)
    }

    products.value = response.data.products
    totalProducts.value = response.data.total
    totalPages.value = Math.ceil(totalProducts.value / pageSize)

    if (sortKey.value === 'price-asc') {
      products.value.sort((a, b) => a.price - b.price)
    } else if (sortKey.value === 'price-desc') {
      products.value.sort((a, b) => b.price - a.price)
    } else if (sortKey.value === 'name-asc') {
      products.value.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortKey.value === 'name-desc') {
      products.value.sort((a, b) => b.title.localeCompare(a.title))
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
}

function selectCategory(catSlug) {
  if (selectedCategory.value === catSlug) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = catSlug
  }
  currentPage.value = 1
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch([selectedCategory, searchTerm, currentPage, sortKey], () => {
  loadProducts()
})

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

* {
  font-family: 'Orbitron', sans-serif;
}
</style>
  