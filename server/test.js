const express = require('express');
const Controller = require('./controller/Controller');
const Logger = require('./util/Logger');
const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');

const result = require('dotenv-safe').config({
    path: path.join(APP_ROOT_DIR, '.env'),
    example: path.join(APP_ROOT_DIR, '.env.example'),
});
async function testCreatePerson() {
    console.log("test create start");
    const contr = await Controller.createController();
    const result = await contr.createPerson('test', 'testman', '1991-11-11', 'test@test.com', 'pass', 1, 'usernametest');
    if (result === null) {
        console.log("person is null");
    } else {
        console.log(result);
    }
    console.log("test create end");
}
async function testLoginPerson() {
    console.log("test login start");
    const contr = await Controller.createController();
    const result = await contr.loginPerson('usernametest', 'pass');
    if (result === null) {
        console.log("person is null");
    } else {
        console.log(result);
    }
    console.log("test login end");
}
async function testFindPerson(id) {
    console.log("start find person test")
    const contr = await Controller.createController()
    const result = await contr.findPerson(id);
    if (result === null) {
        console.log("person is null");
    } else {
        console.log(result);
    }
    console.log("end find person test");
}
async function testRemovePerson(id) {
    console.log("start remove test");
    const contr = await Controller.createController()
    const result = await contr.removePerson(id)
    if (result === null) {
        console.log("person is null");
    } else {
        console.log(result);
    }
    console.log("end remove test");
}
async function testFindApplication(id) {
    console.log("start application test");
    const contr = await Controller.createController()
    const result = await contr.findApplication(id);
    if (result === null) {
        console.log("result is null")
    } else {
        console.log(result)
    }
    console.log("end application test");

}
async function testCreateApplication() {
    console.log("start application test");
    const person = '1012';
    const availability = { availablie: [{ end_date: '2002-12-13', to_date: '2003-01-12' },{ end_date: '2004-12-13', to_date: '2005-01-12' }] };
    const competence = { competence: [{ competence_id: 1, years_of_experience: 0.3}, { competence_id: 2,  years_of_experience: 0.2}, { competence_id: 3, years_of_experience: 0.1 }] }
    const contr = await Controller.createController()
    const result = await contr.createApplication(person,availability, competence)
    console.log("end application test");
}
async function testCreateApplication(id) {
    const contr = await Controller.createController();
    const result = await contr.createApplication(id, {
        dates: [
            { from_date: '2001-01-01', to_date: '2001-02-01', },
            { from_date: '2002-01-01', to_date: '200-02-01' }
        ]
    }, {
        competence: [
            {competence_id:1, years_of_experience:1.01},
            {competence_id:2, years_of_experience:2.02},
            {competence_id:3, years_of_experience:3.03},
        ]
    });

    if (result === null) {
        console.log("result is null")
    } else {
        console.log(result)
    }
}
testFindApplication(1011);

