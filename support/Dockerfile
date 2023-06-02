FROM ubuntu:20.04

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y build-essential libssl-dev curl git vim

# to enable npm install canvas
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata
RUN apt-get install -y libcairo2-dev libjpeg-dev libgif-dev
RUN apt-get install -y python3 

RUN useradd dev --create-home --shell /bin/bash
RUN echo "PS1='\n\[\e[32m\]\u \[\e[33m\]in \w\[\e[0m\] \n> '" >> ~/.bashrc

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

ENV NVM_DIR=/root/.nvm
RUN . /root/.nvm/nvm.sh

RUN mkdir /root/code
