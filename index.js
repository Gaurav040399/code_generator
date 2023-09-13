//  importing All modules require
const express = require("express");
const cors = require("cors");
const path = require("path")
const OpenAI = require('openai');
require("dotenv").config();

//  All Files which is require 
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000 ;
app.use(express.static(path.join(__dirname,'public')));

//  Open api configuration 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
  });
  
//   async function main(input) {
//     const completion = await openai.chat.completions.create({
//       messages: [{ role: 'user', content: input }],
//       model: 'gpt-3.5-turbo',
//     });
  
//     console.log(completion.choices);
//   }

// Function for generating Code 
async function generateCode(input){
    try {
        
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: input }],
            model: 'gpt-3.5-turbo',
          });
          console.log(completion.choices[0])
         return completion.choices[0].message.content
    } catch (error) {
        console.error("Error",error)
        throw error;
    }
}

// Route for converting the code into another language
app.post("/convert", async(req,res)=>{
    try {
        const {language, code} = req.body;
        const response = await generateCode(`Convert the given below code to ${language} \n code ${code}`);

        res.status(200).json({response})
    } catch (error) {
        console.error("Error",error);
        res.status(400).send({msg:"An Error Occurred",error:error})
    }
})

// Route for debug your code
app.post("/debug", async(req,res)=>{
    try {
        const {code} = req.body;
        const response = await generateCode(`Debug the given below code with explaination : \n ${code}`);

        res.status(200).json({response})
    } catch (error) {
        console.error("Error",error);
        res.status(400).send({msg:"An Error Occurred",error:error})
    }
})

// Route for quality check for your code
app.post("/qualityCheck", async(req,res)=>{
    try {
        const {code} = req.body;
        const response = await generateCode(`Check the quelity of the given below code. give rating out of 10 on parameter like accuracy, time complaxity, space complexity, MVC structure \n ${code} \n at the end give some suggestion`);

        res.status(200).json({response})
    } catch (error) {
        console.error("Error",error);
        res.status(400).send({msg:"An Error Occurred",error:error})
    }
})


// Connection the frontend file to our backend 

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
});

// Listing server on PORT which is present on env file
app.listen(PORT , ()=>{
    console.log(`Server is running on PORT ${PORT}`)
});