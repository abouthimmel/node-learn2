const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000
const fs = require('fs/promises')
const {loadContact, findContact, addContact, cekDuplikat, deleteContact} = require('./utils/contacts')
const { title } = require('process')
const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

// gunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts)
app.use(express.static('public')); // built in middleware
app.use(express.urlencoded({extended: true}));

// konfigurasi flash 
app.use(cookieParser('secret'))
app.use(session({
  cookie: {maxAge: 6000},
  secret : 'secret',
  resave: true,
  saveUninitialized: true, 
}))
app.use(flash())

app.use((req, res, next) => {
  console.log('Time : ', Date.now());
  next()
})

app.use((req, res, next) => {
  console.log('Ini adalah middleware');
  next()
})

app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama: 'Mulya ramadhan',
      email: 'mulyaranadhan@gmail.com'
    },
    {
      nama: 'Sandhika Galih',
      email: 'sandhikagalih@gmail.com'
    },
    {
      nama: 'Elang Abdurraziq Matondang',
      email: 'elangabdurraziqmatondang@gmail.com'
    },
  ]
  res.render('index', {
    nama : 'mulya ramadhan',
    title : 'Main page',
    layout : 'layouts/main-layout',
    mahasiswa
  });
})

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  // console.log(contacts)
  res.render('contact', {
    title: 'contact page',
    layout : 'layouts/main-layout',
    contacts,
    msg: req.flash('msg')
  });
})

app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title : "Add contact",
    layout : "layouts/main-layout",

  })
}) 

app.post('/contact',[
  body('nama').custom((value) => {
    const duplikat = cekDuplikat(value);
    if(duplikat) {
      throw new Error('Nama sudah terdaftar')
    }
    return true;
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('nohp', 'No hp tidak valid').isMobilePhone('id-ID')
  
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()})
    res.render('add-contact', {
      title : 'Form tambah kontak',
      layout : 'layouts/main-layout',
      errors: errors.array()
    })
  } else {
    addContact(req.body);
    req.flash('msg', 'Data berhasil di tambahkan!')
    res.redirect('/contact')
  } 
  
})

app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  //jika kontak tidak ada
  if(!contact) {
    res.status(404);
    res.send('<h1>404</h1>')
  } else{
    deleteContact(req.params.nama);
    req.flash('msg', 'Data kontak berhasil dihapus');
    res.redirect('/contact')
  }
})

app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('detail',{
    title: "Halaman Detail Kontak",
    layout : "layouts/main-layout",
    contact,
  })
})


app.get('/about', (req, res) => {
  res.render('about', {
    title: 'about page',
    layout : 'layouts/main-layout'
  });
})

// mengirimkan dara berformat json
app.get('/data-mahasiswa', async (req, res) => {
  try{
    const data = await fs.readFile('dataMahasiswa.json', 'utf8');
    // const jsonData = JSON.parse(data);
    // res.send(data);
    res.json(JSON.parse(data))
  } catch (e) {
    console.error(e);
    res.status(500).send('Interval Server Error')
  }
})

//atau jika ingin lebih mudah
app.get('/tes', (req, res) => {
  res.sendFile('tes.json', {root: __dirname});
})

app.get('/produk/:id/category/:idCat', (req, res) => {
  res.send(`produkID :    <h1> ${req.params.id}</h1> \nCategory ID: ${req.params.idCat}`)
}) // maka url localhost akan menjadi seperti ini localhost:300/produk(tergantung kita masukin berapa)/category(terserah masukin berapa), tapi ini nanti gabisa asal


app.get('/produk/:id', (req, res) => {
  res.send(`produkID : ${req.params.id} \ncategory : ${req.query.category}`)
}) // maka url yg muncul adalah localhost:3000/produk(example:41)/?category=(example: shoes)



app.use( async(req, res) => {
  // res.status(404).send('<h1>404</h1> <h1>Error: File not found</h1>');
  try{
    const erpg = await fs.readFile('errorPage.html', 'utf-8');
    res.send(erpg);
  } catch(err) {
    console.error(e);
    res.send('Interval Server Error')
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
