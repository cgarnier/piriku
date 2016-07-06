#!/bin/bash

docker login -e $REGISTRY_EMAIL -u $REGISTRY_USER -p $REGISTRY_PASSWORD
export REPO=cgarnier/piriku
docker build -f Dockerfile -t $REPO:$COMMIT .
docker tag $REPO:$COMMIT $REPO:$TRAVIS_TAG
docker tag $REPO:$COMMIT $REPO:travis-$TRAVIS_BUILD_NUMBER
docker push $REPO
