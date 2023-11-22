# Northcoders News API

The link to this news API is hosted at https://nc-news-api-cu9g.onrender.com.

This project is mimicing the functionality of a real world backend service (for example reddit) where users will be able to post articles and comments related to articles that they are interested in. You will be able to post articles and comments, get them by id and also patch or delete them if you provide the id. You will also have the ability to add queries to searches so you could get articles that are only relevant to one topic, such as football, for example.

This project can be forked and cloned from github. The first thing to do when you have opened the code is to run 'npm i' in your terminal in order to install all packages relevant for this project. In order to run the server you will need to create a .env.test and .env.development file with the names of the PGDATABASEs that you wish to use. In this case it is a development database and a test database for the storage of a news application. Once these two files are created you will need create the databases in an sql file, these database names will correspond to the names used for PGDATABASE inside of the .env. files.

eg. inside a .env.test file you would have 'PGDATABASE=database_name_test' on the first line, where the database names may be found in a setup.sql file in which the databases are created.

Once the databases are created in sql and the .env. files are created you need to run the script "npm run setup-dbs" in order to seed your development data in the local database(and this will allow you to check that the setup is correct so far). If you want to run the test files then you run the script "npm run test-db" which will reseed the local test database before every test and run through many different happy and sad paths for the endpoints of this API. These tests use a smaller data sample to make testing you are getting exactly what you want easier (test data can be found in db/data/test-data)

To run this program you will need to have Node.js installed to a minimum version of 12.13.0 and recommend installing Postgres to atleast 14.9.
