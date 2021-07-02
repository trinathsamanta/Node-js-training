/* eslint-disable prettier/prettier */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
import Tour from '../../models/tourModel';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log('db connection success'))

//Read Json File

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');

//import data in db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data load executed')
  }
  catch (err) {
    console.log(err)
  }
}

//delete all data

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('delete executed')
  }
  catch (err) {
    console.log(err)
  }
}

if (process.argv[2] === '--import') {
  importData();
}
else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv)