# XHeaders

# Deploying Cyber Siege
# DOCKER BUILD
## Build the Image
```
git clone https://cybersamurai.co.uk/xheaders.git
docker build -t cybersiege .
```
## Deploying Server

### Method 1 (Internal route)
Create an instance of the image (If website hosted by orign server only)
```
docker run -d --name xheaders -p 127.0.0.1:3001:3001 xheaders
```

### Method 2 (Exposed Port 3000)
Create an instance of the image [Expose 3002] (If other website like cybersamurai.co.uk is serving the application also )
```
docker build -t xheaders --build-arg API_KEY=ABUSE_IPDB_APIKEY .
```

--- 

# LOCAL BUILD
## Add API to .local.env
```
ABUSEIP_DB_API ="ADD__YOUR__API_KEY_HERE"
```

## Installing it
```
npm install --force
```
## Deploy Server
```
npm run production
```

