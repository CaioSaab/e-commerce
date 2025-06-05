import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/product/:id', name: 'product-detail', component: ProductDetailView, props: true },
  { path: '/cart', name: 'cart', component: CartView }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
