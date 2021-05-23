# npm-autofs

Automations with file system

## Examples

### generateFile

```
import { generateFile } from 'autofs';

const buildFileObject = {
    imports: [
        { path: 'dotenv/config' },
        { name: 'dotenv', path: 'dotenv' }
    ],
    body: [],
    exports: [
        { name: 'doUsername', as: 'getUsername' },
        { name: 'getSomething' }
    ],
    defaultExports: {
        nodeEnv: 'process.env.NODE_ENV',
        port: 'process.env.PORT',
        host: 'process.env.HOST',
        apiKey: 'process.env.API_KEY',
        mailshrimpApiKey: 'process.env.MAILSHRIMP_API_KEY',
        token: 'process.env.TOKEN',
        id: 'process.env.ID',
        username: 'process.env.USERNAME',
        doSomethingAmazing: 'process.env.DO_SOMETHING_AMAZING',
    },
};

const result = await generateFile(path, buildFileObject);
console.log(result);
```

### Console log from the above code

```
import 'dotenv/config';
import dotenv from 'dotenv';

export {
        doUsername as getUsername,
        getSomething
};

export default {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        host: process.env.HOST,
        apiKey: process.env.API_KEY,
        mailshrimpApiKey: process.env.MAILSHRIMP_API_KEY,
        token: process.env.TOKEN,
        id: process.env.ID,
        username: process.env.USERNAME,
        doSomethingAmazing: process.env.DO_SOMETHING_AMAZING
};
```

### generateIndex

```
import { generateIndex } from 'autofs';

await generateIndex('./test/components', true);
```

### writeInFile

Add the following comments in the file you want to write

- // ### START DYNAMIC CONTENT ###
- // ### END DYNAMIC CONTENT ###

The second parameter you pass to the function will be an array with lines of code to write between these tags

```
import { generateIndex } from 'autofs';

await writeInFile('./test/writeInsideMe.js', [`const alibaba = 123;`, `const testMe = 'Testing';`]);
```
