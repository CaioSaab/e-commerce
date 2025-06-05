<script setup>
import { ref, onMounted } from 'vue'

const cart = ref([])

function loadCart() {
  cart.value = JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

function increaseQuantity(item) {
  item.quantity++
  saveCart()
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    const index = cart.value.findIndex(i => i.id === item.id)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }
  saveCart()
}

function removeItem(item) {
  const index = cart.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    cart.value.splice(index, 1)
  }
  saveCart()
}

function totalPrice() {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
}

onMounted(loadCart)
</script>

<template>
  <div class="min-h-screen bg-[#121212] text-gray-300 font-orbitron p-8">
    <div class="max-w-4xl mx-auto bg-[#1f1f1f] rounded-xl shadow-lg p-8">
      <h1 class="text-4xl font-extrabold mb-8 tracking-wide text-indigo-400 drop-shadow-lg">Meu Carrinho</h1>

      <div v-if="cart.length === 0" class="text-center text-gray-500 text-xl py-20">
        Seu carrinho está vazio.
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex items-center gap-6 bg-[#2c2c2c] rounded-lg p-4 hover:bg-[#3a3a3a] transition"
        >
          <img
            :src="item.thumbnail"
            :alt="item.title"
            class="w-16 h-16 object-cover rounded-lg border border-indigo-600 shadow-md"
          />

          <div class="flex flex-col flex-grow">
            <h2 class="text-xl font-semibold text-gray-100">{{ item.title }}</h2>
            <p class="text-indigo-400 font-bold mt-1">$ {{ item.price.toFixed(2) }}</p>
            <p class="text-gray-400 mt-1">Subtotal: $ {{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>

          <div class="flex items-center space-x-3">
            <button
              @click="decreaseQuantity(item)"
              class="bg-red-600 hover:bg-red-700 transition rounded-md px-3 py-1.5 text-lg font-semibold shadow-md"
              aria-label="Diminuir quantidade"
            >
              -
            </button>
            <span class="text-lg font-mono min-w-[24px] text-center">{{ item.quantity }}</span>
            <button
              @click="increaseQuantity(item)"
              class="bg-green-600 hover:bg-green-700 transition rounded-md px-3 py-1.5 text-lg font-semibold shadow-md"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

          <button
            @click="removeItem(item)"
            class="ml-6 text-red-500 hover:text-red-700 font-semibold transition"
            aria-label="Remover item"
          >
            ✕
          </button>
        </div>

        <div class="text-right text-3xl font-extrabold text-indigo-400 mt-8 select-none drop-shadow-lg">
          Total: $ {{ totalPrice() }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

.font-orbitron {
  font-family: 'Orbitron', sans-serif;
}
</style>
