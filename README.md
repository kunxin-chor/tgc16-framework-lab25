If you wish to continue from this checkpoint, you have to do the following.

1. At the terminal, run `yarn install`

2. Create the database user `foo` with the password `bar` (follow the lab 6 for this step).

3. Set up your .env file:

```
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
DB_DRIVER=mysql
DB_USER=foo
DB_PASSWORD=bar
DB_DATABASE=organic
DB_HOST=localhost
SESSION_SECRET_KEY=
```
Note: if you are running your own database, be sure to change `DB_DATABASE` to the correct database name.

4. Run `./db-migrate.sh up`

5. Begin with `nodemon --ignore sessions`