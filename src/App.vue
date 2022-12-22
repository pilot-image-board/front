<template>
  <div class="bg-light">
    <app-header />
    <div class="container bg-white border-end border-start">
      <Suspense>
        <router-view />
        <template #fallback>
          <loading-component />
        </template>
      </Suspense>
    </div>
  </div>
  <app-alerts />
</template>

<script setup>
import AppHeader from "@/components/AppHeader";
import AppAlerts from "@/components/AppAlerts";
import LoadingComponent from "@/components/common/LoadingComponent.vue";
</script>
