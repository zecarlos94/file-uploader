# File Uploader ![Node.Js](https://badgen.net/badge/icon/node.js?icon=https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain-wordmark.svg&label&labelColor=grey) ![language](https://badgen.net/badge/icon/typescript?icon=https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg&label&labelColor=grey) ![Docker](https://badgen.net/badge/icon/docker?icon=https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg&label&labelColor=grey)

> File Uploader

This app aims to serve as a file uploader.

## Table of Contents

- [Setup](#markdown-header-setup)
- [Installation](#markdown-header-installation)
- [Usage](#markdown-header-usage)
- [References](#markdown-header-references)

## Setup

Before installing this service you need to check if you have `Docker` installed on your computer.

```sh
docker --version
```

If you get an answer like this, it means that `Docker` is installed.

```sh
Docker version 20.10.12, build e91ed57
```

If `Docker` is not installed you can install it on [this link](https://www.docker.com/products/docker-desktop/)

You will also need to check if you have `Node.js`and `NPM` installed on your computer.

To check if you have `Node.js` installed, run this command in your terminal:

```sh
node -v
```

If you get an answer like this, it means that `Node.js` is installed.

```sh
v14.17.3
```

To confirm that you have `NPM` installed you can run this command in your terminal:

```sh
npm -v
```

If you get an answer like this, it means that `NPM` is installed and you may go to the [next section](#markdown-header-then-install-project-dependencies).

```sh
6.14.13
```

If `Node.js` or `NPM` is not installed you can install them on [this link](https://nodejs.org/en/)

Don't forget to update `NPM` after installing `Node.js`:

```sh
npm install npm@latest -g
```

## Installation

### Install project dependencies

```sh
npm install --verbose
```

After this step you may go to the [next section](#markdown-header-configurations).

## Usage

### Configurations

Please check config/default.js configs and update them accordingly before you may go to the [next section](#markdown-header-run).

### Run

To start this service you'll need to run the following command,

```sh
npm run dev
```

You can check the available requests using the swagger dedicaded endpoint `/docs`.

## References

- [Badgen](https://badgen.net/) -> Fast badge generating service
- [Devicon](https://devicon.dev/) -> Set of icons representing programming languages, designing & development tools.
- [Datablist](https://www.datablist.com/learn/csv/download-sample-csv-files) -> Provides a list of dummy csv files

