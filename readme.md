## to run the app

    docker run -d -p 6379:6379  --name my-redis redis
    node .
    docker exec -it my-redis redis-cli
