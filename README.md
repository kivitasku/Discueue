# Project
This project is made to be an easy to deploy self hosted web-based music streaming site with user authentication.


## Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Login</b><br><img src="screenshots/login.png" width="240"></td>
      <td align="center"><b>Home</b><br><img src="screenshots/home.png" width="240"></td>
      <td align="center"><b>Album</b><br><img src="screenshots/album.png" width="240"></td>
    </tr>
    <tr>
      <td align="center"><b>Search</b><br><img src="screenshots/search.png" width="240"></td>
      <td align="center"><b>Queue</b><br><img src="screenshots/queue.png" width="240"></td>
      <td align="center"></td>
    </tr>
  </table>
</div>

## Features
- User authentication
- Session timeout

### User features
- Last played albums
- Queue
- Music searching
- Album listening state to remember where the user left off



## Technical features
- Backend offset searching
- Nginx as reverse proxy

### Data import
- Data import is currently run as a script with the user_id being 1 for authentication
- Data is gathered through song metadata

#### Import structure
- Grouping albums by artist is optional, only cover images are searched by song filepath
```bash
/res/ (configured in env)
├── artist1/
│   ├── album1/
│   │   ├── song1
│   │   ├── song2
│   │   └── cover_image_file
│   └── album2/
│       ├── song3
│       └── cover_image_file
└── artist2/
    └── album3
```

### Supported file formats

#### Song files
- mp3, flac

#### Album covers
- jpg, jpeg, png, webp


## Technologies

### Front

- React
- TypeScript
- Vite
- CSS

### Back

- Node.js
- Fastify
- TypeScript
- Argon2
- Prisma
- PostgreSQL

### Infrastructure
- Nginx

## Project structure
```bash
.
├── back/
│   ├── prisma/
│   │   ├── migrations/
│   │   │   └── migration_files
│   │   └── schema
│   ├── scripts/
│   │   └── import_scripts
│   ├── src/
│   │   ├── hooks/
│   │   │   └── auth.ts
│   │   ├── lib/
│   │   │   └── prisma_client
│   │   └── routes/
│   │       └── api_rouets
│   ├── server.ts
│   ├── secure-session.d.ts
│   ├── secret-key
│   └── .env
├── front/
│   └── src/
│       ├── api/
│       │   └── api_call_functions
│       ├── components/
│       │   └── all_component_files
│       ├── hooks/
│       │   └── hook_files
│       ├── types/
│       │   └── types_for_song_artist_album
│       └── App.tsx
├── nginx/
│   └── nginx.conf
├── start.bat
└── start.sh
```

## Installation

### Requirements
- Node.js 22+
- PostgreSQL
- Nginx

### Setting up
- clone repo

### Back 

- Create empty database
```bash
psql -u postgres
CREATE DATABASE discueue_db;
CREATE USER discueue_user WITH PASSWORD 'PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE discueue_db TO discueue_user;
```

- Fill in database url in .env
```bash
cd back
cp .env.example .env
```

- Generate 32 byte secret-key in /back
```bash
openssl rand -out secret-key 32
```

- Run npm commands to install packages and deploy prisma
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```


### Optional configuration
- Configuration is made in the backend env file
- MAX_QUEUE_SIZE=5
- MAX_RECENT_ALBUMS=8
- REGISTER_OPEN=true
- SESSION_MAX_AGE=21600 (6 hours: 6 x 60 x 60 = 21600)

### Running
```bash
./deploy-build.sh
./deploy-systemd.sh
./deploy-nginx.sh
```


## Known limitations
- "/" on song filename corrupts the filepath
- "[space]" on album directory name corrupts the album cover path

## To be added
- Back end rate limiting
- Range requests for streaming
- User playlists



## License
Project is for educational/personal use only