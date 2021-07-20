## Name

SAFFO: Marketplace

## Description

SAFFO is a marketplace oriented to create a sustainable commerce environment in which, through the principle of scarcity, value is added to the product sold
In SAFFO, designers can create products and these will be marketed in a maximum series established by the designer, with the intention that these products later go to resale, the SAFFO database manages these products and records all the transactions that have been made, for users to have access at anytime to the products value ​​and a approximate price that they can have in the market.

At the moment a NoSQL database is implemented using MongoDB but it is my intention to implement in the near future a back-end integration with Solidity to use an Ethereum network wallet and the possibility of make new ERC-721 tokens and register all the information in there.

At this moment this project is in a pre-seed phase and only a basic CRUD has been implemented. This CRUD allows the creation of users, the creation of collections and the purchase of collections by users without creator permissions.

## Installation

To install this repository run command 'npm install'

The application it's querying the back-end which you can find in the following link: https://github.com/JuanCabruja/FinalProject_backend

You'll need a MongoDB server running locally for it's proper functioning.

In the project directory, you can run:

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Use

This application allows limited functions at the moment. These are:

User creation by clicking on the Login button at the top right of the application.

Login of the created user.

Edit the user profile, upload a user avatar, modify the user description, delete the user, buy products from the Marketplace.

If you edit the role field of the object generated in the database when creating the user and change to role "CREATOR" you can also upload fashion collections by accessing the "New Collection" field in the user Menu (top right)

## Roadmap 

I am willing to make this a full functioning project, next steps are: 

* Implementation of a rating system for the creators after an order is closed
* Implementation of a comment box and feedback for creators and users 
* Making a "Resale products" area in the Marketplace section
* Accessing history orders and prices 
* Make a like button for collections 


