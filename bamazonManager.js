var mysql = require("mysql");
var inquirer = require("inquirer");

// MySQL Config
const config = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
}

// ESTABLISH CONNECTION object
var connection = mysql.createConnection(config);

// End connection when done.
const closeDB = () => {
    connection.end();
}

/**
 * Heirarchical conversation example
 */

'use strict';
var inquirer = require('..');

var menu = {
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
};

function start() {
    console.log('Main Menu');
    menu();
}

function menu() {
    inquirer.prompt(menu).then(answers => {
        switch (answers) {
            case answers.name === 'View Products For Sale':
                viewProducts(goHome)
                break;
            case answers.name === 'View Low Inventory':
                viewLowInventory(goHome)
                break;
            case answers.name === 'Add to Inventory':
                addToInventory(goHome)
                break;
            case answers.name === 'Add New Product':
                addNewProduct(goHome)
                break;
        }
    });
}

function goHome() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'gohome',
            message: 'Return to Menu?',
            default: 
        }
    ]).then(answers => {
        if (answers.gohome) {
            menu();
        } else {
            console.log("Goodbye!");
        }
    })
}

function viewProducts() {

}

function viewLowInventory() {
    inquirer.prompt(directionsPrompt).then(answers => {
        var direction = answers.direction;
        if (direction === 'Forward') {
            var output = 'You find a painted wooden sign that says:';
            output += ' \n';
            output += ' ____  _____  ____  _____ \n';
            output += '(_  _)(  _  )(  _ \\(  _  ) \n';
            output += '  )(   )(_)(  )(_) ))(_)(  \n';
            output += ' (__) (_____)(____/(_____) \n';
            console.log(output);
        } else {
            console.log('You cannot go that way');
            encounter2a();
        }
    });
}

function addToInventory() {
    inquirer
        .prompt({
            type: 'list',
            name: 'weapon',
            message: 'Pick one',
            choices: [
                'Use the stick',
                'Grab a large rock',
                'Try and make a run for it',
                'Attack the wolf unarmed'
            ]
        })
        .then(() => {
            console.log('The wolf mauls you. You die. The end.');
        });
}

function addNewProduct() {
    inquirer
        .prompt({
            type: 'list',
            name: 'weapon',
            message: 'Pick one',
            choices: [
                'Use the stick',
                'Grab a large rock',
                'Try and make a run for it',
                'Attack the wolf unarmed'
            ]
        })
        .then(() => {
            console.log('The wolf mauls you. You die. The end.');
        });
}

menu();