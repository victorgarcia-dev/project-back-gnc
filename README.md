# project-back-gnc

.env
MONGO_INITDB_ROOT_USERNAME=victor
MONGO_INITDB_ROOT_PASSWORD=root
MONGO_INITDB_DATABASE=victorDB
MONGO_DATA_DIR=/data/db
MONGO_LOG_FILE=/var/log/mongodb/mongodb.log
MONGO_CONTAINER_NAME=gncDB
MONGO_EXPOSED_PORT=61116

API_PORT=41114
API_KEY=X1p31DRc47tgOOt0pwBLvjpyCwStGlW8LFZDmnCm


VERIFICATION_AUTH=Basic dGVzdGluZy1zdHJ1Y3RzLWQ4NzFhMWEwOWE5OGIwNTI6NjM4MjU3YWI1NDRjMTgwMDRiYjlmYzdi


MAIL_USER=ponerunmail@dsad.com
MAIL_PASS=4dasd


corre con:

docker-compose -f docker/docker-compose-prod.yml build
docker-compose -f docker/docker-compose-prod.yml up
docker-compose -f docker/docker-compose-prod.yml down