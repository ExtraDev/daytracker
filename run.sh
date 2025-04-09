export NODE_TLS_REJECT_UNAUTHORIZED=0

if ! test -d src/app/common/mock; then
    mkdir src/app/common/mock
    cp database_example.json src/app/common/mock
    mv src/app/common/mock/database_example.json src/app/common/mock/database.json
fi


npm install
npm run electron
