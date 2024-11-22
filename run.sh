#!/bin/bash

ls
pwd
docker build -t doc-to-pdf .

docker run -d -p 5000:5000 doc-to-pdf
