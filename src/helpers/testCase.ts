import { exec } from 'child_process';
import fs from 'fs';


export const testCaseRunObject = async (testcaseSchema: any) => {
  const test = parseSchema(testcaseSchema);

  // create a temp file inside src/temp with content of test
  fs.writeFileSync('./src/temp/test.js', test);
  
  // save the console log as string 
  // const getConsoleData = (data: any) => {
  //   global.logMessages = {
  //     ...global.logMessages,
  //     createdAt: new Date(),
  //     result: data,
  //     logs: data.split('\n'),
  //     status: data.includes('fail') ? 'fail' : 'pass',
  //   };
  //   console.log(global.logMessages);
    
  // }

  // execute command npm run test
  exec('npm run test', (err, stdout, ___) => {
    if(err) {
      console.log(err);
      return;
    }
    console.log(stdout);
  });

  return global.logMessages;
};

const parseSchema = (schema: any) => {  
  const parsedSchema = schema.map((test: any) => {
    return `
      ${getFunctionName(test.name)}("${test.params[0]}", () => {
        ${parseChildrenSchema(test.children)}
      })
    `
  });

  const parsedSchemaString = "const { suite, test, expect, api, call } = require('polaris-suite') \n" + parsedSchema.join('\n');
  
  return parsedSchemaString;
}

const parseChildrenSchema = (childrenSchema: any) => {  
  const parsedChildrenSchema = childrenSchema.map((child: any) => {
    return `
      ${getFunctionName(child.name)}("${child.params[0]}", () => {
        ${parseUtilityScehma(child.children)}
      })
    `
  });

  return parsedChildrenSchema.join('\n');
}

const parseUtilityScehma = (utilitySchema: any) => {
  let parsedUtilitySchema = "";
  
  for (let index = 0; index < utilitySchema.length; index++) {
    const utility = utilitySchema[index];
    parsedUtilitySchema += `
      ${getFunctionName(utility.name)}(${utility.params[0]})${utility.returns ? `.${getReturnFunctionName(utilitySchema[index+1].name)}(${utilitySchema[index+1].params[0]})` : ''};\n
    `
    if(utility.returns) {
      index++;
    }
  }

  return parsedUtilitySchema;
}

const getFunctionName = (name: string) => {
  switch (name) {
    case 'Suite':
      return 'suite';
    case 'Test':
      return 'test';
    case 'Expect':
      return 'expect';
    case 'Call':
      return 'call';
    case 'API':
      return 'api';
    case 'Component':
      return 'component';
    default:
      return name;
  };
}

const getReturnFunctionName = (name: string) => {
  switch (name) {
    case 'Equals':
      return 'equalsTo';
    case 'ToBeNumber':
      return 'toBeNumber';
    case 'ToBeString':
      return 'toBeString';
    case 'ToBeBoolean':
      return 'toBeBoolean';
    case 'ToBeArray':
      return 'toBeArray';
    case 'ToBeObject':
      return 'toBeObject';
    case 'ToBeFunction':
      return 'toBeFunction';
    case 'ToBeUndefined':
      return 'toBeUndefined';
    case 'ToBeNull':
      return 'toBeNull';
    case 'Iterate':
      return 'iterateWithData';
    case 'Returns':
      return 'returns';
    case 'StatusCode':
      return 'statusCode';
    case 'ThrowsError':
      return 'throwsError';
    case 'HasResponse':
      return 'hasResponse';
    default:
      break;
  }
}