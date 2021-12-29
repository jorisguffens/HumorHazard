setlocal
setlocal EnableDelayedExpansion

docker build -t registry.jorisg.be/jorisguffens/humorhazard:backend .
docker push registry.jorisg.be/jorisguffens/humorhazard:backend

endlocal

PAUSE