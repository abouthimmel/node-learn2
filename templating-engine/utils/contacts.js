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

const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}


const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

const cekDuplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.nama === nama);
}

// hapus kontak 
const deleteContact = (nama) => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf8');
    const contacts = JSON.parse(fileBuffer); // parsing json menjadi array objek

    const filteredContacts = contacts.filter(contact => contact.nama !== nama)

    fs.writeFileSync('data/contacts.json', JSON.stringify(filteredContacts, null, 2));
    console.log(filteredContacts)
}
module.exports = {loadContact, findContact, addContact, cekDuplikat, deleteContact}