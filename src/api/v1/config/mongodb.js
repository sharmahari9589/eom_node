import { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config()



const connection = `mongodb://localhost:27017/ecom`


export const db = () => {
    connect(connection)
  .then(() => console.log("Datebase Connected"))
  .catch((err) => console.log(err.message))


}