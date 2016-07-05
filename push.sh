# usage:
# $ export REGISTRY_USER=login && REGISTRY_PASSWORD=password [registry]
# $ bash push.sh

# login to the registry
docker login -u $REGISTRY_USER -p $REGISTRY_PASSWORD

# build the container to push
docker build -t nib0r/piriku:latest .

# get the branch name
branch_git=$(git rev-parse -q --abbrev-ref HEAD | tr / _)
: ${branch:=${CI_BUILD_REF_NAME:=${branch_git}}}
export branch

# tag the container
# docker tag -f robosoft/odoo8:latest hub.nibor.me/robosoft/odoo8:latest
# docker tag -f robosoft/odoo8:latest hub.nibor.me/robosoft/odoo8:"$(git rev-parse -q HEAD)" # sha
# docker tag -f robosoft/odoo8:latest hub.nibor.me/robosoft/odoo8:"$(git describe --always --dirty --tags)" # tag
docker tag -f nib0r/piriku:latest nib0r/piriku:"$(echo $branch | tr / _)" # branch

for image in $(docker images | grep nib0r/piriku | awk '{print $1 ":" $2}' | head -n 4) ; \
    do docker push $image ; done

