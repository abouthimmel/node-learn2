const fs = require('fs');
const { json } = require('stream/consumers');

// membuat folder data jika belum ada
const dirpath = './data';
if(!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
}

// membuat file json jika belum ada
const dataPath = './data/contacts.json';
if(!fs.existsSync(dirpath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer)
    return contacts
}

const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
    return contact
}

module.exports = {loadContact, findContact}