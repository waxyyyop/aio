# Lavalink Setup Guide

This guide walks you through setting up Lavalink nodes for your Discord bot's multi-node music system.

## What is Lavalink?

**Lavalink** is a standalone audio streaming server written in Java. It provides:
- High-quality audio streaming (YouTube, Spotify, SoundCloud, etc.)
- Load balancing across multiple servers
- Advanced playback features (looping, queue management)
- Real-time node health monitoring

## Prerequisites

- **Java Runtime Environment (JRE) 11+** ([Download](https://www.java.com/en/download/))
  - Check: `java --version`
- **Lavalink Server** ([Download](https://github.com/lavalink-devs/Lavalink/releases))
- **Discord Bot** running this code

## Installing Lavalink

### Step 1: Download Lavalink

1. Visit [Lavalink Releases](https://github.com/lavalink-devs/Lavalink/releases)
2. Download the latest `.jar` file (e.g., `Lavalink.jar`)
3. Save it in a directory, e.g., `C:\Lavalink\` or `/opt/Lavalink/`

### Step 2: Configure application.yml

1. Create a file named `application.yml` in the same directory:

```yaml
server:
  port: 2333
  address: localhost

lavalink:
  server:
    password: "your-super-secret-password-here"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      mixer: true
      http: true
      local: false
    filters:
      volume: true
      equalizer: true
      karaoke: true
      timescale: true
      tremolo: true
      vibrato: true
      distortion: true
      rotation: true
      channelmix: true
      lowpass: true
    bufferDurationMs: 400
    youtubePlaylistLoadLimit: 6 # Prevent abuse
    playerUpdateInterval: 5
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
    gc-warnings: true

metrics:
  prometheus:
    enabled: false
    endpoint: /metrics

sentry:
  dsn: ""
  environment: ""

logging:
  level:
    root: INFO
    lavalink: INFO
```

**Important**: Change `password` to a strong, unique value!

### Step 3: Run Lavalink

```bash
# Windows
java -jar Lavalink.jar

# Linux/Mac
java -jar Lavalink.jar
```

You should see:
```
[...] Lavalink is ready to accept connections on localhost:2333
```

**Keep this terminal open!** Lavalink runs in the foreground.

## Adding Nodes to Your Bot

### Using Slash Commands

1. **Add a node**:
   ```
   /nodes add name:primary host:localhost port:2333 password:your-super-secret-password-here
   ```

2. **Check status**:
   ```
   /nodes check
   ✅ primary
   ```

3. **List nodes**:
   ```
   /nodes list
   ```

### Using Message Commands

```
!nodes add name:primary host:localhost port:2333 password:your-super-secret-password-here
!nodes check
!nodes list
```

## Multi-Node Setup (Production)

For redundancy and load balancing, run multiple Lavalink instances:

### Node 1 (Primary - US)
```yaml
server:
  port: 2333
  address: 0.0.0.0

lavalink:
  server:
    password: "node1-password"
```

```bash
java -Dlavalinkserver.port=2333 -jar Lavalink.jar
```

**In Discord bot**:
```
/nodes add name:us-1 host:your-server.com port:2333 password:node1-password
```

### Node 2 (Backup - EU)
```yaml
server:
  port: 2334
  address: 0.0.0.0

lavalink:
  server:
    password: "node2-password"
```

```bash
java -Dlavalinkserver.port=2334 -jar Lavalink.jar
```

**In Discord bot**:
```
/nodes add name:eu-1 host:your-server.com port:2334 password:node2-password
```

Now your bot has automatic failover! If US-1 fails, requests go to EU-1.

## Setting Node Priority

Nodes are selected by priority (highest first):

```javascript
// In database or via future admin command:
// Lower priority = preferred: 100 > 50 > 10
```

To change priority (future enhancement):
```
/nodes priority name:us-1 level:100
/nodes priority name:eu-1 level:50
```

## Troubleshooting

### "Connection Refused" Error
- Ensure Lavalink is running: `java -jar Lavalink.jar`
- Check port: `netstat -tuln | grep 2333` (Linux) or `netstat -ano | findstr :2333` (Windows)
- Verify firewall allows port 2333

### "Authentication Failed"
- Check password matches in `application.yml` and bot command
- Ensure `lavalink.server.password` is set correctly

### "No tracks found"
- YouTube/Spotify might be rate-limited
- Try with different source: URL instead of search query
- Check Lavalink logs for errors

### Bot doesn't respond to `/play`
- Run `/nodes check` to ensure nodes are online
- Check bot has `Connect` and `Speak` permissions in voice channel
- Verify MongoDB connection (check bot logs)

### Node goes offline after a while
- Check Lavalink process is still running
- Increase memory: `java -Xmx512m -jar Lavalink.jar`
- Check system resource usage

## Monitoring Nodes

```bash
# Check Lavalink logs
# Watch the terminal where Lavalink is running for errors

# Optional: Enable Prometheus metrics
# In application.yml:
metrics:
  prometheus:
    enabled: true
    endpoint: /metrics
```

Then access metrics at: `http://localhost:2333/metrics`

## Docker Setup (Optional)

Run Lavalink in Docker for easier management:

```dockerfile
FROM openjdk:11-slim

WORKDIR /lavalink

COPY application.yml .
COPY Lavalink.jar .

EXPOSE 2333

CMD ["java", "-jar", "Lavalink.jar"]
```

```bash
docker build -t lavalink .
docker run -p 2333:2333 lavalink
```

## Security Considerations

1. **Use strong passwords**: Minimum 16 characters, mix of upper/lowercase, numbers, symbols
2. **Restrict network access**: Don't expose ports 2333 publicly
3. **Use reverse proxy**: Put behind nginx with authentication if exposing
4. **Monitor metrics**: Check for unusual activity
5. **Rotate passwords periodically**: Change every 3-6 months

## Resources

- [Lavalink GitHub Repository](https://github.com/lavalink-devs/Lavalink)
- [Lavalink Docker Hub](https://hub.docker.com/r/fredboat/lavalink)
- [Music Providers Status](https://cdn.discordapp.com/status)
- [Java Download](https://www.java.com/en/download/)

## Next Steps

1. ✅ Download & run Lavalink
2. ✅ Configure with strong password
3. ✅ Add node to bot: `/nodes add ...`
4. ✅ Test with: `/play your-favorite-song`
5. ✅ Add more nodes for redundancy
6. ✅ Monitor health: `/nodes check`

## Support

For issues or questions, contact: **support@zenpaix.fun**

Enjoy high-quality music streaming!
