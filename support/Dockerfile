FROM ubuntu:22.04

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y build-essential libssl-dev curl git vim

RUN useradd dev --create-home --shell /bin/bash
USER dev
WORKDIR /home/dev
RUN echo "PS1='\n\[\e[32m\]\u \[\e[33m\]in \w\[\e[0m\] \n> '" >> ~/.bashrc

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

ENV NVM_DIR=/home/dev/.nvm
RUN . /home/dev/.nvm/nvm.sh

RUN mkdir /home/dev/code
