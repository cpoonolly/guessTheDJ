# Local Setup

This repo is built using `firebase` & `create-react-app`.


### To Setup FE

To setup the FE locally simply run the following in one terminal window:

```
nvm use
cd web
npm run start
```

### To Setup BE (Optional)

To setup the BE locally simply run the following in one terminal window:

```
nvm use
npm install -g firebase-tools
firebase emulators:start --only functions,firestore
```

### To point local FE to local BE (Optional)
Simply uncomment this line:
https://github.com/cpoonolly/guessTheDJ/blob/main/web/src/firebase.js#L15


# Contributing

After testing locally just submit a PR! Once it's been approved by @cpoonolly the change will be merged and automatically deployed!
