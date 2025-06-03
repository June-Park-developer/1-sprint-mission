module.exports = {
  apps: [
    {
      name: 'mission10-app',
      script: 'npm',
      args: 'run start',
      cwd: './',
      watch: false,
      env: {
        NODE_ENV: 'dev',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
