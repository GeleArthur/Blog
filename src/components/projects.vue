<script setup>
const projects = [
  {
    title: 'Floppy bird (NES)',
    path: '/projects/floppy-bird',
    image: '/floppy-bird/floppy-bird-main.png',
  },
  {
    title: 'CPU Rasterizer',
    path: '/projects/cpu-rasterizer',
    image: '/cpu-rasterizer/render-normal_gpu.png',
  },
  {
    title: 'Spelunky remake',
    path: '/projects/spelunky-remake',
    image: '/spelunky-remake/ScreenShot1.png',
  },
  {
    title: 'Website 2020',
    path: '/wordpress/index.html',
    image: '/wordpress/wordpress.png',
    target: '_self'
  },
]
</script>

<template>
<div class="project-grid">
  <div class="project-card" v-for="project in projects" :key="project.path">
    <a :href="project.path" v-bind="{target: project.target ? project.target : undefined }">
      <img :src="project.image" class="thumbnail" />
      <h2>{{ project.title }}</h2>
    </a>
  </div>
</div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

@media (max-width: 420px) {
  .project-grid {
    grid-template-columns: 1fr; /* force single column */
  }
}

.project-card {
  background-color: var(--vp-c-bg-soft);;
  border-radius: 1rem;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.project-card:hover {
  transform: scale(1.03);
}

.thumbnail {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-bottom: 1px solid var(--vp-c-divider);
}

.project-card h2 {
  margin: 0.75rem 0;
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
}
</style>
