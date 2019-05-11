# API Starter

**Kickstart your API Development.**

After having to write several variations of this code for several different projects, I decided to create a base repo to accelerate future developments.  
Leaving it Open Source to give back to the community!

## Features:
:ticket: - JSON Web Tokens for auth  
:balance_scale: - Data validation with [express-validator](https://github.com/express-validator/express-validator)  
:world_map: - i18n error messages (en_US & es_MX) with [node-polyglot](https://github.com/airbnb/polyglot.js)  
:mailbox_with_mail: - Sendgrid mailer for forgot-password emails  
:closed_lock_with_key: - Basic security with [Helmet](https://github.com/helmetjs/helmet)  
:spiral_notepad: - Requests logging with [Morgan](https://github.com/expressjs/morgan)  
:coffee: - Testing with [chai](https://github.com/chaijs/chai)  
:previous_track_button: - [Babel](https://github.com/babel/babel) transpilation: ES6 => ES5 (ready for [Heroku](https://www.heroku.com/) deployment!)  
:herb: - Seeder starter with [mongo-seeding](https://github.com/pkosiec/mongo-seeding)  
:speaking_head: - Custom error logs  

## Getting started
Check out <!-- [this](https://israelmuca.dev/blog/how-to-international-api-i18n-validation-in-node-js-for-your-api) --> guide for a more thorough reading, or jump straight ahead for more concise instructions.

### Run the code locally
Clone the repo, then install dependencies:
```shell
git clone https://github.com/israelmuca/api-starter-node-jwt-mongo.git myproject
cd myproject
npm i
```

Then, change the `.env.example` to `.env`. Also, make sure you're running `mongod`.

Run the API:
```shell
npm run dev
```

Now, you can try the automated testing; On another terminal execute:
```shell
npm run test
```

This will run the seeder and the tests.

### Extending this code
The code is well documented, and a more thorough blog post will be made shortly. In the mean time, if you have any questions, don't hesitate and create a [GitHub issue](https://github.com/israelmuca/api-starter-node-jwt-mongo/issues/new) or send me a [tweet](https://twitter.com/IsraelMuCa).