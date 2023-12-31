exports.default = (projectName) => {
  return `{
  "name": "${projectName}",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "electron": "^26.2.0",
    "electron-builder": "^24.6.4",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vite-plugin-optimizer": "^1.4.2",
    "vue": "^3.3.4",
    "vue-router": "^4.2.4",
    "vue-tsc": "^1.8.5"
  }
}`
}
