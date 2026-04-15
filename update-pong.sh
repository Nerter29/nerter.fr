
git pull --recurse-submodules
git submodule update --init --recursive --remote
cp src/projects/web/pong/server/* ../pong/
docker-compose restart pong-server


