sudo -i -u postgres psql

mongosh "mongodb://localhost:27017"

sudo systemctl restart mongod

cd ~/workspace/goodlang/backend

pm2 ls

htop

sudo vi /etc/nginx/nginx.conf

sudo systemctl restart nginx


Start pm2 process
`pm2 flush goodlang-server;pm2 delete goodlang-server;pm2 start ./server.js -i max --name 'goodlang-server' -- -p 3009`

Start pm2 process in debug mode
`pm2 flush goodlang-server;pm2 delete goodlang-server;pm2 start ./server.js -i max --name 'goodlang-server' -- --debug -p 3009`
