git pull

npm install

if ! test -d src/app/common/mock; then
    mkdir src/app/common/mock
    cp database_example.json src/app/common/mock
    mv src/app/common/mock/database_example.json src/app/common/mock/database.json
fi

npm run electron