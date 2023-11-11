# Shop System API

## Users are able to:

- Register;
- Change Password (if registered);
- Login;
- Get all user profile informations;
- Change profile informations;
- Create a new store (Optional);
- Update my store informations;
- Create an unique store coin (Will be created with store creation passing "storeCoin" on request body to store creation);
- Update store informations;
- Insert items to sell on my store;
- Update an item from my store informations;
- Determine if my store item will be on promotion;
- Give my store coin to an existent user/Update my store coin value from an existent user that has some;
- Insert an item list on my store using request parameters OR an CSV (There's an format example on itemListCsvExample file);
- Create an valid coupon to use on my store/Update coupons from my store informations/Disable an coupon from my store;
- List all stores;
- List all items from an store;
- List all my store coupons;
- Purchase an item list from other store;
- Insert an item on my personal wish list/Remove an item from my personal wish list;
- Get all wish list items from my wish list.

## Technologies

- TypeScript
- Node
- Express
- Postgres;
- Docker;
- Vitest (for unit tests and e2e tests);
- Nodemailer;
- BullMQ;
- Redis;
- Swagger for docs.

## Installation guide

```
bash

$ git clone https://github.com/Paiva2/shop-system.git

$ npm install

.env environment configuration

$ docker compose up

$ npx prisma migrate dev

$ npx prisma db push

$ npm run dev

```

//

### You will find all endpoints documentation on localhost:runningport/docs/#/
