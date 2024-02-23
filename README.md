# News Backend API

### Hosted Version

The hosted version of this project can be accessed at https://nc-news-o4n5.onrender.com/api


### Summary

This project is a backend API for the NC News platform. It provides endpoints for managing articles, comments, users, and topics.

### This project requires two .env files:
 
1.Create a **.env.development** file with the following variables:

PGDATABASE=nc_news

2.Create a **.env.test** file with the following variables:

PGDATABASE=nc_news_test

### Requirements
Node.js (minimum version v20.10.0)
PostgreSQL (minimum version 16.1)

### Getting Started

To get a local copy of the project up and running, follow these steps:


### Clone the repository:

git clone https://github.com/jeniahutorova/nc-news.git


### Navigate to the project directory:

cd nc_news


### Install dependencies:

npm install


### Seed the local database:

npm run setup-dbs
npm run seed


### Run tests:

npm test