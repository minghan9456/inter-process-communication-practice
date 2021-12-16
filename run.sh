IMAGE_NAME="ipc-pratice"
docker build . -t $IMAGE_NAME
CID=$(docker run -dti --rm $IMAGE_NAME)
docker attach $CID
