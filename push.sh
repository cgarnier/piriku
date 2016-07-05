# usage:
# $ export REGISTRY_USER=login && REGISTRY_PASSWORD=password [registry]
# $ bash push.sh

# login to the registry
docker login -u $REGISTRY_USER -p $REGISTRY_PASSWORD

# build the container to push
docker build -t cgarnier/piriku:latest .

# get the branch name
branch_git=$(git rev-parse -q --abbrev-ref HEAD | tr / _)
: ${branch:=${CI_BUILD_REF_NAME:=${branch_git}}}
export branch

# tag the container
docker tag -f cgarnier/piriku:latest cgarnier/piriku:"$(echo $branch | tr / _)" # branch

for image in $(docker images | grep cgarnier/piriku | awk '{print $1 ":" $2}' | head -n 4) ; \
    do docker push $image ; done
