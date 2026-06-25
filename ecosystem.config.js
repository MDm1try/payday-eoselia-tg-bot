/**
 * @description pm2 configuration file.
 * @example
 *  production mode :: pm2 start ecosystem.config.js --only payday-eoselia-tg-bot
 */
module.exports = {
  apps: [
    {
      name: 'payday-eoselia-tg-bot', // pm2 start App name
      script: 'dist/index.js',
      exec_mode: 'cluster', // 'cluster' or 'fork'
      instance_var: 'INSTANCE_ID', // instance variable
      instances: 1, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ['node_modules', 'logs'], // ignore files change
      max_memory_restart: '1G', // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: './logs/prod.access.log', // pm2 log file
      error: './logs/prod.error.log', // pm2 error log file
      time: true,
      env: {
        // environment variable
        LOG_DIR: '../../logs',
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'MDm1try',
      host: '0.0.0.0',
      ref: 'origin/master',
      repo: 'git@github.com:payday-eoselia-tg-bot.git',
      path: 'dist/index.js',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --only payday-eoselia-tg-bot',
    },
  },
};
