#!/bin/bash

ls
pwd
docker build -t doc-to-pdf -f $(pwd)/Dockerfile $(pwd)

docker run -d -p 5000:5000 doc-to-pdf
