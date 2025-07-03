module.exports = {
  apps: [
    {
      name: 'map-data-visualization',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/map-data-visualization',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/map-data-visualization-error.log',
      out_file: '/var/log/pm2/map-data-visualization-out.log',
      log_file: '/var/log/pm2/map-data-visualization-combined.log',
      time: true
    }
  ]
}; 