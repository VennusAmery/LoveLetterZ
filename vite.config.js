import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
=======
  plugins: [react()],
  base: '/LoveLetterZ/', 
>>>>>>> 8725177 (cambio)
})
