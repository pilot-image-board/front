<template>
  <div class="bg-light">
    <app-header />
    <div class="container bg-white border-end border-start">
      <router-view />
    </div>
  </div>
  <app-alerts />
</template>

<script setup>
import AppHeader from "@/components/AppHeader";
import AppAlerts from "@/components/AppAlerts";
</script>
