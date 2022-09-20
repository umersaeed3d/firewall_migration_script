/*
    name: MONGODB QUERY FILE
    path: data-access/mongod/index.js
    Objective: In this file we have all of the business logic, all functions get input process it and return the output.
    
*/

let db = require('../../db/mongod/connection'); // DB
let {Mapping} = require('../../../schema/models'); // model
let {ObjectStack} = require('../../../helper/stack'); // helper
let fs = require('fs');
const readline = require('readline');
require('dotenv').config()



/*
objective: function for Cisco To Juniper conversion or vise versa
Input: cisco or juniper configuration file name from ENV
Output: juniper or cisco converted file and status code
description: After the conversion, it will send the output converted file name along with status
*/

const stack = new ObjectStack();
const paramHashTable = {};
const targetLines = [];
const source_vendor = process.env.SOURCE_VENDOR;
const target_vendor = process.env.TARGET_VENDOR;
const source_file_name = process.env.SOURCE_CONFIGURATION_FILE;


let conversion = () => {

  return new Promise(function (resolve, reject) {

    try {
      resolve(processLineByLine(source_file_name));
    } catch (error) {
      reject(error);
    }
      
  });
};

/*
objective: function iterating lines from file
Input: source vendor file name
Output: target vendor file name along with status code 201
description: Process follows such as pick a line -> find its mapped line from mongoDB -> extract the parameters -> replace the parameter -> return output
*/

async function processLineByLine(filename) {

    const fileStream = fs.createReadStream(__dirname +'./../../../configuration_files/'+filename);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    for await (const line of rl) {
      // Each line in configuration file will be successively available here as `line`.  
      if(line.length > 1){
        await mapLine(source_vendor,target_vendor,line);      
      }   
    }

    let finalArr = replaceParams();
    let output_file_name = target_vendor+'_mapped.txt';

    fs.writeFile(output_file_name, finalArr.join('\n'), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

    return {'status_code':201,'output_file_name': output_file_name};
}

/*
objective: function to find the mapped line with respect to source vendor
Input: source vendor name, target vendor name, input file line
Output: null
description: find source vendor mapped line from mongoDB -> filter out the most specific line -> extract the parameters 
*/

async function mapLine(source, target, line){
    
    // Here slicing 0-19 means the pickable keywords for matching
    var data = await db.find({[source]: new RegExp(line.slice(0,19),'i')}).toArray();
    var mappedLine = data[0];
    
    if(data.length > 1){
      
       mappedLine = filterTheMostSpecificObject(data,line,source);
      
    }
    
    if(mappedLine !== undefined){
      extractParams(line,mappedLine[source]);
      targetLines.push(mappedLine[target]);
    }
    
}

/*
objective: function to find filter out the most specific object from the multiple result
Input: object list, input file line, source vendor name
Output: specific object
description: Filter out the most specific object from list 
*/

function filterTheMostSpecificObject(object, line, source){

    if(source=='cisco')
      sliceIndex = 3;
    else
      sliceIndex = 2
    
    splitStr = line.split(' ');
    lastKeyword = splitStr[splitStr.length - sliceIndex];
    
    for (const obj of object) {
      
        if(~obj[source].indexOf(lastKeyword)){
            
            if(stack.isExist(obj._id) == false){
              stack.push(obj._id)
              return obj
            }else{
              continue;
            }
          
        }
    }
}

/*
objective: function to extract the parameter 
Input: source input line, source vendor db line
Output: boolen : has parameter or not. 
*/

function extractParams(source_line,object_line){

    let objParam = object_line.split(' ');
    let srcParam = source_line.split(' ');
    let key;
    let value;
    let hasKeyValue = false;
    
    for (const [index, word] of objParam.entries()) {
      if(~word.indexOf('?')){
        key = word.slice(1);
        value = srcParam[index];
       
        if(paramHashTable[key] == undefined){
          paramHashTable[key] = value;
          hasKeyValue = true;
        }else
          hasKeyValue = false;
        
      }
    }
    
    
    return hasKeyValue;
    
}  

/*
objective: function to replace the parameters in mapped object line from DB
Input: null
Output: mapped lines list
description: replace the paramters "?" in mapped lines
*/

function replaceParams(){
  
    let targetArray = [];
    for (const line of targetLines) {
      let words = line.split(' ');
      for(const [index, word] of words.entries()){
        if(~word.indexOf('?')){
            words[index] = paramHashTable[word.slice(1)];
        }
      }
      
      targetArray.push(words.join(' '));
            
    }
    return targetArray;
}
  

module.exports = {
  conversion,
  
};
