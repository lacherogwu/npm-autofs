# npm-fileGen

Generate file from an object

## Example

```
import { generateFile } from 'jsfilegen';

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

### Console log from above code

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
